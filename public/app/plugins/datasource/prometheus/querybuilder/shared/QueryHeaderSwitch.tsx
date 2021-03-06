import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Stack } from '@grafana/experimental';
import { Switch, useStyles2 } from '@grafana/ui';
import { uniqueId } from 'lodash';
import React, { HTMLProps, useRef } from 'react';

export interface Props extends Omit<HTMLProps<HTMLInputElement>, 'value' | 'ref'> {
  value?: boolean;
  label: string;
}

export function QueryHeaderSwitch({ label, ...inputProps }: Props) {
  const switchIdRef = useRef(uniqueId(`switch-${label}`));
  const styles = useStyles2(getStyles);

  return (
    <Stack gap={1}>
      <label htmlFor={switchIdRef.current} className={styles.switchLabel}>
        {label}
      </label>
      <Switch {...inputProps} id={switchIdRef.current} />
    </Stack>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    switchLabel: css({
      color: theme.colors.text.secondary,
      cursor: 'pointer',
      fontSize: theme.typography.bodySmall.fontSize,
      '&:hover': {
        color: theme.colors.text.primary,
      },
    }),
  };
};
