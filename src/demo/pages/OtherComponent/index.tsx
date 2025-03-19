import ProductBlock from '@base/components/ProductBlock';

interface Props {}

const OtherComponent = (props: Props) => {
  const {} = props;
  return (
    <div style={{ background: 'grey', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {Array.from({ length: 26 }, (_, i) => {
        return <ProductBlock key={i} />;
      })}
    </div>
  );
};

export default OtherComponent;
