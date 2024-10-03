import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react'; // Đảm bảo import React nếu chưa có
interface Props{
    isOpen: boolean;
    onCancel: () => void; // Truyền vào hàm đóng modal
    srcfile: string;
}

const VideoPlayer = (props: Props) => {
    const { isOpen, onCancel, srcfile } = props; // Truyền vào isOpen là giá trị true/false để hiển thị/ẩn modal
    const videoRef = useRef<HTMLVideoElement>(null);
     // Mỗi khi `srcfile` thay đổi, sẽ tải lại video
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();  // Tải lại video khi srcfile thay đổi
        }
    }, [srcfile]);
  return (
    <Modal open={isOpen} footer={null} onCancel={()=>{onCancel(); videoRef.current?.pause()}}>
        <div style={{marginTop:20}}>
            <video ref={videoRef} width="100%" controls={true} onLoadedData={() => console.log('Video loaded successfully')}
                onError={() => {console.log('Error loading video')}}>
                <source src={srcfile} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
        </div>
    </Modal>
  );
};

export default VideoPlayer;
