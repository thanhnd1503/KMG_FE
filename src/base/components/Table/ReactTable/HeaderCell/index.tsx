import { ReactNode } from 'react';

import { Flex } from 'antd';

import OverflowTooltip from '@base/components/OverflowTooltip';

import FilterModal, { FilterListItem } from './FilterModal';

interface HeaderCellProps {
  filterType?: 'list' | 'search' | 'date';
  onFilterChange?: (val: any) => void;
  // isFiltering?: boolean;
  filterList?: FilterListItem[];
  multipleSelect?: boolean;
  title: string | ReactNode;
  style?: React.CSSProperties;
  filterVal?: any;
}

const HeaderCell = (props: HeaderCellProps) => {
  const { filterType, onFilterChange, title, style, filterList, multipleSelect, filterVal } = props;

  const isFiltering = !!filterVal;

  return (
    <Flex
      align="center"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: style?.justifyContent ? style?.justifyContent : 'flex-start',
        ...style
      }}
    >
      {typeof title === 'string' ? (
        <OverflowTooltip
          contentClassName="title-xs"
          style={{
            ...(isFiltering && {
              color: 'var(--button-secondary-fg-selected, #6366F1)'
            })
          }}
        >
          {title}
        </OverflowTooltip>
      ) : (
        title
      )}
      {filterType && (
        <FilterModal
          filterType={filterType}
          filterList={filterList}
          columnTitle={title}
          multipleSelect={multipleSelect}
          onChangeFilter={onFilterChange}
          isFiltering={isFiltering}
          filterVal={filterVal}
        />
      )}
    </Flex>
  );
};

export default HeaderCell;
