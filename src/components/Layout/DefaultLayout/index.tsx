import {Button,Flex, Layout,Menu} from "antd";
import images from "~/assets/images";
import {UserOutlined, BellOutlined, HomeOutlined, ReadOutlined, FacebookOutlined, YoutubeOutlined, TikTokOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { PopHeader} from "./components";
import ModalLogin from "~/auth/login";
import { selectAuth } from "~/redux/selector";
import Register from "./components/register";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./components/authSlice/authSlice";
interface Props {
    children: React.ReactNode;
}
function DefaultLayout(props:Props) {
    //lấy dữ liệu từ store ra được user của người dùng từ payload
    const dispatch = useDispatch();
    const auth = useSelector(selectAuth);
    console.log(auth)
    // collapsed cua sidebar 
    const [collapsed, setCollapsed] = useState(false);
    const {children} = props;
    const itemMenu = [
        {
            key:'1',
            icon: <HomeOutlined />,
            label: 'Trang chủ'
        },{
            key:'2',
            icon: <ReadOutlined />,
            label: 'Bài viết'
        },
        {
            key:'3',
            icon: <ReadOutlined />,
            label: 'test',
            children: [
                {
                    key: '4',
                    label: 'Test 1'
                },
            ]
        },
    ]
    return (
        <Flex wrap gap={5}>
            <Layout>
                {/* phần header  */}
                <Header  style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center", position:"fixed",width:"100%", top:0, 
                    zIndex:1, backgroundColor:"#ffffff", boxShadow:"0 0 10px rgba(0, 0, 0, 0.2)", padding:"0 20px 0 20px"}}>
                
                    <div >
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <img width={60} height={60} src={images.logo} alt="logo"/>
                            <h3>Nền tảng học tập trực tuyến</h3>
                        </div>
                    </div>
                    <div>
                        <div style={{display:"flex", justifyContent:"center"}}>
                            <Search placeholder="input search text" style={{width:500}}/>
                        </div>
                    </div>
                    { //Nếu auth null hoặc là role khác với người dùng thì không hiển thị
                        (auth===null || auth.role !=="nguoidung") ? (<Register />) : (<div >
                            <Flex wrap gap={"small"} style={{justifyContent:"center", alignItems:"center"}}>
                                <Button type="text" onClick={()=>dispatch(logout())}>Khóa học của tôi</Button>
                                <ModalLogin />
                                <PopHeader><Button shape="circle" icon={<UserOutlined />} /></PopHeader>
                            </Flex>
                        </div>)
                    }
                </Header>
                <Layout hasSider>
                    {/* phân sider  */}
                    <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value)=>{setCollapsed(value)}}
                    style={{overflow: 'auto',
                                    height: '100vh',
                                    position: 'fixed',
                                    insetInlineStart: 0,
                                    top: 64,
                                    bottom: 0,
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'unset',backgroundColor:"#ffffff"}}>
                        <Menu items={itemMenu}  defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="light"/>
                    </Sider>
                    {/* phần nội dung */}
                    <Content style={{marginLeft:collapsed?80:200, marginTop:64,overflow: 'initial',height:"100vh", backgroundColor:"#ffffff",transition:"margin-left 0.3s"}}>
                            {/* noi dung content */}
                            <>{children}</>
                   </Content>
                </Layout>
                {/* Phần footer  */}
                <Layout>
                    <Footer style={{backgroundColor:"#002140", zIndex:1}}>
                        <Flex wrap gap={15} style={{color:"#ffffff", justifyContent:"space-between", alignItems:"start"}}>
                            <div>
                            <div style={{ display:'flex', alignItems:'center'}}>
                                <img width={60} height={60} src={images.logo} alt="logo"/>
                                <h4>LearnMore-BCT nền tảng học tập trực tuyến</h4>
                            </div>
                            </div>
                            <div>
                                <Flex wrap gap={10} vertical>
                                    <h3 >Bạn cần hỗ trợ</h3>
                                    <span>Hotline: 0377146143</span>
                                    <span>Địa chỉ: Đ.Tân Vạn - Mỹ Phước, Khu phố An Phú, An Phú, Thuận An, Bình Dương</span>
                                    <span>Email: support@learnmore-bct.vn</span>
                                </Flex>
                            </div>
                            <div>
                                <Flex wrap gap={10} vertical>
                                        <h3>Hỗ trợ khách hàng</h3>
                                        <span>Trang chủ</span>
                                        <span>Giới thiệu</span>
                                        <span>Danh mục</span>
                                        <span>Liên hệ</span>
                                </Flex>
                            </div>
                        </Flex>
                        <Flex wrap gap={10} style={{color:"#ffffff", marginTop:20, justifyContent:"space-between"}}>
                            <div style={{fontSize:12}}> LearnMore-BCT ©{new Date().getFullYear()} Created by BuiChiThien</div>
                            <div>
                                <Flex justify="end" wrap gap={10} style={{fontSize:30}}>
                                    <FacebookOutlined style={{color:"#0866FF"}} /> <YoutubeOutlined style={{color:"#FF0000"}} /> <TikTokOutlined /> 
                                </Flex>
                            </div>
                        </Flex>
                    </Footer>
                </Layout>
            </Layout>
        </Flex>
     );
}

export default DefaultLayout;