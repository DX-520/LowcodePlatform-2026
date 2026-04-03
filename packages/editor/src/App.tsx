// packages/editor/src/App.tsx
import { Layout, Button, Space, Modal } from 'antd';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { LeftPanel } from './components/LeftPanel';
import { Canvas } from './components/Canvas';
import { useEditorStore } from './store';
import type { ComponentType } from '@lowcode/types';
import { RightPanel } from './components/RightPanel';
import { useState } from 'react';
import { useEffect } from 'react';
import { CanvasPreview } from './components/CanvasPreview';
import { ExportHTML } from './components/ExportHTML'; 

const { Header, Sider, Content, Footer } = Layout;

function App() {
  // 【修复】只取简化版 Store 里有的方法
  const { addComponent, components,undo, redo , reorderComponents } = useEditorStore();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z 撤销
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Shift+Z 或 Ctrl+Y 重做
      if (((e.ctrlKey || e.metaKey) && (e.key === 'z'||e.key === 'Z') && e.shiftKey) || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

     const activeId = active.id as string;
    const overId = over.id as string;


    // 【逻辑分支 1】如果是在画布内部排序 (activeId 是组件 ID)
    if (activeId !== overId && components.find((c) => c.id === activeId)) {
      const oldIndex = components.findIndex((c) => c.id === activeId);
      const newIndex = components.findIndex((c) => c.id === overId);
      reorderComponents(oldIndex, newIndex);
      return;
    }


    // 【逻辑分支 2】如果是从左侧面板拖进来新组件 (原来的逻辑)
    if (over.id === 'canvas-drop-zone' && activeId.startsWith('drag-')) {
      const type = active.data.current?.type as ComponentType;
      if (type) {
        const newComponent = {
          id: `${type}-${Date.now()}`,
          type: type,
          props: {},
        };
        addComponent(newComponent);
      }
    }
  };

  // 导出 HTML
  // const handleExportHTML = () => {
  //   const currentComponents = useEditorStore.getState().components;
  //   let htmlContent = '<!DOCTYPE html><html><head><style>body { font-family: sans-serif; padding: 20px; }</style></head><body>';
    
  //   currentComponents.forEach(comp => {
  //     if (comp.type === 'Button') {
  //       htmlContent += `<button style="padding: 8px 16px;">${comp.props.children || '按钮'}</button><br/><br/>`;
  //     }
  //     if (comp.type === 'Input') {
  //       htmlContent += `<input placeholder="${comp.props.placeholder || ''}" style="padding: 8px; width: 200px;" /><br/><br/>`;
  //     }
  //     if (comp.type === 'Text') {
  //       htmlContent += `<p>${comp.props.content || ''}</p>`;
  //     }
  //     if (comp.type === 'Image') {
  //       htmlContent += `<img src="${comp.props.src || 'https://via.placeholder.com/200'}" style="max-width: 300px;" /><br/><br/>`;
  //     }
  //   });
    
  //   htmlContent += '</body></html>';
  //   const blob = new Blob([htmlContent], { type: 'text/html' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'index.html';
  //   a.click();
  // };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>我的低代码编辑器</h2>
          <Space>
            <Button onClick={undo}>撤销 (Ctrl+Z)</Button>
            <Button onClick={redo}>重做 (Ctrl+Y)</Button>
            <Button onClick={() => setIsPreviewModalOpen(true)}>预览</Button>
            {/* <Button onClick={handleExportHTML}>导出HTML</Button> */}
            <ExportHTML />
          </Space>
        </Header>

        <Layout>
          <Sider width={250} theme="light">
            <LeftPanel />
          </Sider>

          <Content style={{ 
            padding: '20px', 
            background: '#e8e8e8', 
            overflow: 'auto', 
            height: 'calc(100vh - 64px - 200px)' 
          }}>
            <Canvas />
          </Content>

          <Sider width={300} theme="light">
             <RightPanel />
          </Sider>
        </Layout>

        <Footer style={{ background: '#141414', padding: '10px 20px', height: '200px', overflow: 'auto' }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>Schema JSON (调试用):</h4>
          <pre style={{ color: '#52c41a', fontSize: '12px', margin: 0 }}>
            {JSON.stringify(components, null, 2)}
          </pre>
        </Footer>

        {/* 【修复】预览逻辑直接写在这里，不引用单独的 CanvasPreview 文件 */}
        <Modal
          title="页面预览"
          open={isPreviewModalOpen}
          onCancel={() => setIsPreviewModalOpen(false)}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          {/* <div style={{ padding: '20px', minHeight: '400px' }}>
            {components.map((comp) => {
              if (comp.type === 'Button') {
                return <div key={comp.id} style={{ marginBottom: '16px' }}><button style={{ padding: '8px 16px' }}>{comp.props.children || '按钮'}</button></div>;
              }
              if (comp.type === 'Input') {
                return <div key={comp.id} style={{ marginBottom: '16px' }}><input placeholder={comp.props.placeholder || '输入框'} style={{ padding: '8px', width: '200px' }} /></div>;
              }
              if (comp.type === 'Text') {
                return <div key={comp.id} style={{ marginBottom: '16px' }}><p>{comp.props.content || '这是一段文本'}</p></div>;
              }
              if (comp.type === 'Image') {
                return <div key={comp.id} style={{ marginBottom: '16px' }}><img src={comp.props.src || 'https://via.placeholder.com/200'} alt="预览" style={{ maxWidth: '300px' }} /></div>;
              }
              return null;
            })}
          </div> */}
          <CanvasPreview />
        </Modal>
      </Layout>
    </DndContext>
  );
}

export default App;