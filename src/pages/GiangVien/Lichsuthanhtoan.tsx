import { UserOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Flex, Select, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { API_URL, formatCurrencyVND, formatToVietnamTime } from "~/constants/constant";
import { selectAuth } from "~/redux/selector";
const LichsuThanhtoan = ()=>{
    const [month, setMonth] = useState('11');
    const [year, setYear] = useState('2024');
    const auth = useSelector(selectAuth);
    const [dataPaymentgv, setDataPaymentgv] = useState<any>([]);
    const getDataPaymentgv = async ()=> {
        try{
            if(auth){
                const res = await axios.post(`${API_URL}paymentgiangvien/paymentgvbyidgv`, {month:month,year:year,idgv: auth.id});
                setDataPaymentgv(res.data);
            }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getDataPaymentgv();
    },[])
    useEffect(()=>{
        getDataPaymentgv();
    },[year, month])
    return (
        <>
            <Card title="Lịch sử thanh toán" extra={<Button>Quay lại</Button>}>
            <Flex>
                    <Space size={"large"} wrap direction="horizontal">
                    <span style={{fontWeight:"bold"}}>Chọn tháng: </span>
                    <Select 
                            onChange={(value)=>{console.log(value);setMonth(value)}}
                            value={month}
                            defaultValue="11"
                            style={{ width: 120 }}
                            // onChange={handleChange}
                            options={[
                                { value: '1', label: 'Tháng 1' },
                                { value: '2', label: 'Tháng 2' },
                                { value: '3', label: 'Tháng 3' },
                                { value: '4', label: 'Tháng 4' },
                                { value: '5', label: 'Tháng 5' },
                                { value: '6', label: 'Tháng 6' },
                                { value: '7', label: 'Tháng 7' },
                                { value: '8', label: 'Tháng 8' },
                                { value: '9', label: 'Tháng 9' },
                                { value: '10', label: 'Tháng 10' },
                                { value: '11', label: 'Tháng 11' },
                                { value: '12', label: 'Tháng 12' },
                            ]}/>
                        <Select
                            value={year}
                            defaultValue="2024"
                            onChange={(value)=>{console.log(value); setYear(value)}}
                            style={{ width: 120 }}
                            // onChange={handleChange}
                            options={[
                                { value: '2024', label: 'Năm 2024' },
                                { value: '2025', label: 'Năm 2025' },
                                { value: '2026', label: 'Năm 2026' },
                                { value: '2027', label: 'Năm 2027' },
                                { value: '2028', label: 'Năm 2028' },
                                { value: '2029', label: 'Năm 2029' },
                                { value: '2030', label: 'Năm 2030' },
                                { value: '2031', label: 'Năm 2031' },
                                { value: '2032', label: 'Năm 2032' },
                                { value: '2033', label: 'Năm 2033' },
                                { value: '2034', label: 'Năm 2034' },
                                { value: '2035', label: 'Năm 2035' },
                            ]}/>
                    </Space>
                </Flex>
                <Divider />
                {
                    dataPaymentgv && <Table columns={[
                        {
                            title: "Mã khóa học",
                            dataIndex: "courseid",
                            render: (text)=>{
                                return <span>{text}</span>
                            } 
                        },
                        {
                            title: "Học viên mới",
                            dataIndex: "hocvienmoi",
                            render: (text)=>{
                                return <span><UserOutlined/> x{text}</span>
                            } 
                        },
                        {
                            title: "Mã giao dịch",
                            dataIndex: "magiaodich",
                            render: (text)=>{
                                return <span>{text}</span>
                            } 
                        },
                        {
                            title: "Phương thức thanh toán",
                            dataIndex: "method",
                            render: (text)=>{
                                return <span>{text}</span>
                            } 
                        },{
                            title: "Kiểu thanh toán",
                            dataIndex: "kieuthanhtoan",
                            render: (text)=>{
                                return <span>{text}</span>
                            } 
                        },{
                            title: "Thời gian",
                            dataIndex: "createdAt",
                            render: (text)=>{
                                return <span>{formatToVietnamTime(text)}</span>
                            } 
                        },{
                            title: "Tổng tiền",
                            dataIndex: "amount",
                            render: (text)=>{
                                return <span>{formatCurrencyVND(text)}</span>
                            } 
                        },
                    ]} dataSource={dataPaymentgv} pagination={false} />
                }
            </Card>
        </>
    )
}

export default LichsuThanhtoan;