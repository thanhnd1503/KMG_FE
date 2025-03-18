import { Flex, Typography } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';

import { TABLE_LIST_PAGINATION_HEIGHT } from '@base/configs/layoutConfig';
import usePagination from '@base/hooks/usePagination';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@base/icons';

import style from './style.module.css';
import Button from '../Button/CustomButton';

const cx = classNames.bind(style);

export interface ListPaginationProps {
  pageIndex: number; // current page
  pageTotal: number; // total page
  pageSize: number; // rows per page
  pageCount: number; // total rows ?
}

interface Props extends ListPaginationProps {
  gotoPage?: (value: number) => void;
  // setPageSize: (value: number, pageIndex?: number) => void;
  isSmall?: boolean; // isSplitMode
  style?: React.CSSProperties;
  isRowPerPage?: boolean;
  pageType?: 'page' | 'more';
}

const ListPagination = (props: Props) => {
  const { pageCount, pageSize, pageTotal, pageIndex, isSmall: isSmallProp = false, style, gotoPage, pageType } = props;
  const isSmall = isSmallProp;
  const { Text } = Typography;
  const onNextPage = () => {
    gotoPage && gotoPage(pageIndex + 1);
  };
  const onPrevPage = () => {
    gotoPage && gotoPage(pageIndex - 1);
  };

  const paginationRange = usePagination({
    totalCount: pageCount,
    pageSize: pageSize,
    currentPage: pageIndex,
    siblingCount: isSmall ? 0 : 5
  });

  const ButtonsView = () => {
    return (
      <div className={cx('listPagination__buttonContainer')}>
        <Flex gap={4}>
          {paginationRange.map((btn, index) => {
            if (btn === '&nextRight') {
              return (
                <button
                  onClick={() => {
                    onNextPage();
                  }}
                  key={index}
                  className={cx('listPagination__button')}
                >
                  <ChevronRight />
                </button>
              );
            }
            if (btn === '&nextLeft') {
              return (
                <button
                  onClick={() => {
                    onPrevPage();
                  }}
                  key={index}
                  className={cx('listPagination__button')}
                >
                  <ChevronLeft />
                </button>
              );
            }
            if (btn === '&lastRight') {
              if (isSmall) return <></>;
              return (
                <button
                  onClick={() => {
                    gotoPage && gotoPage(pageTotal);
                  }}
                  key={index}
                  className={cx('listPagination__button')}
                >
                  <ChevronsRight />
                </button>
              );
            }
            if (btn === '&lastLeft') {
              if (isSmall) return <></>;
              return (
                <button
                  onClick={() => {
                    gotoPage && gotoPage(1);
                  }}
                  key={index}
                  className={cx('listPagination__button')}
                >
                  <ChevronsLeft />
                </button>
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  gotoPage && gotoPage(parseInt(btn));
                }}
                className={cx('listPagination__button', { listPagination__buttonSelected: parseInt(btn) === pageIndex })}
              >
                {btn}
              </button>
            );
          })}
        </Flex>
      </div>
    );
  };

  return (
    <div
      style={{
        height: TABLE_LIST_PAGINATION_HEIGHT,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        ...style,
        ...(pageType === 'more' && {
          position: 'relative'
        })
      }}
      className={cx('listPagination')}
    >
      {!!pageCount && (
        <div className={cx('listPagination__countWrapper')}>
          <Text className={cx('listPagination__countMark') + ' body-text-lg'}>전체수</Text>
          <span className={cx('listPagination__countNumber')}>{pageCount}</span>
        </div>
      )}
      {pageType === 'page' && <>{!!(!!pageIndex && !!pageTotal && !!pageSize) && <ButtonsView />}</>}
      {pageType === 'more' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            visibility: pageIndex >= pageTotal ? 'hidden' : 'visible'
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            size="middle"
            onClick={() => {
              onNextPage();
            }}
          >
            더 가져오기
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListPagination;
