import React from 'react';

import classNames from 'classnames/bind';

import ValueDisplay from '@base/components/ValueDisplay';

import styles from './style.module.css';

interface ViewTableProps {
  headers: any[];
  data: {
    rowTitle: string;
    values: any[];
  }[];
  highlightIndexes?: number[];
}
const cx = classNames.bind(styles);

const ViewTable: React.FC<ViewTableProps> = ({ headers, data }) => {
  return (
    <div style={{ borderRadius: 4, border: '1px solid #E2E5F0' }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          color: '#475069',
          fontSize: 12,
          fontWeight: 400,
          borderBottom: '1px solid #E2E5F0',
          backgroundColor: '#F1F3F9'
        }}
      >
        {headers.map((header, index) => (
          <p key={index} className={cx('row')}>
            <ValueDisplay value={header} />
          </p>
        ))}
      </div>

      {/* Data Rows */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            color: '#475069',
            fontSize: 12,
            fontWeight: 400,
            borderBottom: rowIndex < data.length - 1 ? '1px solid #E2E5F0' : 'none'
          }}
        >
          {/* Row Title */}
          <p
            className={cx('row')}
            style={{
              backgroundColor: '#F1F3F9'
            }}
          >
            {row.rowTitle}
          </p>

          {/* Row Values */}
          {row.values.map((value, cellIndex) => (
            <p
              key={cellIndex}
              className={cx('row')}
              style={{
                backgroundColor: rowIndex % 2 !== 0 ? '#F8F9FC' : 'transparent',
                fontWeight: 500,
                color: '#0F162A'
              }}
            >
              <ValueDisplay value={value} />
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewTable;
