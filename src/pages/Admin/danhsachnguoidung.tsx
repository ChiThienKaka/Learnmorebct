import { UserOutlined } from "@ant-design/icons";
import { Card, Table } from "antd"
import Avatar from "antd/es/avatar/avatar";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { API_URL, formatToVietnamTime } from "~/constants/constant";
const DanhsachNguoidung = () => {
    const [dataUser, setDataUser] = useState<any>([]);
    const getuserdata = async () => {
        try{
            const res = await axios.get(`${API_URL}admin/danhsachnguoidung`);
            console.log(res.data);
            setDataUser(res.data);
        }catch(err){console.log(err);}
    }
    useEffect(()=>{
        //Lấy danh sách người dùng
        getuserdata();
    },[])
    return (
        <Card title={'Danh sách thông tin Người dùng'}>
            {
                dataUser && <Table pagination={{pageSize:6, align:"center"}} columns={[
                    {
                        title: 'Avatar',
                        dataIndex:'avatar',
                        render: (text, record:any)=>{
                            return text ? <Avatar src={`${API_URL}auth/getavatarnd/${record?.id}/${text}`}/> : <Avatar icon={<UserOutlined/>} />
                        }
                    },
                    {
                        title: 'Họ và tên',
                        dataIndex:'name',
                        render: (text)=>{
                            return text ? <span>{text}</span> : <span>chưa cập nhật</span>
                        }
                    },
                    {
                        title: 'Email',
                        dataIndex:'email',
                        render: (text)=>{
                            return text ? <span>{text}</span> : <span>chưa cập nhật</span>
                        }
                    },
                    {
                        title: 'Ngày tạo',
                        dataIndex:'createdAt',
                        render: (text)=>{
                            return <span>{formatToVietnamTime(text).split(' ')[1]}</span>
                        }
                    }
                ]} dataSource={dataUser} />
            }
        </Card>
    )
}
export default DanhsachNguoidung