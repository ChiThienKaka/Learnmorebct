
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Drawer, Flex, Form, Input, Row, Select, Space, Upload, UploadFile } from "antd";
import ImgCrop from "antd-img-crop";
import {useState } from "react";
import { API_URL } from "~/constants/constant";
import images from "~/assets/images";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
interface Prop{
  usercurrent: {id: string; email: string; role: string; name?: string; avatar?: string}
}
const AccountUpgrade = (prop: Prop)=> {
  const [formUpdateND] = useForm();
  const {usercurrent} = prop;
  const [fileListImage, setFileListImage] = useState<UploadFile[]>();
    // tắt mở form 
    const [open, setOpen] = useState(false);
    //Xử lý sự kiện update ảnh đại diện
    const handleupdatenguoidung = async (values: any) => {
        const formData = new FormData();
        formData.append('name', values['name']);
        formData.append('userid', usercurrent.id);
        console.log(usercurrent.id);
        if(values['image']){
            values.image.fileList.forEach((file:any)=>{
                formData.append("image", file.originFileObj)
            });
        }
        // cập nhật dữ liệu
        try{
          const res = await axios.post(`${API_URL}auth/updateusernd`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(res.data);
        }catch(err){console.log(err);}
        setFileListImage([]);
        setOpen(false);
    }
    return (
        <>
            <Button style={{color:"#666666", justifyContent:"start"}} type="link" onClick={()=>setOpen(true)}>
                Thông tin cá nhân
            </Button>
            <Drawer destroyOnClose title="Thông tin cá nhân" onClose={()=>setOpen(false)} open={open}
            styles={{body: {paddingBottom: 80,},}}>
            {/* Form */}
                <Flex justify="center">
                    {
                      usercurrent.avatar ? <img height={100} alt="hihi" width={100} style={{borderRadius:100}} src={`${API_URL}auth/getavatarnd/${usercurrent.id}/${usercurrent.avatar}`} /> :
                      <img height={100} alt="hihi" width={100} style={{borderRadius:100}} src={images.userrong}/>
                    }
                </Flex>
                <Form form={formUpdateND} onFinish={handleupdatenguoidung} initialValues={{name: usercurrent.name??usercurrent.email.split('@')[0], email: usercurrent.email}} style={{marginTop:20}} scrollToFirstError>
                    <Form.Item name={'email'} label={"Email"} rules={[{required: false, message: 'Vui lòng nhập email của bạn'}]}>
                          <Input disabled></Input>
                    </Form.Item>
                    <Form.Item name={'name'} label={"Họ và tên"} rules={[{required: true, message: 'Vui lòng nhập họ tên của bạn' }]}>
                          <Input></Input>
                    </Form.Item>
                    {/* Hình ảnh khóa học */}
                    <span >Chọn hình đại diện mới:</span>
                    <Form.Item style={{marginTop:10}} name="image" rules={[{required: false, message: 'Vui lòng chọn hình đại diện của bạn' }]}>
                      <Upload showUploadList fileList={fileListImage} accept=".png,.jpg,.jpeg" multiple={false} beforeUpload={()=>false}
                      maxCount={1} listType="picture-card" onChange={({fileList})=>{setFileListImage(fileList)}}>
                        <Button type="text" icon={<UploadOutlined />}></Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item style={{display:"flex", justifyContent:"center"}}><Button style={{backgroundColor:"#47d36b"}} type="primary" htmlType="submit">Lưu</Button></Form.Item>
                </Form>
            </Drawer>
        </>
  );
};
   
export default AccountUpgrade;