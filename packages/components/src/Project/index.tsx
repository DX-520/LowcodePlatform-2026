// 项目经历
// 第一步：在type里的ComponentType加上Project类型
// 第二步：在leftpanel里的ComponentsList里加上Project
// 第三步：写render函数
// 这里直接引入组件类型
import type { ComponentSchema } from "@lowcode/types"
const render = ( comp : ComponentSchema) => {
    // 这里是引入数据，在这之前我写吧propDefs写上，方便观看，提前进入第四步
    // 这里也是直接把实习经历复制过来稍作修改
    const { title , startDate , endDate , project ,position , works} = comp.props
    const safeWorks = works || [];
    return(
        // 最外层容器
        <div>
            {/* 标题 */}
         
            <h2 style = {{ borderBottom : '1px solid #eee'}}>{ title || '项目经历' }</h2>
            {/* 第二个模块：时间，公司名称，职位 */}
            {/* 这里三个模块是在一行的，左中右分布。用flex布局吧 */}
            <div style={{ display: 'flex', justifyContent : 'space-between'}}>
                {/* 开始以及结束时间 */}
                {/* 这里也是 */}
                <div style={{ display: 'flex', justifyContent : 'space-between'}}>
                    <div>{ startDate || '开始时间'}</div>
                    ---
                    <div>{ endDate || '结束时间'}</div>
                </div>
                {/* 公司名称 */}
                <div>{ project || '公司名称'}</div>
                {/* 职位 */}
                <div>{ position || '职位'}</div>
            </div>
            {/* 第三个模块：工作内容 */}
            <ul>
            { safeWorks.map( (work : any , index : number)  => (
                // 这里是开启flex布局，一个就够了
                <li key={ index }> 
                    {/* 工作名称 */}
                    {work.workName || '工作名称'}
                    ：
                    {/* 工作描述 */}
                    {work.workDesc || '工作描述'}
                </li>
            ))}

            </ul>
            {/* 至此HTML节点写完了，剩下的就是样式了 */}
        </div>
    )
}
// 第四步：写props
// 直接把实习经历的propsDefs复制过来
import type{ PropDef } from '../index'
const propDefs : PropDef []= [
    {name : 'title' ,label  : '项目经历' , type : 'Input' },
    {name : 'project' ,label  : '项目名称' , type : 'Input' },
    {name : 'startDate' ,label  : '开始时间' , type : 'Input' },
    {name : 'endDate' ,label  : '结束时间' , type : 'Input' },
    {name : 'position' ,label  : '职责' , type : 'Input' ,placeholder : '前端开发' },
    {name : 'works' ,label  : '工作内容' , type : 'DynamicList',
        itemFields : [
         { name : 'workName' , label : '工作名称' , type : 'Input' },
         { name : 'workDesc' , label : '工作描述' , type : 'Input' },
        ]
     },
]
// 第五步导出：也是直接复制过来
import type { ComponentModule } from '../index'
export const  ProjectModule : ComponentModule = {
    render,
    propDefs
}
// 第六步就是注册就好了