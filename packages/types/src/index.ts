// packages/types/src/index.ts
// 组件类型枚举，有什么组件就写什么，不多写
// 注意：这里保留通用类型是为了兼容已保存的本地数据，左侧面板已删除通用组件入口
export type ComponentType = 'Button' | 'Input' | 'Text' | 'Image' | 'Title' | 'PersonalInfo' | 'SkillStack' | 'Internship' | 'Project' | 'SelfEvaluation';

// 单个组件的完整结构
export interface ComponentSchema {
  id: string,       
  type: ComponentType, 
  props: Record<string, any>,
}


export interface EditorState {
  components: ComponentSchema[]; 
  selectedId: string | null;     
  // 历史
  // 不知道为什么要这样写
  past: ComponentSchema[][];
  // 未来
  future: ComponentSchema[][];
  addComponent: (component: ComponentSchema) => void; 
  setSelectedId: (id: string | null) => void;       
  updateComponentProps: (id: string, props: Record<string, any>) => void; 
  deleteComponent: (id: string) => void; // 删除组件
  pushHistory: () => void;
  reorderComponents: (oldIndex: number, newIndex: number) => void; 
  // 撤销
  // 也是不知道这是什么意思
  undo: ()=> void;
  // 重做
  redo: ()=> void;
}
