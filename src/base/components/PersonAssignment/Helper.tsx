import { Typography } from 'antd';

import { CalendarMonth, List, Order } from '@base/icons';
import { dateFormatter, formatPhoneNumber } from '@base/utils/helper';
import * as keyNames from '@customer/pages/ListPage/keyNames';

import HeaderCell from '../Table/ReactTable/HeaderCell';
import { FieldsData } from '../Table/ReactTable/Helper';

export const configFields: FieldsData = [
  {
    header: <HeaderCell title="이름" style={{ color: '#646E8B' }} />,
    keyName: keyNames.KEY_NAME_CUSTOMER_LIST_NAME
  },
  {
    header: <HeaderCell title="전화번호" style={{ color: '#646E8B' }} />,
    keyName: keyNames.KEY_NAME_CUSTOMER_LIST_PHONES
  },
  {
    header: <HeaderCell title="등록일" style={{ color: '#646E8B' }} />,
    keyName: keyNames.KEY_NAME_CUSTOMER_LIST_CREATE_DATE,
    enableSorting: true
  }
];

export const getMapColumns = () => {
  return {
    [keyNames.KEY_NAME_CUSTOMER_LIST_NAME](col: string, data: any) {
      const value = data[col];
      return (
        <Typography
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 12,
            fontWeight: 500,
            textAlign: 'left'
          }}
        >
          {value}
        </Typography>
      );
    },
    [keyNames.KEY_NAME_CUSTOMER_LIST_PHONES](col: string, data: any) {
      const value = formatPhoneNumber(data[col]) || '-';
      return (
        <Typography
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 12,
            fontWeight: 500,
            textAlign: 'left'
          }}
        >
          {value}
        </Typography>
      );
    },
    [keyNames.KEY_NAME_CUSTOMER_LIST_CREATE_DATE](col: string, data: any) {
      const value = dateFormatter(data[col]);
      return (
        <Typography
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 12,
            fontWeight: 500,
            textAlign: 'left'
          }}
        >
          {value}
        </Typography>
      );
    }
  };
};
