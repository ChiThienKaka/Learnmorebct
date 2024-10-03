
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Upload, UploadFile } from "antd";
import ImgCrop from "antd-img-crop";
import {useState } from "react";

const AccountUpgrade = ()=> {
    // tắt mở form 
    const [open, setOpen] = useState(false);
    //Xử lý ảnh đại diện
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          crossOrigin:'anonymous'
        },
      ]);
      const onChange = ({ fileList: newFileList}:{fileList: UploadFile<any>[]}) => {
        console.log(fileList)
        setFileList(newFileList);
      };
      const onPreview = async (file:any) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };
    //kêt thúc xử lý ảnh đại diện
    const formItemLayout = {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 8,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 16,
          },
        },
      };
    return (
        <>
            <Button style={{color:"#666666", justifyContent:"start"}} type="link" onClick={()=>setOpen(true)}>
                Nâng cấp
            </Button>
            <Drawer
            title="Đăng ký tài khoản Giảng viên"
            width={720}
            onClose={()=>setOpen(false)}
            open={open}
            styles={{
                body: {paddingBottom: 80,},
            }}
            extra={
                <Space>
                    <Button onClick={()=>setOpen(false)}>Hủy</Button>
                    <Button onClick={()=>setOpen(false)} type="primary">Gửi</Button>
                </Space>}>

            {/* Form */}
                <Form {...formItemLayout} style={{maxWidth:800}} scrollToFirstError>
                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                        {
                            type: 'email',
                            message: 'Thông tin đầu vào không hợp lệ E-mail!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập E-mail của bạn!',
                        },
                        ]}>
                        <Input />
                    </Form.Item>
                    {/* Họ và tên */}
                    <Form.Item
                    name="hovaten"
                    label="Họ và tên"
                    rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập họ tên của bạn!',
                        whitespace: true,
                    },
                    ]}>
                    <Input />
                    </Form.Item>
                    {/* Số điện thoại  */}
                    <Form.Item
                    name="sodienthoai"
                    label="Số điện thoại"
                    rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập số diện thoại của bạn!',
                        whitespace: true,
                    },
                    ]}>
                    <Input maxLength={10}/>
                    </Form.Item>
                {/* Giới tính */}
                <Form.Item
                    name="gioitinh"
                    label="Giới tính"
                    rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn giới tính của bạn!',
                    },
                    ]}
                >
                    <Select placeholder="Chọn giới tính">
                        <Select.Option value="Nam">Nam</Select.Option>
                        <Select.Option value="Nữ">Nữ</Select.Option>
                        <Select.Option value="Khác">Khác</Select.Option>
                    </Select>
                </Form.Item>
                {/* Địa chỉ */}
                <Form.Item
                name="diachi"
                label="Địa chỉ"
                rules={[
                {
                    required: true,
                    message: 'Vui lòng nhập địa chỉ của bạn!',
                },
                ]}>
                    <Input.TextArea rows={3} showCount maxLength={100} />
                </Form.Item>
                {/* Ảnh đại diện */}
                <Form.Item
                 name="anhdaidien"
                 label="Ảnh đại diện">
                    <ImgCrop rotationSlider>
                        <Upload 
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 5 && '+ Upload'}
                        </Upload>
                        </ImgCrop>
                </Form.Item>
                {/* Tải các file bằng cấp và chứng chỉ  */}
                <Form.Item
                 name="bangcapvachungchi"
                 label="Bằng cấp và chứng chỉ: ">
                    
                </Form.Item>
                </Form>
            </Drawer>
        </>
  );
};
   
export default AccountUpgrade;