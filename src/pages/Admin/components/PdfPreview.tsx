import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
interface Props {
    pdfUrl: string;
}
function PDFViewer(props: Props) {
    const {pdfUrl} = props;
    
    // Khởi tạo plugin default layout
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    //thay đổi kích thước
    const zoomPluginInstance = zoomPlugin();
    useEffect(() => {
      // Sau khi tài liệu được tải, đặt tỷ lệ phóng to mặc định là 170%
      zoomPluginInstance.zoomTo(1.5);
    }, [zoomPluginInstance]);
  return (
    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
      <div style={{ height: '750px', width: '100%' }}>
        {/* sử dụng plugin  */}
        <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}/>
      </div>
    </Worker>
  );
}

export default PDFViewer;
