import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Input, Typography } from 'antd';
import _ from 'lodash';

import ModelSelector from '@base/components/ModelSelector';
import PersonAssignment from '@base/components/PersonAssignment';
import { X } from '@base/icons';

import SelectModal from './ConsultationEnd';

interface SelectDeptProps {
  value?: any;
  onChange?: (val: any) => void;
  type?: 'personAssignment' | 'vehicleInfo';
}

const SelectDept = forwardRef((props: SelectDeptProps, ref) => {
  const { value, onChange, type } = props;

  const [selectItems, setSelectItems] = useState<{ [key: string]: { id: number; name: string } }>(value ?? {});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  useEffect(() => {
    if (value && !_.isEqual(value, selectItems)) {
      setSelectItems(value);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    onInitClick: () => {
      setIsOpenModal(true);
    }
  }));

  const handleRemoveItem = (id: number) => {
    const nItems = { ...selectItems };
    delete nItems[id];
    setSelectItems(nItems);
    onChange && onChange(nItems);
  };

  const handleSubmitItemsSearch = (node: any) => {
    const nItems = {
      ...selectItems,
      [type === 'vehicleInfo' ? node?.groupId : node?.id]: {
        name: node.name,
        id: type === 'vehicleInfo' ? node?.groupId : node?.id
      }
    };
    setSelectItems(nItems);
    setIsOpenModal(false);
    onChange && onChange(nItems);
  };
  return (
    <React.Fragment>
      {Object.keys(selectItems).length === 0 ? (
        <Input readOnly onClick={() => setIsOpenModal(true)} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            gap: 8,
            paddingInline: 16,
            paddingBlock: 8,
            backgroundColor: 'var(--base-bg-color-base-bg-0, #FFFFFF)'
          }}
        >
          {Object.values(selectItems)?.map((item, index) => {
            return (
              <div
                key={index}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <Typography className="body-data-val">{item?.name}</Typography>
                <X style={{ fontSize: 16, padding: 4, cursor: 'pointer' }} onClick={() => handleRemoveItem(item.id)} />
              </div>
            );
          })}
        </div>
      )}
      {isOpenModal &&
        (type === 'personAssignment' ? (
          <PersonAssignment isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} onSelect={handleSubmitItemsSearch} />
        ) : type === 'vehicleInfo' ? (
          <ModelSelector isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} onSubmit={handleSubmitItemsSearch} />
        ) : null)}
    </React.Fragment>
  );
});

export default SelectDept;
