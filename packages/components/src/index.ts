import type { ComponentSchema } from '@lowcode/types'
import type { ReactElement } from 'react'
import { PersonalInfoModule } from './PersonalInfo'
import { SkillStackModule } from './SkillStack'
import { InternshipModule } from './InternShip'
import { ProjectModule } from './Project'
import { SelfEvaluationModule } from './SelfEvaluation'

export interface PropDef {
    name:string,
    label:string,
    type: 'Input' | 'Input.TextArea' | 'Upload' | 'DynamicList',
    placeholder?:string //问号何意味
    itemFields?: Array <{
        name: string
        label:string
        type: 'Input' | 'Input.TextArea'
        placeholder?:string
    }>
}

export interface ComponentModule {
    render: (comp: ComponentSchema ) => ReactElement | null
    propDefs?: PropDef[]
}
export const componentRegistry: Record<string,ComponentModule> = {
    PersonalInfo : PersonalInfoModule ,
    SkillStack : SkillStackModule,
    Internship : InternshipModule,
    Project : ProjectModule,
    SelfEvaluation : SelfEvaluationModule
}