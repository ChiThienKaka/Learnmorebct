import { EditOutlined, MinusOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import { Button, Flex, Form, Input, Layout, Menu, Popconfirm, Upload, UploadFile} from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {MenuItemType, SubMenuType } from "antd/es/menu/interface";
import React from "react";
import {ReactNode, useRef, useState } from "react";
import InputTextArea from "~/components/Layout/GiangvienLayout/components/inputextarea";

function CreateGV() {
    const [labelMenu, setLabelMenu] = useState('');
    const labelSubMenu = useRef("");
    const [visibleForm, setVisibleForm] = useState(false) //ẩn hiện cho form
    const [itemMenus, setItemMenus] = useState<SubMenuType[]>([])//Menu gốc hiện tại
    const [fileList, setFileList] = useState<UploadFile[]>([]);//Ds file tải lên
    const [formKhoahoc] = Form.useForm();// khởi tạo form
    //Hàm xóa một menu
    const deleteMenuItem = (key:string)=>{
        //sử dụng với callback để lấy được giá trị hiện tại
         setItemMenus(value=>{
            const newItemMenus =value.filter(item => item.key !== key);//xóa key đã chọn
            return newItemMenus;
         })
     }
     //Xóa Các menu con trong menu cha
     const deleteSubItems = (keyParent: string, keychild: string) => {
        setItemMenus(value=>{
            const newItemMenus =value.find(item => item.key === keyParent);//lọc ra key cha
            //lọc ra key con
            if(newItemMenus?.children){
                const newSubItemMenus = newItemMenus.children.filter(item => item?.key!==keychild)//lọc key đã chọn ra
                return value.map((item)=>{
                        if(item.key === keyParent){
                            item.children = newSubItemMenus;
                        }
                        return item;
                })
            }
            return value;
        })
     }
     //Xóa giá trị input sau khi được lưu
     const deleteInput = (id:string)=>{
        const inputElement = document.getElementById(id) as HTMLInputElement;
        if(inputElement){
            inputElement.value = ' ';
        }
     }

    //Hàm thêm một thư mục mới
    const addMenuItem= (label:string)=>{
        const key = `sub${itemMenus.length + 1}`;
        setItemMenus([...itemMenus, {key: key, label:<h4>{label}</h4>, children: [], 
        icon:(<Flex wrap gap={12}>
            {/* Thêm subitem mới  */}
            <Popconfirm trigger={"click"} icon={<EditOutlined/>}  placement="bottomLeft" title="Nhập nội dung bài giảng"
            onPopupClick={(e)=>e.stopPropagation()}
            description={<Flex wrap gap={5}><InputTextArea rows={3} id={`in${key}`} onClick={(e)=>e.stopPropagation()} 
                        onChange={(e)=>labelSubMenu.current=e.target.value}></InputTextArea>
                    </Flex>}
            onConfirm={(e)=>{e?.stopPropagation();addSubItem(key, labelSubMenu.current);deleteInput(`in${key}`);
            labelSubMenu.current=''}}>
            <Button shape="circle" style={{backgroundColor:"#4FD572", fontSize:11, fontWeight:"bold"}} icon={<PlusOutlined />} 
            type="primary" size="small" onClick={(e)=>e.stopPropagation()}></Button>
            </Popconfirm>

            {/* Xóa menu cha  */}
            <Button type="primary" style={{backgroundColor:"#4FD572", fontSize:11, fontWeight:"bold"}} icon={<MinusOutlined />} 
            shape="circle" size="small" onClick={()=>{deleteMenuItem(key)}}></Button>
        </Flex>)}])
     }
     //Add subitem cho thư mục con
     const addSubItem = (keyParent:string, label:string)=>{
        setItemMenus(values =>{
            const updateItemMenus = values.map(item=>{
                const keychild = `${keyParent}itemsub${item.children.length + 1}`; 
                const newSubitmemenus:MenuItemType = {
                    key: keychild,
                    title: label,
                    label:label,
                    // Xóa menu con vừa thêm 
                    icon: <Button size="small" type="primary" shape="circle" style={{fontWeight:'bold',fontSize:11,backgroundColor:"#4FD572",color:"#ffffff"}}
                    icon={<MinusOutlined/>}
                    onClick={(e)=>{e.stopPropagation(); deleteSubItems(keyParent,keychild)}}></Button>
                }
                return item.key === keyParent ? {...item, children: [...item.children, newSubitmemenus]} : item
            })
            return updateItemMenus
        })
     }
    return ( 
        <Flex wrap gap="middle">
           <Layout style={{display:"flex"}}>
                    <Content style={{marginRight:"28%",height:1200, backgroundColor:"pink", padding:40}}>
                        {/* ẩn hiện cho form  */}
                        <>{visibleForm ? (<Form form={formKhoahoc} layout="vertical" scrollToFirstError >
                        <Form.Item name={"titleparent"} label="Tiêu đề bài giảng" rules={[{required:true, message:"Tiêu đề không được để trống"}]}>
                        <Input></Input></Form.Item>

                        <Form.Item name={"titlelesson"} label="Tiêu đề bài học" rules={[{required:true, message:"Tiêu đề bài giảng không được để trống"}]}>
                        <Input></Input></Form.Item>
                        
                        <Form.Item name={"description"} label="Mô tả khóa học" rules={[{required:true, message:"Nội dung khóa học không được để trống"}]}>
                        <Input.TextArea rows={5}></Input.TextArea></Form.Item>
                        <Form.Item name={"upload"} label="Tài liệu tham khảo" rules={[
                            {required: true, message: "Vui lòng nhập các văn bản và chứng chỉ của bạn!"}
                        ]}>
                            <Upload showUploadList fileList={fileList} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" multiple={true} beforeUpload={()=>false}
                            listType="text" onChange={({fileList})=>{setFileList(fileList)}}>
                            <Button type="default" icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button block style={{backgroundColor:"#46d36b", borderRadius:20}} htmlType="submit" type="primary">Đăng ký</Button>
                        </Form.Item>
                        </Form>) : <h1>Kiếp này coi nhử bỏ</h1>
                        }</>  
                    </Content>
                    <Sider width={"25%"} theme="light" 
                    style={{position:"fixed",right:0, height:"100vh", overflow:"auto"}}>

                        <Flex wrap gap={8} style={{margin:"10px 0px 10px 10px", alignItems:"center"}}>
                            <h3>Nội dung khóa học</h3>
                            <Popconfirm icon={<EditOutlined />} placement="bottom" title="Nhập tiêu đề bài giảng" 
                                description={(<Input value={labelMenu} onChange={(e)=>setLabelMenu(e.target.value)}></Input>)}
                                onConfirm={()=>{addMenuItem(labelMenu); setLabelMenu('')}}>
                                <Flex><Button type="primary" style={{backgroundColor:"#4FD572"}}>Thêm mới</Button></Flex>
                            </Popconfirm>
                        </Flex>
                        {/* Gọi sự kiện khi chọn một itemMenu  */}
                        <Menu defaultSelectedKeys={['sub1']} onSelect={({ item,keyPath}:any)=>{
                                const titleparent:ReactNode= itemMenus.find(item => item.key === keyPath[1])?.label;
                                //cập nhật lại form khi thay đổi tiêu đề
                                if(React.isValidElement(titleparent)){
                                    formKhoahoc.setFieldsValue({titlelesson: item.props.title, 
                                    titleparent: titleparent.props.children})
                                }
                                setVisibleForm(true);//hiện lại form
                        }}
                            defaultOpenKeys={['sub1']} mode="inline" theme="light" items={itemMenus}> 
                        </Menu>
                    </Sider>
            </Layout>
        </Flex>
     );
}

export default CreateGV;
