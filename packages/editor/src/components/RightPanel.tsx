// packages/editor/src/components/RightPanel.tsx
import { useEditorStore } from '../store';
import { Form, Input, Button } from 'antd';
import { useMemo } from 'react';

// 【核心修复】把Form逻辑拆成独立子组件
// 只有当选中组件时，这个组件才会渲染，useForm和Form永远成对出现
const FormPanel = ({ 
  selectedComponent, 
  updateComponentProps, 
  deleteComponent 
}: {
  selectedComponent: any;
  updateComponentProps: (id: string, props: any) => void;
  deleteComponent: (id: string) => void;
}) => {
  // 【关键】useForm只在Form存在的时候才执行，实例永远有绑定的Form元素
  const [form] = Form.useForm();

  // 选中组件变化时，更新表单值
  Form.useWatch([], form);
  useMemo(() => {
    form.setFieldsValue(selectedComponent.props);
  }, [selectedComponent, form]);

  // 表单变化时，实时更新组件属性
  const handleValuesChange = (_changedValues: any, allValues: any) => {
    updateComponentProps(selectedComponent.id, allValues);
  };

  // 删除组件
  const handleDelete = () => {
    deleteComponent(selectedComponent.id);
  };

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
        当前选中：{selectedComponent.type}
      </p>
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        {/* 按钮组件配置 */}
        {selectedComponent.type === 'Button' && (
          <>
            <Form.Item label="按钮文字" name="children">
              <Input placeholder="请输入按钮文字" />
            </Form.Item>
            <Form.Item label="按钮类型" name="type">
              <Input placeholder="primary / default / dashed" />
            </Form.Item>
          </>
        )}

        {/* 输入框组件配置 */}
        {selectedComponent.type === 'Input' && (
          <Form.Item label="占位文字" name="placeholder">
            <Input placeholder="请输入 placeholder" />
          </Form.Item>
        )}

        {/* 文本组件配置 */}
        {selectedComponent.type === 'Text' && (
          <Form.Item label="文本内容" name="content">
            <Input.TextArea rows={4} placeholder="请输入文本内容" />
          </Form.Item>
        )}

        {/* 图片组件配置 */}
        {selectedComponent.type === 'Image' && (
          <Form.Item label="图片链接" name="src">
            <Input placeholder="请输入图片 URL" />
          </Form.Item>
        )}
      </Form>

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <Button danger block onClick={handleDelete}>
          删除该组件
        </Button>
      </div>
    </div>
  );
};

// 外层主组件
export const RightPanel = () => {
  const { components, selectedId, updateComponentProps, deleteComponent } = useEditorStore();
  
  // 找到当前选中的组件
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

  // 选中组件时，渲染FormPanel子组件
  return (
    <div style={{ padding: '20px' }}>
      <h3>属性配置</h3>
      <FormPanel
        selectedComponent={selectedComponent}
        updateComponentProps={updateComponentProps}
        deleteComponent={deleteComponent}
      />
    </div>
  );
};