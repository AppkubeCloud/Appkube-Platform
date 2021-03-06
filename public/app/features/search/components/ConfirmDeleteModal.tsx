import React, { FC } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';
import { ConfirmModal, stylesFactory, useTheme } from '@grafana/ui';
import { locationService } from '@grafana/runtime';
import { DashboardSection, OnDeleteItems } from '../types';
import { getCheckedUids } from '../utils';
import { deleteFoldersAndDashboards } from 'app/features/manage-dashboards/state/actions';
// import { config } from '../../config';

interface Props {
  onDeleteItems: OnDeleteItems;
  results: DashboardSection[];
  isOpen: boolean;
  onDismiss: () => void;
}

export const ConfirmDeleteModal: FC<Props> = ({ results, onDeleteItems, isOpen, onDismiss }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const uids = getCheckedUids(results);
  const { folders, dashboards } = uids;
  const folderCount = folders.length;
  const dashCount = dashboards.length;

  let text = 'Do you want to delete the ';
  let subtitle;
  const dashEnding = dashCount === 1 ? '' : 's';
  const folderEnding = folderCount === 1 ? '' : 's';

  if (folderCount > 0 && dashCount > 0) {
    text += `selected folder${folderEnding} and dashboard${dashEnding}?\n`;
    subtitle = `All dashboards and alerts of the selected folder${folderEnding} will also be deleted`;
  } else if (folderCount > 0) {
    text += `selected folder${folderEnding} and all ${folderCount === 1 ? 'its' : 'their'} dashboards and alerts?`;
  } else {
    text += `selected dashboard${dashEnding}?`;
  }

  const deleteItems = () => {
    deleteFoldersAndDashboards(folders, dashboards).then(() => {
      onDismiss();
      // Redirect to /dashboard in case folder was deleted from f/:folder.uid
      locationService.push('/dashboards');
      onDeleteItems(folders, dashboards);
    });
    // let dashboardList = [];
    // if (results && results.length > 0) {
    //   for (let i = 0; i < results.length; i++) {
    //     const folder = results[i];
    //     if (folder && folder.items && folder.items.length > 0) {
    //       const items = folder.items;
    //       for (let j = 0; j < items.length; j++) {
    //         const uid = items[j].uid as string;
    //         if (dashboards.indexOf(uid) !== -1) {
    //           dashboardList.push({ id: items[j].id, uid: uid });
    //         }
    //       }
    //     }
    //   }
    // }
    // let requestOptions: any = {
    //   method: `DELETE`,
    //   body: JSON.stringify(dashboardList),
    // };
    // fetch(`${config.DELETE_DASHBOARD}`, requestOptions).then((response: any) => {
    //   console.log(response);
    // });
  };

  return isOpen ? (
    <ConfirmModal
      isOpen={isOpen}
      title="Delete"
      body={
        <>
          {text} {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </>
      }
      confirmText="Delete"
      onConfirm={deleteItems}
      onDismiss={onDismiss}
    />
  ) : null;
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    subtitle: css`
      font-size: ${theme.typography.size.base};
      padding-top: ${theme.spacing.md};
    `,
  };
});
