package api

import (
	"bytes"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cloudwatch"
	"github.com/grafana/grafana/pkg/setting"
	"io"
	"io/ioutil"
	"math/rand"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana/pkg/api/datasource"
	"github.com/grafana/grafana/pkg/api/dtos"
	"github.com/grafana/grafana/pkg/api/response"
	"github.com/grafana/grafana/pkg/bus"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/plugins/adapters"
	"github.com/grafana/grafana/pkg/util"
	"github.com/grafana/grafana/pkg/web"
)

var datasourcesLogger = log.New("datasources")

func (hs *HTTPServer) GetDataSources(c *models.ReqContext) response.Response {
	query := models.GetDataSourcesQuery{OrgId: c.OrgId, DataSourceLimit: hs.Cfg.DataSourceLimit}

	if err := hs.DataSourcesService.GetDataSources(c.Req.Context(), &query); err != nil {
		return response.Error(500, "Failed to query datasources", err)
	}

	filtered, err := hs.filterDatasourcesByQueryPermission(c.Req.Context(), c.SignedInUser, query.Result)
	if err != nil {
		return response.Error(500, "Failed to query datasources", err)
	}

	result := make(dtos.DataSourceList, 0)
	for _, ds := range filtered {
		dsItem := dtos.DataSourceListItemDTO{
			OrgId:     ds.OrgId,
			Id:        ds.Id,
			UID:       ds.Uid,
			Name:      ds.Name,
			Url:       ds.Url,
			Type:      ds.Type,
			TypeName:  ds.Type,
			Access:    ds.Access,
			Password:  ds.Password,
			Database:  ds.Database,
			User:      ds.User,
			BasicAuth: ds.BasicAuth,
			IsDefault: ds.IsDefault,
			JsonData:  ds.JsonData,
			ReadOnly:  ds.ReadOnly,
			AccountId: ds.AccountId,
			CloudType: ds.CloudType,
			InputType: ds.InputType,
		}

		if plugin, exists := hs.pluginStore.Plugin(c.Req.Context(), ds.Type); exists {
			dsItem.TypeLogoUrl = plugin.Info.Logos.Small
			dsItem.TypeName = plugin.Name
		} else {
			dsItem.TypeLogoUrl = "public/img/icn-datasource.svg"
		}

		result = append(result, dsItem)
	}

	sort.Sort(result)

	return response.JSON(200, &result)
}

// GET /api/datasources/:id
func (hs *HTTPServer) GetDataSourceById(c *models.ReqContext) response.Response {
	id, err := strconv.ParseInt(web.Params(c.Req)[":id"], 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "id is invalid", err)
	}
	query := models.GetDataSourceQuery{
		Id:    id,
		OrgId: c.OrgId,
	}

	if err := hs.DataSourcesService.GetDataSource(c.Req.Context(), &query); err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		if errors.Is(err, models.ErrDataSourceIdentifierNotSet) {
			return response.Error(400, "Datasource id is missing", nil)
		}
		return response.Error(500, "Failed to query datasources", err)
	}

	filtered, err := hs.filterDatasourcesByQueryPermission(c.Req.Context(), c.SignedInUser, []*models.DataSource{query.Result})
	if err != nil || len(filtered) != 1 {
		return response.Error(404, "Data source not found", err)
	}

	dto := convertModelToDtos(filtered[0])

	// Add accesscontrol metadata
	dto.AccessControl = hs.getAccessControlMetadata(c, "datasources", dto.Id)

	return response.JSON(200, &dto)
}

// DELETE /api/datasources/:id
func (hs *HTTPServer) DeleteDataSourceById(c *models.ReqContext) response.Response {
	id, err := strconv.ParseInt(web.Params(c.Req)[":id"], 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "id is invalid", err)
	}

	if id <= 0 {
		return response.Error(400, "Missing valid datasource id", nil)
	}

	ds, err := hs.getRawDataSourceById(c.Req.Context(), id, c.OrgId)
	if err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(400, "Failed to delete datasource", nil)
	}

	if ds.ReadOnly {
		return response.Error(403, "Cannot delete read-only data source", nil)
	}

	cmd := &models.DeleteDataSourceCommand{ID: id, OrgID: c.OrgId}

	err = hs.DataSourcesService.DeleteDataSource(c.Req.Context(), cmd)
	if err != nil {
		return response.Error(500, "Failed to delete datasource", err)
	}

	hs.Live.HandleDatasourceDelete(c.OrgId, ds.Uid)

	return response.Success("Data source deleted")
}

