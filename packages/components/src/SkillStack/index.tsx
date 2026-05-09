import type { ComponentSchema } from "@lowcode/types";
import type { ComponentModule } from "../index";
import type { PropDef } from "../index";

const render = ( comp : ComponentSchema) => {
    const { title , items } = comp.props
    return (
        <div>
            {/* 顶部：标题加灰色下划线 */}
            <h2 style = {{ borderBottom : '1px solid #eee'}}>{ title || '核心技术栈' }</h2>
            {/* 内容 */}
            <div>
                <ul>
                    {items &&  items.map((item : any , index : number) => (
                        <li key={index}>
                            <span style={{fontWeight:'bold'}}>{item.name + ':'}</span>
                            {item.desc && <span>{item.desc}</span>}
                        </li>
                    )
                    )}
                </ul>
            </div>
        </div>
    )
 }

 const propDefs : PropDef [] = [
    {
    name: 'title',
    label: '模块标题',
    type: 'Input',
    placeholder: '核心技术栈'
  },
  {
    name: 'items',
    label: '技能列表',
    type: 'DynamicList',
    itemFields: [
      { name: 'name', label: '技术名称', type: 'Input', placeholder: '如 React' },
      { name: 'desc', label: '描述', type: 'Input', placeholder: '如 熟练掌握' }
    ]
  }
 ]

 export const SkillStackModule : ComponentModule = {
    render,
    propDefs
 }