import { Card, Flex, Layout, Menu, ConfigProvider } from "antd";
import './stylehome.css'
import ReactPlayer from "react-player";
import { MenuItemType } from "antd/es/menu/interface";
const HoctapCourse = () => {
    //cấu hình lại menu thông qua token design
    const dataLesson : MenuItemType[] = [
        {key: "sub1", label:"Bài 1 ngu thế là cùng"},
        {key: "sub2", label:"Bài 1 ngu thế là cùng"},
        {key: "sub3", label:"Bài 1 ngu thế là cùng"}
    ]

    return (
        <Layout style={{WebkitScrollSnapType:"inline"}}>
            <Layout.Header style={{position:"fixed", top:0, left:0, right:0, zIndex:1}}></Layout.Header>
            <Layout>
                <Layout.Content style={{margin:"64px 300px 48px 0px", height:"100%",overflowY:"auto"}}>
                 
                <div style={{width:"100%",height:1000, padding:"15px 50px 15px 50px", backgroundColor:"black"}}>
                    <ReactPlayer
                        url={"https://youtu.be/-jV06pqjUUc"}
                        controls
                        height= {500}
                        width="100%"/>
                </div>
                  
                    </Layout.Content>
                <Layout.Sider width={300} style={{position:"fixed", top:64, right:0, bottom:48,
                    backgroundColor:"green", maxHeight:"100vh", overflowY:"auto"}}>
                            <h3>Nội dung khóa học</h3>
                            <div style={{height:1000}}></div>
                           <ConfigProvider theme={{
                                components: {
                                    Menu: {
                                        itemSelectedColor: '#ffffff',  // Màu chữ của item đang hoạt động (active)
                                        itemSelectedBg: '#1890ff',   // Màu nền của item đang hoạt động (active)
                                    }
                                }
                           }}>
                            <Menu items={dataLesson}></Menu>
                           </ConfigProvider>
                    </Layout.Sider>
            </Layout>
            <Layout.Footer style={{backgroundColor:"red", position:"fixed", bottom:0, left:0, right:0,}} ></Layout.Footer>
        </Layout>
)}

export default HoctapCourse;