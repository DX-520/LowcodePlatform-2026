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

const { Paragraph } = Typography;

// // 可排序的单个组件 wrapper
// const SortableItem = ({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id, distance: 5 });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.3 : 1,
//     zIndex: isDragging ? 999 : 'auto',
//     position: 'relative' as const,
//   };

//   const handleClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!isDragging) {
//       onClick();
//     }
//   };

//   return (
//     <div 
//       ref={setNodeRef} 
//       style={style} 
//       {...attributes}
//       {...listeners}
//       onClick={handleClick}
//     >
//         {children}
//     </div>
//   );
// };
// 可排序的单个组件 wrapper
// const SortableItem = ({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id, distance: 5 }); // distance: 5 保留，意思是移动5像素以上才认为是拖拽

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.3 : 1,
//     zIndex: isDragging ? 999 : 'auto',
//     position: 'relative' as const,
//   };

//   // ✅ 修复 1：只提取拖拽需要的监听器，不要 onClick
//   const dragOnlyListeners = {
//     onMouseDown: listeners.onMouseDown,
//     onTouchStart: listeners.onTouchStart,
//   };

//   // ✅ 修复 2：去掉 isDragging 判断，只要点击就执行
//   const handleClick = (e: React.MouseEvent) => {
//     e.stopPropagation(); // 只阻止冒泡，不做其他判断
//     onClick();
//   };

//   return (
//     <div 
//       ref={setNodeRef} 
//       style={style} 
//       {...attributes}
//       {...dragOnlyListeners} 
//       onClick={handleClick}
//     >
//         {children}
//     </div>
//   );
// };
// // 可排序的单个组件 wrapper
// const SortableItem = ({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ 
//     id, 
//     // 【关键配置】只有按住鼠标移动 8 像素以上，才认为是要拖拽
//     // 这就给“点击”留下了足够的容错空间（手稍微抖一下也不会误触拖拽）
//     distance: 8 
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.3 : 1,
//     zIndex: isDragging ? 999 : 'auto',
//     position: 'relative' as const,
//     width: '100%',
//   };

//   return (
//     // 【第一层】只负责拖拽，不管点击
//     <div 
//       ref={setNodeRef} 
//       style={style} 
//       {...attributes} 
//       {...listeners}
//     >
//       {/* 【第二层】只负责点击，不管拖拽 */}
//       {/* 注意：这里没有 spread 任何 dnd-kit 的东西 */}
//       <div
//         onClick={(e) => {
//           e.stopPropagation(); // 阻止冒泡到画布
//           // 【双重保险】如果正在拖拽中，就不触发点击
//           if (!isDragging) {
//             onClick();
//           }
//         }}
//         style={{
//           width: '100%',
//           height: '100%',
//           cursor: 'pointer',
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// 可排序的单个组件 wrapper
const SortableItem = ({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const,
    display: 'flex', // 让手柄和内容并排
    alignItems: 'flex-start',
    width: '100%',
  };

  return (
    // 【外层容器】只负责定位和样式
    <div ref={setNodeRef} style={style}>
      
      {/* 【核心】拖拽手柄区：只有这里能拖拽！ */}
      {/* 把 dnd-kit 的所有东西都只绑在这个小手柄上 */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab', // 鼠标放上去变成“抓手”
          padding: '8px 4px',
          color: '#999',
          marginTop: '4px',
        }}
      >
        {/* 这里用了一个图标，如果没装库，直接写 <span>≡</span> 也行 */}
        {/* <GripVertical size={16} /> */}
        {/* <GripVertical size={16} /> 把这行删掉，换成下面的 */}
<span style={{ fontWeight: 'bold' }}>≡</span>
      </div>

      {/* 【核心】内容点击区：只有这里能点击！ */}
      {/* 这里干干净净，没有任何 dnd-kit 的监听器 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(); // 直接执行，不做任何 isDragging 判断！
        }}
        style={{
          flex: 1, // 占满剩余空间
          cursor: 'pointer',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Canvas = () => {
  // 从store取数据
  const { components, selectedId, setSelectedId, deleteComponent } = useEditorStore();

  // 画布的放置区域
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  // 监听键盘Delete键删除组件
  useEffect(() => { 
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        deleteComponent(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteComponent]);

  // 渲染单个组件的函数
  const renderComponent = (comp: ComponentSchema) => {
    const isSelected = selectedId === comp.id;

    // 根据组件类型渲染对应内容
    const componentContent = (() => {
      switch (comp.type) {
        case 'Button':
          return <Button {...comp.props}>{comp.props.children || '按钮'}</Button>;
        case 'Input':
          return <Input {...comp.props} placeholder={comp.props.placeholder || '输入框'} style={{ width: 200 }} />;
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
        default:
          return null;
      }
    })();

    // 给组件套上选中的边框
    return (
      <div
        style={{
          padding: '8px',
          border: isSelected ? '2px solid #1890ff' : '2px solid transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '8px',
          width: '100%',
        }}
      >
        {componentContent}
      </div>
    );
  };

  // 提取所有组件的 ID 数组给 SortableContext
  const componentIds = components.map((c) => c.id);
  
  // 画布的主渲染
  return (
    <div
      ref={setNodeRef}
      onClick={() => setSelectedId(null)}
      style={{
        padding: '20px',
        background: isOver ? '#e6f7ff' : '#fff',
        minHeight: '100%',
        border: '2px dashed #d9d9d9',
        transition: 'background 0.2s',
      }}
    >
      {components.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center' }}>请把左侧组件拖拽到这里</p>
      ) : (
        // SortableContext 包裹
        <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {components.map((comp) => (
              <SortableItem 
                key={comp.id} 
                id={comp.id}
                onClick={() => {
                  setSelectedId(comp.id);
                }}
              >
                {renderComponent(comp)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};