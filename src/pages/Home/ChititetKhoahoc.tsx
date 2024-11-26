import { Avatar, Button, Col, Collapse, Divider, Drawer, Flex, Image, Progress, Rate, Row, Space, Tabs} from "antd";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "~/assets/images";
import { v4 as uuidv4 } from "uuid";
import { API_URL, formatCurrencyVND, formatToVietnamTime } from "~/constants/constant";
import { CaretRightOutlined, MinusOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { selectAuth } from "~/redux/selector"
import { useSelector} from "react-redux";
import Login from "~/components/Layout/DefaultLayout/components/login";
const DetailCourseRegister = () => {
    const navigate = useNavigate();
    const auth = useSelector(selectAuth);
    const location = useLocation();
    const {courseid, idGV} = location.state;
    const [datachitiet, setDatachitiet] = useState<any>();
    const [dataQuizz, setDataQuizz] = useState<any>();
    const [dataLesson, setDataLesson] = useState<any[]>([]);
    const [dataLessonChild, setDataLessonChild] = useState<any[]>([]);
    const [isModalLogin, setIsModalLogin] = useState(false);
    const [openDrawerInfoGV, setOpenDrawerInfoGV] = useState(false);
    const [checkUserCousre, setCheckUserCousre] = useState<any>();//kiểm tra xem người dùng này đã đăng ký khóa học này chưa 
    const [dataReviews, setDataReviews] = useState<any>([]);//lưu lại dữ liệu đánh  giá

    //lấy dữ liệu data đánh giá
    const getReviews = async ()=>{
        try{
            const res = await axios.post(`${API_URL}reviews/getbycourseid/`, {courseid:courseid});
            console.log(res.data)
            setDataReviews(res.data);
        }catch(err){console.log(err);}
    }
    const getData = async (idcousrese: any, idGV: any)=>{
        try{
            const res = await axios.get(`${API_URL}course/getinfolessongvforcourse/${idcousrese}/${idGV}`);
            //Lấy danh sách các bài kiểm tra
            const resQuizz = await axios.get(`${API_URL}quizz/getquizz/${idcousrese}`);
            const reslessonchild = await axios.get(`${API_URL}lessonchild/lessonchildallcourse/${courseid}`);
            setDataLesson(res.data.lesson);//lưu lại danh sách bài giảng
            setDataLessonChild(reslessonchild.data);//lưu lại toàn bộ bài học con theo id khóa học
            setDatachitiet(res.data);
            setDataQuizz(resQuizz.data);
        }catch(err){console.log(err);}
    }
    useEffect(()=>{
        if(auth){
            //kiểm tra người dùng này đã đăng ký khóa học này chưa
            const check = async () => {
                if(auth){
                    const res = await axios.post(`${API_URL}enrollment/checkenrollment`, {courseid: courseid, userid: auth.id});
                    setCheckUserCousre(res.data);
                }
            }
            check();
        }
        getReviews();
        getData(courseid, idGV);
    },[courseid, idGV, auth]);

    const handletieptuchoc = async () => {
        navigate('/hoctap', {state:  {courseid: courseid,itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser: checkUserCousre}})
    }
    //Thanh toán khóa học
    const handlethanhtoanmomo = async () => {
        try{
            if(datachitiet.course.length!==0){
                console.log('thanhtoanmomo', datachitiet.course);
                const res = await axios.post(`${API_URL}momo/payment`, {
                    userid: auth?.id,
                    courseid: courseid,
                    idgv: datachitiet.course.idGV,
                    gia: datachitiet.course.price, 
                    nameCourse: datachitiet.course.title, 
                    descriptionCourse: datachitiet.course.description, 
                    imageCourse: `${API_URL}course/thumbail/${datachitiet.course.idGV}/${datachitiet.course.thumbnail}`
                })
                if(res.status===200){
                    console.log(res.data)
                    // //Tạo ra một mã mới 
                    // const respayment = await axios.post(`${API_URL}payment/create`,{
                    //     transactionid: res.data.orderId, 
                    //     userid: idGV, courseid: courseid, 
                    //     amount: res.data.amount, 
                    //     paymentdate: res.data.responseTime, 
                    //     paymentmethod: "colletionlink"
                    // })
                    //Nhảy đến trang thanh toán
                    window.location.href = res.data.shortLink;
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    //bắt đầu mới khi thanh toán thành công

    const createEnrllment = async () => {
        const tongbaigiangkhoahoc = Number(datachitiet.tongbaikiemtra) + Number(datachitiet.tongbaigiang);
        const res = await axios.post(`${API_URL}enrollment/create`,{courseid: courseid, userid: auth?.id,totalquizzes:tongbaigiangkhoahoc });
        const idenrollment = res.data.id;
        //lấy id của enrollment
        await axios.post(`${API_URL}usercoursecurrent/create`, {idenrollment: idenrollment});
        // if(res.status===201){
        //     navigate('/hoctap',{state:{courseid: courseid, itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser:res.data}});
        // }
        // if(res.status===200){
        //     navigate('/hoctap',{state:{courseid: courseid, itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser:res.data}});
        // }
    }
    //không cần phải thanh toán
    const handleDangkyhocMinephi = async () => {

        try{
            console.log(auth)
            //kiểm tra xem đã đăng nhập chưa
            if(auth===null){
                setIsModalLogin(true);
                return;
            }
            const tongbaigiangkhoahoc = Number(datachitiet.tongbaikiemtra) + Number(datachitiet.tongbaigiang);
            const res = await axios.post(`${API_URL}enrollment/create`,{courseid: courseid, userid: auth.id,totalquizzes:tongbaigiangkhoahoc });
            const idenrollment = res.data.id;
            //lấy id của enrollment
            await axios.post(`${API_URL}usercoursecurrent/create`, {idenrollment: idenrollment});
            if(res.status===201){
                navigate('/hoctap',{state:{courseid: courseid, itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser:res.data}});
            }
            if(res.status===200){
                navigate('/hoctap',{state:{courseid: courseid, itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser:res.data}});
            }
        }catch(err) {console.log(err);}
    }
    const handledangkyhoc = async (courseid:any) => {
        try{
            console.log(auth)

            //kiểm tra xem đã đăng nhập chưa
            if(auth===null){
                setIsModalLogin(true);
                return;
            }
            //thanh toán momo
            handlethanhtoanmomo();

            // const tongbaigiangkhoahoc = Number(datachitiet.tongbaikiemtra) + Number(datachitiet.tongbaigiang);
            // const res = await axios.post(`${API_URL}enrollment/create`,{courseid: courseid, userid: auth.id,totalquizzes:tongbaigiangkhoahoc });
            // const idenrollment = res.data.id;
            // //lấy id của enrollment
            // await axios.post(`${API_URL}usercoursecurrent/create`, {idenrollment: idenrollment});
            // if(res.status===201){
            //     navigate('/hoctap',{state:{courseid: courseid, itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser:res.data}});
            // }
            // if(res.status===200){
            //     navigate('/hoctap',{state:{courseid: courseid, itemCourse: datachitiet.course, itemGV: datachitiet.giangVien, enrollmentUser:res.data}});
            // }
        }catch(err) {console.log(err);}
    }
    return (
        <>  
            <Login isModalOpen={isModalLogin} onCancel={()=>setIsModalLogin(false)}/>
            {/* bug không truyền tham số  */}
            {datachitiet && location.state && (
                <Flex flex={1} style={{width:"100%",padding:30, marginBottom:50}}>
                {/* Chiếm 3 phần  */}
                <Flex vertical flex={1} style={{width:"100%",height:"100%"}}>
                    {/* Nội dung thumbail khóa học  */}
                    <h1>{datachitiet.course.title}</h1>
                    <span style={{textAlign:"justify"}}>{datachitiet.course.description}</span>
                    <Row>
                    <Col span={12}><Flex wrap gap={20} style={{marginTop:15}}>
                        <div><img alt="hihi" width={300} height={169} src={`${API_URL}course/thumbail/${datachitiet.course.idGV}/${datachitiet.course.thumbnail}`} 
                        style={{borderRadius: 20}}/></div>
                        <div>
                            <Space direction="vertical" size="middle">
                                <h4>Tổng số {datachitiet.tongbaigiang} bài học</h4>
                                <span>+ Bài kiểm tra: {datachitiet.tongbaikiemtra} bài</span>
                                {datachitiet.course.price!==0 ? <span>Giá: <span style={{fontWeight:"bold", color:"red"}}>{formatCurrencyVND(datachitiet.course.price)}</span></span>:
                                <span style={{fontWeight:'bold', color:'red'}}>Miễn phí</span>}
                                <span>Ngày phát hành: <span style={{fontWeight:"bold"}}>{formatToVietnamTime(datachitiet.course.createdAt).split(' ')[1]}</span></span>
                                {/* kiểm tra xem người dùng này đã đăng ký khóa học này chưa */}
                                {checkUserCousre !== null && auth!==null ? <Button type="primary" onClick={handletieptuchoc} style={{backgroundColor:"#47d36b", borderRadius:20}}>Tiếp tục học</Button> :
                                datachitiet.course.price !==0 ? <Button type="primary" onClick={()=>handledangkyhoc(courseid)} style={{backgroundColor:"#47d36b", borderRadius:20}}>Mua khóa học</Button> : 
                                <Button type="primary" onClick={()=>handleDangkyhocMinephi} style={{backgroundColor:"#47d36b", borderRadius:20}}>Đăng ký học ngay</Button>}
                            </Space>
                        </div>
                    </Flex></Col>
                    <Col span={12}><Flex wrap gap={20} align="center">
                        <Space direction="vertical">
                            <img alt="hehe" width={100} height={100} style={{objectFit:"cover", borderRadius:100}}
                            src={`${API_URL}admin/images/${datachitiet.giangVien.email}`} />
                            <Button onClick={()=>setOpenDrawerInfoGV(true)} type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Xem chi tiết</Button>
                        </Space>
                    
                        <Space direction="vertical">
                            <span style={{fontWeight:'bold', textAlign:'center', display:"block", fontSize:15, marginBottom:10}}>Thông tin giảng viên</span>
                            <span>Họ và tên: <span style={{fontWeight:'bold'}}>{datachitiet.giangVien.name}</span></span>
                            <span>Trình độ học vấn: <span style={{fontWeight:"bold"}}>{`${datachitiet.giangVien?.capbac??'đang cập nhật'}`}</span></span>
                            <span>Lĩnh vực: <span style={{fontWeight:"bold"}}>{`${datachitiet.giangVien?.linhvuc??'đang cập nhật'}`}</span></span>
                        </Space>
                    </Flex></Col>
                    </Row>
                    <Tabs defaultActiveKey="1" items={
                        [{key: '1', label: 'Nội dung khóa học', children: 
                            <>
                                {/* Danh sách các bài giảng con  */}
                                <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />} 
                                expandIconPosition="end" style={{margin:"15px 0px 15px 0px"}} accordion items={[{
                                    key: 'noidung1', label: <h3 style={{margin:"10px 0px 10px 0"}}>Nội dung khóa học</h3>,
                                    children:<Space style={{width:"100%"}} direction="vertical">{
                                        dataLesson.length!==0 && dataLesson.map((itemLS)=>{
                                        return <Collapse expandIcon={({ isActive }) => isActive?<MinusOutlined style={{fontWeight:'bold',color:"#26743B"}} />:<PlusOutlined style={{fontWeight:'bold',color:"#26743B"}} />}
                                        key={uuidv4()} accordion items={[
                                            {key: itemLS.lessonid, label: <h3>{itemLS.title}</h3>, children: <Fragment>
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
                                                                                itemLD.type === 'video' ? <Avatar size={"small"}  src={<img alt="hihi" src={images.iconplaying} /> } /> : 
                                                                                itemLD.tailieu.includes('docx') ?  <Button icon={<Avatar src={<img alt="hihi" src={images.iconword} /> } /> } type="text" shape="circle"
                                                                                key={`${uuidv4()}doc1`}></Button>:
                                                                                <Button icon={<Avatar src={<img alt="hihi" src={images.iconpdf} /> } />} type="text" shape="circle"
                                                                                key={`${uuidv4()}pdf`}></Button>                  
                                                                            }</Col>
                                                                        </Row>
                                                                        <Divider />
                                                                </Fragment>
                                                        }
                                                    })}
                                            </Fragment>}
                                        ]} />
                                    })}</Space>
                                }]} />
                                {dataQuizz.length !== 0 ? <>
                                <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />}
                                expandIconPosition="end" accordion items={[
                                    {key: 'baikiemtra', label: <h3 style={{margin:"10px 0px 10px 0"}}>Danh sách bài kiểm tra</h3>, 
                                    children: <>
                                        <Row gutter={10} style={{fontWeight:"bold"}}>
                                            <Col span={10}>Bài kiểm tra</Col>
                                            <Col style={{textAlign:"center"}} span={5}>Điểm đậu</Col>
                                            <Col style={{textAlign:"center"}} span={5}>Tổng điểm</Col>
                                            <Col style={{textAlign:"center"}} span={4}></Col>
                                        </Row>
                                        <Divider />
                                        {dataQuizz.map((itemquizz:any)=>{
                                            return(
                                                    <Fragment key={uuidv4()}>
                                                        <Row gutter={10} align={"middle"}>
                                                            <Col span={10}>{itemquizz.title}</Col>
                                                            <Col style={{textAlign:"center"}} span={5}>{itemquizz.passing_marks}</Col>
                                                            <Col style={{textAlign:"center"}} span={5}>{itemquizz.total_marks}</Col>
                                                            <Col style={{textAlign:"center"}}  span={4}><Avatar size="large" 
                                                            src={<img src={'https://img.lovepik.com/free-png/20211125/lovepik-student-who-takes-the-test-paper-png-image_401138206_wh1200.png'} 
                                                            alt="thumbnail"></img>} /></Col>
                                                        </Row>
                                                        <Divider />
                                                    </Fragment>
                                            )
                                        })}
                                    </>}
                                ]}  />
                                </> : <></>}
                            </>
                        },
                        {key: '2', label: 'Đánh giá khóa học', children: <>
                            {
                                dataReviews.course && <Row>
                                <Col span={12}>
                                <Space direction="vertical">
                                    <h1><span>{dataReviews.course.rate||'0.0'}</span><span style={{fontSize:20, color:"gray"}}>/5</span></h1>
                                    <Rate style={{fontSize:30}} disabled allowHalf defaultValue={dataReviews.course.rate||0} />
                                    <span style={{color:"gray"}}>{`${dataReviews.luotdanhgia}`} lượt đánh giá</span>
                                </Space></Col>
                                <Col span={12}>
                                    <Space direction="vertical">
                                        <Space direction="horizontal" size={"small"}>
                                            <Rate disabled allowHalf defaultValue={5} />
                                            <Progress format={(percent)=><span style={{color:"#000000"}}>{`${percent}%`}</span>} strokeLinecap="square" size={[200, 10]} percent={Number(dataReviews.rate5||0)} strokeColor={"#fadb14"} />
                                        </Space>
                                        <Space direction="horizontal" size={"small"}>
                                            <Rate disabled allowHalf defaultValue={4} />
                                            <Progress format={(percent)=><span style={{color:"#000000"}}>{`${percent}%`}</span>} strokeLinecap="square" size={[200, 10]} percent={Number(dataReviews.rate4||0)} strokeColor={"#fadb14"} />
                                        </Space>
                                        <Space direction="horizontal" size={"small"}>
                                            <Rate disabled allowHalf defaultValue={3} />
                                            <Progress format={(percent)=><span style={{color:"#000000"}}>{`${percent}%`}</span>} strokeLinecap="square" size={[200, 10]} percent={Number(dataReviews.rate3||0)} strokeColor={"#fadb14"} />
                                        </Space>
                                        <Space direction="horizontal" size={"small"}>
                                            <Rate disabled allowHalf defaultValue={2} />
                                            <Progress format={(percent)=><span style={{color:"#000000"}}>{`${percent}%`}</span>} strokeLinecap="square" size={[200, 10]} percent={Number(dataReviews.rate2||0)} strokeColor={"#fadb14"} />
                                        </Space>
                                        <Space direction="horizontal" size={"small"}>
                                            <Rate disabled allowHalf defaultValue={1} />
                                            <Progress format={(percent)=><span style={{color:"#000000"}}>{`${percent}%`}</span>} strokeLinecap="square" size={[200, 10]} percent={Number(dataReviews.rate1||0)} strokeColor={"#fadb14"} />
                                        </Space>
                                    </Space>
                                </Col>
                                {/* <Col span={12}></Col> */}
                            </Row>
                            }
                            <Divider />
                            {/* Phần đánh giá  */}
                            {
                                dataReviews.infodanhgia && dataReviews.infodanhgia.map((item:any)=>{
                                    return <Row key={item.id}>
                                    <Col span={1}>{item.user.avatar ? <Avatar src={`${API_URL}auth/getavatarnd/${item.user.id}/${item.user.avatar}`} />:
                                    <Avatar icon={<UserOutlined />} />}</Col>
                                    <Col span={23}>
                                        <Space direction="vertical">
                                            <Space size={0} direction="vertical">
                                                <span style={{fontSize:13}}>{item.user.name||'Người dùng'}</span>
                                                <Rate style={{fontSize:13}} defaultValue={item.rating||0} />
                                                <span style={{fontSize:13}}>{formatToVietnamTime(item.createdAt)}</span>
                                            </Space>
                                            <span style={{fontSize:16}}>{item.comment}</span>
                                            {item.hinhanh && <Image alt="hihi" style={{objectFit:"contain"}} width={120} height={67} src={`${API_URL}reviews/getimage/${item.idenrollment}/${item.hinhanh}`} />}
                                        </Space>
                                    </Col>
                                </Row>
                                })
                            }
                        </>}
                    ]
                    } />
                </Flex>
                {/* Chiếm 1 phần  */}
                {/* <Flex vertical gap={15} align="center" flex={1} style={{width:"100%",height:"100%", padding:20}}>
                        
                </Flex> */}
            </Flex>
            )}
            <Drawer title={'Thông tin chi tiết Giảng viên'} onClose={()=>setOpenDrawerInfoGV(false)} open={openDrawerInfoGV}>
                {
                    datachitiet&&datachitiet.giangVien&&
                        <Space direction="vertical">
                            <Space style={{display:"flex", justifyContent:"center"}}>
                                <Image alt="hihi" width={100} height={100} style={{borderRadius:8, objectFit:"cover"}} src={`${API_URL}admin/images/${datachitiet.giangVien.email}`} />
                            </Space>
                            <Divider />
                            <Space direction="vertical">
                                <span><span style={{fontWeight:"bold"}}>Họ và tên: </span><span>{datachitiet.giangVien.name??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                                <span><span style={{fontWeight:"bold"}}>Email:</span> <span>{datachitiet.giangVien.email??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                                <span><span style={{fontWeight:"bold"}}>Trình độ học vấn: </span><span>{datachitiet.giangVien.capbac??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                                <span><span style={{fontWeight:"bold"}}>Lĩnh vực: </span><span>{datachitiet.giangVien.linhvuc??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                                <span><span style={{fontWeight:"bold"}}>Trường học: </span><span>{datachitiet.giangVien.truonghoc??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                                <span><span style={{fontWeight:"bold"}}>Kinh nghiệm làm việc: </span><span>{datachitiet.giangVien.kinhnghiem??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                                <span><span style={{fontWeight:"bold"}}>Châm ngôn sống: </span><span>{datachitiet.giangVien.chamngonsong??<span style={{color:"red"}}>đang cập nhật</span>}</span></span>
                            </Space>
                        </Space>
                    
                }
            </Drawer>
        </>
    )
}

export default DetailCourseRegister;