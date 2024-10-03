
import { Modal } from 'antd';
import React, {useRef, useState} from 'react'; // Đảm bảo import React nếu chưa có
import ReactPlayer from 'react-player';
interface Props{
    isOpen: boolean;
    onCancel: () => void; // Truyền vào hàm đóng modal
    srcfile: string;
}
const VideoPlayerReact = (props: Props) => {
    const { isOpen, onCancel, srcfile} = props; // Truyền vào isOpen là giá trị true/false để hiển thị/ẩn modal
    const videoRef = useRef<ReactPlayer>(null);
  return (
    <Modal open={isOpen} title={'Trình phát Vieo'} footer={null} onCancel={()=>onCancel()} destroyOnClose={true}>
        <div style={{marginTop:15}}>
            <ReactPlayer
              ref={videoRef}
              url={srcfile}
              controls
              height= {300}
              width="100%"/>
        </div>
    </Modal>
  );
};

export default VideoPlayerReact;
