import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

// import {
//   MENU_ADMIN_BASIC_SETTING_KEY,
//   MENU_ADMIN_INFO_CHANGE_HISTORY_SETTING_KEY,
//   MENU_ADMIN_LOG_HISTORY_SETTING_KEY,
//   MENU_ADMIN_SECURITY_MANAGEMENT_SETTING_KEY,
//   MENU_ADMIN_USER_MANAGEMENT_SETTING_KEY
// } from '@adminsetting/constants/menu';
import * as Icon from '@base/icons';
export const LIMIT_TAB_VIEW = 20;
const iconMap: { [key: string]: (props: IconComponentProps) => JSX.Element } = {
  demo: (props) => <Icon.LayoutDashboard {...props} />,
  dashboard: (props) => <Icon.LayoutDashboard {...props} />,
  customer: (props) => <Icon.TableClient {...props} />,
  vendor: (props) => <Icon.TableCorrespondent {...props} />,
  stock: (props) => <Icon.Stock {...props} />,
  auction: (props) => <Icon.Auction {...props} />,
  purchase: (props) => <Icon.Purchase {...props} />,
  sales: (props) => <Icon.Delivery {...props} />,
  account: (props) => <Icon.Adjustment {...props} />,
  statistics: (props) => <Icon.Statistics {...props} />,
  setting: (props) => <Icon.Settings {...props} />,
  // [MENU_ADMIN_BASIC_SETTING_KEY]: (props) => <Icon.Settings {...props} />,
  // [MENU_ADMIN_USER_MANAGEMENT_SETTING_KEY]: (props) => <Icon.BinaryTree {...props} />,
  // [MENU_ADMIN_SECURITY_MANAGEMENT_SETTING_KEY]: (props) => <Icon.Lock {...props} />,
  // [MENU_ADMIN_INFO_CHANGE_HISTORY_SETTING_KEY]: (props) => <Icon.FilePencil {...props} />,
  // [MENU_ADMIN_LOG_HISTORY_SETTING_KEY]: (props) => <Icon.ListTree {...props} />
};
export const getIconByKey = (key: string, props: IconComponentProps = {}): JSX.Element | null => {
  const IconComponent = iconMap[key];
  return IconComponent ? <IconComponent {...props} /> : null;
};
