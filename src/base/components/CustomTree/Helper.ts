import { NodeType } from '.';

export const findNodeByGroupId = (tree: NodeType[], groupId?: number | string, customKey: string = 'groupId'): NodeType | null => {
  if (!Array.isArray(tree) || !groupId) return null;
  for (const node of tree) {
    if (node[customKey] === groupId) {
      return node;
    }
    if (node.children) {
      const foundNode = findNodeByGroupId(node.children, groupId, customKey);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};
export const getFullPathName = (tree: NodeType[], groupId: number | string): string => {
  const findPath = (node: NodeType, currentPath: string[]): string[] | null => {
    currentPath.push(node.name);

    if (node.groupId === groupId) {
      return currentPath;
    }

    if (node.children) {
      for (const child of node.children) {
        const path = findPath(child, [...currentPath]);
        if (path) {
          return path;
        }
      }
    }

    return null;
  };

  for (const node of tree) {
    const path = findPath(node, []);
    if (path) {
      return path.join('_');
    }
  }

  return '';
};
