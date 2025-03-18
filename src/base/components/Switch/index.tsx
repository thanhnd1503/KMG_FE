import { Switch as AnSwitch, SwitchProps, Typography } from 'antd';

interface Props extends SwitchProps {
  label?: string;
}

const Switch = (props: Props) => {
  const { label, disabled } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <AnSwitch {...props} />
      {label && (
        <Typography
          className="body-text-lg"
          style={{ color: disabled ? 'var(--base-fg-color-base-fg-50, #646E8B)' : 'var(--base-fg-color-base-fg-70, #333C55)' }}
        >
          {label}
        </Typography>
      )}
    </div>
  );
};

export default Switch;