// GET /api/datasources/uid/:uid
func (hs *HTTPServer) GetDataSourceByUID(c *models.ReqContext) response.Response {
	ds, err := hs.getRawDataSourceByUID(c.Req.Context(), web.Params(c.Req)[":uid"], c.OrgId)

	if err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(http.StatusNotFound, "Data source not found", nil)
		}
		return response.Error(http.StatusInternalServerError, "Failed to query datasource", err)
	}

	filtered, err := hs.filterDatasourcesByQueryPermission(c.Req.Context(), c.SignedInUser, []*models.DataSource{ds})
	if err != nil || len(filtered) != 1 {
		return response.Error(404, "Data source not found", err)
	}

	dto := convertModelToDtos(filtered[0])

	// Add accesscontrol metadata
	dto.AccessControl = hs.getAccessControlMetadata(c, "datasources", dto.Id)

	return response.JSON(200, &dto)
}

// DELETE /api/datasources/uid/:uid
func (hs *HTTPServer) DeleteDataSourceByUID(c *models.ReqContext) response.Response {
	uid := web.Params(c.Req)[":uid"]

	if uid == "" {
		return response.Error(400, "Missing datasource uid", nil)
	}

	ds, err := hs.getRawDataSourceByUID(c.Req.Context(), uid, c.OrgId)
	if err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(400, "Failed to delete datasource", nil)
	}

	if ds.ReadOnly {
		return response.Error(403, "Cannot delete read-only data source", nil)
	}

	cmd := &models.DeleteDataSourceCommand{UID: uid, OrgID: c.OrgId}

	err = hs.DataSourcesService.DeleteDataSource(c.Req.Context(), cmd)
	if err != nil {
		return response.Error(500, "Failed to delete datasource", err)
	}

	hs.Live.HandleDatasourceDelete(c.OrgId, ds.Uid)

	return response.JSON(200, util.DynMap{
		"message": "Data source deleted",
		"id":      ds.Id,
	})
}

// DELETE /api/datasources/name/:name
func (hs *HTTPServer) DeleteDataSourceByName(c *models.ReqContext) response.Response {
	name := web.Params(c.Req)[":name"]

	if name == "" {
		return response.Error(400, "Missing valid datasource name", nil)
	}

	getCmd := &models.GetDataSourceQuery{Name: name, OrgId: c.OrgId}
	if err := hs.DataSourcesService.GetDataSource(c.Req.Context(), getCmd); err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(500, "Failed to delete datasource", err)
	}

	if getCmd.Result.ReadOnly {
		return response.Error(403, "Cannot delete read-only data source", nil)
	}

	cmd := &models.DeleteDataSourceCommand{Name: name, OrgID: c.OrgId}
	err := hs.DataSourcesService.DeleteDataSource(c.Req.Context(), cmd)
	if err != nil {
		return response.Error(500, "Failed to delete datasource", err)
	}

	hs.Live.HandleDatasourceDelete(c.OrgId, getCmd.Result.Uid)

	return response.JSON(200, util.DynMap{
		"message": "Data source deleted",
		"id":      getCmd.Result.Id,
	})
}

func validateURL(cmdType string, url string) response.Response {
	if _, err := datasource.ValidateURL(cmdType, url); err != nil {
		return response.Error(400, fmt.Sprintf("Validation error, invalid URL: %q", url), err)
	}

	return nil
}

