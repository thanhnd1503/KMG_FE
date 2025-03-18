import { Checkbox } from 'antd';

import ListTable, { LIST_TABLE_PAGINATION_HEIGHT } from '@base/components/ListTable';
import { makeTable8Columns } from '@base/components/Table/ReactTable/Helper';
import { LIST_TOOLBAR_HEIGHT } from '@base/configs/layoutConfig';
import { useTabs } from '@base/hooks/useTabs';
import { MENU_DEMO_URL } from '@demo/constants/menu';

import { getMapColumns } from './Helper';

type Props = {
  data: any;
  checkedIds: string[];
  paging: any;
  configFields: any;
  onChecked: (checkedIds: string[]) => void;
  onPagingChange?: (paging: { page: number; size: number }) => void;
  onChangeSort: (sort: any) => void;
  onChangeFilter: (filter: any) => void;
  subMenu?: string;
};

const Body = (props: Props) => {
  const { data = [], paging, configFields: fields, onPagingChange, checkedIds, onChecked, onChangeSort, onChangeFilter, subMenu } = props;

  const { directTo } = useTabs();

  const handlePagingChange = (page: number, size: number) => {
    const newPaging = { page, size };
    onPagingChange && onPagingChange(newPaging);
  };

  let tableColumns = [
    {
      id: 'select',
      width: '45px',
      header: ({ table }: any) => (
        <Checkbox
          {...{
            color: 'primary',
            checked: table.getIsAllRowsSelected(),

            onChange: table.getToggleAllRowsSelectedHandler()
          }}
          style={{ padding: 0 }}
          className="list-check-box"
        />
      ),
      cell: ({ row }: any) => (
        <div className="pd-x-1">
          <Checkbox
            {...{
              color: 'primary',
              checked: row.getIsSelected(),

              onChange: row.getToggleSelectedHandler()
            }}
            style={{ padding: 0 }}
          />
        </div>
      )
    },
    ...makeTable8Columns(fields, getMapColumns(), { subMenu }, [])
  ];

  const handleOnRowClick = (row: any) => {
    directTo(`/${MENU_DEMO_URL}/all/view/${row['id']}`);
  };

  const minusHeight = LIST_TOOLBAR_HEIGHT + 32 + 16;
  // 32: toolbar padding, 16: list margin bottom, should modify base on menu, some menu has Top Button like product

  return (
    <div style={{ height: `calc(100% - ${minusHeight}px )` }}>
      <div style={{ width: '100%', flex: 1, minHeight: 0, height: '100%', overflow: 'hidden' }}>
        <ListTable
          rows={data || []}
          pagingProps={paging}
          columns={tableColumns}
          isSmall={false}
          pagingStyle={{
            height: LIST_TABLE_PAGINATION_HEIGHT,
            justifyContent: 'center'
          }}
          checkedIds={checkedIds}
          onRowChecked={onChecked}
          onRowClick={handleOnRowClick}
        />
      </div>
    </div>
  );
};

export default Body;
