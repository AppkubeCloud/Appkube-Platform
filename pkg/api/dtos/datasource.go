package dtos

import (
	"strings"

	"github.com/grafana/grafana/pkg/components/simplejson"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/services/accesscontrol"
)

type DataSource struct {
	Id                int64                  `json:"id"`
	UID               string                 `json:"uid"`
	OrgId             int64                  `json:"orgId"`
	Name              string                 `json:"name"`
	Type              string                 `json:"type"`
	TypeLogoUrl       string                 `json:"typeLogoUrl"`
	Access            models.DsAccess        `json:"access"`
	Url               string                 `json:"url"`
	Password          string                 `json:"password"`
	User              string                 `json:"user"`
	Database          string                 `json:"database"`
	BasicAuth         bool                   `json:"basicAuth"`
	BasicAuthUser     string                 `json:"basicAuthUser"`
	BasicAuthPassword string                 `json:"basicAuthPassword"`
	WithCredentials   bool                   `json:"withCredentials"`
	IsDefault         bool                   `json:"isDefault"`
	JsonData          *simplejson.Json       `json:"jsonData,omitempty"`
	SecureJsonFields  map[string]bool        `json:"secureJsonFields"`
	Version           int                    `json:"version"`
	ReadOnly          bool                   `json:"readOnly"`
	AccessControl     accesscontrol.Metadata `json:"accessControl,omitempty"`
	//  ------Manoj.  custom changes for appcube plateform ------
	AccountId string `json:"accountID"`
	TenantId  string `json:"tenantID"`
	CloudType string `json:"cloudType"`
	InputType string `json:"inputType"`
	// ------Manoj.  custom changes for appcube plateform ------
}

type DataSourceListItemDTO struct {
	Id          int64            `json:"id"`
	UID         string           `json:"uid"`
	OrgId       int64            `json:"orgId"`
	Name        string           `json:"name"`
	Type        string           `json:"type"`
	TypeName    string           `json:"typeName"`
	TypeLogoUrl string           `json:"typeLogoUrl"`
	Access      models.DsAccess  `json:"access"`
	Url         string           `json:"url"`
	Password    string           `json:"password"`
	User        string           `json:"user"`
	Database    string           `json:"database"`
	BasicAuth   bool             `json:"basicAuth"`
	IsDefault   bool             `json:"isDefault"`
	JsonData    *simplejson.Json `json:"jsonData,omitempty"`
	ReadOnly    bool             `json:"readOnly"`
	//  ------Manoj.  custom changes for appcube plateform ------
	AccountId string `json:"accountID"`
	TenantId  string `json:"tenantID"`
	CloudType string `json:"cloudType"`
	InputType string `json:"inputType"`
	// ------Manoj.  custom changes for appcube plateform ------
}

type DataSourceList []DataSourceListItemDTO

func (slice DataSourceList) Len() int {
	return len(slice)
}

func (slice DataSourceList) Less(i, j int) bool {
	return strings.ToLower(slice[i].Name) < strings.ToLower(slice[j].Name)
}

func (slice DataSourceList) Swap(i, j int) {
	slice[i], slice[j] = slice[j], slice[i]
}

// ------Manoj.  custom changes for appcube plateform ------
type DataSourceMasterListItemDTO struct {
	Id        int64            `json:"id"`
	JsonData  *simplejson.Json `json:"jsonData,omitempty"`
	CloudType string           `json:"cloudType"`
}

type DataSourceMasterList []DataSourceMasterListItemDTO

// ------Manoj.  custom changes for appcube plateform ------
