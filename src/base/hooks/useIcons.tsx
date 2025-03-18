// auth provider
import {
  CalendarIcon,
  CarIcon,
  DolarIcon,
  GraphIcon,
  GroupUserIcon,
  ListIcon,
  MailIcon,
  MoveInIcon,
  PhoneCallIcon,
  SettingIcon,
  CalculatorIcon,
  TaskIcon,
  UserInfoIcon
} from '@base/assets/icons';
export const iconMap: { [key: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element } = {
  product: (props) => <CarIcon {...props} />,
  contract: (props) => <CalendarIcon {...props} />,
  customer: (props) => <GroupUserIcon {...props} />,
  setting: (props) => <SettingIcon {...props} />,
  discount: (props) => <DolarIcon {...props} />,
  notification: (props) => <MailIcon {...props} />,
  note: (props) => <ListIcon {...props} />,
  service: (props) => <PhoneCallIcon {...props} />,
  statistics: (props) => <GraphIcon {...props} />,
  account: (props) => <MoveInIcon {...props} />,
  task: (props) => <TaskIcon {...props} />,
  settlement: (props) => <CalculatorIcon {...props} />
};
export const useIcons = () => {
  const getIconByKey = (key: string, props: React.SVGProps<SVGSVGElement> = {}): JSX.Element | null => {
    const IconComponent = iconMap[key];
    return IconComponent ? <IconComponent {...props} /> : null;
  };
  return {
    getIconByKey
  };
};
