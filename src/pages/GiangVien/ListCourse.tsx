import React, { useEffect, useState } from 'react';

import { Button, Col, Flex, Form, Input, InputNumber, List, Modal, notification, Row, Tag, Tooltip, Upload, UploadFile } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { API_URL } from '~/constants/constant';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useForm } from 'antd/es/form/Form';
import { selectAuth } from '~/redux/selector';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function ListCourse() {
    const auth = useSelector(selectAuth);//Lấy giảng viên hiện tại
    const [dataCourse, setDataCourse] = useState<any[]>([]);//data khóa học 
    const [isOpenModalCreateLesson, setIsOpenModalCreateLesson] = useState(false); // Bật tắt Modal
    const [isOpenModalCreateQuizz, setIsOpenModalCreateQuizz] = useState(false); // Bật form tạo bài kiểm tra
    const [idCourse, setIdCourse] = useState(0);// lưu mã id khi xử lý sự kiện
    const [fileListVideoFile, setFileListVideoFile] = useState<UploadFile[]>([]);//Danh sách file video tải lên
    const [fileListTailieu, setFileListTailieu] = useState<UploadFile[]>([]);//Danh sách file tài liệu tải lên
    const [fileListImage, setFileListImage] = useState<UploadFile[]>([]);//Danh sách file hình ảnh thumbail 

    const [api, contextHolder] = notification.useNotification();//Thông báo thành công
    //Tạo sự kiện thông báo
    const openNotification = () => {
        api.success({
            message: 'Tạo bài kiểm tra thành công',
            placement: 'top',
            duration:2.5
        })
    }


    const [form] = useForm();
    const [formQuizz] = useForm();
    const navigate = useNavigate();


    //Check dữ liệu 1 trong 2 form videourl và filevideo phải có
    const checkFormVideoUrlandFilevideo = (_:any, value:any)=>{
        const filevideo = form.getFieldValue('filevideo');
        const videourl =  form.getFieldValue('videourl');
        // Nếu cả hai trường đều không có giá trị thì báo lỗi
        if(!filevideo && !videourl){
            return Promise.reject(new Error('Bạn phải nhập ít nhất một trong hai trường video URL hoặc video của bạn!'));
        }
        // Nếu có ít nhất một trường có giá trị thì không có lỗi
        return Promise.resolve();
    }


    //lấy dữ liệu từ khóa học từ server
    const getDataCourse = async ()=>{
        try{
            const response = await axios.get(`${API_URL}course/getcourses/${auth?.id}`);
            setDataCourse(response.data);
        }catch(err){console.log(err)};
    }
    useEffect(()=>{
        getDataCourse();
    },[])

    // xử lý khi người dùng bắt đầu tạo bài kiểm tra
    const handleCreateQuizz = async (id: number) => {
        setIsOpenModalCreateQuizz(true);
        setIdCourse(id);
    }


    // xử lý khi người dùng bắt đầu tạo khóa học
    const handleCreateLesson = (id: number) => {
        setIsOpenModalCreateLesson(true);
        setIdCourse(id);
    }


    // Xử lý form tạo bài kiểm tra
    const onFinishQuizz = async (values: any)=> {
        try {
            const res = await axios.post(`${API_URL}quizz/createquizz`, {
                title: values['title'],
                description: values['description'],
                total_marks: values['total_marks'],
                passing_marks: values['passing_marks'],
                courseid: idCourse
            })
            console.log(res.data);
            setIsOpenModalCreateQuizz(false);
            formQuizz.resetFields();
            openNotification();
        }catch(e){console.log(e);}
    }

    // Xử lý tạo bài giảng con mới
    const onFinish = async (values:any)=> {
        try{
            await axios.post(`${API_URL}lesson/create`,{
                courseid: idCourse.toString(), 
                title: values['title'], 
                content: values['content'],
                lessonid: uuidv4()
            })
        
            setIsOpenModalCreateLesson(false)
            // reset toàn bộ dữ liệu 
            setFileListVideoFile([]);
            setFileListTailieu([]);
            form.resetFields();
        }catch(err){console.log(err)}
    }


    return (
        <>
        {contextHolder}
          <div style={{padding:50}}>
              <List pagination={{pageSize: 5, align: 'center'}}
                  // style={{justifyContent: 'center', alignItems: 'center'}}
                  itemLayout="horizontal"
                  dataSource={dataCourse}
                  renderItem={(item:any, index) => (
                  <List.Item actions={[<Flex wrap gap={12}>
                          <Button type="primary" onClick={()=>handleCreateLesson(item.id)} style={{backgroundColor:"#46d36b"}}>Tạo bài giảng</Button>
                          <Button type="primary" onClick={()=>handleCreateQuizz(item.id)} style={{backgroundColor:"#46d36b"}}>Tạo bài kiểm tra</Button>
                          <Flex wrap gap={3}>
                              <Tooltip title='Xem danh sách bài giảng'><Button onClick={()=>navigate('/giangvien/listlesson', {state: {id: item.id, idGV: item.idGV, thumbnail: item.thumbnail }, replace: true})} shape='circle' icon={<EyeOutlined />}></Button></Tooltip>
                              <Tooltip title='Chỉnh sửa khóa học'><Button shape='circle' icon={<EditOutlined />}></Button></Tooltip>
                              <Tooltip title='Xóa khóa học'><Button shape='circle' icon={<DeleteOutlined />}></Button></Tooltip>
                          </Flex>
                      </Flex>]}>
                      <List.Item.Meta style={{justifyContent: 'center', alignItems:"center"}}
                      avatar={<img alt='thumbail' height={67} style={{objectFit:"cover", borderRadius:10}} width={120} src={`${API_URL}course/thumbail/${item.idGV}/${item.thumbnail}`} />}
                      title={<span>{item.title}</span>}
                      description={item.description}
                      />{item.status ? <Tag color="green">Đã duyệt</Tag>: <Tag color="red">Chờ duyệt</Tag>}
                  </List.Item>
              )}/>
          </div>
          {/* Tạo Form Thiết lập bài giảng  */}
          <Modal title={"Nội dung bài giảng"} footer={null} onCancel={()=>setIsOpenModalCreateLesson(false)} open={isOpenModalCreateLesson}>
                {/* <p>id của khóa học vừa chọn là {idCourse}</p> check id của khóa học */}
                <Form form={form} layout="vertical" onFinish={(values)=>onFinish(values)}>
                     {/* Title */}
                    <Form.Item label="Tiêu đề bài giảng" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                      <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    {/* Content */}
                    <Form.Item label="Nhập mô tả nội dung bài giảng" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                        <Input.TextArea placeholder="Nhập nội dung" rows={4} />
                    </Form.Item>
                    {/* Submit button */}
                    <Form.Item style={{display:'flex', justifyContent:"center"}}> <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit"> Tải bải giảng lên </Button></Form.Item>
                </Form>
          </Modal>
          {/* Form thiết lập bài kiểm tra  */}
          <Modal title={'Bài kiểm tra kết thúc khóa học'} open={isOpenModalCreateQuizz} onCancel={()=>setIsOpenModalCreateQuizz(false)} footer={null}>
          <Form form={formQuizz} layout="vertical" onFinish={onFinishQuizz} initialValues={{ total_marks: 10, passing_marks: 5 }}>
            {/* Title */}
            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                <Input placeholder="Tiêu đề bài kiểm tra" />
            </Form.Item>
            
            {/* Description */}
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                <Input.TextArea rows={2} placeholder="Mô tả bài kiểm tra" />
            </Form.Item>

            {/* Total Marks */}
            <Form.Item label="Tổng điểm cho bài kiểm tra" name="total_marks" rules={[{ required: true, message: 'Vui lòng nhập tổng điểm!' }]}>
                <InputNumber min={0} max={1000} placeholder="Tổng điểm cho bài kiểm tra" style={{ width: '100%' }} />
            </Form.Item>

            {/* Passing Marks */}
            <Form.Item label="Điểm để qua bài kiểm tra" name="passing_marks" rules={[{ required: true, message: 'Vui lòng nhập điểm để qua!' }]}>
                <InputNumber min={0} max={1000} placeholder="Điểm để qua bài kiểm tra" style={{ width: '100%' }} />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{display:'flex', justifyContent:"center"}}>
                <Button type="primary" style={{backgroundColor:"#47d46b"}} htmlType="submit">Tải bài kiểm tra lên</Button>
            </Form.Item>
            </Form>
          </Modal>
        </>
    );
}

export default ListCourse;