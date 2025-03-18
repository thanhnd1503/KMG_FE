import { ReactNode, useEffect, useState } from 'react';

import { Input, Popover, Typography } from 'antd';
import _ from 'lodash';

import Button from '@base/components/Button/CustomButton';
import { CalendarMonth, List, Search, Check, X } from '@base/icons';

import RangeDateFilter from './RangeDateFilter';

export interface FilterListItem {
  key: string;
  label: string | ReactNode;
}

interface Props {
  filterType?: 'list' | 'search' | 'date';
  filterList?: FilterListItem[];
  onChangeFilter?: (val: any) => void;
  isFiltering?: boolean;
  multipleSelect?: boolean;
  filterVal?: any;
  columnTitle?: string | ReactNode;
}

interface Props {}

const FilterModal = (props: Props) => {
  const { filterList = [], onChangeFilter, filterType, isFiltering = false, multipleSelect = true, filterVal, columnTitle } = props;

  const initFilterValue = filterType === 'list' ? [] : filterType === 'search' ? '' : undefined;
  const [filterValue, setFilterValue] = useState<any>(initFilterValue);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (filterType !== 'list') {
      setFilterValue(filterType === 'search' ? (filterVal ? filterVal : '') : filterValue);
    } else {
      if (!filterVal || _.isEmpty(filterVal)) {
        setFilterValue([]);
      }
    }
  }, [filterVal, filterType]);

  const handleChangeFilter = () => {
    onChangeFilter && onChangeFilter(filterType === 'list' ? (!_.isEmpty(filterValue) ? filterValue : undefined) : filterValue);
    setOpen(false);
  };

  const handleFilterList = (item: FilterListItem | null) => {
    if (!item) {
      setFilterValue([]);
    } else {
      setFilterValue(
        multipleSelect
          ? (prev: FilterListItem[]) => {
              let nFilterVal = prev;
              if (prev?.find((ele: any) => ele?.key === item?.key)) {
                return nFilterVal.filter((ele) => ele.key !== item?.key);
              } else {
                return [...nFilterVal, item];
              }
            }
          : [item]
      );
    }
  };

  const Content = (
    <div style={{ width: 180, display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', paddingInline: 8, paddingBlock: 4, backgroundColor: 'var(--base-bg-color-base-bg-10, #F1F3F9)' }}>
        <Typography className="title-xs">{filterType === 'list' ? 'Options' : '검색'}</Typography>
      </div>

      {filterType === 'list' ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              paddingInline: 8,
              paddingBlock: 4,
              gap: 4,
              cursor: 'pointer'
            }}
            onClick={() => handleFilterList(null)}
          >
            <div style={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!filterValue ||
                (filterValue?.length === 0 && <Check style={{ fontSize: 12, color: 'var(--primary-fg-color-primary-fg-50, #6366F1)' }} />)}
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
            >
              {'전체보기'}
            </Typography>
          </div>
          {filterList.map((item, index) => {
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
                onClick={() => handleFilterList(item)}
              >
                <div style={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {_.isArray(filterValue) && filterValue?.find((ele: any) => ele?.key === item.key) && (
                    <Check style={{ fontSize: 12, color: 'var(--primary-fg-color-primary-fg-50, #6366F1)' }} />
                  )}
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
                >
                  {item.label}
                </Typography>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', width: '100%', gap: 4 }}>
          <Typography className="button-xs">{columnTitle}</Typography>
          <Input size="small" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
        </div>
      )}

      <div style={{ width: '100%', padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          icon={<X />}
          style={{ flex: 1 }}
          onClick={() => {
            setFilterValue(initFilterValue);
            setOpen(false);
            onChangeFilter && onChangeFilter(undefined);
          }}
        >
          초기화
        </Button>
        <Button size="small" variant="outlined" color="primary" icon={<Check />} style={{ flex: 1 }} onClick={() => handleChangeFilter()}>
          적용
        </Button>
      </div>
    </div>
  );

  const Icon = filterType === 'date' ? CalendarMonth : filterType === 'list' ? List : Search;

  return filterType === 'date' ? (
    <RangeDateFilter />
  ) : (
    <Popover
      placement="bottomRight"
      content={Content}
      trigger="click"
      open={open}
      onOpenChange={(val) => setOpen(val)}
      destroyTooltipOnHide
      arrow={false}
      // overlayStyle={{
      //   borderRadius: 4,
      //   overflow: 'hidden',
      //   border: '1px solid var(--base-stroke-color-base-stroke-30, #CBD1E1)'
      // }}
      // overlayInnerStyle={{ padding: 0 }}
      styles={{
        body: { padding: 0 },
        root: { borderRadius: 4, overflow: 'hidden', border: '1px solid var(--base-stroke-color-base-stroke-30, #CBD1E1)' }
      }}
    >
      {Icon && (
        <Icon
          style={{
            fontSize: 16,
            color: 'var(--list-fg-label, #646E8B)',
            padding: 4,
            cursor: 'pointer',
            ...(isFiltering && {
              color: 'var(--button-secondary-fg-selected, #6366F1)'
            })
          }}
        />
      )}
    </Popover>
  );
};
export default FilterModal;
