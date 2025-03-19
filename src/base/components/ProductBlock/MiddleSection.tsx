import Typography from 'antd/es/typography/Typography';

interface MiddleSectionProps {}

const MiddleSection = (props: MiddleSectionProps) => {
  const {} = props;
  return (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', paddingTop: 12, paddingInline: 20 }}>
      <Typography
        style={{
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          wordWrap: 'break-word',
          wordBreak: 'break-all'
        }}
        className="title-sm"
      >
        BMW 2시리즈 그란쿠페(F44) 220i 어드밴티지지지지지지ㅋㅊㅋㅌㅊ지지지지ㅋㅊㅋㅌㅊ지지지지ㅋㅊㅋㅌㅊ
      </Typography>
    </div>
  );
};

export default MiddleSection;
