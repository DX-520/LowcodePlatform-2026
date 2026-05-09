import { useEditorStore } from '../store'


export const DebugPanel = () => {
    // 这句话没读懂
    // 只订阅state.components
    const components = useEditorStore( (state) => state.components )
    // 为什么要加一个（）在return后面？
    return  (
        // <pre>标签是啥？之前都没见过。
        // style为什么要用两个{}{}？
        // 为什么属性都要加上引号啊？
        // 0又不加引号了？
        <pre style= {{color:'#52c41a',fontSize:'12px',margin:0}}>
            {/* 为什么是JSON.stringify?以及它是怎么用的？这一句话是什么意思？ */}
            {JSON.stringify(components, null, 2)}
        </pre>
    )
}