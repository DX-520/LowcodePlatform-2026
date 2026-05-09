// packages/editor/src/components/RightPanel.tsx
import { useEditorStore } from '../store';
import { useMemo } from 'react';
import { DynamicForm } from './DynamicForm';
import {componentRegistry} from '@lowcode/components'

export const RightPanel = () => {
  const { components, selectedId, updateComponentProps, deleteComponent } = useEditorStore();
  
  const selectedComponent = useMemo(() => {
    return components.find((c) => c.id === selectedId);
  }, [components, selectedId]);

  // 没选中组件时，只显示提示
  if (!selectedComponent) {
    return (
      <div style={{ padding: '20px' }}>
        <h3>属性配置</h3>
        <p style={{ color: '#999' }}>请点击画布上的组件</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
      <h3>属性配置</h3>
      <DynamicForm
        propDefs={componentRegistry[selectedComponent.type]?.propDefs || []}
        currentProps={selectedComponent.props}
        onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
      />
    </div>
  );
};