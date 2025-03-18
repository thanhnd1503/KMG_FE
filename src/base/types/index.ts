import { CSSProperties, ReactNode } from 'react';

export type ActionProps = {
  key: string;
  element: JSX.Element;
};
// List trip table
export type ListTripProps = {
  column: Record<string, any>;
  data: any[];
  renderItem: (item: any, index: number) => JSX.Element;
  title?: string;
  subTitle?: string;
  subTitlePosition?: 'left' | 'right';
  headerLeftAction?: ActionProps[]; // button in header or any ui
  headerRightAction?: ActionProps[]; // button in header or any ui
  footerAction?: ActionProps[]; // button in footer or any ui
  footerPosition?: 'mid' | 'left' | 'right';
  checkBox?: boolean;
  isHaveMoreMenu?: boolean;
  onCheckedRow?: (checkList: any) => void;
  pagination?: PaginationType;
  onChangePageSize?: (pageSize: number) => void;
  isLoading?: boolean;
  sortColumns?: string[];
  onChangeSort?: (sort: SortType) => void;
  detailSection?: ReactNode;
  activeRowID?: string | number;
  wrapperStyle?: CSSProperties;
};
export type PaginationType = {
  currentPage: number;
  totalPage: number;
  totalCount: number;
  onGoPreviousPage: (page: number) => void;
  onGoNextPage: (page: number) => void;
  onGoInputPage: (page: number) => void;
};

export enum SortEnum {
  ASC = 'asc',
  DESC = 'desc'
}

export type SortType = {
  sort?: string | null;
  order?: SortEnum.ASC | SortEnum.DESC | null;
};

export enum YesNoType {
  YES = 'Y',
  NO = 'N'
}

export enum BinType {
  TRUE = 1,
  FALSE = 0
}

//End List trip table
