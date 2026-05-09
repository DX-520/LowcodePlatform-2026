// packages/editor/src/components/Canvas.tsx
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '../store';
import { Button, Input, Typography } from 'antd';
import { useEffect } from 'react';
import type { ComponentSchema } from '@lowcode/types';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { componentRegistry } from '@lowcode/components';

const { Paragraph } = Typography;

// --------------------------------------------------
// SortableItem：负责拖拽 + 点击选中 + 选中边框
// --------------------------------------------------
const SortableItem = ({
  id,
  children,
  isSelected,
  onClick,
}: {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const,
    width: '100%',
    // 选中态边框
    border: isSelected ? '1px solid #1890ff' : '1px solid transparent',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    // display: 'flex',      // 让手柄和内容并排
    // alignItems: 'flex-start',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* 极简手柄：只有悬停时隐约可见，放在内容左侧 */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          width: 12,                   // 很窄
          minHeight: 5,
          background: 'transparent',
          flexShrink: 0,
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {/* 手柄视觉提示：两个小灰点 */}
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc' }} />
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc' }} />
        </div>
      </div>

      {/* 内容区：只有这里响应点击，不参与拖拽 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{ flex: 1, cursor: 'pointer' }}
      >
        {children}
      </div>
    </div>
  );
};


// --------------------------------------------------
// Canvas 主组件
// --------------------------------------------------
export const Canvas = () => {
  const { components, selectedId, setSelectedId, deleteComponent } = useEditorStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  // 监听键盘删除键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        deleteComponent(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteComponent]);

  // 纯渲染函数：不再处理点击、边框，只返回组件内容
  const renderComponent = (comp: ComponentSchema) => {
    // 1. 先从注册表找新简历组件
    const module = componentRegistry[comp.type];
    if (module) {
      return module.render(comp);
    }

    // 2. 旧通用组件的渲染（保留原有逻辑，但不再套任何外层 div）
    switch (comp.type) {
      case 'Button':
        return <Button {...comp.props}>{comp.props.children || '按钮'}</Button>;
      case 'Input':
        return (
          <Input
            {...comp.props}
            placeholder={comp.props.placeholder || '输入框'}
            style={{ width: 200 }}
          />
        );
      case 'Text':
        return <Paragraph {...comp.props}>{comp.props.content || '这是一段文本'}</Paragraph>;
      case 'Image':
        return (
          <img
            {...comp.props}
            src={comp.props.src || 'https://via.placeholder.com/200'}
            alt="组件"
            style={{ maxWidth: '300px' }}
          />
        );
      case 'Title':
        return (
          <h2 {...comp.props} style={{ color: comp.props.color }}>
            {comp.props.title || '标题'}
          </h2>
        );
      default:
        return null;
    }
  };

  const componentIds = components.map((c) => c.id);

  return (
    <div
      style={{
        background: '#eee',
        minHeight: '100%',
        padding: '5px 0',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
       id="resume-paper"
        ref={setNodeRef}
        onClick={() => setSelectedId(null)}
        style={{
          width: '794px',
          height: '1123px',
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          padding: '5px',
          transition: 'box-shadow 0.2s',
        }}
      >
        {components.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>请把左侧组件拖拽到这里</p>
        ) : (
          <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {components.map((comp) => (
                <SortableItem
                  key={comp.id}
                  id={comp.id}
                  isSelected={selectedId === comp.id}
                  onClick={() => setSelectedId(comp.id)}
                >
                  {renderComponent(comp)}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};