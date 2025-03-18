import { useEffect, useRef, useState } from 'react';

import { Popover, Typography } from 'antd';
import { TooltipRef } from 'antd/es/tooltip';
import _ from 'lodash';

import { Check, DotsVertical, SortAscending, SortDescending } from '@base/icons';
import { SortEnum } from '@base/types';

import CustomSelect from '../CustomSelect/CustomSelect';

export interface KebapSortItem {
  key: string;
  label: string;
  sort: SortEnum.ASC | SortEnum.DESC | boolean;
}

interface Props {
  sortItems: KebapSortItem[];
  onChangeSort: (val: KebapSortItem[]) => void;
  pageSetting: { pageSize: number; pageType: 'page' | 'more' };
  setPageSetting: (val: { pageSize: number; pageType: 'page' | 'more' }, type: 'pageSize' | 'pageType') => void;
}

const configPageSizeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 80, 100];

const ListSettingKebap = (props: Props) => {
  const { sortItems = [], onChangeSort, pageSetting, setPageSetting } = props;

  const [sortState, setSortState] = useState<KebapSortItem[]>([]);

  useEffect(() => {
    if (sortItems && !_.isEqual(sortItems, sortState)) {
      setSortState(sortItems);
    }
  }, [sortItems]);

  const handleChangeSort = (key: string, sort: SortEnum.ASC | SortEnum.DESC | false) => {
    const nSort = sortState.map((sortItem, index) => {
      return sortItem.key === key ? { ...sortItem, sort: sort } : { ...sortItem, sort: false };
    });
    setSortState(nSort);
    onChangeSort(nSort);
  };

  const Content = (
    <div style={{ width: 180, display: 'flex', flexDirection: 'column' }}>
      {/* Sort */}
      {sortState.length > 0 && sortState?.[0]?.label !== '' && (
        <>
          <div style={{ width: '100%', paddingInline: 8, paddingBlock: 4, backgroundColor: 'var(--base-bg-color-base-bg-10, #F1F3F9)' }}>
            <Typography className="title-xs">정렬</Typography>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 4 }}>
            {sortState.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    paddingInline: 8,
                    paddingBlock: 4,
                    gap: 4,
                    cursor: 'pointer'
                  }}
                  // onClick={() => handleChangeSort(item.key, SortEnum.ASC)}
                  onClick={() =>
                    handleChangeSort(
                      item.key,
                      item.sort === SortEnum.ASC ? SortEnum.DESC : item.sort === SortEnum.DESC ? false : SortEnum.ASC
                    )
                  }
                >
                  <div style={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.sort && <Check style={{ fontSize: 12, color: 'var(--primary-fg-color-primary-fg-50, #6366F1)' }} />}
                  </div>
                  <Typography
                    style={{
                      flex: 1,
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: 12,
                      fontWeight: 500,
                      textAlign: 'left',
                      userSelect: 'none'
                    }}
                    className="button-xs"
                    onClick={() =>
                      handleChangeSort(
                        item.key,
                        item.sort === SortEnum.ASC ? SortEnum.DESC : item.sort === SortEnum.DESC ? false : SortEnum.ASC
                      )
                    }
                  >
                    {item.label}
                  </Typography>
                  <div style={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.sort && item.sort === SortEnum.ASC ? (
                      <SortAscending
                        style={{ fontSize: 12, color: 'var(--base-fg-color-base-fg-70, #333C55)' }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handleChangeSort(item.key, SortEnum.DESC);
                        // }}
                      />
                    ) : item.sort === SortEnum.DESC ? (
                      <SortDescending
                        style={{ fontSize: 12, color: 'var(--base-fg-color-base-fg-70, #333C55)' }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handleChangeSort(item.key, false);
                        // }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Setting */}

      <div style={{ width: '100%', paddingInline: 8, paddingBlock: 4, backgroundColor: 'var(--base-bg-color-base-bg-10, #F1F3F9)' }}>
        <Typography className="title-xs">설정</Typography>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingBlock: 4 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, paddingInline: 8, paddingBlock: 4 }}>
          <Typography className="button-xs">목록개수</Typography>
          <CustomSelect
            options={configPageSizeOptions.map((item) => ({ label: item, value: item }))}
            value={pageSetting.pageSize}
            onChange={(val) => setPageSetting({ ...pageSetting, pageSize: Number(val) }, 'pageSize')}
          />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, paddingInline: 8, paddingBlock: 4 }}>
          <Typography className="button-xs">목록유형</Typography>
          <CustomSelect
            options={[
              {
                label: '페이지',
                value: 'page'
              },
              {
                label: '더보기',
                value: 'more'
              }
            ]}
            value={pageSetting.pageType}
            onChange={(val) => setPageSetting({ ...pageSetting, pageType: val }, 'pageType')}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={Content}
      trigger="click"
      arrow={false}
      styles={{
        body: { padding: 0 },
        root: { borderRadius: 4, overflow: 'hidden', border: '1px solid var(--base-stroke-color-base-stroke-30, #CBD1E1)' }
      }}
      // overlayStyle={{ borderRadius: 4, overflow: 'hidden', border: '1px solid var(--base-stroke-color-base-stroke-30, #CBD1E1)' }}
      // overlayInnerStyle={{ padding: 0 }}
      getPopupContainer={(triggerNode) => {
        if (triggerNode?.parentNode instanceof HTMLElement) {
          return triggerNode.parentNode;
        }
        throw new Error('Parent node is not an HTMLElement');
      }}
    >
      <DotsVertical style={{ fontSize: 24, color: 'var(--base-fg-color-base-fg-70, #333C55)', cursor: 'pointer' }} />
    </Popover>
  );
};

export default ListSettingKebap;
