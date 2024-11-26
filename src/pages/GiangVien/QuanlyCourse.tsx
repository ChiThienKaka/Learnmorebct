import { CaretRightOutlined, CommentOutlined, FileImageOutlined, SendOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Collapse, ConfigProvider, Drawer, Form, Input, Progress, Row, Space, Table, Tag, Upload, UploadFile } from "antd";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL, formatToVietnamTime } from "~/constants/constant";
import { selectAuth } from "~/redux/selector";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "antd/es/form/Form";
import images from "~/assets/images";
import { io } from "socket.io-client";

const QuanlyCourse = () => {
    const auth = useSelector(selectAuth);//Lấy giảng viên hiện tại
    const [dataCourse, setDataCourse] = useState<any[]>([]);//data khóa học 
    const [dataEnrollmentfull, setDataEnrollmentfull] = useState<any[]>([]);//data dữ liệu học sinh các khóa học của giảng viên
    const [isOpendrawerChat, setIsOpendrawerChat] = useState(false);
    const [keydefaultactive, setKeydefaultactive] = useState(0);
    const [fileListImage, setFileListImage] = useState<UploadFile[]>();
    const [formChatcourseuser] = useForm();
    const idenrollment = useRef<string>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [datachat, setDatachat] = useState<any[]>([]); //chat với học viên
    const avartaruser = useRef('');
    //lấy dữ liệu chat lần đầu tiên
    const handledoanchat = async (idenroll:any) => {
        try{
            const res = await axios.get(`${API_URL}chatcourseuser/get/${idenroll}`);
            console.log(res.data);
            setDatachat(res.data);
        }catch(err){console.log(err);}
    }
    const handlesocket = () => {
        const socket = io('http://localhost:5000'); // Kết nối tới server Socket.IO
        // Listener cho kết nối
        socket.on('connect', () => {
            console.log('Kết nối với server:', socket.id);
            socket.emit('joinRoom', { room: `${idenrollment.current}` }); // Chỉ gửi yêu cầu vào phòng khi kết nối phải là chuỗi
        });
        // Lắng nghe sự kiện phản hồi 'joinRoom' từ server (đăng ký một lần)
        socket.on('joinRoom', (room) => {
            console.log('Đã vào phòng', room);
        });
        // Lắng nghe sự kiện 'newMessage' và cập nhật danh sách tin nhắn
        socket.on('newMessage', (newMessage) => {
            setDatachat(newMessage);
            console.log('Đã nhận tin nhắn:', newMessage);
            console.log(newMessage);
        });
        // Hàm dọn dẹp để xử lý ngắt kết nối
        return () => {
            socket.disconnect();
            console.log('Ngắt kết nối với server');
            socket.off('newMessage'); // Gỡ bỏ listener cho 'newMessage'
        };
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
    }, [datachat,isOpendrawerChat]);
    const handlechathocvien = (key: any, idenroll:any) => {
        idenrollment.current = idenroll;
        //socket
        handlesocket();
        setKeydefaultactive(key);
        setIsOpendrawerChat(true);
    }
    //chat với học vien
    const handleguinoidungdoanchat = async (values: any) => {
        console.log(values);
        const formData = new FormData();
        formData.append('idenrollment', idenrollment.current || 'false');
        formData.append('gvchat', 'true');
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
    //lấy dữ liệu từ khóa học từ server
    const getDataCourse = async ()=>{
        try{
            const response = await axios.get(`${API_URL}course/getcourses/${auth?.id}`);
            //từ id của giáo viên trên lấy ra danh sách học sinh
            const allenrollment = await Promise.all(
               response.data.map(async(item:any)=>{
                    const resenrollment = await axios.get(`${API_URL}enrollment/enrollmentbyidcourse/${item.id}`);
                    const result = resenrollment.data;
                    return {course: item, enrollment: result, tongsinhvien: result.length};
               })
            )
            console.log(allenrollment)
            setDataCourse(allenrollment);
        }catch(err){console.log(err)};
    }
    useEffect(()=>{
        getDataCourse();
    },[])
    return(
        <>
            <Card title='Quản lý khóa học'>
                {
                    dataCourse && dataCourse.map((item)=>{
                        return <Collapse defaultActiveKey={keydefaultactive} key={item.course.id} expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />}
                        expandIconPosition="end" items={[
                            {key: '2', label:<Row align={"middle"}>
                                <Col span={3}>
                                    <img alt='thumbail' height={67} style={{objectFit:"cover", borderRadius:10}} width={120} src={`${API_URL}course/thumbail/${item.course.idGV}/${item.course.thumbnail}`} />
                                </Col>
                                <Col span={12}>
                                    <Space size={"small"} direction="vertical">
                                        <span style={{fontWeight:"bold"}}>{item.course.title}</span>
                                        <span>{item.course.description}</span>
                                    </Space>
                                </Col>
                                <Col span={3}>
                                    {item.course.status ? <Tag color="green">Đã duyệt</Tag>: <Tag color="red">Chờ duyệt</Tag>}
                                </Col>
                                <Col span={4}>
                                    <span>{`${item.tongsinhvien} học viên `}<UsergroupAddOutlined style={{fontSize:15}} /></span>
                                </Col>
                            </Row>, 
                            children: item.enrollment.length!==0 && 
                            <Table
                            columns={[
                                {title:'Học viên', key: 'user', dataIndex:'user', 
                                    render: (text)=>{
                                        return <span>{text.email}</span>
                                    }
                                },
                                {title:'Avatar', key: 'user', dataIndex:'user', 
                                    render: (text)=>{
                                        return text.avatar !==null ?<Avatar src={`${API_URL}auth/getavatarnd/${text.id}/${text.avatar}`} /> : <Avatar icon={<UserOutlined />} />
                                    }
                                },
                                {title:'Điểm trung bình', key: 'diemtb', dataIndex:'diemtb', align:'center',
                                    render: (text)=>{
                                        return <span>{text}</span>
                                    }
                                },
                                {title:'Bài đã học', key: 'totalquizzes', dataIndex:'totalquizzes', align:'center',
                                    render: (text, record:any)=>{
                                        return <span>{`${record.process}/${text}`}</span>
                                    }
                                },
                                {title:'Tiến trình', key: 'status', dataIndex:'status', align:'center',
                                    // #52c41a màu xanh
                                    render: (text, record:any)=>{
                                        const phantram = Math.floor(Number(record.process) * 100 / Number(record.totalquizzes));
                                        return <ConfigProvider theme={{
                                            components: {
                                                Progress: {
                                                    defaultColor: "red"
                                                }
                                            }
                                        }}>
                                                <Progress format={(percent)=>{
                                                    return <span style={{color:"#ffffff"}}>{percent}%</span>
                                                }} strokeColor={phantram<50?'red':phantram<100?'#1677ff':'#52c41a'} percent={phantram} percentPosition={{ align: 'center', type: 'inner' }} size={[400, 20]} />
                                        </ConfigProvider>
                                    }
                                },
                                {title:'Nhắn tin', key: 'id', dataIndex:'id', align:'center',
                                    render: (text, record)=>{
                                        return <Button onClick={()=>{
                                            //lấy avatar người dùng nếu có
                                            if(record.user.avatar!==null){
                                                avartaruser.current = `${API_URL}auth/getavatarnd/${record.user.id}/${record.user.avatar}`;
                                            }else{
                                                avartaruser.current = '';
                                            }
                                            console.log(avartaruser.current)
                                            handledoanchat(text);//idenrollment
                                            handlechathocvien(item.course.id, text);}} icon={<CommentOutlined />}></Button>
                                    }
                                },
                            ]}
                            pagination={false} dataSource={item.enrollment} />
                        },
                        ]} />
                    })
                    
                }
            </Card>
            <Drawer width={500} title={'Chat với học viên'} open={isOpendrawerChat} onClose={()=>setIsOpendrawerChat(false)}
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
                                        item.gvchat === false ? (
                                        <Row>
                                            <Col span={2}>{avartaruser.current!==''?<Avatar src={avartaruser.current} />:<Avatar icon={<UserOutlined />} />}</Col>
                                            <Col span={19}><div style={{backgroundColor:"#d7d7d7", padding:10, borderRadius: 8}}>
                                                {item.hinhanh && <img width={"100%"} style={{objectFit:"contain"}} height={100} src={images.icons8facebook} />}
                                                <Space direction="vertical">
                                                    {item.vanban!=='undefined' && <span>{item.vanban}</span>}
                                                    <span>{formatToVietnamTime(item.createdAt)}</span>
                                                </Space>
                                            </div></Col>
                                            <Col span={3}></Col>
                                            </Row>
                                        ):(<Row>
                                        <Col span={6}></Col>
                                        <Col span={18}><div style={{backgroundColor:"#b0dda8", padding:10, borderRadius: 8}}>
                                                {item.hinhanh && <img width={"100%"} style={{objectFit:"contain"}} height={100} src={images.icons8facebook} />}
                                                <Space direction="vertical">
                                                    {item.vanban!=='undefined' && <span>{item.vanban}</span>}
                                                    <span>{formatToVietnamTime(item.createdAt)}</span>
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
        </>
    )
}

export default QuanlyCourse;