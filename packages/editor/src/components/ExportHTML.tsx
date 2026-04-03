// packages/editor/src/components/ExportHTML.tsx
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'; // 可选：加个下载图标，更好看
import { useEditorStore } from '../store';
import type { ComponentSchema } from '@lowcode/types';

// 【核心】把组件数据转换成 HTML 字符串的纯函数
const generateHTML = (components: ComponentSchema[]): string => {
  let htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>低代码导出页面</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      padding: 40px; 
      background-color: #f5f5f5;
    }
    .component-wrapper {
      margin-bottom: 16px;
      background: white;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto;">
`;

  // 遍历组件，生成对应的 HTML
  components.forEach(comp => {
    htmlContent += '<div class="component-wrapper">';
    
    if (comp.type === 'Button') {
      const btnText = comp.props.children || '按钮';
      const btnType = comp.props.type === 'primary' ? 'background: #1890ff; color: white; border: none;' : '';
      htmlContent += `<button style="padding: 8px 16px; border-radius: 4px; cursor: pointer; ${btnType}">${btnText}</button>`;
    }
    
    if (comp.type === 'Input') {
      const placeholder = comp.props.placeholder || '';
      htmlContent += `<input placeholder="${placeholder}" style="padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; width: 100%; box-sizing: border-box;" />`;
    }
    
    if (comp.type === 'Text') {
      const content = comp.props.content || '这是一段文本';
      htmlContent += `<p style="margin: 0; font-size: 14px; line-height: 1.5;">${content}</p>`;
    }
    
    if (comp.type === 'Image') {
      const src = comp.props.src || 'https://via.placeholder.com/200';
      htmlContent += `<img src="${src}" alt="图片" style="max-width: 100%; display: block;" />`;
    }

    htmlContent += '</div>';
  });

  htmlContent += `
  </div>
</body>
</html>`;

  return htmlContent;
};

// 【组件】导出 HTML 按钮
export const ExportHTML = () => {
  // 从 store 取数据
  const components = useEditorStore((state) => state.components);

  // 点击导出
  const handleClick = () => {
    const htmlContent = generateHTML(components);
    
    // 触发下载
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-page.html'; // 文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // 释放临时链接
  };

  return (
    <Button 
      type="primary" 
      icon={<DownloadOutlined />} 
      onClick={handleClick}
    >
      导出HTML
    </Button>
  );
};