// POST /api/datasources/
func (hs *HTTPServer) AddDataSource(c *models.ReqContext) response.Response {
	cmd := models.AddDataSourceCommand{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	datasourcesLogger.Debug("Received command to add data source", "url", cmd.Url)
	cmd.OrgId = c.OrgId
	if cmd.Url != "" {
		if resp := validateURL(cmd.Type, cmd.Url); resp != nil {
			return resp
		}
	}

	//  ------Manoj.  custom changes for appcube plateform ------
	// below code restricts creating duplicate datasource of having same accountId/inputType
	query := models.GetDataSourceQueryByAccountIdAndInputType{
		AccountId: cmd.AccountId,
		InputType: cmd.InputType,
	}
	hs.DataSourcesService.GetDataSourceByAccountIdAndInputType(c.Req.Context(), &query)
	if query.Res != nil && len(query.Res) > 0 {
		return response.Error(1000, "The given account id and datasource type already exists", nil)
	}
	//  ------Manoj.  custom changes for appcube plateform ------

	if err := hs.DataSourcesService.AddDataSource(c.Req.Context(), &cmd); err != nil {
		if errors.Is(err, models.ErrDataSourceNameExists) || errors.Is(err, models.ErrDataSourceUidExists) {
			return response.Error(409, err.Error(), err)
		}

		return response.Error(500, "Failed to add datasource", err)
	}

	ds := convertModelToDtos(cmd.Result)
	return response.JSON(200, util.DynMap{
		"message":    "Datasource added",
		"id":         cmd.Result.Id,
		"name":       cmd.Result.Name,
		"datasource": ds,
	})
}

// PUT /api/datasources/:id
func (hs *HTTPServer) UpdateDataSource(c *models.ReqContext) response.Response {
	cmd := models.UpdateDataSourceCommand{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}
	datasourcesLogger.Debug("Received command to update data source", "url", cmd.Url)
	cmd.OrgId = c.OrgId
	var err error
	if cmd.Id, err = strconv.ParseInt(web.Params(c.Req)[":id"], 10, 64); err != nil {
		return response.Error(http.StatusBadRequest, "id is invalid", err)
	}
	if resp := validateURL(cmd.Type, cmd.Url); resp != nil {
		return resp
	}

	ds, err := hs.getRawDataSourceById(c.Req.Context(), cmd.Id, cmd.OrgId)
	if err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(500, "Failed to update datasource", err)
	}

	if ds.ReadOnly {
		return response.Error(403, "Cannot update read-only data source", nil)
	}

	err = hs.fillWithSecureJSONData(c.Req.Context(), &cmd)
	if err != nil {
		return response.Error(500, "Failed to update datasource", err)
	}

	err = hs.DataSourcesService.UpdateDataSource(c.Req.Context(), &cmd)
	if err != nil {
		if errors.Is(err, models.ErrDataSourceUpdatingOldVersion) {
			return response.Error(409, "Datasource has already been updated by someone else. Please reload and try again", err)
		}
		return response.Error(500, "Failed to update datasource", err)
	}

	query := models.GetDataSourceQuery{
		Id:    cmd.Id,
		OrgId: c.OrgId,
	}

	if err := hs.DataSourcesService.GetDataSource(c.Req.Context(), &query); err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(500, "Failed to query datasource", err)
	}

	datasourceDTO := convertModelToDtos(query.Result)

	hs.Live.HandleDatasourceUpdate(c.OrgId, datasourceDTO.UID)

	return response.JSON(200, util.DynMap{
		"message":    "Datasource updated",
		"id":         cmd.Id,
		"name":       cmd.Name,
		"datasource": datasourceDTO,
	})
}

func (hs *HTTPServer) fillWithSecureJSONData(ctx context.Context, cmd *models.UpdateDataSourceCommand) error {
	if len(cmd.SecureJsonData) == 0 {
		return nil
	}

	ds, err := hs.getRawDataSourceById(ctx, cmd.Id, cmd.OrgId)
	if err != nil {
		return err
	}

	if ds.ReadOnly {
		return models.ErrDatasourceIsReadOnly
	}

	for k, v := range ds.SecureJsonData {
		if _, ok := cmd.SecureJsonData[k]; !ok {
			decrypted, err := hs.SecretsService.Decrypt(ctx, v)
			if err != nil {
				return err
			}
			cmd.SecureJsonData[k] = string(decrypted)
		}
	}

	return nil
}

func (hs *HTTPServer) getRawDataSourceById(ctx context.Context, id int64, orgID int64) (*models.DataSource, error) {
	query := models.GetDataSourceQuery{
		Id:    id,
		OrgId: orgID,
	}

	if err := hs.DataSourcesService.GetDataSource(ctx, &query); err != nil {
		return nil, err
	}

	return query.Result, nil
}

func (hs *HTTPServer) getRawDataSourceByUID(ctx context.Context, uid string, orgID int64) (*models.DataSource, error) {
	query := models.GetDataSourceQuery{
		Uid:   uid,
		OrgId: orgID,
	}

	if err := hs.DataSourcesService.GetDataSource(ctx, &query); err != nil {
		return nil, err
	}

	return query.Result, nil
}

// Get /api/datasources/name/:name
func (hs *HTTPServer) GetDataSourceByName(c *models.ReqContext) response.Response {
	query := models.GetDataSourceQuery{Name: web.Params(c.Req)[":name"], OrgId: c.OrgId}

	if err := hs.DataSourcesService.GetDataSource(c.Req.Context(), &query); err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(500, "Failed to query datasources", err)
	}

	filtered, err := hs.filterDatasourcesByQueryPermission(c.Req.Context(), c.SignedInUser, []*models.DataSource{query.Result})
	if err != nil || len(filtered) != 1 {
		return response.Error(404, "Data source not found", err)
	}

	dto := convertModelToDtos(filtered[0])
	return response.JSON(200, &dto)
}

// Get /api/datasources/id/:name
func (hs *HTTPServer) GetDataSourceIdByName(c *models.ReqContext) response.Response {
	query := models.GetDataSourceQuery{Name: web.Params(c.Req)[":name"], OrgId: c.OrgId}

	if err := hs.DataSourcesService.GetDataSource(c.Req.Context(), &query); err != nil {
		if errors.Is(err, models.ErrDataSourceNotFound) {
			return response.Error(404, "Data source not found", nil)
		}
		return response.Error(500, "Failed to query datasources", err)
	}

	ds := query.Result
	dtos := dtos.AnyId{
		Id: ds.Id,
	}

	return response.JSON(200, &dtos)
}

