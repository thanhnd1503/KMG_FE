import React, { forwardRef, ReactNode } from 'react';

import { Input } from 'antd';

interface ItemProps {
  [x: string]: any;
}

type ValueType<T extends Record<string, ItemProps>> = { [K in keyof T]: string };

interface SearchMultiLineProps<T extends Record<string, ItemProps>> {
  value: ValueType<T>;
  onChange: (value: ValueType<T>) => void;
  keys: T;
  style: React.CSSProperties;
  separator?: ReactNode;
  vertical?: boolean;
}

const SearchMultiLine = forwardRef(
  <T extends Record<string, ItemProps>>(
    props: SearchMultiLineProps<T>,
    ref: React.Ref<HTMLDivElement> // Adjust this type based on the element you want the ref to point to
  ) => {
    const { value, onChange, keys, style, separator, vertical = true } = props;
    const handleInputChange = (key: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [key]: e.target.value || '' });
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          ...(!vertical && { alignItems: 'center' }),
          gap: 8,
          width: '100%',
          ...style
        }}
      >
        {Object.keys(keys).map((key, index) => (
          <React.Fragment key={key}>
            <Input
              // placeholder={`${keys[key as keyof T]?.placeholder}`}
              {...keys[key as keyof T]}
              value={value?.[key as keyof T] ?? ''}
              onChange={handleInputChange(key as keyof T)}
            />
            {index < Object.keys(keys)?.length - 1 &&
              (separator ? <div style={{ display: 'flex', alignItems: 'center' }}>{separator}</div> : <></>)}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

export default SearchMultiLine;
