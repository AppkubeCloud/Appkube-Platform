// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from 'react';
import { css } from '@emotion/css';
import cx from 'classnames';
import { useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

import { Divider } from './Divider';

const getStyles = (theme: GrafanaTheme2) => {
  return {
    LabeledList: css`
      label: LabeledList;
      list-style: none;
      margin: 0;
      padding: 0;
    `,
    LabeledListItem: css`
      label: LabeledListItem;
      display: inline-block;
    `,
    LabeledListLabel: css`
      label: LabeledListLabel;
      color: ${theme.isLight ? '#999' : '#666'};
      margin-right: 0.25rem;
    `,
  };
};

type LabeledListProps = {
  className?: string;
  items: Array<{ key: string; label: React.ReactNode; value: React.ReactNode }>;
};

export default function LabeledList(props: LabeledListProps) {
  const { className, items } = props;
  const styles = useStyles2(getStyles);
  return (
    <ul className={cx(styles.LabeledList, className)}>
      {items.map(({ key, label, value }, i) => {
        const divider = i < items.length - 1 && (
          <li className={styles.LabeledListItem} key={`${key}--divider`}>
            <Divider />
          </li>
        );
        return [
          <li className={styles.LabeledListItem} key={key}>
            <span className={styles.LabeledListLabel}>{label}</span>
            <strong>{value}</strong>
          </li>,
          divider,
        ];
      })}
    </ul>
  );
}