// /api/datasources/:id/resources/*
func (hs *HTTPServer) CallDatasourceResource(c *models.ReqContext) {
	datasourceID, err := strconv.ParseInt(web.Params(c.Req)[":id"], 10, 64)
	if err != nil {
		c.JsonApiErr(http.StatusBadRequest, "id is invalid", err)
		return
	}
	ds, err := hs.DataSourceCache.GetDatasource(c.Req.Context(), datasourceID, c.SignedInUser, c.SkipCache)
	if err != nil {
		if errors.Is(err, models.ErrDataSourceAccessDenied) {
			c.JsonApiErr(403, "Access denied to datasource", err)
			return
		}
		c.JsonApiErr(500, "Unable to load datasource meta data", err)
		return
	}

	plugin, exists := hs.pluginStore.Plugin(c.Req.Context(), ds.Type)
	if !exists {
		c.JsonApiErr(500, "Unable to find datasource plugin", err)
		return
	}

	hs.callPluginResource(c, plugin.ID, ds.Uid)
}

func convertModelToDtos(ds *models.DataSource) dtos.DataSource {
	dto := dtos.DataSource{
		Id:                ds.Id,
		UID:               ds.Uid,
		OrgId:             ds.OrgId,
		Name:              ds.Name,
		Url:               ds.Url,
		Type:              ds.Type,
		Access:            ds.Access,
		Password:          ds.Password,
		Database:          ds.Database,
		User:              ds.User,
		BasicAuth:         ds.BasicAuth,
		BasicAuthUser:     ds.BasicAuthUser,
		BasicAuthPassword: ds.BasicAuthPassword,
		WithCredentials:   ds.WithCredentials,
		IsDefault:         ds.IsDefault,
		JsonData:          ds.JsonData,
		SecureJsonFields:  map[string]bool{},
		Version:           ds.Version,
		ReadOnly:          ds.ReadOnly,
		AccountId:         ds.AccountId,
		CloudType:         ds.CloudType,
		InputType:         ds.InputType,
	}

	for k, v := range ds.SecureJsonData {
		if len(v) > 0 {
			dto.SecureJsonFields[k] = true
		}
	}

	return dto
}

// CheckDatasourceHealth sends a health check request to the plugin datasource
// /api/datasource/:id/health
func (hs *HTTPServer) CheckDatasourceHealth(c *models.ReqContext) response.Response {
	datasourceID, err := strconv.ParseInt(web.Params(c.Req)[":id"], 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "id is invalid", err)
	}

	ds, err := hs.DataSourceCache.GetDatasource(c.Req.Context(), datasourceID, c.SignedInUser, c.SkipCache)
	if err != nil {
		if errors.Is(err, models.ErrDataSourceAccessDenied) {
			return response.Error(http.StatusForbidden, "Access denied to datasource", err)
		}
		return response.Error(http.StatusInternalServerError, "Unable to load datasource metadata", err)
	}

	plugin, exists := hs.pluginStore.Plugin(c.Req.Context(), ds.Type)
	if !exists {
		return response.Error(http.StatusInternalServerError, "Unable to find datasource plugin", err)
	}

	dsInstanceSettings, err := adapters.ModelToInstanceSettings(ds, hs.decryptSecureJsonDataFn())
	if err != nil {
		return response.Error(http.StatusInternalServerError, "Unable to get datasource model", err)
	}
	req := &backend.CheckHealthRequest{
		PluginContext: backend.PluginContext{
			User:                       adapters.BackendUserFromSignedInUser(c.SignedInUser),
			OrgID:                      c.OrgId,
			PluginID:                   plugin.ID,
			DataSourceInstanceSettings: dsInstanceSettings,
		},
	}

	var dsURL string
	if req.PluginContext.DataSourceInstanceSettings != nil {
		dsURL = req.PluginContext.DataSourceInstanceSettings.URL
	}

	err = hs.PluginRequestValidator.Validate(dsURL, c.Req)
	if err != nil {
		return response.Error(http.StatusForbidden, "Access denied", err)
	}

	resp, err := hs.pluginClient.CheckHealth(c.Req.Context(), req)
	if err != nil {
		return translatePluginRequestErrorToAPIError(err)
	}

	payload := map[string]interface{}{
		"status":  resp.Status.String(),
		"message": resp.Message,
	}

	// Unmarshal JSONDetails if it's not empty.
	if len(resp.JSONDetails) > 0 {
		var jsonDetails map[string]interface{}
		err = json.Unmarshal(resp.JSONDetails, &jsonDetails)
		if err != nil {
			return response.Error(http.StatusInternalServerError, "Failed to unmarshal detailed response from backend plugin", err)
		}

		payload["details"] = jsonDetails
	}

	if resp.Status != backend.HealthStatusOk {
		return response.JSON(http.StatusBadRequest, payload)
	}

	return response.JSON(http.StatusOK, payload)
}

