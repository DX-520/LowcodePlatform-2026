import type { ComponentSchema } from '@lowcode/types'
import type { ComponentModule , PropDef } from '../index'

const render: ComponentModule['render'] = (comp : ComponentSchema) => {
  const { personalInfoTitle ,avatar, name, title, startTime, workDays, age, phone, email } = comp.props;

  return (

   
    <div>
         {/* 标题 */}
         <h2 style = {{ borderBottom : '1px solid #eee'}}>{personalInfoTitle || '个人基本信息'}</h2>
        <div style={{
            display: 'flex',
            alignItems: 'center', // 垂直居中
            justifyContent: 'space-between', // 空间自然分开
            padding: '5px 0', // 纯白背景，不需要背景色
            width: '100%'
            }}>
            
            {/* 左侧：方形头像 */}
            {/* <div style={{ flexShrink: 0, marginRight: '24px' }}>
                {avatar ? (
                <img src={avatar} alt="头像"
                    style={{
                    width: 120, height: 120,
                    objectFit: 'cover',
                    display: 'block'
                    }}
                />
                ) : (
                <div style={{
                    width: 80, height: 80,
                    background: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ccc', fontSize: '12px'
                }}>
                    暂无
                </div>
                )}
            </div> */}
            {/* {avatar ? (
                        <div 
                        id="resume-avatar"
                        style={{
                            width: 120,
                            height: 120,
                            backgroundImage: `url(${avatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0,
                            marginRight: '24px',
                            imageRendering: 'auto' as any,
                            
                        }} />
                        ) : (
                        <div style={{
                            width: 120, height: 120,
                            background: '#f0f0f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ccc', fontSize: '12px',
                            flexShrink: 0,
                            marginRight: '24px',
                        }}>
                            暂无
                        </div>
            )} */}

            <div style={{
                width: 120, height: 120,
                flexShrink: 0,
                marginRight: '24px',
                overflow: 'hidden',       // 裁掉多余部分
                borderRadius: '0px',      // 你之前是方形
                }}>
                {avatar ? (
                    <img
                    src={avatar}
                    alt="头像"
                    style={{
                        // width: '100%',
                        height: '100%',
                        objectFit: 'cover',  // 确保填满且不变形
                        display: 'block',
                        overflow: 'hidden'
                    }}
                    />
                ) : (
                    <div style={{
                    width: '100%', height: '100%',
                    background: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ccc', fontSize: '12px'
                    }}>
                    暂无
                    </div>
                )}
                </div>
            {/* 中间：姓名、意向职位等 */}
            <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
                {name || '未填写姓名'}
                </h2>
                <div style={{ display: 'flex', flexDirection:'column' , gap: '5px', color: '#555', fontSize: '14px' }}>
                {/* <span>{title || '意向职位'}</span> */}
                <span>{'意向职位:'+title}</span>
                {/* <span>{startTime || '最快到岗'}</span> */}
                <span>{'最快到岗:'+startTime}</span>
                {/* <span>{workDays || '一周几天'}</span> */}
                <span>{ '一周几天:'+workDays}</span>
                </div>
            </div>

            {/* 右侧：年龄、电话、邮箱（值在上、标签在下） */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection:'column', gap: '5px', textAlign: 'center' }}>
                <div style={{display: 'flex'}}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>{age || '--'}</div>
                <div style={{ fontSize: '16px', color: '#999' }}>年龄</div>
                </div>
                <div style={{display: 'flex'}}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>{phone || '--'}</div>
                <div style={{ fontSize: '16px', color: '#999' }}>电话</div>
                </div>
                <div style={{display: 'flex'}}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>{email || '--'}</div>
                <div style={{ fontSize: '16px', color: '#999' }}>邮箱</div>
                </div>
            </div>

            </div>
    </div>
   
  );
};

const propDefs : PropDef[] = [
    { name: 'personalInfoTitle' , label: '基本信息模块标题' ,type : 'Input' , placeholder:'基本信息标题'},
    { name: 'name', label: '姓名', type: 'Input', placeholder: '你的姓名' },
    { name: 'title', label: '意向职位', type: 'Input', placeholder: '前端开发工程师' },
    { name: 'startTime', label: '最快到岗时间', type: 'Input', placeholder: '随时 / 一周内' },
    { name: 'workDays', label: '一周几天', type: 'Input', placeholder: '5天 / 4天' },
    { name: 'age', label: '年龄', type: 'Input', placeholder: '你的年龄' },
    { name: 'phone', label: '电话', type: 'Input', placeholder: '手机号码' },
    { name: 'email', label: '邮箱', type: 'Input', placeholder: 'example@email.com' },
    { name: 'avatar', label: '头像', type: 'Upload', placeholder: '点击上传头像' },
]

export const PersonalInfoModule : ComponentModule = {
    render,
    propDefs
}