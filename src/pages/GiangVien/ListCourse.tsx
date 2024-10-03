import React, { useEffect, useState } from 'react';

import { Button, Col, Flex, Form, Input, List, Modal, Row, Tag, Tooltip, Upload, UploadFile } from "antd";
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
    const [idCourse, setIdCourse] = useState(0);// lưu mã id khi xử lý sự kiện
    const [fileListVideoFile, setFileListVideoFile] = useState<UploadFile[]>([]);//Danh sách file video tải lên
    const [fileListTailieu, setFileListTailieu] = useState<UploadFile[]>([]);//Danh sách file tài liệu tải lên
    const [fileListImage, setFileListImage] = useState<UploadFile[]>([]);//Danh sách file hình ảnh thumbail 

    const [form] = useForm();
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
    // xử lý khi người dùng bắt đầu tạo khóa học
    const handleCreateLesson = (id: number) => {
        setIsOpenModalCreateLesson(true);
        setIdCourse(id);
    }
    // Xử lý tạo bài giảng con mới
    const onFinish = async (values:any)=> {
        try{
            const formData = new FormData();
            formData.append('lessonid', uuidv4());
            formData.append('courseid', idCourse.toString());
            formData.append('title', values['title']);
            formData.append('content', values['content']);
            formData.append('videourl', values['videourl']);
            //lấy file filevideo
            if(values.filevideo){
                values.filevideo.fileList.forEach((file:any)=>{
                    formData.append("filevideo", file.originFileObj)
                });
            }

            // lấy file tài liệu
            if(values.tailieu.fileList){
                values.tailieu.fileList.forEach((file:any)=>{
                    formData.append("tailieu", file.originFileObj)
                });
            }
            //Lấy file thumbnail cho hình ảnh thêm sau
            if(values.image.fileList){
                values.image.fileList.forEach((file:any)=>{
                    formData.append("image", file.originFileObj)
                });
            }

            await axios.post(`${API_URL}lesson/create`,formData,{
                headers:{"Content-Type":"multipart/form-data"}
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
          <div style={{padding:50}}>
              <List pagination={{pageSize: 5, align: 'center'}}
                  // style={{justifyContent: 'center', alignItems: 'center'}}
                  itemLayout="horizontal"
                  dataSource={dataCourse}
                  renderItem={(item:any, index) => (
                  <List.Item actions={[<Flex wrap gap={12}>
                          <Button type="primary" onClick={()=>handleCreateLesson(item.id)} style={{backgroundColor:"#46d36b"}}>Tạo bài giảng</Button>
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
          <Modal title={"Nội dung bài giảng"} footer={null} onCancel={()=>setIsOpenModalCreateLesson(false)} open={isOpenModalCreateLesson}
            style={{top:64, overflow:'auto', maxHeight:600}} width={700}>
                {/* <p>id của khóa học vừa chọn là {idCourse}</p> check id của khóa học */}
                <Form form={form} layout="vertical" onFinish={(values)=>onFinish(values)}>
                     {/* Title */}
                    <Form.Item label="Tiêu đề bài giảng" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                      <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Row gutter={12}>
                        {/* Content */}
                        <Col span={12}><Form.Item label="Nhập mô tả nội dung bài giảng" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                        <Input.TextArea placeholder="Nhập nội dung" rows={4} />
                        </Form.Item></Col>

                        {/* Hình ảnh thumbail cho bài giảng */}
                        <Col span={12}><Form.Item name="image" label="Chọn hình ảnh thumbail cho bài giảng" rules={[{required: true, message: 'Vui lòng chọn thumbail cho bài giảng' }]}>
                                <Upload showUploadList fileList={fileListImage} accept=".png,.jpg,.jpeg" multiple={false} beforeUpload={()=>false}
                                maxCount={1} listType="picture-card" onChange={({fileList})=>{setFileListImage(fileList)}}>
                                    <Button type="text" icon={<UploadOutlined />}></Button>
                                </Upload>
                                </Form.Item></Col>
                    </Row>
                    {/* Video URL */}
                    <Form.Item label="Video URL" name="videourl" rules={[{validator: checkFormVideoUrlandFilevideo,}]}>
                      <Input placeholder="Nhập URL của video" />
                    </Form.Item>
                    
                    <Row gutter={12}>
                        {/* file Video */}
                        <Col span={12}><Form.Item label="Chọn video của bạn" name="filevideo" 
                        rules={[{validator: checkFormVideoUrlandFilevideo,}]}>
                          <Upload maxCount={1} showUploadList fileList={fileListVideoFile} accept="video/*" beforeUpload={()=>false}
                          listType="text" onChange={({fileList})=>{setFileListVideoFile(fileList)}}>
                                  <Button type="default" icon={<UploadOutlined />}>Tải video lên</Button>
                        </Upload></Form.Item></Col>

                        {/* file tài liệu*/}
                        <Col span={12}><Form.Item label="Chọn các tài liệu của bạn" name="tailieu" rules={[{required: true, message: 'Vui lòng chọn file!' }]}>
                        <Upload showUploadList fileList={fileListTailieu} accept=".pdf,.doc,.docx" multiple={true} beforeUpload={()=>false}
                                listType="text" onChange={({fileList})=>{setFileListTailieu(fileList)}}>
                                <Button type="default" icon={<UploadOutlined />}>Tải tài liệu lên</Button>
                        </Upload></Form.Item></Col>
                    </Row>
                    
                    {/* Submit button */}
                    <Form.Item style={{display:'flex', justifyContent:"flex-end"}}> <Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit"> Tải bải giảng lên </Button></Form.Item>
                </Form>
          </Modal>
        </>
    );
}

export default ListCourse;