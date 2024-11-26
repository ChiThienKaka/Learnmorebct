import { BarChartOutlined, HomeOutlined, ReadOutlined } from "@ant-design/icons";
import { Flex, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Children, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import images from "~/assets/images";
import { TaikhoanGV } from "./components";
function GiangVienLayout() {
    const navigate = useNavigate();
    // collapsed cua sidebar 
    const [collapsed, setCollapsed] = useState(false);
    const itemMenu = [
        {
            key:'1',
            icon: <HomeOutlined />,
            label: 'Khóa học',
            children: [
                {
                    key: '10',
                    label: 'Bắt đầu'
                },
                {
                    key: '11',
                    label: 'Danh sách'
                },
            ]
        },{
            key:'2',
            icon: <ReadOutlined />,
            label: 'Quản lý',
            children: [
                {
                    key: '20',
                    label: 'Khóa học'
                }
            ]
        },
        {
            key:'3',
            icon: <ReadOutlined />,
            label: 'Doanh thu',
            children: [
                {
                    key: '30',
                    label: 'Khóa học'
                },{
                    key: '31',
                    label: 'Lịch sử'
                }
            ]
        },
        {
            key: '4',
            icon: <BarChartOutlined />,
            label: 'Thống kê',
            children: [
                {
                    key: '40',
                    label: 'Người dùng'
                },
                {
                    key: '41',
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
                        <TaikhoanGV />
                    </Header>
               <Layout style={{display:"flex"}}>
                        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(collapsed)=>{setCollapsed(collapsed)}} style={{position:"fixed",top:64, height:"100vh"}}>
                            <Menu items={itemMenu} 
                                onSelect={({item, key})=>{
                                    if(key === '10'){navigate('/giangvien/CreateGV1');}
                                    if(key === '11'){navigate('/giangvien/listcourse');}
                                    if(key === '20'){navigate('/giangvien/quanlycourse');}
                                    if(key === '30'){navigate('/giangvien/khoahoctien');}
                                    if(key === '31'){navigate('/giangvien/lichsuthanhtoan');}
                                    if(key === '40'){navigate('/giangvien/thongkenguoidunggv');}
                                    if(key === '41'){navigate('/giangvien/thongkedoanhthugv');}
                                   
                                }}
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                theme="light"/>
                        </Sider>
                        <Content style={{marginLeft:collapsed?80:200,transition:"margin-left 0.3s", backgroundColor:"#ffffff",marginTop:64}}>
                                <><Outlet /></>
                        </Content>
                </Layout>
                {/* <Footer style={{backgroundColor:"black"}}></Footer> */}
           </Layout>
        </Flex>
     );
}

export default GiangVienLayout;
