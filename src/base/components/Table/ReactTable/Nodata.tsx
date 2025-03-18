import { Typography } from 'antd';

interface NodataProps {
  colspan: number;
}

function Nodata({ colspan }: NodataProps) {
  return (
    <tr>
      <td
        colSpan={colspan}
        style={{
          height: 32,
          paddingInline: 4,
          textAlign: 'center',
          verticalAlign: 'center'
        }}
      >
        <Typography className="body-data-val" style={{ color: 'var(--base-fg-color-base-fg-40, #949DB8)' }}>
          자료가 없습니다
        </Typography>
      </td>
    </tr>
  );
}

export default Nodata;
