// 这个文件是用来？
// 1.画布上组件的样子
// 2.属性面板的样子
// 第一步怎么写？或者说第一步我要做什么？
// 第一步写出render函数来。
// 先把HTML结构先出来
import type { ComponentSchema } from '@lowcode/types'

const render = ( comp : ComponentSchema ) => {
    const { title , startDate , endDate , company ,position , works} = comp.props
    const safeWorks = works || [];
    return(
        // 最外层容器
        <div>
            {/* 标题 */}
            {/* 这里意识到需要把组件的数据传进来。组件的数据是什么呢？ */}
            {/* 1.我去了type里加了Internship,又去LeftPanel里componentList加上了Internship */}
            {/* 我得去App.tsx里面去看看 */}
            {/* 这时候确实是把组件拖进了画布里，只有type:Internship这一个信息 ，app.tsx里加上了id*/}
            {/* 现在去canvas里面看看 */}
            {/* 1.靠componentRegistry[comp.type]找到组件模型 */}
            {/* 2.return module.render(comp);再靠这个渲染出来 */}
            {/* 其实到这里我知道了传经来的是comp也就是整个组件 */}
            {/* 可是组件现在什么都没有，我要怎么给组件加上属性呢？ */}
            {/* 这一步其实有点卡到了，我去看看之前的组件 */}
            {/* 直接从comp.props里面传进来的 */}
            {/* comp.props是从哪里来的呢？ */}
            {/* 加的时候是空白的{}呀。在app.tsx里的时候。这里确实疑惑 */}
            <h2 style = {{ borderBottom : '1px solid #eee'}}>{ title || '实习经历' }</h2>
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
                <div>{ company || '公司名称'}</div>
                {/* 职位 */}
                <div>{ position || '职位'}</div>
            </div>
            {/* 第三个模块：工作内容 */}
            <ul>
            { safeWorks.map( (work : any , index : number)  => (
                // 这里是开启flex布局，一个就够了
                <li  key={ index}> 
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
// 那第一步先告一段落了
// 现在开始第二步了
// 写上propDefs
// 其实我想直到为什么要写上propDefs
// 我知道这个的作用是让属性面板长什么样子
// propDefs成了遍历的目标
// 不同的type显示不同的样子
// 来吧
import type{ PropDef } from '../index'
const propDefs : PropDef []= [
    {name : 'title' ,label  : '实习经历' , type : 'Input' },
    {name : 'company' ,label  : '公司名称' , type : 'Input' },
    {name : 'startDate' ,label  : '开始时间' , type : 'Input' },
    {name : 'endDate' ,label  : '结束时间' , type : 'Input' },
    {name : 'position' ,label  : '职位名称' , type : 'Input' ,placeholder : '前端开发实习生' },
    {name : 'works' ,label  : '工作内容' , type : 'DynamicList',
        itemFields : [
         { name : 'workName' , label : '工作名称' , type : 'Input' },
         { name : 'workDesc' , label : '工作描述' , type : 'Input' },
        ]
     },
]
    

// 这个就真的是乱写的
// 第三步：导出
import type { ComponentModule } from '../index'
export const  InternshipModule : ComponentModule = {
    render,
    propDefs
}
// 第四步引入类型以及补充类型
// 唉，迷茫呀。
// 唉，懵逼呀
// 觉得写的挺好的，也写了快3小时了
// 补个样式就可以了，现在把样式补起来
// 第五步
// 可以了就调了一下布局就可以用了