import { Avatar, Button, Card, Col, Collapse, Divider, Flex, Row,Space, Table, Tabs, Tag, Tooltip } from "antd";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "~/constants/constant";
import { v4 as uuidv4} from "uuid";
import { CaretRightOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, FileWordOutlined, PlayCircleOutlined } from "@ant-design/icons";
import VideoPlayerReact from "../GiangVien/VideoReactPlayer";
import images from "~/assets/images";
const ChitietCourse= () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dataLesson, setDataLesson] = useState<any[]>([]);
    const [isOpenVideoPlayer, setIsOpenVideoPlayer] = useState(false);//Mở trình duyệt phát video
    const [selectKhoahoc, setSelectKhoahoc] = useState(''); //Lưu lại bài gảng đã chọn
    const [dataQuizz, setDataQuizz] = useState<any[]>([]);//Lưu lại bài kiểm tra
    const [dataQuestion, setDataQuestion] = useState<any[]>([]);//Lưu lại danh sách các câu hỏi
    const [dataLessonChild, setDataLessonChild] = useState<any[]>([]);//lưu lại danh sách các bài giảng con
    //Lấy dữ liệu bài giảng từ id truyền vào
    const getLessonByCourseid = async (courseid: string)=>{
        try{const response = await axios.get(`${API_URL}lesson/getlesson/${courseid}`);
            const res = await axios.get(`${API_URL}quizz/getquizz/${courseid}`);
            const resquestion = await axios.get(`${API_URL}question/questionbycourse/${courseid}`);
            const reslessonchild = await axios.get(`${API_URL}lessonchild/lessonchildallcourse/${courseid}`);
            setDataQuizz(res.data)//lưu lại danh sách bài kiểm tra
            setDataQuestion(resquestion.data)// lưu lại danh sách câu hỏi trong khóa học
            setDataLesson(response.data);
            setDataLessonChild(reslessonchild.data);
        }catch(error){console.log(error);}
    }
    useEffect(()=>{
        getLessonByCourseid(location.state);
    },[])
    return (
        <>
            <Card title={<Flex wrap justify="space-between"><div><span>Danh sách bài giảng</span></div>
            <Button onClick={()=>navigate('/admin/courseadxd',{replace:true})} type="primary" style={{backgroundColor:"#47c36b"}}>Quay lại</Button></Flex>}>
            <Tabs defaultActiveKey="1" items={[
                {key:'1', label:"Danh sách bài giảng", children: <Card title={'Nội dung bài giảng'}>
                    {/* Danh sách các khóa học con  */}
                    {/* Chỉ render khi lấy được giá trị key của thẻ đầu tiên  */}
                    {dataLesson.length !==0 && <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />}
                    defaultActiveKey={dataLesson[0].lessonid} items={dataLesson.map((itemLS:any)=>{
                    return {key: itemLS.lessonid, label: <Flex flex={1} wrap gap={6}>
                        <Flex flex={7}><h3>{itemLS.title}</h3></Flex>
                        <Flex flex={3} justify="flex-end"><Space direction="horizontal">
                            {/* <Button type="primary" onClick={(e)=>{handleCreateLessonChild(itemLS.lessonid);e.stopPropagation();}} style={{backgroundColor:"#47d36b"}}>Tạo nội dung</Button> */}
                            <Button shape="circle" icon={<EditOutlined />}></Button>
                            <Button shape="circle" icon={<DeleteOutlined />}></Button>
                        </Space></Flex>
                    </Flex>,children: <>
                            <Row gutter={10} style={{fontWeight:"bold"}}>
                                <Col span={3}></Col>
                                <Col span={13}>Tiêu đề</Col>
                                <Col span={6}>Loại</Col>
                                <Col span={2}></Col>
                            </Row>
                            <Divider />
                    {dataLessonChild.length!==0 && dataLessonChild.map((itemLD)=>{
                        if(itemLS.lessonid === itemLD.lessonid){
                            return <Fragment key={uuidv4()}>
                                        <Row gutter={10} align={"middle"}>
                                            <Col span={3}>
                                                {itemLD.type === 'video' ? <img alt="anh" height={50} width={90} style={{borderRadius:8}}
                                                src={`${API_URL}lessonchild/getimage/${itemLD.lessonid}/${itemLD.thumbnail}`} /> : 
                                                <img alt="anh" height={50} width={90} style={{borderRadius:8}}
                                                src='https://vuiapp.vn/sites/default/files/2022-06/quan-ly-tai-lieu-1%20%281%29.jpg' />}       
                                            </Col>
                                            <Col span={13}>{itemLD.title}</Col>
                                            <Col span={6}>{itemLD.type==='video'?'Video':'Tài liệu'}</Col>
                                            <Col span={2}>{
                                                itemLD.type === 'video' ? <Avatar size={"small"} onClick={()=>{
                                                    if(itemLD.filevideo!==''){//Nếu filevideo khác rỗng lấy file video
                                                        setSelectKhoahoc(`${API_URL}lessonchild/getvideo/${itemLD.lessonid}/${itemLD.filevideo}`);
                                                    }else{setSelectKhoahoc(itemLD.videourl);} // Nếu rỗng thì lấy file url
                                                    setIsOpenVideoPlayer(true);
                                                }} src={<img alt="hihi" src={images.iconplaying} /> } /> : 
                                                itemLD.tailieu.includes('docx') ?  <Button icon={<Avatar src={<img alt="hihi" src={images.iconword} /> } /> } type="text" shape="circle"
                                                key={`${uuidv4()}doc1`} onClick={()=>{
                                                    navigate('/preview',{state: {wordFileUrl: `${API_URL}lessonchild/gettailieu/${itemLD.lessonid}/${itemLD.tailieu}`}})
                                                }}></Button>:
                                                <Button icon={<Avatar src={<img alt="hihi" src={images.iconpdf} /> } />} type="link" shape="circle"
                                                key={`${uuidv4()}pdf`} href={`${API_URL}lessonchild/gettailieu/${itemLD.lessonid}/${itemLD.tailieu}`} target="_blank"></Button>
                                                
                                            }</Col>
                                        </Row>
                                        <Divider />
                                </Fragment>
                        }
                    })}
            </>}
        })}/>}
                </Card>},
                {key:'2', label:"Danh sách bài kiểm tra", children: <>
                    {
        dataQuizz.length !==0 ? <Card title={'Bài kiểm tra cấp chứng chỉ'}>
            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />}
            defaultActiveKey={dataQuizz[0].id} items={
                dataQuizz.map((value)=>{
                    return {key: value.id, label: <Flex wrap align="center" gap={3}>
                    <Flex flex={6}> <h3>{value.title}</h3></Flex>
                    <Flex flex={1}><span>Tổng điểm: {value.total_marks}</span></Flex>
                    <Flex flex={1}><span>Điểm đậu: {value.passing_marks}</span></Flex>
                    <Flex flex={2} wrap gap={8} justify="flex-end">
                        {/* <Button style={{backgroundColor:"#47d36b"}} onClick={(e)=>{e.stopPropagation();}} type="primary">Tạo câu hỏi</Button> */}
                    <Button icon={<EditOutlined />} onClick={(e)=>{e.stopPropagation();}} shape="circle"></Button>
                    <Button icon={<DeleteOutlined />} onClick={(e)=>{e.stopPropagation();}} shape="circle"></Button>
                    </Flex>
            </Flex>, 
                children: <Fragment>
                <Row gutter={10} style={{fontWeight:"bold"}}>
                                <Col span={8}><span>Câu hỏi</span></Col>
                                <Col span={7}><span>Đáp án</span></Col>
                                <Col span={2}><span>Điểm</span></Col>
                                <Col span={2}><span>Loại</span></Col>
                                <Col span={5}></Col>
                </Row>
                <Divider />
                {dataQuestion.length !==0 && dataQuestion.map((itemqs)=>{
                if(value.id === itemqs.idquizz) {
                        return(
                            <Fragment key={uuidv4()}>
                                <Row gutter={10}>
                                    <Col span={8}><span>{itemqs.question_text}</span></Col>
                                    <Col span={7}><span>{itemqs.correct}</span></Col>
                                    <Col span={2}><span>{itemqs.mark}</span></Col>
                                    <Col span={2}><span>{itemqs.question_type==='tracnghiem'?'Trắc nghiệm' : 'Tự luận'}</span></Col>
                                    <Col span={5} style={{display:'flex',justifyContent:"flex-end"}}><Space direction="horizontal">
                                        <Button shape="circle" icon={<EyeOutlined />}></Button>
                                        <Button shape="circle" icon={<EditOutlined />}></Button>
                                        <Button shape="circle" icon={<DeleteOutlined />}></Button>
                                    </Space></Col>
                                </Row>
                                <Divider />
                            </Fragment>
                            )
                }
            })}</Fragment>
            }
                })
            }></Collapse>
        </Card> : <div></div>
      }
                </>}]} />
            </Card>
            {selectKhoahoc && <VideoPlayerReact srcfile={selectKhoahoc} isOpen={isOpenVideoPlayer} onCancel={()=>setIsOpenVideoPlayer(false)} />}
        </>
    );
}

export default ChitietCourse;