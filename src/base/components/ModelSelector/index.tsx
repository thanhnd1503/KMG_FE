import { useEffect, useState } from 'react';

import { Form, Input } from 'antd';

import BaseModal from '@base/components/BaseModal';
import Button from '@base/components/Button/CustomButton';
import CustomTree, { NodeType } from '@base/components/CustomTree';
import useDebounce from '@base/hooks/useDebounce';
import { Check, Search, X } from '@base/icons';

import { useGetProductGroupTree } from '../../hooks/group/useGetProductGroupTree';
import { getFullPathName } from '../CustomTree/Helper';

interface ModelSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (selectedNode: any) => void;
}

const ModelSelector = (props: ModelSelectorProps) => {
  const { isOpen = false, onClose, onSubmit } = props;

  const [searchText, setSearchText] = useState('');
  const debounceSearch = useDebounce(searchText);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const { treeData, getNodesByUpperId } = useGetProductGroupTree();

  useEffect(() => {
    if (isOpen && treeData?.length === 0) {
      getNodesByUpperId();
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      getNodesByUpperId(0, debounceSearch);
      setSelectedNode(null);
    }
  }, [debounceSearch]);
  const handleSubmit = () => {
    if (selectedNode?.groupId) {
      const formattedNode = { ...selectedNode, name: getFullPathName(treeData, selectedNode.groupId) };
      onSubmit && onSubmit(formattedNode);
    }
  };
  return (
    <BaseModal
      modalTitle={'차종'}
      open={isOpen}
      onClose={() => {
        onClose && onClose();
      }}
      width={720}
      style={{ top: 140 }}
    >
      <div style={{ padding: 20 }}>
        <Form.Item>
          <Input
            value={searchText}
            className={'body-text-lg'}
            style={{ borderRadius: 4, padding: '8px 12px' }}
            size="large"
            placeholder="Search..."
            suffix={<Search style={{ fontSize: 20 }} />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Form.Item>
        <div
          style={{
            padding: 'var(--spacing-sm, 12px) var(--spacing-md, 16px)',
            borderRadius: 'var(--button-radius-square, 4px)',
            border: '1px solid var(--base-stroke-color-base-stroke-20, #E2E5F0)',
            marginTop: 20,
            maxHeight: 500
          }}
          className="scroll-box"
        >
          <CustomTree
            key={searchText}
            data={treeData}
            onExpandNode={(node) => getNodesByUpperId(node.groupId)}
            onSelectNode={setSelectedNode}
          />
        </div>
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
        <Button color="secondary" variant="outlined" icon={<X style={{ fontSize: 16 }} />} onClick={() => onClose && onClose()}>
          닫기
        </Button>
        <Button disabled={!selectedNode} onClick={handleSubmit} color="primary" variant="solid" icon={<Check style={{ fontSize: 16 }} />}>
          저장
        </Button>
      </div>
    </BaseModal>
  );
};

export default ModelSelector;