func (hs *HTTPServer) decryptSecureJsonDataFn() func(map[string][]byte) map[string]string {
	return func(m map[string][]byte) map[string]string {
		decryptedJsonData, err := hs.SecretsService.DecryptJsonData(context.Background(), m)
		if err != nil {
			hs.log.Error("Failed to decrypt secure json data", "error", err)
		}
		return decryptedJsonData
	}
}

func (hs *HTTPServer) filterDatasourcesByQueryPermission(ctx context.Context, user *models.SignedInUser, datasources []*models.DataSource) ([]*models.DataSource, error) {
	query := models.DatasourcesPermissionFilterQuery{
		User:        user,
		Datasources: datasources,
	}
	query.Result = datasources

	if err := hs.DatasourcePermissionsService.FilterDatasourcesBasedOnQueryPermissions(ctx, &query); err != nil {
		if !errors.Is(err, bus.ErrHandlerNotFound) {
			return nil, err
		}
		return datasources, nil
	}

	return query.Result, nil
}

func (hs *HTTPServer) GetMasterDataSourcePlugins(c *models.ReqContext) response.Response {
	datasourceType := web.Params(c.Req)[":key"]
	extResp, err := externalServiceClient.Get("https://grafana.com/api/plugins?enabled=1&type=datasource")
	if err != nil {
		return response.Error(500, "Error in getting master datasource plugins", err)
	}

	defer extResp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(extResp.Body)
	if err != nil {
		return response.Error(401, "Invalid master datasource plugin response from grafana.com", err)
	}
	bodyString := string(bodyBytes)
	var dsInfo = make(map[string]interface{})
	errw := json.Unmarshal([]byte(bodyString), &dsInfo)
	if errw != nil {
		return response.Error(401, "Master datasource response unmarshalling to JSON failed", errw)
	}
	items := dsInfo["items"]
	var selectedItems []interface{}
	for _, v := range items.([]interface{}) {
		data, _ := json.Marshal(v)
		itemString := string(data)
		var itemInfo = make(map[string]interface{})
		errItem := json.Unmarshal([]byte(itemString), &itemInfo)
		if errItem != nil {
			return response.Error(401, "datasource unmarshalling to JSON failed", errItem)
		}

		if strings.Contains(strings.ToLower(datasourceType), strings.ToLower(itemInfo["slug"].(string))) {
			selectedItems = append(selectedItems, itemInfo)
		}

	}
	dsInfo["items"] = selectedItems
	return response.JSON(200, dsInfo["items"])
}

//	------Manoj.  custom changes for appcube plateform ------
//
// GET /api/datasources/accountid/:accountID
func (hs *HTTPServer) GetDataSourceByAccountId(c *models.ReqContext) response.Response {
	query := models.GetDataSourceQueryByAccountIdOrCloudType{
		AccountId: web.Params(c.Req)[":accountID"],
		OrgId:     1,
	}
	return hs.BuildDatasourceList(&query, c, "Datasource query by account id failed")
}

// GET /api/datasources/cloudType/:cloud
func (hs *HTTPServer) GetDataSourceByCloudType(c *models.ReqContext) response.Response {
	query := models.GetDataSourceQueryByAccountIdOrCloudType{
		CloudType: web.Params(c.Req)[":cloud"],
		OrgId:     1,
	}
	return hs.BuildDatasourceList(&query, c, "Datasource query by cloud type failed")
}

// GET /api/datasources/accountid/:accountID/inputType/:inputType
func (hs *HTTPServer) GetDataSourceByAccountIdAndInputType(c *models.ReqContext) response.Response {
	query := models.GetDataSourceQueryByAccountIdAndInputType{
		AccountId: web.Params(c.Req)[":accountID"],
		InputType: web.Params(c.Req)[":inputType"],
		OrgId:     1,
	}
	return hs.BuildDatasourceListOfAccountIdAndInputType(&query, c, "Datasource query by account id and input type failed")
}

