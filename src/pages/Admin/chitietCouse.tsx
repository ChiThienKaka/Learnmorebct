import { Button, Card, Flex, Table, Tag, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "~/constants/constant";
import { v4 as uuidv4} from "uuid";
import { CaretRightOutlined, FilePdfOutlined, FileWordOutlined, PlayCircleOutlined } from "@ant-design/icons";
import VideoPlayerReact from "../GiangVien/VideoReactPlayer";
const ChitietCourse= () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dataLesson, setDataLesson] = useState<any[]>([]);
    const [isOpenVideoPlayer, setIsOpenVideoPlayer] = useState(false);//Mở trình duyệt phát video
    const [selectKhoahoc, setSelectKhoahoc] = useState(''); //Lưu lại bài gảng đã chọn
    //Lấy dữ liệu bài giảng từ id truyền vào
    const getLessonByCourseid = async (courseid: string)=>{
        try{const response = await axios.get(`${API_URL}lesson/getlesson/${courseid}`);
            setDataLesson(response.data);
        }catch(error){console.log(error);}
    }
    useEffect(()=>{
        getLessonByCourseid(location.state);
    },[])
    const columns = [
        // Đây là cột 1 
        { title: 'Bài giảng', dataIndex: 'title', key: 'title', render: (text:any, record:any)=>{return <>
            <Flex gap={8} align="center" style={{width:'100%'}}>
                <Flex>
                    <img alt="thumbnail" width={120} height={67} style={{objectFit:"cover", borderRadius:8}}
                    src={`${API_URL}lesson/getimage/${record.lessonid}/${record.image}`} />
                </Flex>
                <Flex vertical gap={1}>
                    <div><span style={{fontWeight:"bold"}}>{text}</span></div>
                    <div><span>{record.content}</span></div>
                    <div><Flex wrap align="center">
                            <span style={{fontWeight:"bold", color:"#6e6e6e"}}>Tài liệu:</span>
                            {record.tailieu.split(', ').map((itemT:any)=>{
                                if(itemT.includes('.docx')){
                                    return(<Button icon={<FileWordOutlined style={{color:"#2A5697"}} />} type="text" shape="circle"
                                          key={`${uuidv4()}doc1`} onClick={()=>{
                                              navigate('/preview',{state: {wordFileUrl: `${API_URL}lesson/gettailieu/${record.lessonid}/${itemT}`}})
                                          }}></Button>)
                                  }else if(itemT.includes('.doc')){
                                          return <Button icon={<FileWordOutlined />} type="link" shape="circle"
                                          key={`${uuidv4()}pdf`} href={`${API_URL}lesson/gettailieu/${record.lessonid}/${itemT}`} target="_blank"></Button>
                                  }else{
                                    return <Button icon={<FilePdfOutlined style={{color:"#E30809"}} />} type="link" shape="circle"
                                    key={`${uuidv4()}pdf`} href={`${API_URL}lesson/gettailieu/${record.lessonid}/${itemT}`} target="_blank"></Button>
                                  }
                            })}
                    </Flex></div>
                </Flex>     
            </Flex></>}},


        // Đây là cột 2
        { title: 'Phát video',width:'10%', dataIndex: 'idlesson', key: 'idlesson', render: (text:any,record:any)=>{
            return <Flex wrap justify="center"><Tooltip title={'Trình chiếu video'}><Button type="primary" style={{backgroundColor:"#47c36b"}} 
            shape="circle" icon={<CaretRightOutlined />} onClick={()=>{
                if(record.filevideo!==''){//Nếu filevideo khác rỗng lấy file video
                    setSelectKhoahoc(`${API_URL}lesson/getvideo/${record.lessonid}/${record.filevideo}`);
                }else{setSelectKhoahoc(record.videourl);} // Nếu rỗng thì lấy file url
                setIsOpenVideoPlayer(true);
            }} ></Button></Tooltip></Flex>
        }}
    ]
    return (
        <>
            <Card title={<Flex wrap justify="space-between"><div><span>Danh sách bài giảng</span></div>
            <Button onClick={()=>navigate('/admin/courseadxd',{replace:true})} type="primary" style={{backgroundColor:"#47c36b"}}>Quay lại</Button></Flex>}>
            <Table pagination={{pageSize:3}} tableLayout="auto" columns={columns} dataSource={dataLesson}></Table></Card>
            {selectKhoahoc && <VideoPlayerReact srcfile={selectKhoahoc} isOpen={isOpenVideoPlayer} onCancel={()=>setIsOpenVideoPlayer(false)} />}
        </>
    );
}

export default ChitietCourse;