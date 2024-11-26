import { CaretRightOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, FileWordOutlined, UploadOutlined } from "@ant-design/icons";
import { Avatar, Button,Form, Card, Col, Collapse, Empty, Flex, List, Modal, Row, Space, Tabs, Input, Radio, InputNumber, Divider, Upload, UploadFile, Select } from "antd";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "~/constants/constant";
import { v4 as uuidv4 } from "uuid";
import VideoPlayerReact from "./VideoReactPlayer";
import VideoPlayer from "./VideoPlayer";
import { useForm } from "antd/es/form/Form";
import images from "~/assets/images";
function ListLesson() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpenVideoPlayer, setIsOpenVideoPlayer] = useState(false);
    const {id, idGV, thumbnail} = location.state;
    const [dataListLesson, setDataListLesson] = useState<any[]>([]);
    const [selectKhoahoc, setSelectKhoahoc] = useState(''); //Lưu lại bài gảng đã chọn
    const [dataQuizz, setDataQuizz] = useState<any[]>([]);//Lưu lại data Tiêu đề kiểm tra
    const [dataQuestion, setDataQuestion] = useState<any[]>([]);//Lưu lại data các câu hỏi
    const [isOpenModalCreateQuestion, setIsOpenModalCreateQuestion] = useState(false);// Mở modal tạo câu hỏi
    const [isOpenModalCreateLessonChild, setIsOpenModalCreateLessonChild] = useState(false);//mở bảng tạo nội dung LessonChild
    const [selectLesson, setSelectLesson] = useState(''); //lưu lại bài giảng đã chọn
    const [dataLessonChild, setDataLessonChild] = useState<any[]>([]);
    const [isopenModalUpdateLesson, setIsOpenModalUpdateLesson] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);//Danh sách ảnh tải lên
    const [fileListVideoFile, setFileListVideoFile] = useState<UploadFile[]>([]);//Danh sách file video tải lên
    const [fileListTailieu, setFileListTailieu] = useState<UploadFile[]>([]);//Danh sách file tài liệu tải lên
    const [lessonidcurrent, setLessonidcurrent] = useState();//lấy lessonid  hiện tại
    const [quizzidcurrent, setQuizzidcurrent] = useState();//lây id quizz hiện tại
    const [dataLessoncurrent, setDataLessoncurrent] = useState<any>([]);//lấy lesson hiện tại để cập nhật
    const [idquizzselect, setIdquizzselect] = useState();
    const [isopenModalUpdateQuizz, setIsOpenModalUpdateQuizz] = useState(false);
    const [formTracnghiem] = useForm();
    const [formTuluan] = useForm();
    const [formTaovideo] = useForm();
    const [formTaoTailieu] = useForm();
    const [formUpdateLesson] = useForm();
    const [formUpdatequizz] = useForm();
    //update quizz theo id
    const handleupdatequizzbyid = async (values: any) => {
        try{
            const res = await axios.post(`${API_URL}quizz/updatequizz`, {
                idquizz: quizzidcurrent,
                title: values['title'],
                description: values['description'],
                order: values['order'],
                total_marks: values['total_marks'],
                passing_marks: values['passing_marks']
            });
            //load lại giao diện
            setIsOpenModalUpdateQuizz(false);
            getdataListLesson(id);
        }catch(err){console.log(err);}
    }
    //lấy danh sách idquizz mới cập nhật lại vào file
    const getquizzbyid = async ()=>{
        try{
            if(quizzidcurrent){
                const res = await axios.post(`${API_URL}quizz/getquizzbyid`,{
                    idquizz: quizzidcurrent
                })
                if(res.data){
                    formUpdatequizz.setFieldsValue({
                        title: res.data.title,
                        description: res.data.description,
                        order: res.data.order,
                        total_marks: res.data.total_marks,
                        passing_marks: res.data.passing_marks
                    })
                }
            }
        }catch(err){console.log(err)}
    }
    //Cập nhật lại bài học
    const handleupdatelesson = async(values: any) => {
        try{
            const res = await axios.post(`${API_URL}lesson/updatelessonbyid`, {
                lessonid: lessonidcurrent, 
                title: values['title'], 
                content:values['content'], 
                order:values['order'], 
                trylearn:values['trylearn']==='1'?true: false
            });
            console.log(res.data);
            //load lại giao diện
            setIsOpenModalUpdateLesson(false);
            getdataListLesson(id);
        }catch(err){console.log(err);}
    }
    //lấy danh lesson theo id
    const getlessonbyid = async () => {
        try{
            if(lessonidcurrent){
                const res = await axios.post(`${API_URL}lesson/getlessonbyid`, {lessonid: lessonidcurrent});
                console.log(res.data);
                setDataLessoncurrent(res.data);
                formUpdateLesson.setFieldsValue({
                    title: res.data.title,
                    content: res.data.content,
                    order: res.data.order
                })
            }
        }catch(er){
            console.log(er);
        }
    }
    //Check dữ liệu 1 trong 2 form videourl và filevideo phải có
    const checkFormVideoUrlandFilevideo = (_:any, value:any)=>{
        const filevideo = formTaovideo.getFieldValue('filevideo');
        const videourl =  formTaovideo.getFieldValue('videourl');
        // Nếu cả hai trường đều không có giá trị thì báo lỗi
        if(!filevideo && !videourl){
            return Promise.reject(new Error('Bạn phải nhập ít nhất một trong hai trường video URL hoặc video của bạn!'));
        }
        // Nếu có ít nhất một trường có giá trị thì không có lỗi
        return Promise.resolve();
    }

    const handleCreateLessonChild = (id: string)=>{
        setSelectLesson(id);
        setIsOpenModalCreateLessonChild(true);
    }
    const handleCreateQuestion = (idquizz: any) => {
        setIdquizzselect(idquizz);
        setIsOpenModalCreateQuestion(true);
    }
    const getdataListLesson = async (courseid: string)=>{
        try{
            const response = await axios.get(`${API_URL}lesson/getlesson/${courseid}`);
            const res = await axios.get(`${API_URL}quizz/getquizz/${courseid}`);
            const resquestion = await axios.get(`${API_URL}question/questionbycourse/${courseid}`);
            const reslessonchild = await axios.get(`${API_URL}lessonchild/lessonchildallcourse/${courseid}`);
            setDataLessonChild(reslessonchild.data);//lư danh sách các bài giảng con
            setDataListLesson(response.data);//lưu lại danh sách khóa học
            setDataQuizz(res.data)//lưu lại danh sách bài kiểm tra
            setDataQuestion(resquestion.data)// lưu lại danh sách câu hỏi trong khóa học
            
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getdataListLesson(id);
    },[]);
    useEffect(()=>{
        getlessonbyid();
    }, [lessonidcurrent]);
    //lấy lại nội dung cập nhật của quizz
    useEffect(()=>{
        getquizzbyid();
    },[quizzidcurrent])
    //Xử lý form tạo tài liệu
    const onFinishTailieu = async (values: any)=>{
        try{
            const formData = new FormData();
            formData.append('lessonid', selectLesson);
            formData.append('title', values['title']);
            formData.append('type', 'tailieu')
            // lấy file tài liệu
            if(values.tailieu.fileList){
                values.tailieu.fileList.forEach((file:any)=>{
                    formData.append("tailieu", file.originFileObj)
                });
            }
            await axios.post(`${API_URL}lessonchild/create`,formData,{
                headers:{"Content-Type":"multipart/form-data"}
            })
        
            setIsOpenModalCreateLessonChild(false)
            // reset toàn bộ dữ liệu 
            setFileListTailieu([]);
            formTaoTailieu.resetFields();
            getdataListLesson(id);//refesh lại dữ liệu
        }catch(err){console.log(err)}
    }
    //xử lý form tạo video
    const onFinishVideo = async(values: any) => {
        try{
            const formData = new FormData();
            formData.append('lessonid', selectLesson);
            formData.append('title', values['title']);
            formData.append('videourl', values['videourl']);
            formData.append('type', 'video')
            //lấy file filevideo
            if(values.filevideo){
                values.filevideo.fileList.forEach((file:any)=>{
                    formData.append("filevideo", file.originFileObj)
                });
            }
            //Lấy file thumbnail cho hình ảnh thêm sau
            if(values.image.fileList){
                values.image.fileList.forEach((file:any)=>{
                    formData.append("image", file.originFileObj)
                });
            }

            await axios.post(`${API_URL}lessonchild/create`,formData,{
                headers:{"Content-Type":"multipart/form-data"}
            })
        
            setIsOpenModalCreateLessonChild(false)
            // reset toàn bộ dữ liệu 
            setFileListVideoFile([]);//set lại file video
            setFileListThumbnail([]);//set lại file ảnh
            formTaovideo.resetFields();
            getdataListLesson(id);//refesh lại dữ liệu
        }catch(err){console.log(err)}
    }
    //xử lý form tạo trắc nghiệm
    const onFinishTracnghiem = async (values: any)=>{
        try {
            const correctselect = formTracnghiem.getFieldValue(values["correctAnswer"]); //lấy lựa chọn đúng
            const res = await axios.post(`${API_URL}question/create`,{
                idquizz: idquizzselect,
                question_text: values["question"],
                question_type: 'tracnghiem',
                mark: values["mark"],
                correct: correctselect,
                choice1: values["luachon1"],
                choice2: values["luachon2"],
                choice3: values["luachon3"],
                choice4: values["luachon4"]
            })
            setIsOpenModalCreateQuestion(false);
            formTracnghiem.resetFields();
            getdataListLesson(id);//refesh lại dữ liệu
            console.log(res.data)
        }catch(err){console.log(err);}
    }
    //xử lý form tạo tự luận
    const onFinishTuLuan = async (values: any)=>{
        try {
            const res = await axios.post(`${API_URL}question/create`,{
                idquizz: idquizzselect,
                question_text: values["question"],
                question_type: 'tuluan',
                mark: values["mark"],
                correct: values["sampleAnswer"],
            })
            setIsOpenModalCreateQuestion(false);
            formTuluan.resetFields();
            getdataListLesson(id);//refesh lại dữ liệu
            console.log(res.data)
        }catch(err){console.log(err);}
    }
    return ( 
        <div style={{ padding: '20px' }}>
      <Card title={<Flex justify="space-between"><span>Danh sách các bài giảng</span> 
      <Button type="primary" style={{backgroundColor:"#47d36b"}} onClick={()=>navigate('/giangvien/listcourse',{replace: true})}>Quay lại</Button></Flex>} 
      bordered={false} style={{ width: '100%' }}>
        <Row style={{backgroundColor:"#fafafa", padding:10}}>
            <Col span={14}><h3>Nội dung bài giảng</h3></Col>
            <Col span={10}><h3>Thứ tự bài giảng</h3></Col>
        </Row>
        {/* Danh sách các khóa học con  */}
        {
           dataListLesson.length !==0 && <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />}
           items={dataListLesson.map((itemLS:any)=>{
                return {key: itemLS.lessonid, label: <Flex flex={1} wrap gap={6}>
                    <Flex flex={7}>
                        <Row style={{width:"100%"}}>
                            <Col span={20}>
                                <Space direction="vertical" >
                                    <h3>{itemLS.title}</h3>
                                    <span>{itemLS.content}</span>
                                </Space>
                            </Col>
                            <Col style={{alignItems:"center", display:"flex"}} span={4}><span>Số thứ tự <span style={{fontWeight:"bold"}}>{`${itemLS.order}`}</span></span></Col>
                        </Row>
                    </Flex>
                    <Flex flex={3} justify="flex-end"><Space direction="horizontal">
                        <Button type="primary" onClick={(e)=>{handleCreateLessonChild(itemLS.lessonid);e.stopPropagation();}} style={{backgroundColor:"#47d36b"}}>Tạo nội dung</Button>
                        <Button onClick={(e)=>{e.stopPropagation(); setIsOpenModalUpdateLesson(true); setLessonidcurrent(itemLS.lessonid)}} shape="circle" icon={<EditOutlined style={{color:"#e49c3c"}} />}></Button>
                        <Button onClick={(e)=>{e.stopPropagation();}} shape="circle" icon={<DeleteOutlined style={{color:"red"}} />}></Button>
                    </Space></Flex>
                </Flex>,children: <>
                        <Row gutter={10} style={{fontWeight:"bold"}}>
                            <Col span={3}></Col>
                            <Col span={13}>Tiêu đề</Col>
                            <Col span={6}>Loại</Col>
                            <Col span={2}></Col>
                        </Row>
                        <Divider />
                        {dataLessonChild.length !==0 && dataLessonChild.map((itemLD)=>{
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
            })}/>
        }
      </Card>
      {/* {selectKhoahoc && <VideoPlayer srcfile={selectKhoahoc} isOpen={isOpenVideoPlayer} onCancel={()=>setIsOpenVideoPlayer(false)} />} */}
      {selectKhoahoc && <VideoPlayerReact srcfile={selectKhoahoc} isOpen={isOpenVideoPlayer} onCancel={()=>setIsOpenVideoPlayer(false)} />}

          {/* Danh sách các câu hỏi  */}
      {
        dataQuizz.length !==0 ? <Card title={'Bài kiểm tra cấp chứng chỉ'}>
            <Row style={{padding:10, backgroundColor:"#fafafa"}}>
                <Col span={12}><span style={{fontWeight:"bold"}}>Tên bài kiểm tra</span></Col>
                <Col span={12}><span style={{fontWeight:"bold"}}>Thứ tự bài kiểm tra</span></Col>
            </Row>
            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />} items={
                dataQuizz.map((value)=>{
                    return {key: value.id, label: <Flex wrap align="center" gap={3}>
                    <Flex flex={5}> <h3>{value.title}</h3></Flex>
                    <Flex flex={1}><span>Số thứ tự: <span style={{fontWeight:"bold"}}>{value.order}</span></span></Flex>
                    <Flex flex={1}><span>Tổng điểm: {value.total_marks}</span></Flex>
                    <Flex flex={1}><span>Điểm đậu: {value.passing_marks}</span></Flex>
                    <Flex flex={2} justify="flex-end" wrap gap={8}><Button style={{backgroundColor:"#47d36b"}} onClick={(e)=>{
                        handleCreateQuestion(value.id);
                        e.stopPropagation();
                    }} type="primary">
                    Tạo câu hỏi</Button>
                    <Button icon={<EditOutlined style={{color:"#e49c3c"}} />} onClick={(e)=>{e.stopPropagation();setIsOpenModalUpdateQuizz(true);setQuizzidcurrent(value.id)}} shape="circle"></Button>
                    <Button icon={<DeleteOutlined style={{color:"red"}} />} onClick={(e)=>{e.stopPropagation();}} shape="circle"></Button>
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
                {dataQuestion.length !== 0 && dataQuestion.map((itemqs)=>{
                if(value.id === itemqs.idquizz) {
                        return(
                            <Fragment key={uuidv4()}>
                                <Row gutter={10}>
                                    <Col span={8}><span>{itemqs.question_text}</span></Col>
                                    <Col span={7}><span>{itemqs.correct}</span></Col>
                                    <Col span={2}><span>{itemqs.mark}</span></Col>
                                    <Col span={2}><span>{itemqs.question_type==='tracnghiem'?'Trắc nghiệm' : 'Tự luận'}</span></Col>
                                    <Col span={5}><Space direction="horizontal">
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

      <Modal title={'Tạo câu hỏi mới'} style={{overflow:"auto", maxHeight:500}} open={isOpenModalCreateQuestion} onCancel={()=>{setIsOpenModalCreateQuestion(false)}} footer={null}>
            <Tabs defaultActiveKey="1" items={[
                {key: "1", label: "Tạo câu hỏi trắc nghiệm",
                children: <>{/* Form tạo câu hỏi trắc nghiệm  */}
                    <Form form={formTracnghiem} layout="vertical" onFinish={onFinishTracnghiem}>
                    {/* Câu hỏi */}
                    <Form.Item label="Câu hỏi" name="question" rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}>
                        <Input.TextArea rows={3} placeholder="Nhập câu hỏi của bạn" />
                    </Form.Item>

                    {/* Điểm số */}
                    <Form.Item label="Điểm" name="mark" rules={[{ required: true, message: 'Vui lòng nhập điểm!' }]}>
                        <InputNumber />
                    </Form.Item>
                    {/* Các lựa chọn */}
    
                    <Form.Item label={'Đáp án 1'} name={'luachon1'} rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}>
                        <Input placeholder={'Vui lòng nhập đáp án!'}/>
                    </Form.Item>

                    <Form.Item label={'Đáp án 2'} name={'luachon2'} rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}>
                        <Input placeholder={'Vui lòng nhập đáp án!'}/>
                    </Form.Item>

                    <Form.Item label={'Đáp án 3'} name={'luachon3'} rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}>
                        <Input placeholder={'Vui lòng nhập đáp án!'}/>
                    </Form.Item>

                    <Form.Item label={'Đáp án 4'} name={'luachon4'} rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}>
                        <Input placeholder={'Vui lòng nhập đáp án!'}/>
                    </Form.Item>
                    {/* Đáp án đúng */}
                    <Form.Item label="Đáp án đúng" name="correctAnswer" rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}>
                        <Radio.Group>
                            <Space direction="horizontal">
                                <Radio key={'1'} value={'luachon1'}>Đáp án 1</Radio>
                                <Radio key={'2'} value={'luachon2'}>Đáp án 2</Radio>
                                <Radio key={'3'} value={'luachon3'}>Đáp án 3</Radio>
                                <Radio key={'4'} value={'luachon4'}>Đáp án 4</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
      
                    {/* Nút Submit */}
                    <Form.Item style={{display:'flex', justifyContent:"center"}}>
                        <Button type="primary" style={{backgroundColor:"#47d36b"}} htmlType="submit">
                            Tạo câu hỏi
                    </Button></Form.Item>
                    </Form>
                </>
                },
                {key: "2", label: "Tạo câu hỏi tự luận",
                    children: <>
                        <Form form={formTuluan} layout="vertical" onFinish={onFinishTuLuan}>
                        {/* Câu hỏi tự luận */}
                        <Form.Item label="Câu hỏi tự luận" name="question" rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}>
                            <Input.TextArea placeholder="Nhập câu hỏi tự luận của bạn" />
                        </Form.Item>
                        {/* Điểm  */}
                        <Form.Item label="Điểm" name="mark" rules={[{ required: true, message: 'Vui lòng nhập điểm!' }]}>
                            <InputNumber />
                        </Form.Item>
                        {/* Đáp án mẫu */}
                        <Form.Item label="Đáp án mẫu" name="sampleAnswer" rules={[{ required: true, message: 'Vui lòng nhập đáp án mẫu!' }]}>
                            <Input.TextArea placeholder="Nhập đáp án mẫu cho câu hỏi này" />
                        </Form.Item>

                        {/* Nút Submit */}
                        <Form.Item style={{display:'flex', justifyContent:"center"}}>
                            <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit">Tạo câu hỏi</Button>
                        </Form.Item>
                        </Form>
                    </>
                },
            ]}/>
      </Modal>

      <Modal width={600} title={'Tạo nội dung bài giảng'} footer={null} open={isOpenModalCreateLessonChild} onCancel={()=>setIsOpenModalCreateLessonChild(false)}>
            <Tabs defaultActiveKey="1" items={[
                {key:'1', label:'Tạo bài giảng Video', children:<>
                     <Form form={formTaovideo} layout="vertical" onFinish={(values)=>onFinishVideo(values)}>
                        {/* Title */}
                        <Form.Item label="Tiêu đề bài giảng" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                            <Input placeholder="Nhập tiêu đề" />
                        </Form.Item>
                        <Row gutter={12}>
                            <Col span={14}>
                                {/* Hình ảnh thumbail cho bài giảng */}
                                <Form.Item name="image" label="Chọn hình ảnh thumbail cho bài giảng" rules={[{required: true, message: 'Vui lòng chọn thumbail cho bài giảng' }]}>
                                    <Upload showUploadList fileList={fileListThumbnail} accept=".png,.jpg,.jpeg" multiple={false} beforeUpload={()=>false}
                                    maxCount={1} listType="picture-card" onChange={({fileList})=>{setFileListThumbnail(fileList)}}>
                                        <Button type="text" icon={<UploadOutlined />}></Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                {/* Video */}
                                <Form.Item label="Chọn video của bạn" name="filevideo" 
                                rules={[{validator: checkFormVideoUrlandFilevideo,}]}>
                                <Upload maxCount={1} showUploadList fileList={fileListVideoFile} accept="video/*" beforeUpload={()=>false}
                                listType="text" onChange={({fileList})=>{setFileListVideoFile(fileList)}}>
                                        <Button type="default" icon={<UploadOutlined />}>Tải video lên</Button>
                                </Upload></Form.Item>
                            </Col>
                        </Row>
                         {/* Video URL */}
                        <Form.Item label="Video URL" name="videourl" rules={[{validator: checkFormVideoUrlandFilevideo,}]}>
                            <Input placeholder="Nhập URL của video" />
                        </Form.Item>
                        {/* Submit button */}
                        <Form.Item style={{display:'flex', justifyContent:"center"}}> <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit"> Tải video lên </Button></Form.Item>
                     </Form>
                </>},
                {key:'2', label:'Tạo bài giảng tài liệu Pdf, Docx', children:<>
                    <Form form={formTaoTailieu} layout="vertical" onFinish={(values)=>onFinishTailieu(values)}>
                        {/* Title */}
                        <Form.Item label="Tiêu đề bài giảng" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                            <Input placeholder="Nhập tiêu đề" />
                        </Form.Item>
                        {/* File tài liệu  */}
                        <Form.Item label="Chọn các tài liệu của bạn" name="tailieu" rules={[{required: true, message: 'Vui lòng chọn file!' }]}>
                        <Upload maxCount={1} showUploadList fileList={fileListTailieu} accept=".pdf,.docx" beforeUpload={()=>false}
                                listType="text" onChange={({fileList})=>{setFileListTailieu(fileList)}}>
                                <Button type="default" icon={<UploadOutlined />}>Tải tài liệu lên</Button>
                        </Upload></Form.Item>
                        {/* Submit button */}
                        <Form.Item style={{display:'flex', justifyContent:"center"}}> <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit"> Tải tài liệu lên</Button></Form.Item>
                    </Form>
                </>}
            ]} />
      </Modal>
      {/* Cập nhật nội dung bài giang  */}
      <Modal title={'Cập nhật nội dung bài giảng'} footer={null} open={isopenModalUpdateLesson} onCancel={()=>setIsOpenModalUpdateLesson(false)}>
            <Form form={formUpdateLesson} style={{marginTop:20}} onFinish={handleupdatelesson}>
                <Form.Item label="Tiêu đề bài giảng" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <Input placeholder="Nhập tiêu đề" />
                </Form.Item>
                <Form.Item label="Nội dung bài giảng" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                    <Input.TextArea autoSize placeholder="Nhập nội dung" />
                </Form.Item>
                <Form.Item label="Thứ tự bài giảng" name="order" rules={[{ required: true, message: 'Vui lòng nhập thứ tự bài giảng!' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item initialValue={'0'} label={"Cho phép học thử"} name={"trylearn"} rules={[{ required: true, message: 'Vui lòng chọn giá trị!' }]}>
                    <Select options={[
                        { value: '1', label: 'Được học thử' },
                        { value: '0', label: 'Không được học thử' },
                    ]} />
                </Form.Item>
                <Form.Item style={{display:'flex', justifyContent:"center"}}>
                    <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit">Cập nhật</Button>
                </Form.Item>
            </Form>
      </Modal>
      {/* Cập nhật nội dung bài kiểm tra  */}
      {/* Cập nhật nội dung bài giang  */}
      <Modal title={'Cập nhật nội dung bài kiểm tra'} footer={null} open={isopenModalUpdateQuizz} onCancel={()=>setIsOpenModalUpdateQuizz(false)}>
            <Form form={formUpdatequizz} style={{marginTop:20}} onFinish={handleupdatequizzbyid}>
                <Form.Item label="Tiêu đề bài kiểm tra" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài kiểm tra!' }]}>
                    <Input placeholder="Nhập tiêu đề bài kiểm tra" />
                </Form.Item>
                <Form.Item label="Nội dung bài kiểm tra" name="description" rules={[{ required: true, message: 'Vui lòng nhập nội dung bài kiểm tra!' }]}>
                    <Input.TextArea autoSize placeholder="Nhập nội dung" />
                </Form.Item>
                <Form.Item label="Thứ tự bài kiểm tra" name="order" rules={[{ required: true, message: 'Vui lòng nhập thứ tự bài kiểm tra!' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label="Điểm tổng" name="total_marks" rules={[{ required: true, message: 'Vui lòng nhập điểm tổng!' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label="Điểm để đạt" name="passing_marks" rules={[{ required: true, message: 'Vui lòng nhập điểm để đạt!' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item style={{display:'flex', justifyContent:"center"}}>
                    <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit">Cập nhật</Button>
                </Form.Item>
            </Form>
      </Modal>
    </div>
     );
}

export default ListLesson;