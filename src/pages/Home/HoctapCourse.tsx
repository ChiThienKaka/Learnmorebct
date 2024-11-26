import { Card, Flex, Layout, Menu, ConfigProvider, Row, Col, Space, Button,Radio, Input, Tag, Modal, Table, Collapse, Progress, Result, FloatButton, Tooltip, Drawer, Upload, Form, UploadFile, message, Rate, notification } from "antd";
import './stylehome.css'
import ReactPlayer from "react-player";
import {Component, Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL, formatToVietnamTime } from "~/constants/constant";
import Avatar from "antd/es/avatar/avatar";
import images from "~/assets/images";
import WordPreview from "../Admin/components/WordPreview";
import PDFViewer from "../Admin/components/PdfPreview";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { CaretLeftOutlined, CaretRightOutlined, CheckOutlined, CloseOutlined, CommentOutlined, ConsoleSqlOutlined, EllipsisOutlined, FileImageOutlined, FileTextOutlined, FrownOutlined, LeftOutlined, LikeOutlined, SendOutlined, UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { selectAuth } from "~/redux/selector";
import io from "socket.io-client"
import { useSelector } from "react-redux";
interface Answers {
    [key: number]: string;
}
interface Question{
    choice1?: string,
    choice2?: string,
    choice3?: string,
    choice4?: string,
    correct?: string,
    id:number,
    idquizz?:number,
    mark?: number,
    order?:number,
    question_text?: string,
    question_type?: string,
    index?:number
}
interface ChatCourseUser{
    id?:number,
    idenrollment?:number,
    vanban?: string,
    hinhanh?: string,
    gvchat?: boolean,
    createdAt?: string,
    updatedAt?: string
}
const HoctapCourse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {courseid, itemCourse, itemGV,enrollmentUser} = location.state || {};
    const [dataBaiGiang, setDataBaiGiang] = useState<any[]>([]);
    const [selectbaigiang, setSelectbaigiang] = useState<any>();//bài giảng được chọn
    const [selectedQuestion, setSelectedQuestion] = useState<Question>();//câu hỏi được chọn
    const [answers, setAnswers] = useState<Answers>({}); //câu trả lời ghi nhận
    const [correctAnswer, setCorrectAnswer] = useState<Answers>({}); //đáp án đúng
    const [usercoursecurrent, setUsercoursecurrent] = useState<any>();
    const [isOpenModalNopbai, setIsOpenModalNopbai] = useState(false);
    const [lichsulambai, setLichsulambai] = useState<any[]>([]);//lịch sử làm bài
    const [processhoctap, setProcesshoctap] = useState<any>();//process và tổng bài hoành thành
    const idquizz = useRef<any>();//id bài kiểm tra được chọn
    const idlessonchild = useRef<any>();//id lessonchild được chọn
    const [lessoncheck, setLessoncheck] = useState<any>(); // lấy những bài giảng đã hoàn thành gắn vào menu
    const [quizzcheck, setQuizzcheck] = useState<any>(); // lấy những bài kiểm tra đã đầu gắn vào menu
    const [isopenDrawerChatGiangvien, setIsOpenDrawerChatGiangvien] = useState(false);//Mở drawer chat
    const [formChatcourseuser] = useForm();//nội dung đoạn chat khi gửi
    const [fileListImage, setFileListImage] = useState<UploadFile[]>([]);//Ds file image tải lên
    const [fileListImageDanhgia, setFileListImageDanhgia] = useState<UploadFile[]>([]);
    const [datachat, setDatachat] = useState<ChatCourseUser[]>([]);//lấy toàn bộ dữ liệu chat
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isopenModalDanhgia, setIsOpenModalDanhgia] = useState(false);
    const [api, contextHolder] = notification.useNotification();//Thông báo thành công
    const [formDanhgia] = useForm();
    const auth = useSelector(selectAuth);
    //Tạo sự kiện thông báo
    const openNotification = () => {
        api.error({
            message: 'Bạn phải hoàn thành toàn bộ khóa học!!!',
            placement: 'top',
            duration:2.5
        })
    }
    const handledanhgia = async (values: any) => {
        try{
            if(processhoctap.process===100){
                console.log(enrollmentUser.id, courseid, auth?.id);
                console.log(values)
                const formData = new FormData();
                formData.append('idenrollment', enrollmentUser.id);
                formData.append('courseid', courseid);
                formData.append('userid', auth?.id||'');
                formData.append('rating',values['danhgia']);
                formData.append('comment',values['noidung']);
                if(values.hinhanh){
                    values.hinhanh.fileList.forEach((item:any)=>{
                      formData.append('hinhanh', item.originFileObj);
                    })
                  }
                const res = await axios.post(`${API_URL}reviews/create`, formData, {
                    headers: {"Content-Type":"multipart/form-data"}
                })
                console.log(res.data);
                formDanhgia.resetFields();
                setIsOpenModalDanhgia(false);
                setFileListImageDanhgia([]);
            }else{
                openNotification();
                setIsOpenModalDanhgia(false);
            }
        }catch(err){
            console.log(err)
        }
    }
    // Hàm cuộn đến cuối
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    // Gọi hàm cuộn mỗi khi danh sách tin nhắn thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [datachat,isopenDrawerChatGiangvien]);
    const handlesocket = () => {
        const socket = io('http://localhost:5000'); // Kết nối tới server Socket.IO
        // Kết nối tới socket và vào phòng bằng idenrollment khi kết nối
        // const socket = io("http://localhost:5000", {
        //     query: { room: idenrollment } // Gửi idenrollment ngay khi kết nối
        // });
        //bắn lên server đã vào room
        // Listener cho kết nối
       // Lắng nghe sự kiện 'connect' để phát 'joinRoom'
        socket.on('connect', () => {
            console.log('Kết nối với server:', socket.id);
            socket.emit('joinRoom', { room: `${enrollmentUser.id}` }); // Chỉ gửi yêu cầu vào phòng khi kết nối
        });

        // Lắng nghe sự kiện phản hồi 'joinRoom' từ server (đăng ký một lần)
        socket.on('joinRoom', (room) => {
            console.log('Đã vào phòng', room);
        });

        // Lắng nghe sự kiện 'newMessage' và cập nhật danh sách tin nhắn (đăng ký một lần)
        socket.on('newMessage', (newMessage) => {
            setDatachat(newMessage);
            console.log('Đã nhận tin nhắn:', newMessage);
        });
        // Hàm dọn dẹp để xử lý ngắt kết nối
        return () => {
            socket.disconnect();
            console.log('Ngắt kết nối với server');
            socket.off('newMessage'); // Gỡ bỏ listener cho 'newMessage'
        };
    }
    const handledoanchat = async () => {
        try{
            const res = await axios.get(`${API_URL}chatcourseuser/get/${enrollmentUser.id}`);
            console.log(res.data);
            setDatachat(res.data);
        }catch(err){console.log(err);}
    }
    const handleguinoidungdoanchat = async (values: any) => {
        console.log(values);
        const formData = new FormData();
        formData.append('idenrollment', enrollmentUser.id);
        formData.append('gvchat', 'false');
        if(values['vanban'] || values.hinhanh){
            formData.append('vanban', values['vanban']);
            if(values.hinhanh){
                values.hinhanh.fileList.forEach((item:any)=>{
                formData.append('hinhanh', item.originFileObj);
                })
            }
            try{    
                const res = await axios.post(`${API_URL}chatcourseuser/create`,formData,{
                    headers:{"Content-Type":"multipart/form-data"}
                })
                console.log(res.data)
                setFileListImage([]);
                formChatcourseuser.resetFields();
            }catch(err){console.log(err)}
        }
        
    }
    const handlelessoncheckandquizzcheck = async () => {
        try{
            const res = await axios.get(`${API_URL}userprocesslesson/getbaidahoc/${enrollmentUser.id}`);
            const result = res.data;
            if(result){
                const resultlesson = result.filter((item:any)=>item.type==='lessonchild').map((item:any)=>item.id);
                const resultquizz = result.filter((item: any)=>item.type==='quizz').map(((item:any)=>item.id));
                console.log('lesson', resultlesson, 'quizz', resultquizz)
                setLessoncheck(resultlesson);
                setQuizzcheck(resultquizz);
            }
        }catch(err){
            console.log(err);
        }
    }
    //nút hoàn thành bài học cập nhật lại bài học đã học xog
    const handlehoanthanhbaihoc = async() => {
        await axios.post(`${API_URL}userprocesslesson/update`,{
            idenrollment: enrollmentUser.id, 
            idlessonchild: idlessonchild.current
        })
        handlegettientrinh();
        //gọi lại hàm check bài
        handlelessoncheckandquizzcheck();
    }
    const handlegetlichsubailam = async (idquizz: any) => {
        //lấy lịch sử làm bài 
            const reslichsulambai = await axios.get(`${API_URL}userprocessquizz/getlichsulambai/${enrollmentUser.id}/${idquizz}`);
            console.log(reslichsulambai.data)
            if(reslichsulambai.status === 200){
                setLichsulambai(reslichsulambai.data)
            }
    }
    const handlegettientrinh =  async() => {
        // lấy tiến trình 
        const resprocess = await axios.get(`${API_URL}enrollment/getenrollmentprocessbyid/${enrollmentUser.id}`);
        setProcesshoctap(resprocess.data);
    }
    const getChitietbaigiang = async ()=>{
        try{
            const response = await axios.get(`${API_URL}course/getcoursealllessonquizzhocvien/${courseid}`);
            setDataBaiGiang(response.data.baigiang);
            //check giá trị curent của usercurrent hiện tại
            const resusercoursecurrent = await axios.get(`${API_URL}usercoursecurrent/get/${enrollmentUser.id}`);
            handlegettientrinh();
            //lấy lịch sử làm bài 
            // const reslichsulambai = await axios.get(`${API_URL}userprocessquizz/getlichsulambai/${enrollmentUser.id}`);
            // console.log(reslichsulambai.data)
            // if(reslichsulambai.status === 200){
            //     setLichsulambai(reslichsulambai.data)
            // }
            //lấy ra những bài đã học vào check vào menu
            handlelessoncheckandquizzcheck();
            //lấy ra kêt quả hiện tại
            const result = resusercoursecurrent.data[0];
            //lấy id bài con hiện tại
            idlessonchild.current = result.lessonchildid;
            if(result.lessonid === null){
                const baidautien = response.data.baigiang[0];
                if(baidautien.type==='baihoc'){
                    if(baidautien.lessonchild.length!==0){
                        const res = await axios.put(`${API_URL}usercoursecurrent/update`,{
                            idenrollment: enrollmentUser.id,
                            lessonid: baidautien.lessonchild[0].lessonid, 
                            lessonchildid: baidautien.lessonchild[0].id, 
                        });
                        setUsercoursecurrent(res.data);
                        //setbaigiang hien tai
                        setSelectbaigiang(baidautien.lessonchild[0]);
                    }
                }
            }else{
                //set up menu của khóa học hiện tài mà người dùng rời đi
                setUsercoursecurrent(result);
                const dsbaigiang = response.data.baigiang;
                dsbaigiang.forEach((item:any)=>{
                    if(result.lessonid === item.lessonid){
                        if(item.lessonchild.length!==0){
                            //tìm ra select hiện tại bài giảng đã chọn
                            const temp = item.lessonchild.find((child:any)=> child.id === result.lessonchildid);
                            setSelectbaigiang(temp);
                        }
                    }
                })
            }
            //chọn bài đầu tiên
            // const baidautien = response.data.baigiang[0];
            // if(baidautien.type==='baihoc'){
            //     if(baidautien.lessonchild.length!==0){
            //         setSelectbaigiang(baidautien.lessonchild[0]);
            //     }
            // }else if(baidautien.type==='kiemtra'){
            //     if(baidautien.question.length!==0){
            //         setSelectbaigiang(baidautien.question);
            //     };
            // }
        }catch(err){console.log(err)}
    }
    useEffect(()=>{
        //cuộn về cuối đoạn chat
        scrollToBottom();
        //lấy đoạn chat lúc đầu 
        handledoanchat();
        //socket
        handlesocket();
        console.log(enrollmentUser);
        getChitietbaigiang();
        console.log('render lai');
    },[])
    //nộp bài 
    const handleNopbai = async()=>{
        console.log('nội dung nộp câu hỏi',answers);
        //load lại các bài giang đã hoàn thành
        handlelessoncheckandquizzcheck();
        //load lại phần trăm
        handlegettientrinh();
        console.log(idquizz.current,'nopbai')
        try{
            const res = await axios.post(`${API_URL}userprocessquizz/create`, {idquizz:idquizz.current, idenrollment:enrollmentUser.id,answers:answers});
            console.log(res.data)
            //reset lại danh sách câu trả lời
            setAnswers({});
            //gọi lại lịch sử nộp bài 
            //lấy lịch sử làm bài 
            const reslichsulambai = await axios.get(`${API_URL}userprocessquizz/getlichsulambai/${enrollmentUser.id}/${idquizz.current}`);
            if(reslichsulambai.status === 200){
                setLichsulambai(reslichsulambai.data)
            }
            //đóng modal nộp bài
            setIsOpenModalNopbai(false);
        }catch(err){
            console.log(err);
        }
    }
    //bắt sự kiện lấy các bài giảng con
    const onSelectBaigiang = async(keyPath: any) =>{
        const keychildlesson = keyPath[0].includes('lessonchild') ? keyPath[0].split('lessonchild')[0] : keyPath[0].split('quizz')[0];
        const baigiang= await Promise.all( dataBaiGiang.map(async(item)=>{
            if(item.type==='baihoc'){
                if(item.lessonid===keyPath[1]){
                    //lấy bài giảng con
                    const lessonchild = item.lessonchild.find((child:any)=>child.id.toString() === keychildlesson);
                    const res = await axios.put(`${API_URL}usercoursecurrent/update`,{
                        idenrollment: enrollmentUser.id,
                        lessonid: lessonchild.lessonid, 
                        lessonchildid: lessonchild.id, 
                    });
                    idlessonchild.current = lessonchild.id;
                    return lessonchild;
                }
            }else if(item.type === 'kiemtra'){
                if(item.id.toString()=== keychildlesson){
                    //lưu lại id được idquizz được chọn
                    console.log('mã bài học',item.id);
                    handlegetlichsubailam(item.id);
                    idquizz.current = item.id;
                    return item.question;
                }
            }
            return null;
        }))
        const result = baigiang.find(item=>item!=null);
        setSelectbaigiang(result);
        //lấy câu hỏi đầu tiên
        setSelectedQuestion({...result[0], index:1})
    }
    //sử lý render giao diện
    const renderContent = () => {
        if(selectbaigiang){
            //bài kiểm tra
            if(Array.isArray(selectbaigiang)){
                return <Row gutter={10} style={{width:"100%"}}>
                            <Col span={6} style={{display:"flex",flexDirection:"column",gap:20,alignItems:"center", backgroundColor:"#fafafa"}}>
                                <Card title={'Danh sách câu hỏi'} style={{width:"100%"}}>
                                     
                                         <Flex>
                                             {selectbaigiang.length!==0 && <Space key={uuidv4()} direction="horizontal" 
                                             style={{display:"flex", flexWrap:"wrap", width:250}}>
                                                {
                                                    selectbaigiang.map((value, index)=>{
                                                        if(answers[value.id]){
                                                            return <Button type="primary"  style={{backgroundColor:"#999999"}} shape="circle" 
                                                            key={uuidv4()} onClick={()=>{setSelectedQuestion({...value, index: index+1})}}>
                                                            <span style={{fontWeight:"bold"}}>{index+1}</span>
                                                            </Button>
                                                        }else{
                                                            return <Button  style={{borderColor:"#666666"}} shape="circle" 
                                                            key={uuidv4()} onClick={()=>{setSelectedQuestion({...value, index: index+1})}}>
                                                                <span style={{fontWeight:"bold"}}>{index+1}</span>
                                                            </Button>
                                                        }
                                                        
                                                     })
                                                }
                                             </Space>}
                                         </Flex>
                                         
                                </Card>
                                <Button onClick={()=>{setIsOpenModalNopbai(true)}} type="primary" style={{backgroundColor:"#47d36b"}}>Nộp bài</Button>
                            </Col>
                            <Col span={18}>
                               {
                                    selectedQuestion!==undefined && (<Flex flex={1}>
                                    {/* Cau hoi  */}
                                    <Flex flex={1}><Card title={'Câu hỏi'} style={{width:"100%"}}>
                                        {/* sét cứng để tiểu luận và trắc nghiệm có form theo thiết kế  */}
                                        <div style={{height:200}}>
                                            <Space key={uuidv4()} size={"large"} direction="vertical" style={{width:"100%",backgroundColor:"#B7E4C7",borderRadius:8, padding:10}}>
                                                <span style={{display:'flex', justifyContent:"space-between"}}>
                                                <span>{`Câu ${selectedQuestion.index}: ${selectedQuestion.question_text}`}</span> 
                                                <span style={{fontWeight:"bold", color:"red"}}>{`${selectedQuestion.mark} điểm`}</span></span>
                                                {
                                                    selectedQuestion.question_type==='tracnghiem'?<Radio.Group onChange={(e)=>{
                                                        setAnswers((value:any)=>{
                                                            return {...value, [selectedQuestion.id]:e.target.value}
                                                        })
                                                    }} value={answers[selectedQuestion.id]}>
                                                        <Space direction="vertical">
                                                                <Radio value={selectedQuestion.choice1}>{selectedQuestion.choice1}</Radio>
                                                                <Radio value={selectedQuestion.choice2}>{selectedQuestion.choice2}</Radio>
                                                                <Radio value={selectedQuestion.choice3}>{selectedQuestion.choice3}</Radio>
                                                                <Radio value={selectedQuestion.choice4}>{selectedQuestion.choice4}</Radio>
                                                        </Space>
                                                    </Radio.Group>:
                                                    <Input onClear={()=>{
                                                        setAnswers((value:any)=>{
                                                            return {...value, [selectedQuestion.id]:undefined}
                                                        })
                                                    }} onBlur={(e)=>{
                                                            setAnswers((value:any)=>{
                                                                return {...value, [selectedQuestion.id]:e.target.value}
                                                            })
                                                    }} allowClear value={answers[selectedQuestion.id]} placeholder="Nhập đáp án"></Input>
                                                }
                                            </Space>
                                        </div>
                                        {/* Lịch sử làm bài  */}
                                        {lichsulambai.length!==0 && (
                                           <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{color:"green", fontSize:15}} rotate={isActive ? 90 : 0} />}
                                           expandIconPosition="end" items={[
                                                {key:'lichsulambai',label: 'Lịch sử làm bài', children: <Table pagination={false} columns={[
                                                    {
                                                        title: 'Thời gian nộp bài',
                                                        dataIndex:'createdAt',
                                                        key:'createdAt',
                                                        render: (text) => <span>{formatToVietnamTime(text)}</span>
                                                    },
                                                    {
                                                        title: 'Điểm',
                                                        dataIndex:'score',
                                                        key:'score',
                                                        align:"center",
                                                        render: (text, record) => <span>{text}/{record.scorequizz}</span>
                                                    },
                                                    {
                                                        title: 'Kết quả',
                                                        dataIndex:'ispass',
                                                        key:'ispass',
                                                        align:"center",
                                                        render: (text) => text?<CheckOutlined style={{color:"green"}} />: <CloseOutlined style={{color:"red"}} />
                                                    }
                                                ]} dataSource={lichsulambai}/>}
                                           ]} />
                                        )}
                                    </Card></Flex>
                                        {/* Thong bao diem  */}
                                        {/* <Flex flex={2}>
                                            <Space direction="vertical" style={{padding:20,border:"0.5px solid #ccc",height:100, width:"100%", 
                                                borderTop:"none", borderBottomLeftRadius:10, borderBottomRightRadius: 10
                                            }}>
                                                    <span><span>Câu hỏi: </span><span style={{fontWeight:"bold", fontSize:20}}>{`${selectedQuestion.index}`}</span></span>
                                                    <span>{`Điểm số: ${selectedQuestion.mark}`}</span>
                                            </Space>
                                        </Flex> */}
                                    </Flex>)
                               }
                            </Col>
                        </Row>
            }else{
                //Phân loại các loại bài giảng
                if(selectbaigiang.type==='video'){
                    if(selectbaigiang.filevideo===''){
                        return <div><div style={{padding:"10px 20px 10px 20px", backgroundColor:"black"}}>
                                    <ReactPlayer
                                    url={selectbaigiang.videourl}
                                    controls
                                    height= {500}
                                    width="100%"/>
                                </div>
                                <div style={{margin:"20px 0px 0px 20px"}}>
                                    <Button onClick={handlehoanthanhbaihoc} type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Hoàn thành</Button></div>
                                </div>
                    }else{
                        return <div><div style={{padding:"10px 20px 10px 20px", backgroundColor:"black"}}>
                                    <ReactPlayer
                                    url={`${API_URL}lessonchild/getvideo/${selectbaigiang.lessonid}/${selectbaigiang.filevideo}`}
                                    controls
                                    height= {500}
                                    width="100%"/>
                                </div><div style={{margin:"20px 0px 0px 20px"}}>
                                <Button onClick={handlehoanthanhbaihoc} type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Hoàn thành</Button></div></div>
                    }
                }else if(selectbaigiang.type==='tailieu'){
                    if(selectbaigiang.tailieu.includes('docx')){
                        return <div><WordPreview wordfileurlprop={`${API_URL}lessonchild/gettailieu/${selectbaigiang.lessonid}/${selectbaigiang.tailieu}`} />
                        <div style={{position:"fixed",bottom:42,left:0,right:0,padding:10, display:"flex", justifyContent:"flex-start"}}>
                        <Button onClick={handlehoanthanhbaihoc} type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Hoàn thành</Button></div></div>
                    }else{
                        return <div><PDFViewer pdfUrl={`${API_URL}lessonchild/gettailieu/${selectbaigiang.lessonid}/${selectbaigiang.tailieu}`} />
                        <div style={{position:"fixed",bottom:42,left:0,right:0,padding:10, display:"flex", justifyContent:"flex-start"}}>
                        <Button onClick={handlehoanthanhbaihoc} type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Hoàn thành</Button></div></div>
                    }
                }
            }
        }
    } 
    return (
       <>
        {contextHolder}
            <Layout style={{WebkitScrollSnapType:"inline"}}>
                <Layout.Header  style={{position:"fixed", top:0, left:0, right:0, zIndex:10, color:"#ffffff"}}>
                        <Flex justify="space-between">
                            <Flex wrap gap={3} align="center">
                            <Button onClick={()=>navigate('/', {replace:true})} type="text" shape="circle" icon={<CaretLeftOutlined style={{fontSize:20, fontWeight:'bold',color:"#ffffff"}} />}></Button>  
                            <img width={60} height={60} src={images.logo} alt="logo"/>
                            <h3>{itemCourse?.title}</h3>
                            </Flex>
                            {
                                processhoctap && <Flex gap={10} justify="center" align="center" wrap>
                                <div>
                                    <ConfigProvider theme={
                                        {components: {
                                            Progress: {
                                                circleTextColor: "#ffffff",
                                                defaultColor: "#46d36b",
                                                remainingColor: "#ffffff"
                                            }
                                        }}
                                    }>
                                        <Progress type="circle" size={35} format={(percent)=><span style={{color:"#ffffff"}}>{`${percent}%`}</span>} percent={Number(processhoctap.process)} />
                                    </ConfigProvider>
                                </div>
                                <div><span>{`${processhoctap.tongbaihoanthanh}/${enrollmentUser.totalquizzes} bài học`}</span></div>
                            <div><span> <FileTextOutlined /> Ghi chú</span></div></Flex>
                            }
                        </Flex>
                </Layout.Header>
                <Layout style={{backgroundColor:"#ffffff"}}>
                    <Layout.Content style={{margin:"64px 300px 48px 0px",height:"100%",overflowY:"auto",backgroundColor:"#ffffff", zIndex:3}}>
                     
                            {
                                selectbaigiang && renderContent()
                            }
                    </Layout.Content>
                    <Layout.Sider width={300} theme="light" style={{position:"fixed", top:64, right:0, bottom:48,
                        maxHeight:"100vh", overflowY:"auto", backgroundColor:"#f7f8fa", border:"1px solid #cccccc"}}>
                                <h3 style={{margin:"5px 0px 0px 5px"}}>Nội dung khóa học</h3>
                               {
                                    //xem user đang ở bài nào trong menu
                                    usercoursecurrent && 
                                    <ConfigProvider theme={{
                                        components: {
                                            Menu: {
                                                itemSelectedColor: '#000000',  // Màu chữ của item đang hoạt động (active)
                                                itemSelectedBg: '#b7e4c7',   // Màu nền của item đang hoạt động (active)
                                            }}}}>
                                    <Menu defaultSelectedKeys={[`${usercoursecurrent.lessonchildid}lessonchild`]} defaultOpenKeys={[`${usercoursecurrent.lessonid}`]} onSelect={({keyPath})=>onSelectBaigiang(keyPath)} mode="inline" items={
                                        dataBaiGiang && dataBaiGiang.map((item)=>{
                                            if(item.type==='baihoc'){
                                                return {key: item.lessonid, label: <span style={{fontWeight:"bold"}}>{`${item.order}. `} {item.title}</span>, children: item.lessonchild.map((child:any)=>{
                                                    return {key:`${child.id}lessonchild`,icon:lessoncheck && lessoncheck.includes(child.id) ?<Avatar size={15} src={<img alt="hihi" src={images.check} />} />:null,
                                                    label:child.type==='video'?<span style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                                        {child.title}<Avatar style={{marginRight:5}} size={15} shape="square" src={<img alt="hihi" src={images.iconplaying} />} /></span>:
                                                    child.tailieu.includes('docx') ? <span style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}
                                                    >{child.title}<Avatar style={{marginRight:5}} size={15} shape="square" src={<img alt="hihi" src={images.iconword} />} /></span> : 
                                                    <span style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}
                                                    >{child.title}<Avatar style={{marginRight:5}} size={15} shape="square" src={<img alt="hihi" src={images.iconpdf} />} /></span>} 
                                                })}
                                                }else if(item.type==='kiemtra'){
                                                    // idquizz.current = item.id; //lưu lại mã quizz bài kiểm tra
                                                return {key: `${item.id}quizz`, label: <Flex justify="space-between">
                                                        <div><span style={{fontWeight:"bold"}}>{`${item.order}. `}{item.title}</span></div>
                                                        <div>
                                                           {
                                                                quizzcheck && quizzcheck.includes(item.id) && <Avatar size={15} src={<img alt="hihi" src={images.check} />} />
                                                           }
                                                        </div>
                                                    </Flex>}
                                                }else{return null;}
                                            })
                                    }></Menu>
                                   </ConfigProvider>
                               }
                               
                        </Layout.Sider>
                </Layout>
                <Layout.Footer style={{backgroundColor:"#f0f0f0", position:"fixed", bottom:0, left:0, right:0,zIndex:11, height:50,display:"flex", justifyContent:"center", alignItems:"center"}} >
               
                    <span style={{fontSize:12}}>Người phụ trách biên soạn: </span> 
                                        <Avatar src={<img alt="hihi" src={`${API_URL}admin/images/${itemGV.email}`}/>} />
                                        <span style={{fontWeight:"bold"}}> {itemGV.name}</span>
                                        <ConfigProvider theme={{
                                            components: {
                                                FloatButton: {
                                                    colorPrimary: "#47d36b",
                                                    colorPrimaryHover: "#91EE97"
                                                }
                                            }
                                        }}>
                                            <FloatButton.Group style={{position: "fixed", bottom: 55, right:305}} 
                                            trigger="click" type="primary" icon={<EllipsisOutlined />}>
                                                <Tooltip placement="left" title={'Hỏi đáp'}><FloatButton onClick={()=>{setIsOpenDrawerChatGiangvien(true)}} icon={<CommentOutlined />} /></Tooltip>
                                                <Tooltip placement="left" title={'Đánh giá'}><FloatButton onClick={()=>{setIsOpenModalDanhgia(true)}} icon={<LikeOutlined />}/></Tooltip>
                                            </FloatButton.Group>
                                        </ConfigProvider>
                </Layout.Footer>
            </Layout>
            <Modal title={"Thông báo"} open={isOpenModalNopbai} okText={"Xác nhận"} cancelText={"Từ chối"} 
            onOk={handleNopbai} onCancel={()=>setIsOpenModalNopbai(false)}>
                    <span>Bạn có chắc chán muốn nộp bài không</span>
            </Modal>
            <Drawer  width={500} title={'Hỏi đáp với giảng viên'} open={isopenDrawerChatGiangvien} onClose={()=>setIsOpenDrawerChatGiangvien(false)}
                footer={
                    <Form form={formChatcourseuser} onFinish={handleguinoidungdoanchat}>
                        <Row>
                            <Col span={20}><Form.Item name={"hinhanh"}><Upload
                            beforeUpload={() => false} // Ngăn không tải ảnh lên tự động
                            fileList={fileListImage}
                            accept=".png,.jpg,.jpeg" multiple={false}
                            onChange={({fileList})=>{setFileListImage(fileList)}}
                            maxCount={1}
                            listType="picture-card"
                            showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}>
                            <Button type="primary" style={{backgroundColor:"#47d36b"}} icon={<FileImageOutlined />} />
                        </Upload></Form.Item></Col>
                        <Col span={4}></Col>
                        </Row>
                        <Row>
                            <Col span={20}><Form.Item name={"vanban"}><Input.TextArea
                            // value={text}
                            // onChange={handleTextChange}
                            placeholder="Nhập tin nhắn..."
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            style={{ flex: 1 }}
                        /></Form.Item></Col>
                            <Col span={4} style={{display:"flex",justifyContent:"center", alignItems: "center"}}>
                            <Form.Item>
                                <Button htmlType="submit"
                                type="primary"
                                style={{backgroundColor:"#47d36b"}}
                                icon={<SendOutlined />}
                                // onClick={handleSend}
                                // disabled={!text && !image} // Chỉ cho phép gửi khi có nội dung hoặc ảnh
                            />
                            </Form.Item>
                            </Col>
                        </Row>
                        
                    </Form>
                }>
                <Space direction="vertical" size={"small"} style={{width:"100%"}}>
                    {/* Giảng viên trả lời  */}
                    {
                        datachat.length!== 0 && datachat.map((item: any)=>{    
                                return <Fragment key={uuidv4()}>
                                    {
                                        item.gvchat ? (
                                        <Row>
                                            <Col span={2}><Avatar src={<img alt="hihi" src={`${API_URL}admin/images/${itemGV.email}`}/>} /></Col>
                                            <Col span={19}><div style={{backgroundColor:"#d7d7d7", padding:10, borderRadius: 8}}>
                                                {item.hinhanh && <img alt="hihi" width={"100%"} style={{objectFit:"contain"}} height={100} src={images.icons8facebook} />}
                                                <Space direction="vertical">
                                                    {item.vanban!=='undefined' && <span>{item.vanban}</span>}
                                                    <span style={{fontSize:12}}>{formatToVietnamTime(item.createdAt)}</span>
                                                </Space>
                                            </div></Col>
                                            <Col span={3}></Col>
                                            </Row>
                                        ):(<Row>
                                        <Col span={6}></Col>
                                        <Col span={18}><div style={{backgroundColor:"#b0dda8", padding:10, borderRadius: 8}}>
                                                {item.hinhanh && <img alt="hihi" width={"100%"} style={{objectFit:"contain"}} height={100} src={images.icons8facebook} />}
                                                <Space direction="vertical">
                                                    {item.vanban!=='undefined' && <span>{item.vanban}</span>}
                                                    <span style={{fontSize:12}}>{formatToVietnamTime(item.createdAt)}</span>
                                                </Space>
                                            </div></Col>
                                        </Row>)
                                    }
                                </Fragment>
                        })
                    }
                    {/* Thẻ div này để làm điểm cuộn đến cuối */}
                    <div ref={messagesEndRef} />
                </Space>
            </Drawer>
            <Modal title={<Space style={{display:"flex", justifyContent:"center"}}><span>Đánh giá khóa học</span></Space>} footer={null} open={isopenModalDanhgia} onCancel={()=>{setIsOpenModalDanhgia(false)}}>
                    <Form form={formDanhgia} onFinish={handledanhgia}>
                        <Form.Item label="Đánh giá" name="danhgia" rules={[{ required: true, message: 'Vui lòng đánh giá!' }]}>
                            <Rate />
                        </Form.Item>
                        <Form.Item label="Nội dung đánh giá" name="noidung" rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá!' }]}>
                            <Input.TextArea autoSize placeholder="nhập đánh giá của bạn" />
                        </Form.Item>
                        <Form.Item name="hinhanh" label="Chọn hình ảnh">
                            <Upload showUploadList fileList={fileListImageDanhgia} accept=".png,.jpg,.jpeg" multiple={false} beforeUpload={()=>false}
                            maxCount={1} listType="picture-card" onChange={({fileList})=>{setFileListImageDanhgia(fileList)}}>
                                <Button type="text" icon={<UploadOutlined />}></Button>
                            </Upload>
                            </Form.Item>
                        <Form.Item style={{display:"flex", justifyContent:"flex-end"}}>
                            <Button type="primary" style={{backgroundColor:"#47d36b"}} htmlType="submit">Gửi đánh giá</Button>
                        </Form.Item>
                    </Form>
            </Modal>
       </>
)}

export default HoctapCourse;