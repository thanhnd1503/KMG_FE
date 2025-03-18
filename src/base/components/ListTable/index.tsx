import { ColumnDef } from '@tanstack/react-table';
import { Flex } from 'antd';

import { TABLE_LIST_PAGINATION_HEIGHT } from '@base/configs/layoutConfig';

import ListPagination, { ListPaginationProps } from '../ListPagination';
import { onSortByFunc, ReactTable8 } from '../Table/ReactTable';

export const LIST_TABLE_PAGINATION_HEIGHT = TABLE_LIST_PAGINATION_HEIGHT;

export interface BaseListProps {
  pagingProps?: ListPaginationProps;
  onPageChange?: (page: number, size: number) => void;
  rows: any[];
  primaryKey?: string;
  onRowChecked?: (ids: string[]) => void;
}

export interface ListTableProps extends BaseListProps {
  style?: React.CSSProperties;
  columns: ColumnDef<any>[];
  isRowSpanned?: boolean;
  pagingStyle?: React.CSSProperties; //style props for pagination
  isSmall?: boolean;
  noDataComponent?: JSX.Element;
  tableHeaderCellStyle?: React.CSSProperties;
  isRowPerPage?: boolean; // use for show hide Row per page
  sortValue?: any;
  onSortBy?: onSortByFunc;
  filterValue?: any;
  sxTableContainer?: React.CSSProperties;
  tableWrapStyle?: React.CSSProperties;
  hideHeader?: boolean;
  checkedIds?: string[];
  headerHeight?: number;
  rowHeight?: number;
  rowAlign?: 'top' | 'middle' | 'bottom' | 'baseline';
  border?: boolean;
  customFooter?: JSX.Element;
  onRowClick?: (row: any, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
  pageType?: 'page' | 'more';
}

const ListTable = (props: ListTableProps) => {
  const {
    columns,
    rows = [],
    pagingProps,
    onPageChange,
    style,
    isRowSpanned = false,
    pagingStyle,
    isSmall,
    noDataComponent,
    tableHeaderCellStyle,
    isRowPerPage = true,
    sxTableContainer,
    tableWrapStyle,
    hideHeader = false,
    checkedIds,
    onRowChecked,
    headerHeight,
    rowHeight,
    rowAlign,
    border = false,
    customFooter,
    onRowClick,
    onSortBy,
    pageType = 'page'
  } = props;

  const nColumns = columns.map((column: any) => {
    return {
      ...column,
      header: column.hideTitle ? '' : column.header
    };
  });

  return (
    <Flex
      vertical
      style={{
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 0,
        borderRadius: 8,
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
      // className="scroll-box"
    >
      <Flex
        style={{
          // flex: 1,
          minHeight: 0,
          width: '100%',
          maxHeight: `calc(100% - ${LIST_TABLE_PAGINATION_HEIGHT}px)`,
          ...tableWrapStyle
        }}
      >
        <ReactTable8
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          rowAlign={rowAlign}
          border={border}
          columns={nColumns}
          data={rows}
          paging={pagingProps ?? { pageSize: rows?.length ?? 10 }}
          isRowSpanned={isRowSpanned}
          noDataComponent={noDataComponent}
          tableHeaderCellSx={tableHeaderCellStyle}
          sxTableContainer={{ height: '100%', minWidth: 1024, ...sxTableContainer }}
          hideHeader={hideHeader}
          rowSelected={checkedIds}
          onRowSelect={onRowChecked}
          onRowClick={onRowClick}
          onSortBy={onSortBy}
        />
      </Flex>

      {pagingProps && (
        <ListPagination
          gotoPage={(page: number) => onPageChange && onPageChange(page, pagingProps.pageSize)}
          // setPageSize={(size: number, pageIndex) => onPageChange && onPageChange(pageIndex ?? pagingProps.pageIndex, size)}
          pageSize={pagingProps.pageSize}
          pageIndex={pagingProps.pageIndex}
          pageTotal={pagingProps.pageTotal}
          pageCount={pagingProps.pageCount}
          isSmall={isSmall}
          isRowPerPage={isRowPerPage}
          pageType={pageType}
        />
      )}
      {customFooter && (
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--list-stroke-footer, #cbd1e1)',
            backgroundColor: 'var(--list-bg-footer, #f1f3f9)',
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8
          }}
        >
          {customFooter}
        </div>
      )}
    </Flex>
  );
};

export default ListTable;
