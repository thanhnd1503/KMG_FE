import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Checkbox, Flex, Typography } from 'antd';
import classNames from 'classnames/bind';

import { ChevronRight, Folder, FolderOpen, PurchaseManager } from '@base/icons';

import styles from './CustomTree.module.css';
import { findNodeByGroupId } from './Helper';
const cx = classNames.bind(styles);
export interface NodeType {
  groupId?: number;
  upperId?: number | string;
  children?: Array<NodeType> | null;
  name: string;
  isFolder?: boolean;
  [key: string]: any; // Allow any other properties
}
export interface CustomTreeProps {
  data: Array<NodeType>;
  onExpandNode?: (node: NodeType) => void;
  selectedNodeKey?: number | string;
  onSelectNode?: (node: NodeType) => void;
  checkedNodeKeys?: number | string | number | string[];
  onCheckNode?: (node: NodeType | NodeType[]) => void;
  customKey?: string;
  customUpperKey?: string;
}

export default function CustomTree({
  data,
  onExpandNode,
  selectedNodeKey: controlSelectNodeKey,
  onSelectNode,
  checkedNodeKeys: controlCheckedNodeKeys,
  onCheckNode,
  customKey,
  customUpperKey
}: CustomTreeProps) {
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [checkedNodes, setCheckedNodes] = useState<NodeType[]>([]);
  const [lastExpandNode, setLastExpandNode] = useState<NodeType | null>(null);
  const [resetKey, setResetKey] = useState(0); // Add a state to force re-render
  useEffect(() => {
    const handleReset = () => {
      setCheckedNodes([]);
      setSelectedNode(null);
      setResetKey((prevKey) => prevKey + 1);
    };
    const allNodesChecked = (nodes: Array<NodeType>) => {
      let nCheckedNodes: NodeType[] = checkedNodes.slice();
      for (const node of nodes) {
        if (onCheckNode && nCheckedNodes.includes(node)) {
          selectNodeWithChildren(node, true, nCheckedNodes);
          setCheckedNodes(nCheckedNodes);
          onCheckNode && onCheckNode(nCheckedNodes);
          if (lastExpandNode && getNodeKey(node) === getNodeKey(lastExpandNode)) return;
        }
        if (node.children) {
          allNodesChecked(node.children);
        }
      }
    };
    if (data) {
      if (!!onCheckNode && checkedNodes.length > 0 && lastExpandNode && checkedNodes.includes(lastExpandNode)) allNodesChecked(data);

      if (lastExpandNode) {
        setLastExpandNode(null);
      } else {
        handleReset();
      }
    }
  }, [data]);

  useEffect(() => {
    const controlSelectedNode = findNodeByGroupId(data, controlSelectNodeKey, customKey) || null;
    setSelectedNode(controlSelectedNode);
  }, [controlSelectNodeKey]);

  useEffect(() => {
    const controlCheckedNode = Array.isArray(controlCheckedNodeKeys)
      ? (controlCheckedNodeKeys.map((key) => data.find((item) => getNodeKey(item) === Number(key))).filter(Boolean) as NodeType[])
      : [];

    setCheckedNodes(controlCheckedNode);
  }, [controlCheckedNodeKeys]);

  const getNodeKey = (node: NodeType) => (customKey ? node[customKey] : node.groupId);
  const getNodeUpperKey = (node: NodeType) => (customUpperKey ? node[customUpperKey] : node.upperId);

  const handleToggleOpen = (node: NodeType) => {
    setLastExpandNode(node);
    !node.children && node.isFolder && onExpandNode && onExpandNode(node);
  };

  const handleSelectNode = (node: NodeType) => {
    if (!getNodeKey(node)) return;
    setSelectedNode(node);
    onSelectNode && onSelectNode(node);
  };

  const findNode = (nodes: Array<NodeType>, key: number | string): NodeType | null => {
    for (const node of nodes) {
      if (getNodeKey(node) === key) {
        return node;
      }
      if (node.children) {
        const found = findNode(node.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const selectNodeWithChildren = (node: NodeType, checked: boolean, nCheckedNodes: NodeType[]) => {
    if (checked) {
      nCheckedNodes.push(node);
      node.children?.forEach((child) => selectNodeWithChildren(child, true, nCheckedNodes));
    } else {
      const index = nCheckedNodes.findIndex((checkedNode) => getNodeKey(checkedNode) === getNodeKey(node));
      if (index > -1) {
        nCheckedNodes.splice(index, 1);
      }
      node.children?.forEach((child) => selectNodeWithChildren(child, false, nCheckedNodes));
    }
  };

  const handleCheckNode = (node: NodeType) => {
    console.log(getNodeKey(node));

    if (!getNodeKey(node)) return;

    const isChecked = checkedNodes.find((checked) => getNodeKey(checked) === getNodeKey(node));
    console.log('isChecked', checkedNodes);

    let nCheckedNodes: NodeType[] = checkedNodes.slice();
    const checkParentNode = (node: NodeType) => {
      const parentNode = findNode(data, getNodeUpperKey(node));
      if (parentNode) {
        const siblingNodes = parentNode.children;
        const allSiblingsChecked = siblingNodes?.every((sibling) =>
          nCheckedNodes.some((checked) => getNodeKey(checked) === getNodeKey(sibling))
        );
        if (allSiblingsChecked) {
          nCheckedNodes.push(parentNode);
          checkParentNode(parentNode);
        }
      }
    };

    const parentNodeChecked = checkedNodes.find((checked) => getNodeKey(checked) === getNodeUpperKey(node));
    if (isChecked) {
      selectNodeWithChildren(node, false, nCheckedNodes);
      if (parentNodeChecked) {
        nCheckedNodes = nCheckedNodes.filter((checkedNode) => getNodeKey(checkedNode) !== getNodeKey(parentNodeChecked));
      }
    } else {
      selectNodeWithChildren(node, true, nCheckedNodes);
      if (!parentNodeChecked) {
        checkParentNode(node);
      }
    }
    setCheckedNodes(nCheckedNodes);
    onCheckNode && onCheckNode(nCheckedNodes);
  };

  const renderTreeNodes = (nodes: Array<NodeType>, level = 0) => {
    return (
      Array.isArray(nodes) &&
      nodes.map((node, index) => (
        <TreeNode
          key={`${index}-${resetKey}`} // Add resetKey to key to force re-render
          node={node}
          level={level}
          active={selectedNode ? getNodeKey(selectedNode) === getNodeKey(node) : false}
          checked={(checkedNodes ?? []).findIndex((checked) => getNodeKey(checked) === getNodeKey(node)) > -1}
          onToggle={handleToggleOpen}
          onSelect={handleSelectNode}
          onCheck={handleCheckNode}
          showCheckbox={!!onCheckNode}
        >
          {node.children && renderTreeNodes(node.children, level + 1)}
        </TreeNode>
      ))
    );
  };

  return (
    <Flex gap={4} vertical style={{ maxHeight: '100%' }}>
      {renderTreeNodes(data || [])}
    </Flex>
  );
}

interface TreeNodeProps {
  level: number;
  node: NodeType;
  children?: any;
  active: boolean;
  checked: boolean;
  onToggle: (node: NodeType) => void;
  onSelect: (node: NodeType) => void;
  onCheck: (node: NodeType) => void;
  showCheckbox: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  children,
  active = false,
  checked = false,
  onToggle,
  onSelect,
  onCheck,
  level,
  showCheckbox
}) => {
  const { name, isFolder, isUser } = node;
  const [isOpenChildren, setIsOpenChildren] = useState(false);
  const handleToggleOpen = () => {
    if (isFolder) {
      setIsOpenChildren(!isOpenChildren);
    }
    onToggle(node);
  };

  return (
    <div>
      <Flex align="center" gap={4}>
        <Flex align="center" className={cx('node', { isChild: level !== 0, active })} gap={4} onClick={handleToggleOpen}>
          {!isFolder && <div style={{ width: 16, height: 16 }}></div>}
          {isFolder && <ChevronRight className={cx('chevron', { isOpenChildren })} />}
          {showCheckbox && (
            <Checkbox
              checked={checked}
              onClick={(e) => {
                e.stopPropagation();
                onCheck(node);
              }}
            />
          )}
          <span style={{ fontSize: 16 }} onClick={() => onSelect(node)}>
            {isFolder || isUser === undefined ? isOpenChildren ? <FolderOpen /> : <Folder /> : <PurchaseManager />}
          </span>
          <Typography className={cx('node-label')} onClick={() => onSelect(node)}>
            {name}
          </Typography>
        </Flex>
      </Flex>
      {isOpenChildren && (
        <Flex gap={4} vertical className={cx('node-children')}>
          {children}
        </Flex>
      )}
    </div>
  );
};