func (hs *HTTPServer) BuildDatasourceListOfAccountIdAndInputType(query *models.GetDataSourceQueryByAccountIdAndInputType, c *models.ReqContext, errMsg string) response.Response {

	if err := hs.DataSourcesService.GetDataSourceByAccountIdAndInputType(c.Req.Context(), query); err != nil {
		return response.Error(500, errMsg, err)
	}

	filtered, err := hs.filterDatasourcesByQueryPermission(c.Req.Context(), c.SignedInUser, query.Res)
	if err != nil {
		return response.Error(500, "Datasource filtering with account id and input type failed. "+errMsg, err)
	}

	result := make(dtos.DataSourceList, 0)
	for _, ds := range filtered {
		dsItem := dtos.DataSourceListItemDTO{
			OrgId:     ds.OrgId,
			Id:        ds.Id,
			UID:       ds.Uid,
			Name:      ds.Name,
			Url:       ds.Url,
			Type:      ds.Type,
			TypeName:  ds.Type,
			Access:    ds.Access,
			Password:  ds.Password,
			Database:  ds.Database,
			User:      ds.User,
			BasicAuth: ds.BasicAuth,
			IsDefault: ds.IsDefault,
			JsonData:  ds.JsonData,
			ReadOnly:  ds.ReadOnly,
			AccountId: ds.AccountId,
			CloudType: ds.CloudType,
			TenantId:  ds.TenantId,
			InputType: ds.InputType,
		}

		if plugin, exists := hs.pluginStore.Plugin(c.Req.Context(), ds.Type); exists {
			dsItem.TypeLogoUrl = plugin.Info.Logos.Small
			dsItem.TypeName = plugin.Name
		} else {
			dsItem.TypeLogoUrl = "public/img/icn-datasource.svg"
		}

		result = append(result, dsItem)
	}

	sort.Sort(result)

	return response.JSON(200, &result)

}

// GET /api/datasources/accountid/:accountID/cloudType/:cloud
func (hs *HTTPServer) GetDataSourceByAccountIdAndCloudType(c *models.ReqContext) response.Response {
	query := models.GetDataSourceQueryByAccountIdOrCloudType{
		AccountId: web.Params(c.Req)[":accountID"],
		CloudType: web.Params(c.Req)[":cloud"],
		OrgId:     1,
	}
	return hs.BuildDatasourceList(&query, c, "Datasource query by account id and cloud type failed")
}

func (hs *HTTPServer) BuildDatasourceList(query *models.GetDataSourceQueryByAccountIdOrCloudType, c *models.ReqContext, errMsg string) response.Response {

	if err := hs.DataSourcesService.GetDataSourceByAccountIdOrCloudType(c.Req.Context(), query); err != nil {
		return response.Error(500, errMsg, err)
	}

	filtered, err := hs.filterDatasourcesByQueryPermission(c.Req.Context(), c.SignedInUser, query.Res)
	if err != nil {
		return response.Error(500, "Datasource filtering failed. "+errMsg, err)
	}

	result := make(dtos.DataSourceList, 0)
	for _, ds := range filtered {
		dsItem := dtos.DataSourceListItemDTO{
			OrgId:     ds.OrgId,
			Id:        ds.Id,
			UID:       ds.Uid,
			Name:      ds.Name,
			Url:       ds.Url,
			Type:      ds.Type,
			TypeName:  ds.Type,
			Access:    ds.Access,
			Password:  ds.Password,
			Database:  ds.Database,
			User:      ds.User,
			BasicAuth: ds.BasicAuth,
			IsDefault: ds.IsDefault,
			JsonData:  ds.JsonData,
			ReadOnly:  ds.ReadOnly,
			AccountId: ds.AccountId,
			CloudType: ds.CloudType,
			TenantId:  ds.TenantId,
			InputType: ds.InputType,
		}

		if plugin, exists := hs.pluginStore.Plugin(c.Req.Context(), ds.Type); exists {
			dsItem.TypeLogoUrl = plugin.Info.Logos.Small
			dsItem.TypeName = plugin.Name
		} else {
			dsItem.TypeLogoUrl = "public/img/icn-datasource.svg"
		}

		result = append(result, dsItem)
	}

	sort.Sort(result)

	return response.JSON(200, &result)

}

func (hs *HTTPServer) GetDataSourceMaster(c *models.ReqContext) response.Response {
	query := models.GetAllDataSourceMasterQuery{
		// Id: 1,
		// CloudType: web.Params(c.Req)[":cloud"],
	}

	if err := hs.DataSourcesService.GetDataSourceMaster(c.Req.Context(), &query); err != nil {
		return response.Error(500, "Failed to query datasource master", err)
	}

	filtered, err := hs.filterDatasourceMasterByQueryPermission(c.Req.Context(), c.SignedInUser, query.Result)
	if err != nil {
		return response.Error(500, "Failed to query datasource master", err)
	}

	result := make(dtos.DataSourceMasterList, 0)
	for _, ds := range filtered {
		dsItem := dtos.DataSourceMasterListItemDTO{
			Id:        ds.Id,
			JsonData:  ds.JsonData,
			CloudType: ds.CloudType,
		}

		result = append(result, dsItem)
	}

	// sort.Sort(result)

	return response.JSON(200, &result)
}

