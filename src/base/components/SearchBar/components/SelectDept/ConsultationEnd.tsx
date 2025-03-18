import { Typography } from 'antd';

import BaseModal from '@base/components/BaseModal';
import Button from '@base/components/Button/CustomButton';
import { Check, X } from '@base/icons';

interface SelectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: () => void;
}

const SelectModal = (props: SelectModalProps) => {
  const { isOpen = false, onClose, onSave } = props;

  return (
    <BaseModal
      modalTitle={'차량정보조회 '}
      open={isOpen}
      onClose={() => {
        onClose && onClose();
      }}
      width={440}
    >
      <div style={{ width: '100%', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography className="title-md">상담종료로 전환하시겠습니까 ?</Typography>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          paddingBlock: 16,
          borderTop: '1px solid var(--base-stroke-color-base-stroke-20, #E2E5F0)'
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
          아니오
        </Button>
        <Button
          color="primary"
          variant="solid"
          icon={<Check style={{ fontSize: 16 }} />}
          onClick={() => {
            onSave && onSave();
            onClose && onClose();
          }}
        >
          예
        </Button>
      </div>
    </BaseModal>
  );
};

export default SelectModal;
