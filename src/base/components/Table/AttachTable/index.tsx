import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { Button, Checkbox, CheckboxProps, Empty, Spin, Upload } from 'antd';
import classNames from 'classnames/bind';
import style from './style.module.css';

const cx = classNames.bind(style);
type AttachTableProps = {
  column?: Record<string, any>;
  data: any[];
  renderItem?: (item: any, index: number) => ReactNode;
  checkBox?: boolean;
  isLoading?: boolean;
  wrapperStyle?: CSSProperties;
  rightAction?: ReactNode;
};
const defaultColumn = {
  renderDownload: '계약서',
  reg_date: '등록날짜'
};

const AttachTable = ({
  column = defaultColumn,
  renderItem,
  data = [],
  checkBox = false,
  isLoading = false,
  wrapperStyle,
  rightAction
}: AttachTableProps) => {
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const renderColumn = () => {
    return Object.keys(column)?.map((key, index) => {
      return <th key={index}>{column[key]}</th>;
    });
  };
  const defaultRenderRow = (item: any, index: number) => (
    <>
      {Object.keys(column) &&
        Object.keys(column).map((key, indx) => (
          <td key={`${index}-${indx}`}>
            <span>{item[key as keyof any]}</span>
          </td>
        ))}
    </>
  );
  const checkAll = data?.length !== 0 && data?.length === checkedList?.length;
  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(e.target.checked ? data : []);
  };
  useEffect(() => {
    setCheckedList([]);
  }, [data]);
  return (
    <Spin spinning={isLoading}>
      <div className={cx('wrapper')} style={wrapperStyle}>
        <table>
          <thead>
            <tr>
              {checkBox && (
                <th style={{ width: '80px' }}>
                  <Checkbox onChange={onCheckAllChange} checked={checkAll}></Checkbox>
                </th>
              )}
              {renderColumn()}
              {rightAction && <th>{rightAction}</th>}
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {checkBox && (
                    <td>
                      <Checkbox checked={checkedList?.some((listItem) => listItem.id === item.id)}></Checkbox>
                    </td>
                  )}
                  {typeof renderItem === 'function' ? renderItem(item, index) : defaultRenderRow(item, index)}
                  {rightAction && <td></td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>{data?.length === 0 && <Empty imageStyle={{ height: 60 }} />}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Spin>
  );
};

export default AttachTable;
