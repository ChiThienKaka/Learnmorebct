import { UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useState } from "react";
import images from "~/assets/images";
import {API_URL} from "~/constants/constant"
import { jwtDecode } from "jwt-decode";
import { useDispatch} from "react-redux";
import { login } from "./authSlice/authSlice";
import { useNavigate } from "react-router-dom";
interface Props {
    isModalOpen: boolean;
    onCancel?: () => void;
}
function Login(props: Props) {
    const {isModalOpen, onCancel} = props;
    const navigate = useNavigate();
    const [isModalLoginEmail, setIsModalLoginEmail] = useState(false);
    const [formLoginEmail] = useForm();
    const dispatch = useDispatch();
    //Login đăng nhập tài khoản bằng email
    const onFinishLoginEmail= async (values:any)=>{
        try{
            const res = await axios.post(`${API_URL}auth/login`,{
                email: values['email'],
                password: values['password']
            })
            localStorage.setItem('token', res.data.token);
            console.log("Đăng nhập thành công");
            
            // Đưa token này lên dữ liệu store của redux 
            const token = localStorage.getItem('token');
            if(token){
                // Giải mã token lấy dữ liệu payload user trả về
                const decode : {id:number, email: string, role: string} = jwtDecode(token);
                const {id, email, role } = decode;
                dispatch(login({id, email, role}));

                //chuyển chang nếu roll đúng theo vai trò
                if(role ==='giangvien'){
                    const response = await axios.post(`${API_URL}auth/status`,{id: id});
                    console.log(response)
                    if(response.data.statusGV === false){
                        navigate('/errorgiangvien')
                    }else navigate('giangvien')
                }
                if(role === 'admin'){
                    navigate('admin')
                }
            }
        }catch(e){
            formLoginEmail.setFields([{
                name: 'email',
                errors: ['Tài khoản hoặc mật khẩu không chính xác!'],
            },{
                name: 'password',
                errors: ['Tài khoản hoặc mật khẩu không chính xác!'],
            }])
        }
    }
    return (  
        <>
            <Modal open={isModalOpen} footer={null} onCancel={onCancel}>
                <Flex style={{marginTop:20,maxHeight:501, overflow:"auto"}} gap={15} vertical justify="center" align="center">
                    <img width={60} height={60} src={images.logo} alt="logo"/>
                    <h2>Đăng nhập vào LEARNMORE-BCT</h2>

                    <Button style={{display:"flex", borderRadius:20, padding:16, maxWidth:360}} type="default" block
                    onClick={()=>setIsModalLoginEmail(true)}>
                        <UserOutlined style={{flex:1}} />
                        <span style={{flex:10, textAlign:"center", fontWeight:"600"}}>Sử dụng email / số điện thoại</span>
                    </Button>

                    <Button style={{display:"flex", borderRadius:20, padding:16, maxWidth:360}} type="default" block>
                        <img src={images.icons8google} width={18} height={18}  style={{flex:1}} alt="logo-google"/>
                        <span style={{flex:10, textAlign:"center", fontWeight:"600"}}>Đăng nhập với Google</span>
                    </Button>

                    <Button style={{display:"flex", borderRadius:20, padding:16, maxWidth:360}} type="default" block>
                        <img src={images.icons8facebook} width={18} height={18}  style={{flex:1}} alt="logo-facebook"/>
                        <span style={{flex:10, textAlign:"center", fontWeight:"600"}}>Đăng nhập với Facebook</span>
                    </Button>

                    <Flex vertical>
                        <span style={{fontWeight:400}}>Bạn chưa có tài khoản? <Button style={{paddingLeft:0, color:"green"}} type="link">Đăng ký</Button></span>
                        <Button style={{color:"green"}} type="link">Quên mật khẩu?</Button>
                    </Flex>
                    <p style={{textAlign:"center", fontSize:10, maxWidth:360}}>Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản sử dụng của chúng tôi</p>
               </Flex>
            </Modal>
            {/* Đăng nhập bằng email  */}
            <Modal style={{top:20}} open={isModalLoginEmail} footer={null} onCancel={()=>setIsModalLoginEmail(false)}>
                <Flex style={{marginTop:20}} gap={5} vertical justify="center" align="center">
                    <img width={60} height={60} src={images.logo} alt="logo"/>
                    <h2>Đăng nhập vào LEARNMORE-BCT</h2>
                    <Form onFinish={(values)=>onFinishLoginEmail(values)} form={formLoginEmail} scrollToFirstError layout="vertical" style={{minWidth:330}}>
                        <Form.Item label="Tên đăng nhập" name={"email"} rules={[
                            {required:true, message:"Vui lòng nhập email của bạn!", type:"email"}
                        ]}><Input style={{borderRadius:20}}/></Form.Item>

                        <Form.Item label="Mật khẩu" name={"password"} rules={[
                            {required:true, message:"Vui lòng nhập mật khẩu của bạn!"}
                        ]}><Input.Password style={{borderRadius:20}}/></Form.Item>

                        <Form.Item name={"remember"} valuePropName="checked">
                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                        </Form.Item>
                        <Form.Item style={{display:'flex', justifyContent:"center"}}>
                            <Button type="primary" style={{backgroundColor:"#4fd572", borderRadius:20}} htmlType="submit">Đăng nhập</Button>
                        </Form.Item>
                    </Form>
                    <Flex vertical>
                        <span style={{fontWeight:400}}>Bạn chưa có tài khoản? <Button style={{paddingLeft:0, color:"green"}} type="link">Đăng ký</Button></span>
                        <Button style={{color:"green"}} type="link">Quên mật khẩu?</Button>
                    </Flex>
                    <p style={{textAlign:"center", fontSize:10, maxWidth:360}}>Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản sử dụng của chúng tôi</p>
                </Flex>
            </Modal>
        </>
    );
}

export default Login;