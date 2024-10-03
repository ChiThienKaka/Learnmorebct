import { FilePdfOutlined, FileWordOutlined, LockOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, List, Tag} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "~/constants/constant";
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from "react-router-dom";
function AdminGiangVien() {
  const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<any[]>([])
    const capnhatStatusGV = async (id: string, status: boolean) => {
        try{
            await axios.put(`${API_URL}auth/status/${id}`,{status: status});
        }catch(err) {
          console.log(err);
        }
    }
    const getData = async (email:string) => {
      try {
           const res = await axios.get(`${API_URL}admin/documents/${email}`);
           return await res.data;
      } catch(e){console.log(e);}
   }
   const data = async () => {
    try {
       //id name email avatar files: ccvb status
       //lấy dữ liệu giảng viên cần duyệt
       const res =  await axios.get(`${API_URL}admin/duyetGV`); 
       //lấy mảng chứng chỉnh văn bằng
       const dataFiles = await Promise.all(
         res.data.data.map(async (item:any)=>{
           // goi api status ở đây
           const status = await axios.post(`${API_URL}auth/status`,{id: item.id});
           const resfile = await getData(item.email)
           return {...item, filevb: resfile.files, status: status.data.statusGV}
         })
       )
       setDataSource(dataFiles)
    }catch(e){console.log(e);}
}
    useEffect( ()=>{
        data();
    },[]);
    return ( 
        <><Card title={'Danh sách Giảng viên'}>
          <List pagination={{pageSize:6, align:'center'}} itemLayout="horizontal" dataSource={dataSource} renderItem={(itemP) => (
            <List.Item key={itemP.id} actions={[<Flex wrap gap={10} justify="center" align="center">
                                          <Button type="primary" style={{borderRadius:20, backgroundColor:"#46d36b"}} 
                                          onClick={()=>{capnhatStatusGV(itemP.id, true);data();}}>Duyệt</Button>
                                          <Button type="primary" shape="circle" icon={<LockOutlined />} style={{backgroundColor:"red"}} 
                                          onClick={()=>{capnhatStatusGV(itemP.id, false);data();}}></Button>
                                          {/* window.location.reload(); */}
                                          {itemP.status ? <Tag style={{marginLeft:12}} color="green">Đã duyệt</Tag> : <Tag color="red">Chưa duyệt</Tag>}
                                      </Flex>]}>
              <List.Item.Meta
                title={itemP.name}
                description={itemP.email}
                avatar = {<Avatar src={`${API_URL}admin/images/${itemP.email}`} />}
              />
              <div>
                  <Flex wrap gap={3}>
                    {itemP.filevb.map((item:any)=>{
                      if(item.includes('.docx')){
                        return(<Button icon={<FileWordOutlined style={{color:"#2A5697"}} />} type="text" shape="circle"
                              key={`${uuidv4()}doc1`} onClick={()=>{
                                  navigate('/preview',{state: {wordFileUrl: `${API_URL}admin/documents/${itemP.email}/${item}`}})
                              }}></Button>)
                      }else if(item.includes('.doc')){
                              return <Button icon={<FileWordOutlined />} type="link" shape="circle"
                              key={`${uuidv4()}pdf`} href={`${API_URL}admin/documents/${itemP.email}/${item}`} target="_blank"></Button>
                      }else{
                        return <Button icon={<FilePdfOutlined style={{color:"#E30809"}} />} type="link" shape="circle"
                        key={`${uuidv4()}pdf`} href={`${API_URL}admin/documents/${itemP.email}/${item}`} target="_blank"></Button>
                      }
                    })}
                  </Flex>
              </div>
            </List.Item>
          )}>
                
            </List>
          </Card>
        </>
     );
}

export default AdminGiangVien;