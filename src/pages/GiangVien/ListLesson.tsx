import { ClockCircleOutlined, DeleteOutlined, EditOutlined, FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Flex, List, Row } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "~/constants/constant";
import { v4 as uuidv4 } from "uuid";
import VideoPlayerReact from "./VideoReactPlayer";
import VideoPlayer from "./VideoPlayer";
function ListLesson() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpenVideoPlayer, setIsOpenVideoPlayer] = useState(false);
    const {id, idGV, thumbnail} = location.state;
    const [dataListLesson, setDataListLesson] = useState<any[]>([]);
    const [selectKhoahoc, setSelectKhoahoc] = useState(''); //Lưu lại bài gảng đã chọn
    const getdataListLesson = async (courseid: string)=>{
        try{
            const response = await axios.get(`${API_URL}lesson/getlesson/${courseid}`);
            setDataListLesson(response.data);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getdataListLesson(id);
    },[]);
    return ( 
        <div style={{ padding: '20px' }}>
      <Card title={<Flex justify="space-between"><span>Danh sách các bài giảng</span> 
      <Button type="primary" style={{backgroundColor:"#47d36b"}} onClick={()=>navigate('/giangvien/listcourse',{replace: true})}>Quay lại</Button></Flex>} 
      bordered={false} style={{ width: '100%' }}>
        <List
          itemLayout="horizontal"
          dataSource={dataListLesson}
          renderItem={item => (
            <List.Item>
                <Row gutter={3} style={{width:'100%'}}>
                    <Col span={12}>
                        <List.Item.Meta
                        // avatar={<video width={120} height={67} src={`${API_URL}lesson/getvideo/cf36be92-87fa-4984-8438-9172ba764559/1727602346904.mp4`} autoPlay  muted></video>                }
                        // avatar = {<img alt='thumbail' height={67} style={{objectFit:"cover", borderRadius:10, backgroundColor:"red"}} width={120} src={`${API_URL}course/thumbail/${idGV}/${thumbnail}`} />}
                        avatar = {<img alt='thumbail' height={67} style={{objectFit:"cover", borderRadius:10, backgroundColor:"red"}} width={120} src={`${API_URL}lesson/getimage/${item.lessonid}/${item.image}`} 
                        onClick={()=>{
                            if(item.filevideo!==''){//Nếu filevideo khác rỗng lấy file video
                                setSelectKhoahoc(`${API_URL}lesson/getvideo/${item.lessonid}/${item.filevideo}`);
                            }else{setSelectKhoahoc(item.videourl);} // Nếu rỗng thì lấy file url
                            setIsOpenVideoPlayer(true);
                        }}/>  }
                        
                        title={<span >{item.title}</span>}
                        description={item.content}/></Col>

                    <Col span={2}><span style={{fontSize:12}}><ClockCircleOutlined /> thời gian</span></Col>

                    <Col span={5}><Flex wrap gap={4}>
                            {item.tailieu.split(', ').map((itemT:any)=>{
                                if(itemT.includes('.docx')){
                                    return(<Button icon={<FileWordOutlined style={{color:"#2A5697"}} />} type="text" shape="circle"
                                          key={`${uuidv4()}doc1`} onClick={()=>{
                                              navigate('/preview',{state: {wordFileUrl: `${API_URL}lesson/gettailieu/${item.lessonid}/${itemT}`}})
                                          }}></Button>)
                                  }else if(itemT.includes('.doc')){
                                          return <Button icon={<FileWordOutlined />} type="link" shape="circle"
                                          key={`${uuidv4()}pdf`} href={`${API_URL}lesson/gettailieu/${item.lessonid}/${itemT}`} target="_blank"></Button>
                                  }else{
                                    return <Button icon={<FilePdfOutlined style={{color:"#E30809"}} />} type="link" shape="circle"
                                    key={`${uuidv4()}pdf`} href={`${API_URL}lesson/gettailieu/${item.lessonid}/${itemT}`} target="_blank"></Button>
                                  }
                            })}
                    </Flex></Col>

                    <Col span={5}>
                        <Flex wrap gap={4} justify="center" >
                            <Button icon={<EditOutlined />} shape="circle"></Button>
                            <Button icon={<DeleteOutlined />} shape="circle"></Button>
                    </Flex></Col>
                </Row> 
            </List.Item>
          )}
        />
      </Card>
      {/* {selectKhoahoc && <VideoPlayer srcfile={selectKhoahoc} isOpen={isOpenVideoPlayer} onCancel={()=>setIsOpenVideoPlayer(false)} />} */}
      {selectKhoahoc && <VideoPlayerReact srcfile={selectKhoahoc} isOpen={isOpenVideoPlayer} onCancel={()=>setIsOpenVideoPlayer(false)} />}

    </div>
     );
}

export default ListLesson;