// packages/types/src/index.ts
// 组件类型枚举，有什么组件就写什么，不多写
export type ComponentType = 'Button' | 'Input' | 'Text' | 'Image';

// 单个组件的完整结构
export interface ComponentSchema {
  id: string;       // 唯一ID，不会重复
  type: ComponentType; // 组件类型
  props: Record<string, any>; // 组件的属性
}

// 编辑器全局状态，有什么方法就写什么，不多写
export interface EditorState {
  components: ComponentSchema[]; // 画布上的所有组件
  selectedId: string | null;     // 当前选中的组件ID
  addComponent: (component: ComponentSchema) => void; // 新增组件
  setSelectedId: (id: string | null) => void;        // 设置选中
  updateComponentProps: (id: string, props: Record<string, any>) => void; // 修改属性
  deleteComponent: (id: string) => void; // 删除组件
   // 历史记录相关
  past: ComponentSchema[][];
  future: ComponentSchema[][];
  pushHistory: () => void;
  undo: () => void; // 撤销
  redo: () => void; // 重做
  reorderComponents: (oldIndex: number, newIndex: number) => void; // 排序
}
