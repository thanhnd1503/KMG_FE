import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import Input from 'antd/es/input/Input';

import Button from '@base/components/Button/CustomButton';
import ListSettingKebap, { KebapSortItem } from '@base/components/ListSettingKebap';
import ShowSearchButton from '@base/components/SearchBar/components/ShowSearchButton';
import { LIST_TOOLBAR_HEIGHT } from '@base/configs/layoutConfig';
import { DotsVertical, Reload, Search, Trash } from '@base/icons';

interface ToolbarProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  sort: KebapSortItem[];
  setSort: (val: KebapSortItem[]) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  pageType: 'page' | 'more';
  setPageType: (val: 'page' | 'more') => void;
}

const Toolbar = (props: ToolbarProps) => {
  const { showSearch, setShowSearch, sort, setSort, pageSize, pageType, setPageSize, setPageType } = props;

  const handleChangePageSetting = (pageSetting: { pageSize: number; pageType: 'page' | 'more' }, type: 'pageSize' | 'pageType') => {
    if (type === 'pageSize') {
      setPageSize(pageSetting.pageSize);
    } else if (type === 'pageType') {
      setPageType(pageSetting.pageType);
    }
  };

  return (
    <Flex>
      <Flex
        vertical={false}
        style={{ height: LIST_TOOLBAR_HEIGHT, marginTop: 16, marginBottom: 16, alignItems: 'center', gap: 8, flex: 1 }}
      >
        <ShowSearchButton showSearch={showSearch} setShowSearch={setShowSearch} />
        <Input style={{ width: 180, height: 36 }} placeholder="차량번호, 차종, 고객명" suffix={<Search />} />
        <Button variant="outlined" color="primary" style={{ height: 36 }} icon={<Reload />}>
          필터 초기화
        </Button>
        <Button variant="outlined" color="secondary">
          보험정보조회
        </Button>
        <Button variant="outlined" color="secondary">
          차량정보조회
        </Button>
        <Button variant="outlined" color="secondary" icon={<Trash />}>
          삭제
        </Button>
      </Flex>
      <Flex
        vertical={false}
        style={{ height: LIST_TOOLBAR_HEIGHT, marginTop: 16, marginBottom: 16, alignItems: 'center', gap: 8, flex: 0, fontSize: 14 }}
      >
        <ListSettingKebap
          sortItems={sort}
          onChangeSort={setSort}
          pageSetting={{ pageSize, pageType }}
          setPageSetting={handleChangePageSetting}
        />
      </Flex>
    </Flex>
  );
};

export default Toolbar;
