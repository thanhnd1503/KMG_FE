export interface SearchItemConfig {
  key: string;
  label: string;
  Component: any;
  componentProps?: any;
  onLabelExtraClick?: () => void;
}
