import { Typography } from 'antd';



import * as keyNames from './keyNames';
export const getMapColumns = () => {
  return {
    [keyNames.KEY_NAME_DEMO_LIST_CAR_NUMBER](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_COMPANY_NAME](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_REPRESENT_MODEL](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_REPRESENT_RATE](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_CAR_COLOR](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_CAR_IDENTIFICATE_NUMBER](col: string, data: any, extra?: any) {
      const value = data[col];
      return (
        // <LinkTo to={`/${MENU_DEMO_URL}/${extra?.subMenu || 'all'}/view/${data['id']}`} openTab={false}>
        //   {value}
        // </LinkTo>
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
    [keyNames.KEY_NAME_DEMO_LIST_CURRENT_CONTRACT_ID](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_CURRENT_CONTRACT_CUST_NAME](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_CAR_REGIST_DATE](col: string, data: any) {
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
    [keyNames.KEY_NAME_DEMO_LIST_ACTION](col: string, data: any) {
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
    }
  };
};
