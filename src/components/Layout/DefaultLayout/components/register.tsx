import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Modal, Tabs, Upload, UploadFile, notification } from "antd";
import {  useState } from "react";
import images from "~/assets/images";
import Login from "./login";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "~/firebase";
import {API_URL} from "~/constants/constant"
import axios from "axios";
function Register() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);
    const [isModalLoginEmail, setIsModalLoginEmail] = useState(false);
    const [formGV] = Form.useForm();//Form đăng ký giáo viên
    const [formND] = Form.useForm();//Form đăng ký người dùng
    const [fileList, setFileList] = useState<UploadFile[]>([]);//Ds file tải lên
    const [fileListImage, setFileListImage] = useState<UploadFile[]>([]);//Ds file image tải lên


    const [api, contextHolder] = notification.useNotification();//Thông báo thành công
    const openNotification = () => {
        api.success({
            message: 'Thông báo',
            description: <span>Cảm ơn bạn đã đăng ký tài khoản giảng viên trên LearnMore-BCT. Vui lòng chờ trong tối đa 3 ngày, chúng tôi sẽ kiểm duyệt nội dung Chứng chỉ và bằng cấp của bạn!</span>,
            placement: 'top',
            duration: 0
        })
    }
    //Hàm xử lý khi submit form2 đắng ký người dùng mới
    const onFinishFormND = async (values:any) => {
        try{
            const response = await axios.post(`${API_URL}auth/registernd`,{email: values['email'], password: values['password']});
            if(response.status === 200) {
                // await createUserWithEmailAndPassword(auth, values['email'], values['password']);
                //reset lại toàn bộ Fields
                formND.resetFields();
                console.log("Đăng ký người dùng thành công");
                //đóng modal lại
                setIsModalLoginEmail(true);
            }
        }catch(e){
            formND.setFields([{
                name: 'email',
                errors: ['Email này đã tồn tại hoặc đã được đăng ký!']
            }]);
            console.error(e);
        }
    }
    //Hàm xử lý khi submit form1 đăng ký giảng viên mới
    const onFinishFormDk  = async (values:any) => {
        //đăng ký tài khoản mới
        try{
            const formData = new FormData();
            formData.append("name", values['fullname'])
            formData.append("email", values['email'])
            formData.append("password", values['password'])
            formData.append("files", values.uploadImages.fileList[0].originFileObj);
            if(values.upload.fileList){
                values.upload.fileList.forEach((file:any)=>{
                    formData.append("files", file.originFileObj)
                });
            }
            //Gửi dữ liệu lên API
            try{
                const reponse = await axios.post(`${API_URL}auth/register`,formData,{
                    headers:{"Content-Type":"multipart/form-data"}
                })
                console.log(reponse,'Đưa dữ liệu lên server thành công')

                 // Đăng ký tài khoản lên firebase 
                //await createUserWithEmailAndPassword(auth, values['email'], values['password']);

                //reset lại toàn bộ Fields
                formGV.resetFields();
                //hiện thị thông báo thành công
                openNotification();
                setIsModalOpen(false);
            }catch(e){
                formGV.setFields([{
                    name: 'email',
                    errors: ['Email này đã tồn tại hoặc đã được đăng ký!']
                }])
                console.log(e);
            }
        }catch(e){console.error(e);}
    }

    return (
        <>
            {/* Vị trí thông báo sẽ xuất hiện  */}
            {contextHolder}
            <Flex gap={10} wrap>
                <Button type="text" style={{fontWeight:600, borderRadius:20}} onClick={()=>setIsModalOpen(true)}>Đăng ký</Button>
                <Button type="primary" style={{backgroundColor:"#46D36B", borderRadius:20, fontWeight:600}} onClick={()=>{setIsModalOpenLogin(true)}}>Đăng nhập</Button>
                {/* Gọi trang đăng nhập ra  */}
                <Login isModalOpen={isModalOpenLogin} onCancel={()=>setIsModalOpenLogin(false)} />
            </Flex>
            {/* Đăng ký tài khoản người học và giảng viên  */}
            <Modal height={600} style={{top:20,overflow:"auto"}} open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
                 <Flex style={{marginTop:20}} gap={15} vertical justify="center" align="center">
                    <img width={60} height={60} src={images.logo} alt="logo"/>
                    <h2>Đăng ký tài khoản LEARNMORE-BCT</h2>

                    <Tabs defaultActiveKey="1" items={[
                        {
                            key:"1",
                            label:"Tài khoản người dùng",
                            children: (
                                <Flex style={{marginTop:20}} vertical gap={15} justify="center" align="center">

                                    <Button style={{display:"flex", borderRadius:20, padding:16, maxWidth:360}} type="default" block
                                    onClick={()=>setIsModalLoginEmail(true)}>
                                        <UserOutlined style={{flex:1}} />
                                        <span style={{flex:10, textAlign:"center", fontWeight:"600"}}>Sử dụng email / số điện thoại</span>
                                    </Button>

                                    <Button style={{display:"flex", borderRadius:20, padding:16, maxWidth:360}} type="default" block>
                                        <img src={images.icons8google} width={18} height={18}  style={{flex:1}} alt="logo-google"/>
                                        <span style={{flex:10, textAlign:"center", fontWeight:"600"}}>Đăng ký với Google</span>
                                    </Button>
                
                                    <Button style={{display:"flex", borderRadius:20, padding:16, maxWidth:360}} type="default" block>
                                        <img src={images.icons8facebook} width={18} height={18}  style={{flex:1}} alt="logo-facebook"/>
                                        <span style={{flex:10, textAlign:"center", fontWeight:"600"}}>Đăng ký với Facebook</span>
                                    </Button>
                                </Flex>
                            )
                        },
                        {
                            key:"2",
                            label:"Tài khoản Giảng viên",
                            children: (
                                <>
                                    <Form name="formdk" form={formGV} onFinish={(value)=>onFinishFormDk(value)} layout="vertical" scrollToFirstError	>
                                        <Form.Item name="email" label="Email của bạn" rules={[
                                           {type:"email", message:"Thông tin đầu vào không hợp lệ E-mail!", required:true}
                                        ]}><Input style={{borderRadius:20}}/></Form.Item>

                                        <Form.Item name="password" label="Mật khẩu"  rules={[
                                           {required:true, message:"Vui lòng nhập mật khẩu của bạn!", min:6}
                                        ]}><Input.Password style={{borderRadius:20}} /></Form.Item>
                                        <Form.Item name={"confirm"} label="Xác nhận mật khẩu" dependencies={['password1']} rules={[
                                            {required: true, message: "Vui lòng nhập xác nhận mật khẩu của bạn"},
                                            ({getFieldValue})=>({
                                                validator(_,value){
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu mới bạn nhập không khớp!'));
                                                }
                                            })
                                        ]}><Input.Password style={{borderRadius:20}} /></Form.Item>
                                        <Form.Item name="fullname" label="Họ và tên"  rules={[
                                           {required:true, message:"Vui lòng nhập mật khẩu của bạn!", whitespace:true}
                                        ]}><Input style={{borderRadius:20}} /></Form.Item>
                                        
                                        <Form.Item name={"uploadImages"} label="Nhập hình ảnh hoặc chân dung của bạn" rules={[
                                            {required: true, message: "Vui lòng nhập các văn bản và chứng chỉ của bạn!"}
                                        ]}>
                                            <Upload showUploadList fileList={fileListImage} accept=".png,.jpg,.jpeg" multiple={false} beforeUpload={()=>false}
                                                listType="picture" onChange={({fileList})=>{setFileListImage(fileList)}}>
                                                <Button type="default" icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                            </Upload>
                                        </Form.Item>

                                        <Form.Item name={"upload"} label="Các văn bằng và chứng chỉ" rules={[
                                            {required: true, message: "Vui lòng nhập các văn bản và chứng chỉ của bạn!"}
                                        ]}>
                                            <Upload showUploadList fileList={fileList} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" multiple={true} beforeUpload={()=>false}
                                                listType="text" onChange={({fileList})=>{setFileList(fileList)}}>
                                                <Button type="default" icon={<UploadOutlined />}>Tải chứng chỉ lên</Button>
                                            </Upload>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button block style={{backgroundColor:"#46d36b", borderRadius:20}} htmlType="submit" type="primary">Đăng ký</Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            )
                        }
                    ]} >

                    </Tabs>

                    
                    <Flex vertical>
                        <span style={{fontWeight:400}}>Bạn đã có tài khoản? <Button style={{paddingLeft:0, color:"green"}} type="link">Đăng nhập</Button></span>
                        <Button style={{color:"green"}} type="link">Quên mật khẩu?</Button>
                    </Flex>
                    <p style={{textAlign:"center", fontSize:10, maxWidth:360}}>Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản sử dụng của chúng tôi</p>
                 
                 </Flex>
            </Modal>

            {/* Đăng ký bằng email  */}
            <Modal style={{top:20}} open={isModalLoginEmail} footer={null} onCancel={()=>setIsModalLoginEmail(false)}>
                <Flex style={{marginTop:20}} gap={5} vertical justify="center" align="center">
                    <img width={60} height={60} src={images.logo} alt="logo"/>
                    <h2>Đăng ký tài khoản LEARNMORE-BCT</h2>
                    <Form onFinish={(values)=>onFinishFormND(values)} form={formND} scrollToFirstError layout="vertical" style={{minWidth:330}}>
                        <Form.Item label="Tên đăng nhập" name={"email"} rules={[
                            {required:true, message:"Vui lòng nhập email của bạn!", type:"email"}
                        ]}><Input style={{borderRadius:20}}/></Form.Item>

                        <Form.Item label="Mật khẩu" name={"password"} rules={[
                            {required:true, message:"Vui lòng nhập mật khẩu của bạn!"}
                        ]}><Input.Password style={{borderRadius:20}}/></Form.Item>
                        <Form.Item name={"confirm"} label="Xác nhận mật khẩu" dependencies={['password']} rules={[
                            {required: true, message: "Vui lòng nhập xác nhận mật khẩu của bạn"},
                            ({getFieldValue})=>({
                                validator(_,value){
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error('Mật khẩu mới bạn nhập không khớp!'));
                                }
                            })
                        ]}><Input.Password style={{borderRadius:20}} /></Form.Item>
                        <Form.Item name={"remember"} valuePropName="checked">
                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                        </Form.Item>
                        <Form.Item style={{display:'flex', justifyContent:"center"}}>
                            <Button type="primary" style={{backgroundColor:"#4fd572", borderRadius:20}} htmlType="submit">Đăng ký</Button>
                        </Form.Item>
                    </Form>
                    <Flex vertical>
                        <span style={{fontWeight:400}}>Bạn đã có tài khoản? <Button style={{paddingLeft:0, color:"green"}} type="link">Đăng nhập</Button></span>
                        <Button style={{color:"green"}} type="link">Quên mật khẩu?</Button>
                    </Flex>
                    <p style={{textAlign:"center", fontSize:10, maxWidth:360}}>Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản sử dụng của chúng tôi</p>
                </Flex>
            </Modal>
        </>
        
    );
}

export default Register;