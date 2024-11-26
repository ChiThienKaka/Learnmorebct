import { Avatar, Card, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "~/constants/constant";
const ChitietGiangvien = () => {
    const [dataGV, setDataGV] = useState<any>([]);
    const getdatagv = async () => {
        try {
            const res = await axios.get(`${API_URL}admin/danhsachgiangvien`);
            console.log(res.data)
            setDataGV(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getdatagv();
    }, [])
    return (
        <Card title={'Danh sách thông tin Giảng viên'}>
            {
                dataGV && <Table columns={[
                    {
                        title: 'Avatar',
                        dataIndex: 'email',
                        render: (text) => {
                            return <Avatar alt="hihi" src={`${API_URL}admin/images/${text}`} />
                        }
                    },
                    {
                        title: 'Họ và tên',
                        dataIndex: 'name',
                        render: (text) => {
                            return <span>{text}</span>
                        }
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        render: (text) => {
                            return <span>{text}</span>
                        }
                    },
                    {
                        title: 'CCCD',
                        dataIndex: 'userdetails',
                        render: (text) => {
                            return text.cccd ? <span>{text.cccd}</span> : <span>chưa cập nhật</span>
                        }
                    },
                    {
                        title: 'Địa chỉ',
                        dataIndex: 'userdetails',
                        render: (text) => {
                            return text.diachi ? <span>{text.diachi}</span> : <span>chưa cập nhật</span>
                        }
                    },
                    {
                        title: 'STK',
                        dataIndex: 'userdetails',
                        render: (text) => {
                            return text.sotaikhoan ? <span>{text.sotaikhoan}</span> : <span>chưa cập nhật</span>
                        }
                    },
                    {
                        title: 'Ngân hàng',
                        dataIndex: 'userdetails',
                        render: (text) => {
                            return text.nganhang ? <span>{text.nganhang}</span> : <span>chưa cập nhật</span>
                        }
                    },
                ]} pagination={{pageSize: 6, showSizeChanger: false, align:"center"}} dataSource={dataGV} />
            }
        </Card>
    )
}

export default ChitietGiangvien;