func (hs *HTTPServer) filterDatasourceMasterByQueryPermission(ctx context.Context, user *models.SignedInUser, datasourceMaster []*models.DataSourceMaster) ([]*models.DataSourceMaster, error) {
	query := models.DatasourceMasterPermissionFilterQuery{
		User:        user,
		Datasources: datasourceMaster,
	}
	query.Result = datasourceMaster

	if err := hs.DatasourcePermissionsService.FilterDatasourceMasterBasedOnQueryPermissions(ctx, &query); err != nil {
		if !errors.Is(err, bus.ErrHandlerNotFound) {
			return nil, err
		}
		return datasourceMaster, nil
	}

	return query.Result, nil
}

func (hs *HTTPServer) AddDataSourceMaster(c *models.ReqContext) response.Response {
	cmd := models.AddDataSourceMasterCommand{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	// if len(cmd.CloudType) == 0 {
	// 	return response.Error(http.StatusBadRequest, "bad request data", err)
	// }

	if err := hs.DataSourcesService.AddDataSourceMaster(c.Req.Context(), &cmd); err != nil {
		return response.Error(500, "Failed to add datasource master", err)
	}

	ds := convertModelToDtosMaster(cmd.Result)
	return response.JSON(200, util.DynMap{
		"message":           "Datasource master added",
		"id":                cmd.Result.Id,
		"master-datasource": ds,
	})
}

func convertModelToDtosMaster(ds *models.DataSourceMaster) dtos.DataSource {
	dto := dtos.DataSource{
		Id:       ds.Id,
		JsonData: ds.JsonData,
	}

	return dto
}

func GetSessionByCreds(region string, accessKey string, secretKey string, token string) (*session.Session, error) {
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(accessKey, secretKey, token),
		Region:      aws.String(region),
	})
	return sess, err
}

const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandomString(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = CHARSET[seededRand.Intn(len(CHARSET))]
	}
	return string(b)
}

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

// GET /api/datasources/aws-namespace/:nameSpace?landingZoneId=1
func (hs *HTTPServer) GetAwsMetricList(c *models.ReqContext) response.Response {
	type AWS_METRIC struct {
		Text  string `json:"text,omitempty"`
		Value string `json:"value,omitempty"`
		Label string `json:"label,omitempty"`
	}
	nameSpace := "AWS/" + web.Params(c.Req)[":nameSpace"]
	hs.log.Info("Request to get list of AWS metrics for namespace: " + nameSpace)

	resp, err := getGlobalAwsSecretsFromCmdb()
	if err != nil {
		hs.log.Error("Failed to get global aws secrets from cmdb", "error", err)
		return response.Error(http.StatusInternalServerError, "Failed to get global aws secrets from cmdb", err)
	}
	sess, err := GetSessionByCreds(resp.Region, resp.AccessKey, resp.SecretKey, "")
	if err != nil {
		hs.log.Error("Failed to create AWS session", "error", err)
		return response.Error(http.StatusInternalServerError, "Failed to create AWS session", err)
	}

	svc := cloudwatch.New(sess)

	// Define the input parameters for the ListMetrics operation.
	input := &cloudwatch.ListMetricsInput{
		Namespace: aws.String(nameSpace),
	}

	isMetricFound := map[string]bool{}
	type metricAry []AWS_METRIC
	result := make(metricAry, 0)

	// Retrieve and list available metrics for the namespace.
	err = svc.ListMetricsPages(input, func(page *cloudwatch.ListMetricsOutput, lastPage bool) bool {
		for _, metric := range page.Metrics {
			if isMetricFound[*metric.MetricName] != true {
				isMetricFound[*metric.MetricName] = true
				am := AWS_METRIC{
					Text:  *metric.MetricName,
					Value: *metric.MetricName,
					Label: *metric.MetricName,
				}
				result = append(result, am)
				hs.log.Info("AWS Metric :::: " + *metric.MetricName)
			}
		}
		return !lastPage
	})
	if err != nil {
		hs.log.Error("Failed to list available metrics", "error", err)
		return response.Error(http.StatusInternalServerError, "Failed to list available aws metrics", err)
	}
	return response.JSON(200, &result)
}

func decrypt(encrypted string) ([]byte, error) {
	key := "my32digitkey12345678901234567890"
	iv := "my16digitIvKey12"

	ciphertext, err := base64.StdEncoding.DecodeString(encrypted)

	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher([]byte(key))

	if err != nil {
		return nil, err
	}

	if len(ciphertext)%aes.BlockSize != 0 {
		return nil, fmt.Errorf("block size cant be zero")
	}

	mode := cipher.NewCBCDecrypter(block, []byte(iv))
	mode.CryptBlocks(ciphertext, ciphertext)
	ciphertext = PKCS5UnPadding(ciphertext)

	return ciphertext, nil
}

