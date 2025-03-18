import { useState } from 'react';

import useMutationGet from '@base/hooks/useMutationGet';

import { findNodeByGroupId } from '../../components/CustomTree/Helper';

export type ProductGroup = {
  groupId: number;
  upperId: number;
  name: string;
  desc: string;
  isDel: number;
  isFolder: boolean;
  regUserNo: number;
  children?: ProductGroup[];
};

export const useGetProductGroupTree = () => {
  const [treeData, setTreeData] = useState<ProductGroup[]>([]);
  const mGet = useMutationGet<any>({
    queryKey: ['model_tree'],
    endPoint: 'product-group/list'
  });
  const getNodesByUpperId = async (upperId?: number, name?: string) => {
    const res = await mGet.mutateAsync({ upperId, name });
    if (res?.success) {
      if (upperId) {
        const newTreeData = [...treeData];
        const upperNode = findNodeByGroupId(newTreeData, upperId);
        if (upperNode) {
          upperNode.children = res.data;
          setTreeData(newTreeData);
        }
      } else {
        setTreeData(res.data);
      }
    }
  };
  return { treeData, getNodesByUpperId };
};
