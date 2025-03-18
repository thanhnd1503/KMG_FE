import { useEffect, useRef, useState } from 'react';

import { DatePicker, Typography } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import koKR from 'antd/es/date-picker/locale/ko_KR';

import Button from '@base/components/Button/CustomButton';
import { CalendarMonth, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from '@base/icons';
import './style.css';
const { RangePicker } = DatePicker;

interface RangeDateFilterProps {}

const RangeDateFilter = (props: RangeDateFilterProps) => {
  const {} = props;

  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const handleChange: RangePickerProps['onChange'] = (values) => {
    console.log('handleChange', values);

    setDates(values);
  };

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-date-range-dropdown')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenChange = (status: any) => {
    setOpen(true);
  };

  return (
    <div className="filter-date-range" ref={containerRef}>
      <RangePicker
        placement="topRight"
        locale={koKR}
        value={dates}
        onCalendarChange={handleChange}
        variant={'borderless'}
        suffixIcon={<CalendarMonth style={{ fontSize: 16, color: 'var(--input-fg-enabled, #475069)', cursor: 'pointer' }} />}
        allowClear={false}
        style={{ cursor: 'pointer' }}
        popupStyle={{ padding: 0, borderRadius: 4 }}
        popupClassName="filter-date-range-dropdown"
        open={open}
        onOpenChange={handleOpenChange}
        renderExtraFooter={() => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: -274,
                  height: 28,
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  paddingInline: 8,
                  paddingBlock: 4
                }}
              >
                <Typography style={{ flex: 1, textAlign: 'center' }}>
                  {dates && dates[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : '시작일자'}
                </Typography>
                <Typography>{'->'}</Typography>
                <Typography style={{ flex: 1, textAlign: 'center' }}>
                  {dates && dates[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : '종료일자'}
                </Typography>
              </div>
              <div
                style={{ width: '100%', height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => {
                  setDates([dayjs().startOf('day'), dayjs().endOf('day')]);
                }}
              >
                <Typography className="body-text-sm" style={{ color: 'var(--primary-fg-color-primary-fg-50, #6366F1)' }}>
                오늘
                </Typography>
              </div>
              <div style={{ width: '100%', padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  icon={<X />}
                  style={{ flex: 1 }}
                  onClick={() => {
                    setDates([null, null]);
                    setOpen(false);
                  }}
                >
                  초기화
                </Button>
                <Button size="small" variant="outlined" color="primary" icon={<Check />} style={{ flex: 1 }} onClick={() => setOpen(false)}>
                  적용
                </Button>
              </div>
            </div>
          );
        }}
        superPrevIcon={<ChevronsLeft style={{ fontSize: 18, color: 'var(--base-bg-color-base-bg-30, #CBD1E1)' }} />}
        prevIcon={<ChevronLeft style={{ fontSize: 18, color: 'var(--base-bg-color-base-bg-30, #CBD1E1)' }} />}
        nextIcon={<ChevronRight style={{ fontSize: 18, color: 'var(--base-bg-color-base-bg-30, #CBD1E1)' }} />}
        superNextIcon={<ChevronsRight style={{ fontSize: 18, color: 'var(--base-bg-color-base-bg-30, #CBD1E1)' }} />}
      />
    </div>
  );
};

export default RangeDateFilter;
