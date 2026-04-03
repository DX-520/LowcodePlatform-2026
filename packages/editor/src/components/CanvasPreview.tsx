// packages/editor/src/components/CanvasPreview.tsx
import { useEditorStore } from '../store';
import { Button, Input, Typography } from 'antd';
import type { ComponentSchema } from '@lowcode/types';

const { Paragraph } = Typography;

export const CanvasPreview = () => {
  const { components } = useEditorStore();

  const renderComponent = (comp: ComponentSchema) => {
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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {components.map((comp) => (
        <div key={comp.id}>{renderComponent(comp)}</div>
      ))}
    </div>
  );
};
