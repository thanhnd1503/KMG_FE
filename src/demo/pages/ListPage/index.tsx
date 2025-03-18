import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ListPaginationProps } from '@base/components/ListPagination';
import { KebapSortItem } from '@base/components/ListSettingKebap';
import SearchBar from '@base/components/SearchBar';
import { LIST_TABLE_PAGE_SIZE } from '@base/configs';
import { SortEnum } from '@base/types';
import { useDemoList } from '@demo/hooks/useGetDemoList';

import Body from './Body';
import * as keyNames from './keyNames';
import Toolbar from './Toolbar';

const configSort: KebapSortItem[] = [
  {
    key: 'all',
    label: '전체',
    sort: false
  },
  {
    key: 'updatedCustomers',
    label: '업데이트된 고객',
    sort: false
  },
  {
    key: 'customerNoRepresentative',
    label: '담당자 없는 고객',
    sort: false
  },
  {
    key: 'customerNotEnterProduct',
    label: '상품 입력 안된 고객',
    sort: false
  }
];

const ListPage = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const [paging, setPaging] = useState({ page: 1, pageSize: LIST_TABLE_PAGE_SIZE });
  const [sort, setSort] = useState<KebapSortItem[]>(configSort);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageType, setPageType] = useState<'page' | 'more'>('page');

  const { subMenu } = useParams();

  const params = {
    page: paging.page,
    pageSize: paging.pageSize,
    // search_text: '',
    state: subMenu,
    orderBy: 'id',
    orderDirection: SortEnum.ASC
  };

  const { data, isFetching } = useDemoList(params);

  const configFields = useMemo(() => {
    let newFields = [
      {
        header: '차량 번호',
        keyName: keyNames.KEY_NAME_DEMO_LIST_CAR_NUMBER,
        enableSorting: false,
        width: '120px'
      },
      {
        header: '제조사명',
        keyName: keyNames.KEY_NAME_DEMO_LIST_COMPANY_NAME,
        enableSorting: false,
        enableColumnFilter: true,
        width: '120px'
      },
      {
        header: '대표모델명',
        keyName: keyNames.KEY_NAME_DEMO_LIST_REPRESENT_MODEL,
        enableSorting: false,
        width: '90px'
      },
      {
        header: '대표등급명',
        keyName: keyNames.KEY_NAME_DEMO_LIST_REPRESENT_RATE,
        enableSorting: false,
        enableColumnFilter: true,
        width: '120px'
      },
      {
        header: '차량 색상(외부)',
        keyName: keyNames.KEY_NAME_DEMO_LIST_CAR_COLOR,
        enableSorting: false,
        width: '125px'
      },
      {
        header: '차대번호',
        keyName: keyNames.KEY_NAME_DEMO_LIST_CAR_IDENTIFICATE_NUMBER,
        enableSorting: false,
        enableColumnFilter: true,
        width: 'auto'
      },
      {
        header: '계약번호',
        keyName: keyNames.KEY_NAME_DEMO_LIST_CURRENT_CONTRACT_ID,
        enableSorting: false,
        enableColumnFilter: true,
        width: '120px'
      },
      {
        header: '계약자',
        keyName: keyNames.KEY_NAME_DEMO_LIST_CURRENT_CONTRACT_CUST_NAME,
        enableSorting: false,
        enableColumnFilter: true,
        width: '120px'
      },
      {
        header: '차량 등록일',
        keyName: keyNames.KEY_NAME_DEMO_LIST_CAR_REGIST_DATE,
        enableSorting: false,
        enableColumnFilter: true,
        width: '120px'
      },
      {
        header: '상세보기',
        keyName: keyNames.KEY_NAME_DEMO_LIST_ACTION,
        enableSorting: false,
        enableColumnFilter: true,
        width: '120px'
      }
    ];

    return newFields;
  }, []);

  const pagingData: ListPaginationProps = useMemo(
    () => ({
      pageTotal: data?.attrs?.totalPages || 1, // page quantity
      pageCount: Number(data?.attrs?.totalCount) || 0, // total item quantity
      pageSize: paging.pageSize || LIST_TABLE_PAGE_SIZE,
      pageIndex: data?.attrs?.currentPage || paging.page || 1
    }),
    [paging.pageSize, paging.page, data]
  );

  const handleOnChecked = (checkedIds: string[]) => {
    setSelectedIds(checkedIds);
  };

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'row', position: 'relative' }}>
      <SearchBar
        isShow={showSearch}
        config={[]}
        onSearch={(data: Record<string, string>) => {
          console.log(data);
        }}
        setShow={(value: boolean) => {
          setShowSearch(value);
        }}
      />
      <div
        style={{
          height: '100%',
          overflowY: 'hidden',
          width: '100%',
          marginLeft: showSearch ? 260 : 0,
          transition: 'all 0.2s ease',
          paddingLeft: 16,
          paddingRight: 16
        }}
      >
        <Toolbar
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          sort={sort}
          setSort={setSort}
          pageSize={paging.pageSize}
          pageType={pageType}
          setPageSize={(val) => setPaging((prev) => ({ ...prev, pageSize: val }))}
          setPageType={(val) => setPageType(val)}
        />
        <Body
          data={data?.data}
          paging={pagingData}
          configFields={configFields}
          onPagingChange={(paging: { page: number; size: number }) => {}}
          checkedIds={selectedIds}
          onChecked={handleOnChecked}
          onChangeSort={(sort) => {}}
          onChangeFilter={(filter) => {}}
          subMenu={subMenu}
        />
      </div>
    </div>
  );
};

export default ListPage;
