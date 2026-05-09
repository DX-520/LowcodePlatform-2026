import { Form , Input , Button } from 'antd'
import { useEffect , useRef} from 'react'
import type { PropDef } from '@lowcode/components'


const UploadInput = ({ onChange, placeholder }: { onChange: (value: string) => void; placeholder?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        onChange(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Button onClick={() => inputRef.current?.click()}>{placeholder || '上传文件'}</Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

const DynamicListEditor = ({ label, value, itemFields, onChange }: {
  label: string;
  value: any[];
  itemFields: Array<{ name: string; label: string; type: 'Input' | 'Input.TextArea'; placeholder?: string }>;
  onChange: (newValue: any[]) => void;
}) => {
  // ✅ 防御性代码：确保 value 是数组
  const safeValue = Array.isArray(value) ? value : [];

  // 添加一行
  const handleAdd = () => {
    const newItem: any = {};
    itemFields.forEach((f) => { newItem[f.name] = ''; });
    onChange([...safeValue, newItem]);
  };

  // 删除一行
  const handleDelete = (index: number) => {
    const newValue = safeValue.filter((_, i) => i !== index);
    onChange(newValue);
  };

  // 修改某行某个字段
  const handleItemChange = (index: number, fieldName: string, fieldValue: string) => {
    const newValue = safeValue.map((item, i) => {
      if (i === index) {
        return { ...item, [fieldName]: fieldValue };
      }
      return item;
    });
    onChange(newValue);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 8, fontWeight: 500 }}>{label}</div>
      {safeValue.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          {itemFields.map((f) => (
            <div key={f.name} style={{ flex: 1 }}>
              {f.type === 'Input.TextArea' ? (
                <Input.TextArea
                  placeholder={f.placeholder}
                  value={item[f.name]}
                  onChange={(e) => handleItemChange(idx, f.name, e.target.value)}
                  rows={2}
                />
              ) : (
                <Input
                  placeholder={f.placeholder}
                  value={item[f.name]}
                  onChange={(e) => handleItemChange(idx, f.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <Button danger size="small" onClick={() => handleDelete(idx)}>删除</Button>
        </div>
      ))}
      <Button type="dashed" block onClick={handleAdd}>+ 添加</Button>
    </div>
  );
};

interface DynamicFromProps {
    propDefs : PropDef[]
    currentProps : Record<string,any>
    onPropsChange :(newProps: Record<string,any>) => void
}
export const DynamicForm = ({propDefs , currentProps , onPropsChange} : DynamicFromProps) => {
    const [form] = Form.useForm()

    useEffect( () => {
        form.setFieldsValue(currentProps)
    },[currentProps,form])

    const handleValuesChange = (_changed: any , allValues:any) => {
        onPropsChange(allValues)
    }

    return(
        <Form form={form} layout = "vertical" onValuesChange={handleValuesChange}>
            {propDefs.map( (def) => (
                <Form.Item key={def.name} label={def.label} name={def.name}>
                    {def.type === 'DynamicList' ? (
                        <DynamicListEditor
                            key={def.name}
                            label={def.label}
                            value={currentProps[def.name] || []}
                            itemFields={def.itemFields || []}
                            onChange={(newItems) => {
                            onPropsChange({ ...currentProps, [def.name]: newItems });
                            }}
                        />
                        ):def.type === 'Upload' ? (
                        <UploadInput
                            onChange={(value) => onPropsChange({ ...currentProps, [def.name]: value })}
                            placeholder={def.placeholder}
                        />
                        ) : def.type === 'Input.TextArea' ? (
                        <Input.TextArea rows={3} placeholder={def.placeholder} />
                        ) : (
                        <Input placeholder={def.placeholder} />
                        )}
                </Form.Item>
            ))}
        </Form>
    )
}