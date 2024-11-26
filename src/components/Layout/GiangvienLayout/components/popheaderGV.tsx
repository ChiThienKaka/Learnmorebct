import { Avatar, Button, Card, Col, Drawer, Flex, Form, Image, Input, Popover, Row, Select, Space } from "antd";
import { ReactNode, useEffect, useState } from "react";
import {logout} from "~/components/Layout/DefaultLayout/components/authSlice/authSlice"
import { useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "~/redux/selector";
import { API_URL } from "~/constants/constant";
import { vietQR } from "~/constants/constant";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
// Pop cac chuc nang cua user tren trang header cua DefaultLayout 
const PopHeaderGV: React.FC<{children:ReactNode}> = ({children})=>{
    const [dataInfoGV, setDataInfoGV] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const auth = useSelector(selectAuth);
    const [formInfoGV] = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // list banks are supported create QR code by Vietqr
    const [banks, setBank] = useState<any>([]);
    //Lấy thông tin cá nhân
    const handlegetthongtingiangvien = async() => {
        if(auth){
            const res = await axios.post(`${API_URL}auth/getinfoGV`,{userid: auth.id});
            console.log(res.data)
            setDataInfoGV(res.data);
        }
    }
    //cập nhật thông tin
    const handlecapnhatthongtin = async (values:any) => {
        try{
            console.log(values);
            const newFormdata = new FormData();
            newFormdata.append('userid', auth?.id||'');
            newFormdata.append('name', values['name']);
            newFormdata.append('capbac', values['capbac']);
            newFormdata.append('nganhang', values['nganhang']);
            newFormdata.append('diachi', values['diachi']);
            newFormdata.append('sdt', values['sdt']);
            newFormdata.append('cccd', values['cccd']);
            newFormdata.append('linhvuc', values['linhvuc']);
            newFormdata.append('truonghoc', values['truonghoc']);
            newFormdata.append('kinhnghiem', values['kinhnghiem']);
            newFormdata.append('chamngonsong', values['chamngonsong']);
            newFormdata.append('sotaikhoan', values['sotaikhoan']);
            console.log('test chạy')
            const res = await axios.post(`${API_URL}auth/updateinfogv`,newFormdata, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            });
            console.log(res.data);
            handlegetthongtingiangvien();
            formInfoGV.resetFields();
            setOpen(false);
        }catch(err){console.log(err);}
    }
    const getBank = async () => {
        // list banks are supported create QR code by Vietqr
        vietQR.getBanks().then((banks:any)=>{
            setBank(banks.data);
        })
    }
    useEffect(()=>{
         getBank();  
         if(auth){
            handlegetthongtingiangvien();
         }
    },[])
    useEffect(()=>{
        if(formInfoGV){
            formInfoGV.setFieldsValue({
                email: auth?.email,
                name: dataInfoGV?.name,
                diachi: dataInfoGV?.diachi,
                sdt: dataInfoGV?.sdt,
                cccd: dataInfoGV?.cccd,
                capbac: dataInfoGV?.capbac,
                nganhang: dataInfoGV?.nganhang,
                truonghoc: dataInfoGV?.truonghoc,
                kinhnghiem: dataInfoGV?.kinhnghiem,
                chamngonsong: dataInfoGV?.chamngonsong,
                sotaikhoan: dataInfoGV?.sotaikhoan,
                linhvuc: dataInfoGV?.linhvuc,
            });
        }
    },[dataInfoGV])
    return(
    <>
        <Popover zIndex={10} trigger={"click"}
        placement="bottomRight"
        title={<Flex style={{minWidth:230}} vertical>
            <Flex gap={15} justify="center" align="center">
                <div><Avatar size={50} src={`${API_URL}admin/images/${auth?.email}`}>T</Avatar></div>
                <div>
                    <div style={{fontSize:16}}>{auth?.name}</div>
                    <div style={{fontSize:14, color:"#757575"}}>{auth?.email}</div>
                </div>
            </Flex>
            <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
            <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Trang chủ</Button>
            <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
            <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Tạo khóa học</Button>
            <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
            <Button type="text" onClick={()=>setOpen(true)} style={{color:"#666666", justifyContent:"start"}}>Thông tin của tôi</Button>
            <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
            <Button type="text" onClick={()=>{navigate('/');dispatch(logout())}} style={{color:"#666666", justifyContent:"start"}}>Đăng xuất</Button>
            <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        </Flex>}
      >
            {children}
      </Popover>
      <Drawer
       footer={<Button onClick={()=>{formInfoGV.submit()}} type="primary" style={{backgroundColor:"#47d36b"}}>Cập nhật</Button>} zIndex={100} width={750} destroyOnClose  title="Thông tin cá nhân" onClose={()=>{setOpen(false)}} open={open}>
            <Form form={formInfoGV} initialValues={{
                email:auth?.email,
                name:dataInfoGV?.name,
                diachi:dataInfoGV?.diachi,
                sdt:dataInfoGV?.sdt,
                cccd:dataInfoGV?.cccd,
                capbac: dataInfoGV?.capbac,
                nganhang:dataInfoGV?.nganhang,
                truonghoc:dataInfoGV?.truonghoc,
                kinhnghiem:dataInfoGV?.kinhnghiem,
                chamngonsong:dataInfoGV?.chamngonsong,
                sotaikhoan:dataInfoGV?.sotaikhoan,
                linhvuc: dataInfoGV?.linhvuc,
            }}
             onFinish={(values)=>handlecapnhatthongtin(values)}>
                <Card title={'Thông tin tài khoản'}>
                    <Row>
                        <Col style={{padding:"0px 20px 2px 20px"}} span={6}>
                                <Image style={{padding:"0px 10px 0px 10px",objectFit:"contain", backgroundColor:"#F5F5F5"}} alt="hihi" height={"100%"} width={"100%"} src={`${API_URL}admin/images/${auth?.email}`} />
                        </Col>
                        <Col span={18}>
                        <Form.Item name={'email'} label={"Email"}>
                        <Input disabled/>
                        </Form.Item>
                        <Form.Item name={'name'} label={"Họ và tên"}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name={'diachi'} label={"Địa chỉ"} rules={[{required: true, message: 'Vui lòng nhập địa chỉ của bạn' }]}>
                            <Input.TextArea autoSize />
                        </Form.Item>
                        <Form.Item name={'sdt'} label={"Số điện thoại"} rules={[{required: true, message: 'Vui lòng nhập số điện thoại của bạn' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={'cccd'} label={"Căn cước công dân"} rules={[{required: true, message: 'Vui lòng nhập căn cước công dân' }]}>
                            <Input />
                        </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card title={'Thông tin thanh toán'}>
                    <Form.Item name={'sotaikhoan'} label={"Số tài khoản"} rules={[{required: true, message: 'Vui lòng nhập số tài khoản của bạn' }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'nganhang'} label={"Ngân hàng"} rules={[{required: true, message: 'Vui lòng chọn ngân hàng'}]}>
                        <Select style={{width:"100%", height:40}} options={banks.map((item:any)=>{
                            return {value: item.code, label: <Space wrap style={{justifyContent:"space-between", display:"flex"}}>
                                    <span>{item.shortName}</span>
                                    <span><Avatar  src={item.logo} style={{objectFit:"contain", width:100, height:40}} shape="square" alt="hihi" /></span>
                                </Space>}
                        })} />
                    </Form.Item>
                </Card>
                <Card title={'Thông tin học vấn'}>
                    <Form.Item name={'capbac'} label={"Trình độ học vấn"} rules={[{required: true, message: 'Vui lòng nhập trình độ học vấn' }]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item name={'linhvuc'} label={"Lĩnh vực chuyên môn"} rules={[{required: true, message: 'Vui lòng nhập lịch vực chuyên môn' }]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item name={'truonghoc'} label={"Trường tốt nghiệp"}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={'kinhnghiem'} label={"Thâm niên"}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={'chamngonsong'} label={"Châm ngôn sống"}>
                        <Input.TextArea autoSize />
                    </Form.Item>
                </Card>
            </Form>
      
      </Drawer>
    </>)
}

export default PopHeaderGV;