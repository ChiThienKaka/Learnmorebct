import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, InputNumber, Row, Col, UploadFile, notification} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { API_URL } from '~/constants/constant';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAuth } from '~/redux/selector';

const { TextArea } = Input;
const { Option } = Select;
//định nghĩa kiểu truyền vào cho danh mục
const CreateCourseForm = () => {
  const auth = useSelector(selectAuth);
  const [form] = Form.useForm();
  const [dataDanhmuc, setDataDanhmuc] = useState<any[]>([]);
  const [dataDanhmucChild, setDataDanhmucChild] = useState<any[]>([]);//hàm con gốc để hứng giá trị
  const [dataDanhmuccon, setDataDanhmuccon] = useState<any[]>([]);//lấy giá trị hiện tại khi thay đổi
  const [fileListImage, setFileListImage] = useState<UploadFile[]>([]);//Ds file image tải lên
  const [api, contextHolder] = notification.useNotification();//Thông báo thành công
  //Tạo sự kiện thông báo
  const openNotification = () => {
    api.success({
        message: 'Tạo khóa học thành công',
        placement: 'top',
        duration:2.5
    })
}
 // lấy toàn bộ dữ liệu trong danh mục
  const getDataDanhmuc = async () => {
  const data = await axios.get(`${API_URL}categori/danhmuc`);
  const datachild = await axios.get(`${API_URL}categori/danhmuc1`);
  // Lấy danh sách danh mục con 
  setDataDanhmucChild(datachild.data.danhmuccon);
  // lấy danh sách danh mục cha
  setDataDanhmuc(data.data.data);
}


  useEffect(()=>{
    getDataDanhmuc();
  },[])


     // tạo khóa học mới
  const onFinish = async (values:any) => {
    console.log('Form Values:', values);
    // Gửi dữ liệu khóa học lên server hoặc xử lý tiếp
    try{
      if(auth){
        const formData = new FormData();
        formData.append('title', values['courseName']);
        formData.append('idgv',auth.id);
        formData.append('iddanhmuc', values['categoryCT']);
        formData.append('price', values['price']);
        formData.append('description', values['description']);
        if(values.image){
          values.image.fileList.forEach((item:any)=>{
            formData.append('thumbail', item.originFileObj);
          })
        }
        //đẩy dữ liệu lên data
        const reponse = await axios.post(`${API_URL}course/create`, formData, {
          headers:{"Content-Type":"multipart/form-data"}
        });
        console.log(reponse,'Đưa dữ liệu lên server thành công')
      }
      openNotification(); //mở thông báo
      setFileListImage([]);
      form.resetFields();
    }catch(e){
      console.log(e);
    }
  };
  return (
    <>
      {/* bắt buộc phải thêm mới chạy được thông báo  */}
      {contextHolder}
      <Form form={form} style={{padding:50, backgroundColor:"#f5f5f5"}} layout="vertical" onFinish={onFinish} scrollToFirstError>
        <Row gutter={15} >
          {/* Tên khóa học */}
            <Col span={12}><Form.Item name="courseName" label="Tên khóa học" rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}>
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item></Col>
            
            {/* Giá khóa học */}
            <Col span={12}><Form.Item name="price" label="Giá khóa học" rules={[{ required: true, message: 'Vui lòng nhập giá khóa học' }]}>
              <InputNumber min={0} step={1000} placeholder="Nhập giá" style={{ width: '100%' }} />
            </Form.Item></Col>
        </Row>
  
        {/* Mô tả khóa học */}
        <Form.Item name="description" label="Mô tả khóa học"rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}>
          <TextArea showCount rows={4} placeholder="Nhập mô tả khóa học" />
        </Form.Item>
  
  
        <Row gutter={15}>
          {/* Chọn danh mục khóa học */}
          <Col span={12}><Form.Item name="category" label="Chọn lĩnh vực" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
              <Select placeholder="Chọn danh mục" onSelect={(value)=>{
                    const danhmucon = dataDanhmucChild.filter((item)=> item.parentid === value);
                    setDataDanhmuccon(danhmucon);}}>
                {/* <Option value="frontend">Frontend</Option> */}
                {dataDanhmuc && dataDanhmuc.map((item)=>{
                  return <Option key={item.id} value={item.id}>{item.name}</Option>;
                })}</Select>
            </Form.Item></Col>
  
          {/* Chọn danh mục chi tiết cho khóa học */}
          <Col span={12}><Form.Item name="categoryCT" label="Chọn lĩnh vực cụ thể" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
          <Select placeholder="Chọn danh mục">
            {/* <Option value="frontend">Frontend</Option> */}
            {dataDanhmuccon && dataDanhmuccon.map((item)=>{
              return <Option key={item.id} value={item.id}>{item.name}</Option>;
            })}</Select></Form.Item></Col>
  
        </Row>
        
        {/* Hình ảnh khóa học */}
        <Form.Item name="image" label="Chọn hình ảnh thumbail cho khóa học" rules={[{required: true, message: 'Vui lòng chọn thumbail cho khóa học' }]}>
          <Upload showUploadList fileList={fileListImage} accept=".png,.jpg,.jpeg" multiple={false} beforeUpload={()=>false}
          maxCount={1} listType="picture-card" onChange={({fileList})=>{setFileListImage(fileList)}}>
            <Button type="text" icon={<UploadOutlined />}></Button>
          </Upload>
        </Form.Item>
  
          <Form.Item  style={{display:"flex",justifyContent:"center", alignItems:"center"}}><Button type="primary" htmlType="submit"
          style={{backgroundColor:"#46d36b"}}>
                Tải khóa học lên</Button></Form.Item>
      </Form>
    </>
  );
};

export default CreateCourseForm;
