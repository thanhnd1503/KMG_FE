import { useEffect, useMemo, useRef, useState } from 'react';

import { Alert, Checkbox, Flex, Input, Typography } from 'antd';

import BaseModal from '@base/components/BaseModal';
import Button from '@base/components/Button/CustomButton';
import { ListPaginationProps } from '@base/components/ListPagination';
import ListSettingKebap, { KebapSortItem } from '@base/components/ListSettingKebap';
import ListTable from '@base/components/ListTable';
import { makeTable8Columns } from '@base/components/Table/ReactTable/Helper';
import { LIST_TABLE_PAGE_SIZE } from '@base/configs';
import { Check, Search, X } from '@base/icons';
import { useGetCustomerList } from '@customer/hooks/useGetCustomerList';

import { configFields, getMapColumns } from './Helper';
import CustomTree from '../CustomTree';
import { useGetModelTree } from '../RegisChargePerson/useGetModelTree';
import { useGetUsers } from '@customer/hooks/useGetUsers';

interface PersonAssignmentProps {
  isOpen?: boolean;
  onClose?: (id?: number) => void;
  onSelect?: (row?: any) => void;
  branchesOnly?: boolean;
}

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

const PersonAssignment = (props: PersonAssignmentProps) => {
  const { isOpen = false, onClose, onSelect, branchesOnly = false } = props;

  const [paging, setPaging] = useState({ page: 1, pageSize: 5 });
  const [sort, setSort] = useState<KebapSortItem[]>(configSort);
  const [pageType, setPageType] = useState<'page' | 'more'>('page');
  const { treeData, getNodesByUpperId } = useGetModelTree();
  const [textSearch, setTextSearch] = useState<string | undefined>(undefined);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const params = {
    page: paging.page,
    pageSize: paging.pageSize,
    // stage: 'general',
    orderBy: 'id',
    orderDirection: 'desc',
    search: textSearch,
    groupId: selectedNode?.id
  };
  // const { data } = useGetCustomerList(params, { enabled: isOpen });
  const { data } = useGetUsers(params, { enabled: isOpen });

  // TABLE
  const handleAssignSubmit = (row: any) => {
    // handle api assign ....
    onSelect && onSelect(row);
    onClose && onClose(row?.no);
  };

  const handleSubmit = () => {
    if (selectedNode) {
      onSelect && onSelect(selectedNode);
    }
  };

  let tableColumns = [
    {
      id: 'select',
      width: '72px',
      cell: ({ row }: any) => (
        <div className="pd-x-1" style={{ paddingLeft: 8 }}>
          <Button size="small" color="secondary" variant="outlined" onClick={() => handleAssignSubmit(row.original)}>
            선택
          </Button>
        </div>
      )
    },
    ...makeTable8Columns(configFields, getMapColumns(), {}, [])
  ];
  const pagingData: ListPaginationProps = useMemo(
    () => ({
      pageTotal: data?.attrs?.totalPages || 1, // page funcNumberQty
      pageCount: data?.attrs?.totalCount || 0, // total item funcNumberQty
      pageSize: paging.pageSize || LIST_TABLE_PAGE_SIZE,
      pageIndex: paging.page || 1
    }),
    [paging.pageSize, paging.page, data]
  );

  const handlePagingChange = (page: number, size: number) => {
    const newPaging = { page, pageSize: size };
    setPaging(newPaging);
  };

  const handleChangePageSetting = (pageSetting: { pageSize: number; pageType: 'page' | 'more' }, type: 'pageSize' | 'pageType') => {
    if (type === 'pageSize') {
      setPaging((prev) => ({ ...prev, pageSize: pageSetting.pageSize }));
    } else if (type === 'pageType') {
      setPageType(pageSetting.pageType);
    }
  };

  const handleSearch = (text: string) => {
    setTextSearch(text);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerHeight, setContainerHeight] = useState(0);

  const TOOLBAR_HEIGHT = 28;

  useEffect(() => {
    if (data) {
      const tableMinHeight = 44 + (data?.data?.length > 10 ? 10 : data?.data?.length) * 36 + 44;
      setContainerHeight(tableMinHeight + TOOLBAR_HEIGHT);
    }
  }, [data]);

  useEffect(() => {
    getNodesByUpperId();
  }, []);
  return (
    <BaseModal
      modalTitle={branchesOnly ? '지점 설정' : '담당자지정'}
      open={isOpen}
      onClose={() => {
        onClose && onClose();
      }}
      width={720}
      modalProps={{
        destroyOnClose: true
      }}
    >
      <div
        style={{
          width: '100%',
          padding: 20,
          maxHeight: 'calc(100vh - 160px)',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflow: 'hidden'
        }}
        ref={containerRef}
        className="scroll-box"
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography className="title-sm">{branchesOnly ? '지점명' : '담당자 그룹'}</Typography>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Input
              style={{
                width: 180
              }}
              onPressEnter={(e) => {
                handleSearch((e.target as HTMLInputElement).value);
              }}
              suffix={<Search style={{ fontSize: 16 }} />}
              size="small"
            />
            {/* 담당자 그룹 dont need that button */}
            {/* {!branchesOnly && (
              <ListSettingKebap
                sortItems={sort}
                onChangeSort={setSort}
                pageSetting={{ pageSize: paging.pageSize, pageType }}
                setPageSetting={handleChangePageSetting}
              />
            )} */}
          </div>
        </div>
        <Flex vertical gap={24}>
          <div
            style={{
              padding: 'var(--spacing-sm, 12px) var(--spacing-md, 16px)',
              borderRadius: 'var(--button-radius-square, 4px)',
              border: '1px solid var(--base-stroke-color-base-stroke-20, #E2E5F0)',
              height: '100%',
              maxHeight: '240px',
              overflowY: 'auto'
            }}
          >
            <CustomTree
              // selectedNodeKey={selectedNode?.id}
              data={treeData}
              customKey="id"
              // customUpperKey="parentGroupId"
              onExpandNode={(node) => {
                getNodesByUpperId(node.id);
              }}
              // onSelectNode={branchesOnly ? setSelectedNode : undefined}
              onSelectNode={(node) => {
                setSelectedNode(node);
              }}
            />
          </div>

          {!branchesOnly && (
            <div
              style={{
                minHeight: 44 + (data?.data?.length > 5 ? 5 : data?.data?.length) * 36 + 44,
                height: containerHeight - TOOLBAR_HEIGHT,
                transition: 'all ease 0.3s'
              }}
            >
              <div style={{ width: '100%', flex: 1, minHeight: 0, height: '100%', overflow: 'hidden' }}>
                <ListTable
                  rows={data?.data || []}
                  columns={tableColumns}
                  isSmall={false}
                  sxTableContainer={{
                    minWidth: 'auto'
                  }}
                  pagingProps={pagingData}
                  onPageChange={handlePagingChange}
                />
              </div>
            </div>
          )}
        </Flex>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          paddingBlock: 16
        }}
      >
        <Button
          color="secondary"
          variant="outlined"
          icon={<X style={{ fontSize: 16 }} />}
          onClick={() => {
            onClose && onClose();
          }}
        >
          닫기
        </Button>
        {branchesOnly && (
          <Button disabled={!selectedNode} onClick={handleSubmit} color="primary" variant="solid" icon={<Check style={{ fontSize: 16 }} />}>
            저장
          </Button>
        )}
      </div>
    </BaseModal>
  );
};

export default PersonAssignment;
