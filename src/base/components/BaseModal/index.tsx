import { ReactNode, useMemo } from 'react';

import { Modal, ModalProps, Typography } from 'antd';

import { X } from '@base/icons';

const HeaderModalHeight = 26;
const FooterModalHeight = 32;

type BaseModalProps = {
  modalTitle?: string | JSX.Element;
  open?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  children?: ReactNode;
  width?: string | number;
  modalProps?: ModalProps;
  style?: React.CSSProperties;
};

const BaseModal = (props: BaseModalProps) => {
  const { modalTitle, children, open = false, onClose, onOk, width = 686, modalProps, style } = props;

  const ModalTitleMemo = useMemo(() => {
    if (typeof modalTitle === 'string') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--base-bg-color-base-bg-50, #646E8B)',
            paddingBlock: 12,
            paddingInline: 20
          }}
        >
          <Typography className="title-lg" style={{ color: 'var(--primary-fg-color-primary-fg-0, #FFFFFF)' }}>
            {modalTitle}
          </Typography>
          <X style={{ fontSize: 16, padding: 4, color: 'var(--base-fg-color-base-fg-0, #FFFFFF)' }} onClick={() => onClose && onClose()} />
        </div>
      );
    } else if (typeof modalTitle !== 'undefined') {
      return modalTitle;
    } else {
      return <>&nbsp;</>;
    }
  }, [modalTitle]);

  return (
    <Modal
      open={open}
      centered
      width={width}
      title={ModalTitleMemo}
      footer={null}
      closable={false}
      // style={{ top: 160, ...style }}
      styles={{
        header: {
          marginBottom: 0,
          borderRadius: '8px 8px 0 0'
        },
        body: {},
        content: {
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: 'transparent'
        }
      }}
      {...modalProps}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