// PKCS5UnPadding  pads a certain blob of data with necessary data to be used in AES block cipher
func PKCS5UnPadding(src []byte) []byte {
	length := len(src)
	unpadding := int(src[length-1])

	return src[:(length - unpadding)]
}

// GetAESEncrypted encrypts given text in AES 256 CBC
func encrypt(plaintext string) (string, error) {
	key := "my32digitkey12345678901234567890"
	iv := "my16digitIvKey12"

	var plainTextBlock []byte
	length := len(plaintext)

	if length%16 != 0 {
		extendBlock := 16 - (length % 16)
		plainTextBlock = make([]byte, length+extendBlock)
		copy(plainTextBlock[length:], bytes.Repeat([]byte{uint8(extendBlock)}, extendBlock))
	} else {
		plainTextBlock = make([]byte, length)
	}

	copy(plainTextBlock, plaintext)
	block, err := aes.NewCipher([]byte(key))

	if err != nil {
		return "", err
	}

	ciphertext := make([]byte, len(plainTextBlock))
	mode := cipher.NewCBCEncrypter(block, []byte(iv))
	mode.CryptBlocks(ciphertext, plainTextBlock)

	str := base64.StdEncoding.EncodeToString(ciphertext)

	return str, nil
}

type GlobalAwsSecret struct {
	AccessKey string `json:"accessKey,omitempty"`
	SecretKey string `json:"secretKey,omitempty"`
	Region    string `json:"region,omitempty"`
}

func getGlobalAwsSecretsFromCmdb() (*GlobalAwsSecret, error) {
	type cmdbResp struct {
		Key   string `json:"key,omitempty"`
		Value string `json:"value,omitempty"`
	}
	acKeyResp, err := externalServiceClient.Get(setting.CmdbLandingzoneCredsUrl + "/decrypt/get-by-key/GLOBAL_AWS_ACCESS_KEY")
	if err != nil || acKeyResp.StatusCode >= 400 {
		return nil, fmt.Errorf("cmdb api failed to get global aws access key", err)
	}
	secKeyResp, err := externalServiceClient.Get(setting.CmdbLandingzoneCredsUrl + "/decrypt/get-by-key/GLOBAL_AWS_SECRET_KEY")
	if err != nil || secKeyResp.StatusCode >= 400 {
		return nil, fmt.Errorf("cmdb api failed to get global aws secret key", err)
	}
	regionResp, err := externalServiceClient.Get(setting.CmdbLandingzoneCredsUrl + "/get-by-key/GLOBAL_AWS_REGION")
	if err != nil || regionResp.StatusCode >= 400 {
		return nil, fmt.Errorf("cmdb api failed to get global aws region", err)
	}

	defer acKeyResp.Body.Close()
	defer secKeyResp.Body.Close()
	defer regionResp.Body.Close()
	acKeyRespBodyBytes, err := io.ReadAll(acKeyResp.Body)
	if err != nil {
		return nil, fmt.Errorf("invalid cmdb api response to get global aws access key", err)
	}
	secKeyRespBodyBytes, err := io.ReadAll(secKeyResp.Body)
	if err != nil {
		return nil, fmt.Errorf("invalid cmdb api response to get global aws secret key", err)
	}
	regionRespBodyBytes, err := io.ReadAll(regionResp.Body)
	if err != nil {
		return nil, fmt.Errorf("invalid cmdb api response to get global aws region", err)
	}

	acKeyRespString := string(acKeyRespBodyBytes)
	secKeyRespString := string(secKeyRespBodyBytes)
	regionRespString := string(regionRespBodyBytes)

	acKey := cmdbResp{}
	secKey := cmdbResp{}
	regionKey := cmdbResp{}

	err = json.Unmarshal([]byte(acKeyRespString), &acKey)
	if err != nil {
		return nil, fmt.Errorf("json unmarshal error to unmarshal global aws access key", err)
	}
	err = json.Unmarshal([]byte(secKeyRespString), &secKey)
	if err != nil {
		return nil, fmt.Errorf("json unmarshal error to unmarshal global aws secret key", err)
	}
	err = json.Unmarshal([]byte(regionRespString), &regionKey)
	if err != nil {
		return nil, fmt.Errorf("json unmarshal error to unmarshal global aws region", err)
	}
	globalAwsSecret := GlobalAwsSecret{
		AccessKey: acKey.Value,
		SecretKey: secKey.Value,
		Region:    regionKey.Value,
	}
	return &globalAwsSecret, nil
}

//  ------Manoj.  custom changes for appcube plateform ------
