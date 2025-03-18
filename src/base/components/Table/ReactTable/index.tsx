import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
  SortDirection,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { Flex, Input } from 'antd';
import classNames from 'classnames/bind';
import { isEmpty, reduce } from 'lodash';

import { TABLE_LIST_HEADER_HEIGHT, TABLE_LIST_ROW_HEIGHT } from '@base/configs/layoutConfig';
import { ChevronDown, ChevronUp } from '@base/icons';
import { SortEnum } from '@base/types';

import Nodata from './Nodata';
import style from './style.module.css';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateTableData: (value: unknown) => void;
    updateCellData: (rowIndex: number, columnId: string, value: unknown) => void;
    addTableRow: (value: unknown) => void;
    removeTableRow: (rowIndex: number, columnId: string) => void;
    updateHeaderData?: (columnIdx: number, value: unknown) => void;
  }
}

const cx = classNames.bind(style);

// ==============================|| REACT-TABLE-8 ||============================== //

export type onSortByFunc = (clName: string | any, sortDirection: SortDirection | false) => void;
export type onFilterByFunc = (clName: string | any, filterValue: any) => void;

interface Table8Props {
  columns: any[];
  data: any[];
  rowSelected?: string[];
  paging?: any;
  isRowSpanned?: boolean;
  noDataComponent?: JSX.Element;
  tableHeaderCellSx?: React.CSSProperties;
  sxTableContainer?: React.CSSProperties;
  hideHeader?: boolean;
  onRowSelect?: (params: any) => void;
  onSortBy?: onSortByFunc;
  onFilterBy?: onFilterByFunc;
  headerHeight?: number;
  rowHeight?: number;
  rowAlign?: string;
  border?: boolean;
  onRowClick?: (row: any, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
}

export const ReactTable8 = (props: Table8Props) => {
  const {
    onRowSelect,
    onSortBy,
    onFilterBy,
    rowSelected,
    columns = [],
    data = [],
    isRowSpanned,
    noDataComponent,
    tableHeaderCellSx,
    sxTableContainer = {},
    hideHeader = false,
    headerHeight,
    rowHeight,
    rowAlign,
    border = false,
    onRowClick
  } = props;

  // state
  const initialRowSelection = reduce(
    rowSelected,
    (f: any, id) => {
      f[id] = true;
      return f;
    },
    {}
  );
  const [rowSelection, setRowSelection] = useState<any>(initialRowSelection);

  const [sorting, setSorting] = useState<SortingState>([]);

  //table definition
  const table = useReactTable({
    data: data || [],
    columns,
    state: { rowSelection, sorting },
    enableSortingRemoval: true,
    enableRowSelection: (row: any) => row?.original?.enabled ?? row?.original?.enabled_selection ?? true,
    onRowSelectionChange: setRowSelection,
    getRowId(originalRow: any, index: number, parent?: any) {
      return parent ? [parent['id'], originalRow['id']].join('.') : originalRow['id'];
    },
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: true,
    debugTable: false
  });

  // callback selected rows
  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      if (JSON.stringify(initialRowSelection) !== JSON.stringify(rowSelection)) {
        onRowSelect && onRowSelect(Object.keys(rowSelection)); //onChange
      }
    } else {
      onRowSelect && onRowSelect([]);
    }
  }, [rowSelection]);

  // listen row selected
  useEffect(() => {
    if (isEmpty(rowSelected) && Object.keys(rowSelection).length > 0) {
      setRowSelection({});
    } else {
      if (JSON.stringify(initialRowSelection) !== JSON.stringify(rowSelection)) {
        setRowSelection(initialRowSelection);
      }
    }
  }, [rowSelected]);

  //render
  return (
    <div
      style={{
        boxShadow: 'none',
        overscrollBehavior: 'none',
        border: border ? '1px solid #E2E5F0' : 'none',
        borderRadius: border ? '4px' : '0',
        ...sxTableContainer
      }}
      className={cx('list-trip-table') + ' scroll-box'}
      // className={cx('list-trip-table')}
    >
      <table>
        {!hideHeader && (
          <thead
            style={{
              borderRadius: 0,
              position: 'sticky',
              backgroundColor: 'var(--list-bg-header, #F1F3F9)',
              top: 0,
              zIndex: 1,
              boxShadow: '0px 1px 1px 0px var(--list-stroke-footer, #cbd1e1)'
            }}
          >
            {table.getHeaderGroups().map((headerGroup: any, groupIdx: number) => (
              <tr key={groupIdx}>
                {headerGroup.headers.map((header: any, cIdx: number) => {
                  const columnRelativeDepth = header.depth - header.column.depth;

                  if (!header.isPlaceholder && columnRelativeDepth > 1 && header.id === header.column.id) {
                    return null;
                  }

                  let rowSpan = 1;
                  if (header.isPlaceholder) {
                    const leafs = header.getLeafHeaders();
                    rowSpan = leafs[leafs.length - 1].depth - header.depth;
                  }

                  return (
                    <th
                      key={`${groupIdx}-${cIdx}`}
                      colSpan={header.colSpan}
                      rowSpan={rowSpan}
                      style={{
                        height: headerHeight ? headerHeight : TABLE_LIST_HEADER_HEIGHT,
                        minWidth: header?.column?.columnDef?.minWidth ?? 'auto',
                        maxWidth: header?.column?.columnDef?.maxWidth ?? 'auto',
                        width: header?.column?.columnDef?.width ?? header?.column?.getSize(),
                        paddingRight: 8,
                        paddingLeft: 8
                      }}
                    >
                      <Flex align="center" justify={header?.column?.columnDef?.center ? 'center' : 'flex-start'} gap={4}>
                        <div
                          style={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            ...(!header.column.getCanSort() && header?.column?.columnDef?.center && { width: '100%' }),
                            ...tableHeaderCellSx
                          }}
                          className="title-xs"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>

                        {header.column.getCanSort() && (
                          <div
                            style={{ display: 'flex', flexDirection: 'column', color: 'grey', cursor: 'pointer', gap: 6 }}
                            onClick={() => {
                              const currentSort = header.column.getIsSorted();
                              if (currentSort === SortEnum.ASC) {
                                setSorting([{ id: header.column.id, desc: true }]);
                                onSortBy && onSortBy(header.column.id, 'desc');
                              } else if (currentSort === 'desc') {
                                setSorting([]);
                                onSortBy && onSortBy(header.column.id, false);
                              } else {
                                setSorting([{ id: header.column.id, desc: false }]);
                                onSortBy && onSortBy(header.column.id, SortEnum.ASC);
                              }
                            }}
                          >
                            <ChevronUp
                              style={{
                                fontSize: 16,
                                color:
                                  header.column.getCanSort() && header.column.getIsSorted() === SortEnum.ASC
                                    ? 'var(--primary-fg-color-primary-fg-50, #6366F1)'
                                    : header.column.getIsSorted() === 'desc'
                                      ? 'var(--base-fg-color-base-fg-30, #CBD1E1)'
                                      : 'var(--list-fg-label, #646E8B)'
                              }}
                            />
                            <ChevronDown
                              style={{
                                fontSize: 16,
                                marginTop: -14,
                                color:
                                  header.column.getIsSorted() === 'desc'
                                    ? 'var(--primary-fg-color-primary-fg-50, #6366F1)'
                                    : header.column.getIsSorted() === SortEnum.ASC
                                      ? 'var(--base-fg-color-base-fg-30, #CBD1E1)'
                                      : 'var(--list-fg-label, #646E8B)'
                              }}
                            />
                          </div>
                        )}
                      </Flex>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        )}
        <tbody style={{}}>
          {table.getRowModel().rows.map((row: any, rIdx: number) => {
            return (
              <tr
                key={rIdx}
                style={{
                  height: rowHeight || TABLE_LIST_ROW_HEIGHT,
                  verticalAlign: rowAlign || 'middle',
                  ...(row.getIsSelected() && {
                    backgroundColor: 'var(--list-bg-body-selected, #E2E5F0)'
                  })
                }}
                onClick={(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
                  const target = e.target as HTMLElement;
                  if (
                    (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') ||
                    target.closest('.prevent-row-click')
                  ) {
                    return;
                  }

                  const checkbox = target.querySelector('input[type="checkbox"]');
                  if (checkbox) {
                    // Found a checkbox as a child
                    // not go detail
                    return
                  }

                  const selection = window.getSelection();
                  const hasSelection = selection && selection.toString().length > 0;

                  if (!hasSelection) {
                    if (onRowClick) {
                      e?.preventDefault();
                      onRowClick(row, e);
                    }
                  }
                }}
              >
                {row.getVisibleCells().map((cell: any, ceIdx: number) => {
                  if (isRowSpanned) {
                    if (cell.getValue()?.rowSpan) {
                      if (cell.getValue().isRowSpanned) {
                        return null;
                      } else {
                        return (
                          <td
                            style={{
                              position: 'relative'
                            }}
                            rowSpan={cell.getValue()?.rowSpan}
                            key={ceIdx}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      }
                    } else {
                      return (
                        <td key={ceIdx} style={{ position: 'relative' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    }
                  }
                  return (
                    <td key={ceIdx} style={{ position: 'relative' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {data.length === 0 &&
            (noDataComponent ? (
              <tr>
                <td colSpan={columns.length}>{noDataComponent}</td>
              </tr>
            ) : (
              <Nodata colspan={columns.length} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

// REACT EDIT TABLE

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

interface ReactEditableProps {
  sx?: any;
  // paging?: { pageIndex: number; pageSize: number };
  editableColumn?: any;
  columns: any[];
  data: any[];
  setData: (val: any[], index?: number, id?: string) => void;
  rowSelected?: string[];
  onRowSelect?: (params: any) => void;
  onRowClick?: (params: any) => void;
  primaryKey?: string;
  isMultiSelection?: boolean;
  noDataComponent?: JSX.Element;
  customFooter?: JSX.Element;
  bodyStyle?: CSSProperties;
  headerHeight?: number;
  rowHeight?: number;
  sxTableContainer?: React.CSSProperties;
  border?: boolean;
}

export const ReactEditable = (props: ReactEditableProps) => {
  const {
    editableColumn,
    data,
    columns,
    // paging,
    setData,
    sx,
    rowSelected,
    onRowSelect,
    onRowClick,
    primaryKey = 'id',
    isMultiSelection = true,
    noDataComponent,
    customFooter,
    bodyStyle,
    headerHeight,
    rowHeight,
    sxTableContainer,
    border
  } = props;

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  // Give our default column cell renderer editing superpowers!
  const defaultColumn: Partial<ColumnDef<any>> = {
    cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
      //console.log('row index', index);
      //console.log('column id', id);
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateCellData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return <Input value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
    }
  };

  // state
  const initialRowSelection = reduce(
    rowSelected,
    (f: any, id) => {
      f[id] = true;
      return f;
    },
    {}
  );
  const [rowSelection, setRowSelection] = useState<any>(initialRowSelection);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: editableColumn ? editableColumn : defaultColumn,
    state: {
      // pagination: paging ? paging : { pageIndex: 0, pageSize: 100 },
      rowSelection
    },
    enableMultiRowSelection: isMultiSelection,
    onRowSelectionChange: setRowSelection,
    //option
    getRowId(originalRow: any, index: number, parent?: any) {
      // return row id in select row
      return parent ? [parent[primaryKey], originalRow[primaryKey]].join('.') : originalRow[primaryKey];
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateTableData: (value) => {
        // Skip index reset until after next rerender
        skipAutoResetPageIndex();
        setData(value as any);
      },
      addTableRow: (value) => {
        // Skip index reset until after next rerender
        skipAutoResetPageIndex();
        setData([...data, value]);
      },
      updateCellData: (rowIndex, columnId, value) => {
        // Skip index reset until after next rerender
        skipAutoResetPageIndex();
        const old = [...data];
        const newData = old.map((row: any, index: number) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex]!,
              [columnId]: value
            };
          }
          return row;
        });
        //console.log('newData', newData);
        setData(newData, rowIndex, columnId);
      },
      removeTableRow: (rowIndex, columnId) => {
        // Skip index reset until after next rerender
        skipAutoResetPageIndex();
        const newData = [...data];
        newData.splice(rowIndex, 1);
        setData(newData);
      }
    },
    debugTable: false
  });

  // callback selected rows
  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      if (JSON.stringify(initialRowSelection) !== JSON.stringify(rowSelection)) {
        onRowSelect && onRowSelect(Object.keys(rowSelection)); //onChange
      }
    } else {
      onRowSelect && onRowSelect([]);
    }
  }, [rowSelection]);

  // listen row selected
  useEffect(() => {
    if (isEmpty(rowSelected) && Object.keys(rowSelection).length > 0) {
      setRowSelection({});
    } else {
      if (JSON.stringify(initialRowSelection) !== JSON.stringify(rowSelection)) {
        setRowSelection(initialRowSelection);
      }
    }
  }, [rowSelected]);

  //render
  return (
    <div
      style={{
        boxShadow: 'none',
        overscrollBehavior: 'none',
        border: border ? '1px solid #E2E5F0' : 'none',
        borderRadius: border ? '4px' : '0',
        ...sxTableContainer
      }}
      className={cx('list-trip-table') + ' scroll-box'}
    >
      <table>
        <thead
          style={{
            height: headerHeight ? headerHeight : TABLE_LIST_HEADER_HEIGHT,
            borderRadius: 0,
            position: 'sticky',
            backgroundColor: 'var(--list-bg-header, #F1F3F9)',
            top: 0,
            zIndex: 1,
            boxShadow: '0px 1px 1px 0px var(--list-stroke-footer, #cbd1e1)'
          }}
        >
          {table.getHeaderGroups().map((headerGroup: any, groupIdx: number) => (
            <tr key={groupIdx}>
              {headerGroup.headers.map((header: any, cIdx: number) => {
                return (
                  <th
                    key={`${groupIdx}-${cIdx}`}
                    colSpan={header.colSpan}
                    style={{
                      minWidth: header?.column?.columnDef?.minWidth ?? 'auto',
                      maxWidth: header?.column?.columnDef?.maxWidth ?? 'auto',
                      width: header?.column?.columnDef?.width ?? header?.column?.getSize(),
                      paddingInline: 8
                    }}
                  >
                    <Flex
                      align="center"
                      justify={header.getContext().header.id === 'select' || header?.column?.columnDef?.center ? 'center' : 'flex-start'}
                      gap={4}
                    >
                      <div
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: 12,
                          fontWeight: 600
                          // ...tableHeaderCellSx
                        }}
                        className="title-xs"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header?.column?.columnDef?.required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
                      </div>

                      {header.column.getCanSort() && (
                        <div
                          style={{ display: 'flex', flexDirection: 'column', color: 'grey', cursor: 'pointer', gap: 6 }}
                          onClick={() => {
                            header.column.toggleSorting();
                            // onSortBy && onSortBy(header.column.id, header.column.getNextSortingOrder());
                          }}
                        >
                          <ChevronUp
                            style={{
                              fontSize: 16,
                              color: header.column.getCanSort() && header.column.getIsSorted() === SortEnum.ASC ? 'grey' : 'inherit'
                            }}
                          />
                          <ChevronDown
                            style={{
                              fontSize: 16,
                              marginTop: -14,
                              color: header.column.getIsSorted() === 'desc' ? 'grey' : 'inherit'
                            }}
                          />
                        </div>
                      )}
                    </Flex>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody style={bodyStyle}>
          {table.getRowModel().rows.map((row: any, rIdx: number) => {
            return (
              <tr
                key={rIdx}
                style={{
                  ...(row.getIsSelected() && {
                    backgroundColor: 'var(--list-bg-body-selected, #E2E5F0)'
                  }),
                  height: rowHeight || TABLE_LIST_ROW_HEIGHT
                }}
                onClick={(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
                  const target = e.target as HTMLElement;

                  if (
                    (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') ||
                    target.closest('.prevent-row-click')
                  ) {
                    return;
                  }

                  const selection = window.getSelection();
                  const hasSelection = selection && selection.toString().length > 0;

                  if (!hasSelection) {
                    if (onRowClick) {
                      e?.preventDefault();
                      onRowClick(row);
                    }
                  }
                }}
              >
                {row.getVisibleCells().map((cell: any, ceIdx: number) => {
                  return (
                    <td key={ceIdx} style={{ position: 'relative' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {data.length === 0 &&
            (noDataComponent ? (
              <tr>
                <td colSpan={columns.length}>{noDataComponent}</td>
              </tr>
            ) : (
              <Nodata colspan={columns.length} />
            ))}
        </tbody>
      </table>
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
    </div>
  );
};
