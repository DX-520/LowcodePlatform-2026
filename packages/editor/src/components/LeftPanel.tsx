// packages/editor/src/components/LeftPanel.tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from 'antd';
import type { ComponentType } from '@lowcode/types';

// 左侧可拖拽的组件列表（仅保留简历相关组件）
const componentList = [
  { type: 'PersonalInfo' as ComponentType, label: '个人信息组件' },
  { type: 'SkillStack' as ComponentType, label: '核心技术栈' },
  { type: 'Internship' as ComponentType, label: '实习经历' },
  { type: 'Project' as ComponentType, label: '项目经历' },
  { type: 'SelfEvaluation' as ComponentType, label: '自我评价' },
];

// 主组件
export const LeftPanel = () => {
  return (
    <div style={{ padding: '20px',  height: '100%' }}>
      <h3>组件库</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {componentList.map((item) => (
          <DraggableItem key={item.type} type={item.type} label={item.label} />
        ))}
      </div>
    </div>
  );
};

// 可拖拽的子组件
interface DraggableItemProps {
  type: ComponentType;
  label: string;
}

const DraggableItem = ({ type, label }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `drag-${type}`,
    data: { type },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Button type="dashed" block>{label}</Button>
      {/* {label} */}
    </div>
  );
};
