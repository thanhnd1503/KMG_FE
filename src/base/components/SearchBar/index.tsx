import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';

import { ConfigProvider, Form } from 'antd';

import { SearchItemConfig } from '@base/configs/searchBar';
import { Menu, Plus, Reload, Search, X } from '@base/icons';

import Button from '../Button/CustomButton';

let portal = document.createElement('div');
document.body.appendChild(portal);

interface SearchBarProps {
  isShow: boolean;
  setShow?: (value: boolean) => void;
  onSearch?: (data: Record<string, string>) => void;
  config?: SearchItemConfig[];
  wrapperStyle?: React.CSSProperties;
}

const SearchBar = (props: SearchBarProps) => {
  const { isShow, onSearch, setShow, config: searchConfig = [], wrapperStyle = {} } = props;
  const [config, setConfig] = useState<SearchItemConfig[]>(searchConfig);
  const [form] = Form.useForm();

  if (!config) {
    return <div>No configuration found for this menu.</div>;
  }

  useEffect(() => {
    if (config) {
      setConfig(config);
    }
  }, [config]);

  const handleSubmitPurchaseForm = async (values: any) => {
    onSearch && onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const listCopy: any[] = [...config];
    const movedItem = listCopy.find((item) => item.key === result.draggableId);
    const listRemoved = listCopy.filter((item) => item.key !== result.draggableId);
    if (movedItem) listRemoved.splice(result.destination.index, 0, movedItem);

    setConfig(listRemoved);
  };

  function renderDraggableItem(provided: DraggableProvided, snapshot: DraggableStateSnapshot, item: any) {
    const Component: any = item?.Component;

    const childRef = useRef<any>(null);

    const handleCallChildFunction = () => {
      if (childRef?.current) {
        childRef?.current?.onInitClick && childRef?.current?.onInitClick();
      }
    };

    let child = (
      <div ref={provided.innerRef} {...provided.draggableProps} key={item.key}>
        <div
          style={{
            padding: 8,
            backgroundColor: snapshot.isDragging ? 'var(--base-bg-color-base-bg-20, #E2E5F0)' : 'var(--base-bg-color-base-bg-10, #F1F3F9)',
            borderRadius: 4
          }}
        >
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <Menu {...provided.dragHandleProps} />
            <span style={{ marginLeft: 4 }}>{item.label}</span>
            {item?.onLabelExtraClick && (
              <Plus style={{ fontSize: 16, padding: 4 }} onClick={() => item?.onLabelExtraClick && handleCallChildFunction()} />
            )}
          </label>
          <Form.Item name={item.key}>{Component ? <Component {...item?.componentProps} ref={childRef} /> : <></>}</Form.Item>
        </div>
      </div>
    );

    if (snapshot.isDragging) {
      return ReactDOM.createPortal(child, portal);
    }
    return child;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: 'var(--base-bg-color-base-bg-0)'
          }
        }
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: 'calc(100% - 16px)',
          width: 260,
          left: isShow ? 0 : '-100%',
          opacity: isShow ? 1 : 0,
          pointerEvents: isShow ? 'all' : 'none',
          transition: 'left 0.2s ease-in-out, opacity 0.2s ease',
          marginTop: 16,
          ...wrapperStyle
          // background: 'white'
        }}
      >
        <div
          style={{
            padding: 8,
            paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            minHeight: '100%',
            backgroundColor: 'var(--base-bg-color-base-bg-10, #F1F3F9)',
            gap: 8,
            height: '100%'
          }}
        >
          <X style={{ fontSize: 16, padding: 4, alignSelf: 'flex-end' }} onClick={() => setShow && setShow(false)} />

          <Form form={form} onFinish={handleSubmitPurchaseForm} className="scroll-box" style={{ width: '100%' }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="search-bar-left">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {config &&
                      config.map((section, index) => (
                        <Draggable key={section.key} draggableId={section.key} index={index}>
                          {(provided, snapshot) => <>{renderDraggableItem(provided, snapshot, section)}</>}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'var(--base-bg-color-base-bg-10, #F1F3F9)',
                paddingTop: 24,
                paddingBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%'
              }}
            >
              <Button htmlType="submit" color="primary" variant="solid" icon={<Search />} style={{ width: 'calc(50% - 4px)' }}>
                검색
              </Button>
              <Button onClick={handleReset} color="secondary" variant="outlined" icon={<Reload />} style={{ width: 'calc(50% - 4px)' }}>
                초기화
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SearchBar;
