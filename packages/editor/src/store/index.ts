// packages/editor/src/store/index.ts
import { create } from 'zustand';
import type { EditorState, ComponentSchema } from '@lowcode/types';
import { arrayMove } from '@dnd-kit/sortable';


// 撤销功能

interface HistoryState {
  past: ComponentSchema[][]; // 过去的状态
  future: ComponentSchema[][]; // 未来的状态（用于重做）
}


export const useEditorStore = create<EditorState  & HistoryState>((set, get) => ({
  // 初始数据
  components: [],
  selectedId: null,
   past: [], // 历史栈
  future: [], // 未来栈


  // 【核心】把当前状态推入历史栈的辅助函数
  pushHistory: () => {
    const { components, past } = get();
    set({
      past: [...past, [...components]], // 保存当前状态的副本
      future: [], // 只要有新操作，就清空未来栈
    });
  },

  // 撤销
  undo: () => {
    const { past, components } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      components: previous,
      past: newPast,
      future: [components, ...get().future],
      selectedId: null,
    });
  },

  // 重做
  redo: () => {
    const { future, components } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      components: next,
      past: [...get().past, components],
      future: newFuture,
      selectedId: null,
    });
  },
  // 1. 新增组件
  addComponent: (component) => {
     get().pushHistory(); // 【新增】操作前先记录历史
    set((state) => ({
      components: [...state.components, component]
    }));
  },

  // 2. 设置选中的组件
  setSelectedId: (id) => {
    set({ selectedId: id });
  },

  // 3. 修改组件的属性
  updateComponentProps: (id, props) => {
     get().pushHistory(); // 【新增】操作前先记录历史
    set((state) => ({
      components: state.components.map((comp) => {
        if (comp.id === id) {
          return { ...comp, props: { ...comp.props, ...props } };
        }
        return comp;
      })
    }));
  },

  // 4. 删除组件
  deleteComponent: (id) => {
     get().pushHistory(); // 【新增】操作前先记录历史
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // 5. 排序  
   reorderComponents: (oldIndex: number, newIndex: number) => {
    get().pushHistory(); // 排序也要记录历史，支持撤销
    set((state) => ({
      components: arrayMove(state.components, oldIndex, newIndex),
    }));
  },
}));
