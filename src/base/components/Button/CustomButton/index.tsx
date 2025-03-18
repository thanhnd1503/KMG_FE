import React, { CSSProperties, ReactNode } from 'react';

import { Button as AnButton, ButtonProps as AnButtonProps, ConfigProvider } from 'antd';
import { ButtonType, ButtonColorType } from 'antd/es/button';

export interface ButtonProps extends Omit<AnButtonProps, 'type' | 'color'> {
  active?: boolean;
  round?: boolean;
  type?: ButtonType | 'secondary';
  shape?: AnButtonProps['shape'];
  color?: ButtonColorType | 'secondary' | 'success' | 'error';
  icon?: ReactNode;
}

const validColors = new Set<ButtonColorType>(['default', 'primary', 'danger']);

const Button: React.FC<ButtonProps> = ({ style, active, round, type, color, variant, size = 'large', icon, shape, ...props }) => {
  // const hasIcon = !!icon;
  let customStyle: CSSProperties = {
    fontWeight: size === 'large' ? 600 : 500,
    fontSize: size === 'large' ? 14 : 12,
    padding: size === 'large' ? '8px 16px' : size === 'middle' ? '6px 12px' : '4px 8px',
    borderRadius: round || shape === 'circle' ? 44 : undefined,
    height: size === 'large' ? 36 : size === 'middle' ? 28 : 24,
    width: shape === 'circle' ? (size === 'large' ? 36 : size === 'middle' ? 28 : 24) : undefined,
    gap: 4,
    ...style
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case 'large':
        return 16;
      case 'middle':
        return 12;
      case 'small':
        return 12;
      default:
        return 16;
    }
  };

  const buttonProps: AnButtonProps = {
    ...props,
    style: customStyle,
    type: type === 'secondary' ? undefined : type, // exclude 'secondary' type,
    color: validColors.has(color as ButtonColorType) ? (color as ButtonColorType) : undefined
  };

  const disableColor = (color: string) => {
    return `color-mix(in srgb, ${color} 50%, transparent)`;
  };

  const getColor = (color?: ButtonColorType | 'secondary' | 'success' | 'error') => {
    switch (color) {
      case 'primary':
        return {
          // enable
          defaultColor: variant === 'solid' ? 'var(--button-primary-fg, #FFFFFF)' : 'var(--button-secondary-fg-enabled, #6366F1)',
          defaultBorderColor:
            variant === 'solid' ? 'var(--button-primary-bg-enabled, #6366F1)' : 'var(--button-secondary-stroke-enabled, #6366F1)',
          defaultBg: variant === 'solid' ? 'var(--button-primary-bg-enabled, #6366F1)' : 'var(--button-secondary-bg-enabled, #FFFFFF)',

          // hovered
          defaultHoverColor: variant === 'solid' ? 'var(--button-primary-fg, #FFFFFF)' : 'var(--button-secondary-fg-hovered, #6366F1)',
          defaultHoverBorderColor:
            variant === 'solid' ? ' var(--button-primary-bg-hoverd, #4338CA)' : 'var(--button-secondary-stroke-hovered, #6366F1)',
          defaultHoverBg: variant === 'solid' ? 'var(--button-primary-bg-hoverd, #4338CA)' : 'var(--button-secondary-bg-hovered, #EEF2FF)',

          // pressed
          defaultActiveColor: variant === 'solid' ? 'var(--button-primary-fg, #FFFFFF)' : 'var(--button-secondary-fg-pressed, #4338CA)',
          defaultActiveBg:
            variant === 'solid' ? 'var(--button-primary-bg-pressed, #312E81)' : 'var(--button-secondary-bg-pressed, #E0E7FF)',
          defaultActiveBorderColor:
            variant === 'solid' ? 'var(--button-primary-bg-pressed, #312E81)' : 'var(--button-secondary-stroke-pressed, #4338CA)',

          // disable
          colorTextDisabled:
            variant === 'solid' ? 'var(--button-primary-fg, #FFFFFF)' : disableColor('var(--button-secondary-stroke-enabled, #6366F1)'),
          colorBgContainerDisabled:
            variant === 'solid'
              ? disableColor('var(--button-primary-bg-enabled, #6366F1)')
              : disableColor('var(--button-secondary-bg-enabled, #FFFFFF)'),
          borderColorDisabled:
            variant === 'solid'
              ? disableColor('var(--button-primary-bg-enabled, #6366F1)')
              : disableColor('var(--button-secondary-stroke-enabled, #6366F1)')
        };
      case 'secondary':
        return {
          // enable
          defaultColor: 'var(--button-tertiary-fg-enabled, #646E8B)',
          defaultBorderColor: 'var(--button-tertiary-stroke-enabled, #CBD1E1)',
          defaultBg: 'var(--button-tertiary-bg-enabled, #FFFFFF)',
          // hovered
          defaultHoverColor: 'var(--button-tertiary-fg-hovered, #333C55)',
          defaultHoverBorderColor: 'var(--button-tertiary-stroke-hovered, #646E8B)',
          defaultHoverBg: 'var(--button-tertiary-bg-hovered, #F1F3F9)',
          // pressed
          defaultActiveColor: 'var(--button-tertiary-fg-pressed, #0F162A)',
          defaultActiveBg: 'var(--button-tertiary-bg-pressed, #CBD1E1)',
          defaultActiveBorderColor: 'var(--button-tertiary-stroke-pressed, #333C55)',
          // disable
          colorTextDisabled: disableColor('var(--button-tertiary-fg-enabled, #646E8B)'),
          borderColorDisabled: disableColor('var(--button-tertiary-stroke-enabled, #CBD1E1)'),
          colorBgContainerDisabled: disableColor('var(--button-tertiary-bg-enabled, #FFFFFF)')
        };

      case 'success':
        return {
          // enable
          defaultColor: 'var(--status-success-color-status-success-fg-60, #16A34A)',
          defaultBorderColor: 'var(--status-success-color-status-success-fg-60, #16A34A)',
          defaultBg: ' var(--button-secondary-bg-enabled, #FFFFFF)',
          // hovered
          defaultHoverColor: 'var(--status-success-color-status-success-fg-60, #16A34A)',
          defaultHoverBorderColor: 'var(--status-success-color-status-success-fg-60, #16A34A)',
          defaultHoverBg: 'var(--status-success-color-status-success-bg-5, #F0FDF4)',
          // pressed
          defaultActiveColor: 'var(--status-success-color-status-success-fg-80, #166534)',
          defaultActiveBorderColor: 'var(--status-success-color-status-success-fg-80, #166534)',
          defaultActiveBg: 'var(--status-success-color-status-success-bg-5, #F0FDF4)',
          // disable
          colorTextDisabled: disableColor('var(--status-success-color-status-success-fg-60, #16A34A)'),
          borderColorDisabled: disableColor('var(--status-success-color-status-success-fg-60, #16A34A)'),
          colorBgContainerDisabled: disableColor('var(--button-tertiary-bg-enabled, #FFFFFF)')
        };

      case 'error':
        return {
          // enable
          defaultColor: 'var(--status-error-color-status-error-fg-60, #DC2626)',
          defaultBorderColor: 'var(--status-error-color-status-error-stroke-60, #DC2626)',
          defaultBg: ' var(--button-secondary-bg-enabled, #FFFFFF)',
          // hovered
          defaultHoverColor: 'var(--status-error-color-status-error-fg-60, #DC2626)',
          defaultHoverBorderColor: 'var(--status-error-color-status-error-stroke-60, #DC2626)',
          defaultHoverBg: 'var(--status-error-color-status-error-bg-5, #FEF2F2)',
          // pressed
          defaultActiveColor: 'var(--status-error-color-status-error-fg-80, #991B1B)',
          defaultActiveBorderColor: 'var(--status-error-color-status-error-stroke-80, #991B1B)',
          defaultActiveBg: 'var(--status-error-color-status-error-bg-5, #FEF2F2)',
          // disable
          colorTextDisabled: disableColor('var(--status-error-color-status-error-fg-60, #DC2626)'),
          borderColorDisabled: disableColor('var(--status-error-color-status-error-fg-60, #DC2626)'),
          colorBgContainerDisabled: disableColor('var(--button-tertiary-bg-enabled, #FFFFFF)')
        };

      default:
        return {
          defaultColor: active ? 'white' : 'var(--primary-color)',
          defaultHoverColor: active ? 'white' : 'var(--primary-color)',
          defaultBg: active ? 'var(--primary-color)' : type === 'secondary' ? '#DBF0FF' : 'white',
          defaultHoverBg: active ? 'var(--primary-color)' : type === 'secondary' ? '#e0e8ed' : 'unset',
          defaultActiveBg: active ? 'var(--primary-color)' : type === 'secondary' ? '#e0e8ed' : 'unset',
          defaultBorderColor: active || type === 'secondary' ? 'none' : 'unset',
          defaultHoverBorderColor: active || type === 'secondary' ? 'none' : 'unset',
          defaultActiveBorderColor: active || type === 'secondary' ? 'none' : 'unset'
        };
    }
  };

  const iconWithProps =
    icon &&
    React.cloneElement(icon as React.ReactElement, {
      style: {
        color: getColor(color).defaultColor,
        flexShrink: 0,
        fontSize: getIconSize(size),
        // allow icon with override custom style, ex: icon={<NewWrite style={{ fontSize: 20 }} />}
        ...((icon as React.ReactElement).props.style || {})
      }
    });

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            ...getColor(color)
          }
        }
      }}
    >
      <AnButton {...buttonProps} icon={iconWithProps} />
    </ConfigProvider>
  );
};

export default Button;
