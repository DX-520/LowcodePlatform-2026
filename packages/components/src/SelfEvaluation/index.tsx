// 六步走啊
// 第一步：type的componentType里加上SelfEvaluation
// 第二步：在LeftPanel里的componentList里加上SelfEvaluation
// 第三步：制作render
import type { ComponentSchema} from '@lowcode/types'
const render = ( comp: ComponentSchema ) => {
    const { title , content } = comp.props
    return(
        <div>
            <h2 style={{ borderBottom : '1px solid #eee'}}>{ title || '自我评价'}</h2>
            <div>{ content || '自我评价内容'}</div>
        </div>
    )
}
import type { PropDef } from '..'
const propDefs : PropDef[] = [
    { name: 'title' , label : '自我评价' , type : 'Input'},
    { name: 'content' , label : '内容' , type : 'Input.TextArea'},
]
// 第五步：导出
import type { ComponentModule } from '..'
export const SelfEvaluationModule : ComponentModule = {
    render,
    propDefs
}