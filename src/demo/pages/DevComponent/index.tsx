import { Flex, message, Radio, Switch as AnSwitch, Typography, Checkbox } from 'antd';

import Button from '@base/components/Button/CustomButton';
import Switch from '@base/components/Switch';
import { Refresh } from '@base/icons';
import * as CommonIcon from '@base/icons';
import TableIconCorrespondent from '@base/icons/TableIconCorrespondent';

const DevComponent = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopyText = (jsxCode: string) => {
    navigator.clipboard
      .writeText(jsxCode)
      .then(() => {
        messageApi.open({
          type: 'info',
          content: 'Copied to clipboard',
          duration: 0.5
        });
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const getButtonJSXString = (props: Record<string, any>, children: string) => {
    const propString = Object.entries(props)
      .map(([key, value]) => (typeof value === 'string' ? `${key}="${value}"` : `${key}={${value}}`))
      .join(' ');
    return `<Button ${propString}>
  ${children}
</Button>`;
  };

  const getIconJSXString = (icon: string) => {
    return `<${icon} />`;
  };

  const btnList: {
    variant: 'solid' | 'outlined';
    color: 'primary' | 'secondary' | 'success' | 'error';
  }[] = [
    {
      variant: 'solid',
      color: 'primary'
    },
    {
      variant: 'outlined',
      color: 'primary'
    },
    {
      variant: 'outlined',
      color: 'secondary'
    },
    {
      variant: 'outlined',
      color: 'success'
    },
    {
      variant: 'outlined',
      color: 'error'
    }
  ];

  return (
    <div style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', width: 912, paddingBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        <Typography>Switch</Typography>

        <Switch label="enabled" />
        <Switch defaultChecked label="enabled - selected" />
        <Switch disabled label="disable" checked={false} />
        <Switch defaultChecked disabled label="disable - selected" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        <Typography>Radio</Typography>

        <Radio defaultChecked={false}>enabled</Radio>
        <Radio defaultChecked={true}>enabled - selected</Radio>

        <Radio defaultChecked={false} disabled={true}>
          disabled
        </Radio>
        <Radio defaultChecked={true} disabled={true}>
          disabled - selected
        </Radio>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        <Typography>Checkbox</Typography>
        <Checkbox.Group
          style={{ flexWrap: 'nowrap', flexDirection: 'column', gap: 8 }}
          options={[
            { label: 'enabled', value: '0', style: { whiteSpace: 'nowrap' } },
            { label: 'enabled - selected', value: '1', style: { whiteSpace: 'nowrap' } },
            { label: 'disabled', value: '2', style: { whiteSpace: 'nowrap' }, disabled: true },
            { label: 'disabled - selected', value: '3', style: { whiteSpace: 'nowrap' }, disabled: true }
          ]}
          value={['1', '3']}
        />
      </div>

      <Flex vertical={true} gap={8} style={{ marginTop: 20 }}>
        {contextHolder}

        <Typography.Title level={1} style={{ marginTop: 20 }}>
          Button
        </Typography.Title>
        <Typography>import Button from '@base/components/Button/CustomButton'; </Typography>
        <Typography> Click button to copy </Typography>
        {btnList.map((item, index) => {
          return (
            <Flex key={index} vertical={false} justify="space-between" align="center" gap={32}>
              <Button
                onClick={(e) => handleCopyText(getButtonJSXString({ variant: item.variant, color: item.color }, 'Button'))}
                variant={item.variant}
                color={item.color}
              >
                {`variant="${item.variant}" color="${item.color}"`}
              </Button>

              <Button disabled variant={item.variant} color={item.color}>
                {`variant="${item.variant}" color="${item.color}" disabled`}
              </Button>
            </Flex>
          );
        })}
        <Button
          style={{ width: 'fit-content' }}
          onClick={(e) => handleCopyText(getButtonJSXString({ variant: 'outlined', color: 'secondary' }, 'Button'))}
          variant="outlined"
          color="secondary"
          size="large"
        >
          variant={'outlined'}
          color='secondary' size='large'
        </Button>
        <Button
          style={{ width: 'fit-content' }}
          onClick={(e) => handleCopyText(getButtonJSXString({ variant: 'outlined', color: 'secondary' }, 'Button'))}
          variant="outlined"
          color="secondary"
          size="middle"
        >
          variant={'outlined'}
          color='secondary' size='middle'
        </Button>
        <Button
          style={{ width: 'fit-content' }}
          onClick={(e) => handleCopyText(getButtonJSXString({ variant: 'outlined', color: 'secondary' }, 'Button'))}
          variant="outlined"
          color="secondary"
          size="small"
        >
          variant={'outlined'}
          color='secondary' size='small'
        </Button>

        <Flex align="center" justify="flex-start" gap={16}>
          <Button style={{ width: 'fit-content' }} variant="outlined" color="primary" size="large" icon={<TableIconCorrespondent />} />
          <Button style={{ width: 'fit-content' }} variant="outlined" color="primary" size="middle" icon={<TableIconCorrespondent />} />
          <Button style={{ width: 'fit-content' }} variant="outlined" color="primary" size="small" icon={<TableIconCorrespondent />} />
        </Flex>

        <Button style={{ width: 'fit-content' }} variant="outlined" color="primary" size="large" icon={<TableIconCorrespondent />}>
          Button with Start Icon
        </Button>

        <Typography.Title level={1} style={{ marginTop: 20 }}>
          Icon
        </Typography.Title>
        <Typography>{`import {Refresh} from '@base/icons';`}</Typography>
        <Typography>{`<Refresh style={{ fontSize: 30, color: 'red' }} />`}</Typography>

        <Refresh style={{ fontSize: 30, color: 'red' }} />

        <Typography style={{ paddingTop: 10, paddingBottom: 10 }}> Click icon to copy </Typography>

        <Flex align="center" justify="center" gap={24} wrap="wrap" style={{ marginTop: 20 }}>
          {(Object.keys(CommonIcon) as Array<keyof typeof CommonIcon>).map((icon, index) => {
            const IconComponent = CommonIcon[icon];
            return (
              <IconComponent
                onClick={(e) => handleCopyText(getIconJSXString(icon as string))}
                key={index}
                style={{ fontSize: 28, color: 'var(--base-fg-color-base-fg-70, #333C55)' }}
              />
            );
          })}
        </Flex>

        <Typography.Title level={1} style={{ marginTop: 20 }}>
          Typography
        </Typography.Title>
        <Typography style={{ marginTop: 20 }}>className equal to name in design figma</Typography>
        <Typography>
          it's already define font-size; font-weight; line-height; letter-spacing; just modify style.color as your expect
        </Typography>
        <Typography>if figma design don't have typography name, contact design team and styling as design</Typography>
        <Typography style={{ marginBottom: 20 }}>please follow design figma and using it as a must</Typography>
        <Typography
          className="title-xl"
          style={{ marginBottom: 20 }}
        >{`<Typography className="title-xl">Text (Name in figma: Title/title-xl)</Typography>`}</Typography>

        {/* Navigation */}
        <Typography.Title level={1} style={{ marginTop: 20 }}>
          Navigation
        </Typography.Title>
        <Typography style={{ marginTop: 20 }}>
          about app navigation, it follow useTabs() hook design, open new tab or replace existing page base on design work flow, pls refer
          it
        </Typography>
        <Typography style={{ marginTop: 20, color: 'var(--primary-fg-color-primary-fg-50, #6366F1)' }}>using hook()</Typography>
        <Typography style={{ marginTop: 20 }}>{`const { addOrActivateTab, directTo } = useTabs();`}</Typography>
        <Typography style={{ marginTop: 20 }}>open new tab using: addOrActivateTab(url)</Typography>
        <Typography style={{ marginTop: 20 }}>changing current tab: directTo(url)</Typography>
        <Typography style={{ marginTop: 20, color: 'var(--primary-fg-color-primary-fg-50, #6366F1)' }}>use component</Typography>
        <Typography style={{ marginTop: 20 }}>{`<LinkTo to={'/demo/all/view/${`$`}{data['id']'} openTab>{value}</LinkTo>`}</Typography>
      </Flex>
    </div>
  );
};

export default DevComponent;
