import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportPDF = async (element: HTMLElement, fileName: string = 'resume.pdf') => {
  // 1. 把 A4 纸区域截成图片
  // await new Promise(r => setTimeout(r, 200));
  const canvas = await html2canvas(element, {
    scale: 2,           // 2倍清晰度
    useCORS: true,      // 支持跨域图片（头像链接）
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 宽 210mm
//   const imgWidth = 200; // A4 宽 210mm
  const pageHeight = 297; // A4 高 297mm
//   const pageHeight = 400; // A4 高 297mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // 2. 创建 PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  let heightLeft = imgHeight;
  let position = 0;

  // 3. 添加第一页
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // 4. 内容超过一页时自动分页
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    // pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // 5. 下载
  pdf.save(fileName);
};