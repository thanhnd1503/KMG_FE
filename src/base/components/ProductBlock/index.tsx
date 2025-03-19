import { useCallback } from 'react';

import BottomSection from './BottomSection';
import MiddleSection from './MiddleSection';
import TopSection from './TopSection';

interface ProductBlockProps {
  size?: 'large' | 'middle' | 'small';
}

const ProductBlock = (props: ProductBlockProps) => {
  const { size = 'middle' } = props;

  const getWidth = useCallback(() => {
    switch (size) {
      case 'large':
        return 388;
      case 'middle':
        return 286;
      case 'small':
        return 208;

      default:
        return 286;
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: getWidth(),
        border: '1px solid black',
        borderRadius: 8,
        backgroundColor: 'var(--base-bg-color-base-bg-10, #F1F3F9)'
      }}
    >
      {/* TOP - for image/comparision/whist-list */}
      <TopSection />

      {/* MIDDLE - for tag/name/price(old-price)/Installment(money per month) */}
      <MiddleSection />

      {/* BOTTOM - for properties */}
      <BottomSection />
    </div>
  );
};

export default ProductBlock;
