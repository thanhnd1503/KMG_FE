import { DatePickerProps, FormItemProps, FormProps, InputNumberProps, message, ThemeConfig, UploadProps } from 'antd';
import dayjs from 'dayjs';

import { moneyFormatter } from '@base/utils/helper';

export const uploadImageConfig: UploadProps = {
  name: 'file',
  action: 'backend_url',
  accept: 'image/*',
  headers: {
    authorization: 'authorization-text'
  },
  beforeUpload(file, FileList) {
    return false;
  }
};
export const uploadFileConfig: UploadProps = {
  name: 'file',
  action: 'backend_url',
  // accept: 'image/*',
  headers: {
    authorization: 'authorization-text'
  },
  beforeUpload(file, FileList) {
    return false;
  }
};

export const formConfig: FormProps = {
  scrollToFirstError: {
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  },
  onFinishFailed: () => message.error('Missing essential information', 3),
  requiredMark: false,
  labelAlign: 'left'
};
export const moneyInputConfig: InputNumberProps = {
  formatter: moneyFormatter,
  parser: (value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number,
  addonAfter: '원',
  controls: false
};
export const dateFormConfig: FormItemProps = {
  getValueProps: (value) => ({ value: value && dayjs(value) }),
  normalize: (value) => value && `${dayjs(value).format('YYYY-MM-DD')}`
};
export const dateTimeFormConfig: FormItemProps = {
  getValueProps: (value) => ({ value: value && dayjs(value) }),
  normalize: (value) => value && `${dayjs(value).format('YYYY-MM-DD HH:mm:ss')}`
};
export const rangeDateFormConfig: FormItemProps = {
  getValueProps: (value) => ({ value: value && [value[0] && dayjs(value[0]), value[1] && dayjs(value[1])] }),
  normalize: (value) => value && [dayjs(value[0]).format('YYYY-MM-DD'), dayjs(value[1]).format('YYYY-MM-DD')]
};
export const rangeDateTimeFormConfig: FormItemProps = {
  getValueProps: (value) => ({ value: value && [value[0] && dayjs(value[0]), value[1] && dayjs(value[1])] }),
  normalize: (value) => value && [dayjs(value[0]).format('YYYY-MM-DD HH:mm'), dayjs(value[1]).format('YYYY-MM-DD HH:mm')]
};
export const timeFormConfig: FormItemProps = {
  getValueProps: (value) => {
    return { value: value && dayjs(value, 'HH:mm') };
  },
  normalize: (value) => value && `${dayjs(value).format('HH:mm')}`
};

export const mainLayoutAntdConfig: ThemeConfig = {
  token: {
    fontFamily: "'Pretendard', sans-serif",
    colorTextPlaceholder: '#475069',
    colorError: '#FF7D7D',
    borderRadius: 4,
    lineHeight: 1
  },
  components: {
    Layout: {
      bodyBg: '#ffffff'
    },
    Button: {
      paddingBlockLG: 17,
      paddingInlineLG: 28,
      paddingInline: 10,
      borderRadius: 4
    },
    Typography: {
      colorTextDescription: '#475069',
      colorTextSecondary: '#475069',
      titleMarginBottom: 0,
      colorText: 'var(--base-fg-color-base-fg-70, #333C55)'
    },
    Form: {
      labelColor: '#475069',
      labelRequiredMarkColor: 'red',
      itemMarginBottom: 0,
      labelColonMarginInlineEnd: 16,
      verticalLabelMargin: 0,
      verticalLabelPadding: 2,
      labelHeight: 28,
      controlHeight: 28,
      controlHeightSM: 20
    },
    Tabs: {
      margin: 0,
      itemColor: '#989898'
    },
    Checkbox: {
      colorPrimary: 'var(--check-box-bg-selcted, #6366F1)',
      colorPrimaryHover: 'var(--button-primary-bg-hoverd, #4338ca)',
      colorBorder: 'var(--check-box-stroke-enabled, #CBD1E1)',
      colorTextDisabled: 'var(--base-fg-color-base-fg-50, #646E8B)',
      colorBgContainerDisabled: 'var(--check-box-bg-disabled, #E2E5F0)'
    },
    Divider: {
      colorSplit: '#E2E5F0'
    },
    Radio: {
      dotSize: 6,
      radioSize: 16,
      colorTextDisabled: 'var(--base-fg-color-base-fg-50, #646E8B)',
      wrapperMarginInlineEnd: 16
    },
    Select: {
      controlHeightSM: 28,
      controlHeight: 36,
      colorBorder: '#CBD1E1',
      activeBorderColor: '#CBD1E1',
      boxShadowSecondary: 'none',
      boxShadow: 'none',
      fontSizeSM: 12,
      controlPaddingHorizontalSM: 12,
      optionSelectedBg: '#F1F3F9'
    },
    Modal: { borderRadius: 8 },
    Input: {
      colorTextDisabled: '#000',
      activeBg: 'var(--input-bg-selected, #FFFFFF)',
      activeBorderColor: 'var(--input-stroke-selected, #6366F1) ',
      activeShadow: 'none',
      hoverBg: 'var(--input-bg-hovered, #F1F3F9)',
      hoverBorderColor: 'var(--input-stroke-hovered, #646E8B)',
      colorText: '#475069',
      inputFontSize: 12,
      inputFontSizeSM: 12,
      borderRadius: 4,
      controlHeightSM: 28,
      controlHeight: 36,
      paddingBlockSM: 4,
      paddingBlock: 8,
      paddingInlineSM: 8,
      paddingInline: 12,
      lineHeightLG: 1,
      lineHeight: 1.5,
      colorBorder: '#CBD1E1'
    },
    InputNumber: {
      colorTextDisabled: '#000',
      activeBg: 'var(--input-bg-selected, #FFFFFF)',
      activeBorderColor: 'var(--input-stroke-selected, #6366F1) ',
      activeShadow: 'none',
      hoverBg: 'var(--input-bg-hovered, #F1F3F9)',
      hoverBorderColor: 'var(--input-stroke-hovered, #646E8B)',
      colorText: '#475069',
      inputFontSize: 12,
      inputFontSizeSM: 12,
      borderRadius: 4,
      controlHeightSM: 28,
      controlHeight: 36,
      paddingBlockSM: 4,
      paddingBlock: 8,
      paddingInlineSM: 8,
      paddingInline: 12,
      lineHeightLG: 1,
      lineHeight: 1.5,
      colorBorder: '#CBD1E1'
    },
    Table: {
      fontSize: 16,
      cellFontSize: 16
    },
    Switch: {
      handleBg: '#fff',
      handleSize: 16,
      innerMaxMargin: 20,
      trackHeight: 20,
      trackMinWidth: 38,
      handleShadow: 'red'
    },
    DatePicker: {
      colorBorder: 'var(--check-box-stroke-enabled, #CBD1E1)',
      paddingInline: 8,
      paddingBlock: 2,
      controlHeightSM: 20,
      controlHeight: 36,
      lineHeight: 1.5,
      colorText: '#475069'
    },
    Menu: { iconSize: 20 }
  }
};
