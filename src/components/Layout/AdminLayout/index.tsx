import { BarChartOutlined, DollarOutlined, FileTextOutlined, HomeOutlined, LogoutOutlined, PieChartOutlined, ReadOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Children, useState } from "react";
import { Outlet } from "react-router-dom";
import images from "~/assets/images";
import {logout} from '~/components/Layout/DefaultLayout/components/authSlice/authSlice';
import { useDispatch, useSelector } from "react-redux";
import {selectAuth} from '~/redux/selector'
import { useNavigate } from "react-router-dom";
function AdminLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(selectAuth);
    // collapsed cua sidebar 
    const [collapsed, setCollapsed] = useState(false);
    const itemMenu = [
        {
            key:'1',
            icon: <UserOutlined />,
            label: 'Giảng viên',
            children: [
                {
                    key: '10',
                    label: 'Xét duyệt'
                },
                {
                    key: '11',
                    label: 'Danh sách'
                }
            ]
        },{
            key:'4',
            icon: <TeamOutlined />,
            label: 'Người dùng',
            children: [
                {
                    key: '40',
                    label: 'Danh sách'
                }
            ]
        }
        ,{
            key:'2',
            icon: <ReadOutlined />,
            label: 'Khóa học',
            children: [
                {
                    key: '20',
                    label: 'Xét duyệt'
                }
            ]
        },{
            key:'3',
            icon:<DollarOutlined />,
            label: 'Thanh toán',
            children: [
                {
                    key: '30',
                    label: 'Tiền khóa học'
                },
                {
                    key:'31',
                    label: 'Lịch sử'
                }

            ]
        },{
            key:'5',
            icon:<BarChartOutlined />,
            label: 'Thống kê',
            children: [
                {
                    key: '50',
                    label: 'Học viên'
                },
                {
                    key:'51',
                    label: 'Khóa học'
                },
                {
                    key:'52',
                    label: 'Doanh thu'
                }
            ]
        }
    ]
    return ( 
        <Flex wrap gap="middle">
            <Layout>
                <Header style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center", position:"fixed",width:"100%", top:0, 
                    zIndex:1, backgroundColor:"#ffffff", boxShadow:"0 0 10px rgba(0, 0, 0, 0.2)", padding:"0 20px 0 20px"}}>
                    <div >
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <img width={60} height={60} src={images.logo} alt="logo"/>
                            <h3>Nền tảng học tập trực tuyến</h3>
                        </div>
                    </div>
                    <div>
                        <Flex wrap gap={8} justify="center" align="center">
                            <span>{`Xin chào admin! ${auth?.email}`}</span>
                            <Button shape="circle" icon={<UserOutlined />}></Button>
                            {/* Đăng xuất  */}
                            <Button shape="circle" onClick={()=>{navigate('/'); dispatch(logout())}} icon={<LogoutOutlined />}></Button>
                        </Flex>
                    </div>
                    </Header>
                <Layout style={{display:"flex"}}>
                    <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(collapsed)=>{setCollapsed(collapsed)}} style={{position:"fixed", height:"100vh", top:64}}>
                        <Menu items={itemMenu}  defaultSelectedKeys={['1']} onSelect={({item, key})=>{
                                    if(key === '10'){navigate('/admin/giangvienad');}
                                    if(key === '11'){navigate('/admin/danhsachgiangvien');}
                                    if(key === '20'){navigate('/admin/courseadxd');}
                                    if(key === '30'){navigate('/admin/thanhtoankhoahoc');}
                                    if(key==='31'){navigate('/admin/lichsuthanhtoanad');}
                                    if(key==='40'){navigate('/admin/danhsachnguoidung');}
                                    if(key === '50') {navigate('/admin/thongkenguoidung');}
                                    if(key === '51') {navigate('/admin/thongkekhoahoc');}
                                    if(key === '52') {navigate('/admin/thongkedoanhthu');}
                                }}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="light"/>
                    </Sider>
                    <Content style={{marginTop:64,marginLeft:collapsed?80:200,transition:"margin-left 0.3s", padding:"20px 50px 40px 50px", backgroundColor:"#ffffff"}}>
                            
                            {/* Đây là nơi Outlet sẽ hiển thị các route con */}
                            <Outlet />
                            
                    </Content>
                </Layout>
                {/* <Layout>
                    <Footer style={{backgroundColor:"red", zIndex:1}}>hihi</Footer>
                </Layout> */}
            </Layout>
        </Flex>
     );
}

export default AdminLayout;
