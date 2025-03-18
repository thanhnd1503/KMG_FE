import { Typography } from 'antd';

export interface Field<K extends string = string> {
  [key: string]: any;
  keyName?: K;
  // languageKey: string;
  defaultViewInList?: boolean;
  sortable?: boolean; // depreciated
  name?: string;
  title?: string;
  width?: string | number;
  minWidth?: string | number;
  namespace?: string;
  enableSorting?: boolean;
  enableColumnFilter?: boolean;
}
export type FieldsData<K extends string = string> = Field<K>[];

export const makeTable8Columns = (fields: FieldsData, columnRenderRemap: any, extraParams: any, hiddenColumns: string[]) => {
  //react-table columns
  let newColumns: any[] = [];

  // loadDefaultColumns
  let columnRender = {
    // ...defaultColumnsRender,
    ...columnRenderRemap
  };

  // render column order by setting
  fields.length > 0 &&
    fields.forEach((field: any) => {
      if (hiddenColumns.indexOf(field.keyName) !== -1) {
        return;
      }
      let column: any = {
        header: field.header,
        accessorKey: field.keyName,
        enableSorting: field?.enableSorting || field?.sortable ? true : false,
        width: field?.width ?? 'auto',
        minWidth: field?.minWidth ?? 'auto',
        maxWidth: field?.maxWidth ?? 'auto',
        namespace: field?.namespace ?? '',
        center: field?.center ?? false,
        ...field
      };

      // defaultRender
      let cellRenderFn = (col: string, data: any, extraParams: any = undefined) => {
        let dataType = typeof data[col];
        let renderData =
          dataType !== 'undefined' ? (dataType === 'string' || dataType === 'number' ? data[col] : JSON.stringify(data[col])) : '';
        return <>{renderData}</>;
      };

      if (typeof columnRender[field.keyName] != 'undefined') {
        cellRenderFn = columnRender[field.keyName];
      } else if (columnRender['defaultCell']) {
        cellRenderFn = columnRender['defaultCell'];
      } else {
        cellRenderFn = defaultCellRender;
      }

      column.cell = (props: any) => {
        if (!props) {
          return null;
        }
        let col: string = field.keyName;
        let data: any = props.row.original;
        return cellRenderFn(col, data, { ...extraParams, rIndex: props?.row?.index });
      };
      column.columns = field.children ? makeTable8Columns(field.children, columnRenderRemap, extraParams, hiddenColumns) : undefined;
      newColumns.push(column);
    });

  return newColumns;
};
const defaultCellRender = (col: string, data: any, extraParams: any = undefined) => {
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
};
// export const fixedTableLayoutSx: SxProps = {
//   overflowY: 'scroll',
//   WebkitOverflowScrolling: 'touch',
//   '& table': {
//     tableLayout: 'fixed',
//     '& th:first-of-type': {
//       pl: '12px !important'
//     },
//     '& td:first-of-type': {
//       pl: '12px !important'
//     },
//     '& th:last-of-type': {
//       pr: '12px !important'
//     },
//     '& td:last-of-type': {
//       pr: '12px !important'
//     },
//     '& .MuiTableContainer-root': {
//       overflowX: 'hidden',
//       overflowY: 'scroll',
//       WebkitOverflowScrolling: 'touch'
//     }
//   }
// };
