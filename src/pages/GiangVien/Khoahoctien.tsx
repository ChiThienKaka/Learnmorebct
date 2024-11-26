import { Avatar, Button, Card, Col, Collapse, Divider, Flex, Row, Select, Space, Table, Tag } from "antd"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL, formatCurrencyVND, formatToVietnamTime, vietQR } from "~/constants/constant";
import { v4 as uuidv4 } from "uuid";
import { CaretRightOutlined, CheckOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { selectAuth } from "~/redux/selector";
import { useSelector } from "react-redux";
const KhoahocTien = () => {
    const auth = useSelector(selectAuth)
    const [month, setMonth] = useState('11');
    const [year, setYear] = useState('2024');
    const [thanhtoangiangvien, setThanhtoangiangvien] = useState('0');
    const [dataAll, setDataAll] = useState<any>([]);//lấy danh sách toàn bộ khóa học chưa được thanh toán
    const [bank, setBank] = useState<any>([]);
    const getBank = async () => {
        // list banks are supported create QR code by Vietqr
        vietQR.getBanks().then((banks:any)=>{
            setBank(banks.data);
        })
    }
    const getPaymentThanhtoan = async () => {
        const trangthai = thanhtoangiangvien === '0' ? false : true;
        console.log(year, month, trangthai);
        try{
            if(auth){
                const res = await axios.post(`${API_URL}payment/paymentgv`,{
                    year: year,
                    month: month,
                    thanhtoangiangvien: trangthai,
                    idgv: auth?.id
                });
                setDataAll(res.data);
                console.log(res.data);
            }
        }catch(err){console.log(err);}
    }
    useEffect(()=>{
        getPaymentThanhtoan();
        getBank();
    },[]);
    useEffect(()=>{
        getPaymentThanhtoan();
    },[year,month, thanhtoangiangvien])
    return (
        <>
            <Card title="Thanh toán khóa học theo từng tháng" extra={<Button>Quay lại</Button>}>
            
                <Flex justify="space-around">
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
                    <Space wrap direction="horizontal" size={"large"}>
                        <span style={{fontWeight:"bold"}}>Trạng thái thanh toán: </span>
                        <Select
                            value={thanhtoangiangvien}
                            onChange={(value)=>{setThanhtoangiangvien(value)}}
                            defaultValue="0"
                            style={{ width: 200 }}
                            // onChange={handleChange}
                            options={[
                                {value: '0', label: 'Chưa thanh toán'},
                                {value: '1', label: 'Đã thanh toán'},
                            ]}/>
                    </Space>
                </Flex>
                <Divider />
                <Flex vertical>
                    {
                        dataAll.length !==0 && (
                            <Card title={<Row>
                                <Col span={6}>Khóa học</Col>
                                <Col span={6}>Giảng viên</Col>
                                <Col span={8}>Ngân hàng</Col>
                                <Col span={4}>Tổng tiền</Col>
                            </Row>}>{
                            dataAll.map((item:any)=>{
                                return (<Collapse expandIconPosition="end" expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20, color:"#26743B"}} rotate={isActive ? 90 : 0} />}
                                    key={`${uuidv4()}`} items={[
                                    {key:`${item.course.id}`, label:<>
                                        <Row>
                                            <Col span={6}>
                                            <Flex gap={8} align="center" style={{width:'100%'}}>
                                                <Flex>
                                                    <img alt="thumbnail" width={120} height={67} style={{objectFit:"cover", borderRadius:8}}
                                                    src={`${API_URL}course/thumbail/${item.course.idGV}/${item.course.thumbnail}`} />
                                                </Flex>
                                                <Flex vertical gap={1}>
                                                    <div><span style={{fontWeight:"bold"}}>{item.course.title}</span></div>
                                                    {/* <div><span>{item.course.description}</span></div> */}
                                                    <span>{`Tỉ lệ: ${item.course.tileanchia}`}</span>
                                                    <div><span style={{fontWeight:'bold', color:'red'}}>{formatCurrencyVND(item.course.price)}</span>
                                                    <span>{item.course.status?<Tag style={{marginLeft:5}} color="green">Đã duyệt</Tag>:<Tag style={{marginLeft:5}} color="red">Chưa duyệt</Tag>}</span></div>
                                                </Flex>     
                                            </Flex>
                                            </Col>
                                            <Col span={6}>
                                            <Flex gap={8} align="center" style={{width:'100%'}}>
                                                <Flex>
                                                    <img alt="thumbail" width={50} height={50} style={{objectFit:"cover", borderRadius:100}}
                                                    src={`${API_URL}admin/images/${item.user.email}`} />
                                                </Flex>
                                                <Flex vertical gap={1}>
                                                    <div><span style={{fontWeight:"bold"}}>{item.user.name}</span></div>
                                                    <div><span>{item.user.email}</span></div>
                                                    <div><span style={{fontSize:10}}>Ngày tạo khóa học: {formatToVietnamTime(item.course.createdAt)}</span></div>
                                                </Flex>     
                                            </Flex></Col>
                                            <Col span={8}>
                                                <Space direction="vertical" style={{fontSize:12}} >
                                                    <span style={{fontSize:15}}>{`STK: ${item.user.sotaikhoan}`}</span>
                                                    <span>{bank&&bank.find((bank:any)=>bank.code===item.user.nganhang)?.name}</span>
                                                    <Space wrap>
                                                        <span>{bank&&bank.find((bank:any)=>bank.code===item.user.nganhang)?.shortName}</span>
                                                        <span>{bank && <Avatar alt="hhiih" shape="square" style={{width:80, height:30}} src={bank.find((bank:any)=>bank.code===item.user.nganhang)?.logo} />}</span>
                                                    </Space>
                                                </Space>
                                            </Col>
                                            <Col span={4}>
                                              <Space direction="vertical">
                                                    <span style={{fontWeight:"bold"}}>Học viên mới: <span style={{color:"red", fontWeight:"bold"}}>{`x${item.thanhvienmoi}`}</span></span>
                                                    <span style={{fontWeight:"bold"}}>Tổng giá: <span style={{color:"red", fontWeight:"bold"}}>{`${formatCurrencyVND(item.tongtien)}`}</span></span>
                                                    {thanhtoangiangvien==='0' ? <Tag color="red">Chưa thanh toán</Tag>:
                                                    <Tag color="green">Đã thanh toán</Tag>}
                                              </Space>
                                            </Col>
                                        </Row>
                                    </>, children: <>
                                        <Table columns={[
                                            {title:'Avatar', key: 'user', dataIndex:'user', 
                                                render: (text)=>{
                                                    return text.avatar !==null ?<Avatar src={`${API_URL}auth/getavatarnd/${text.id}/${text.avatar}`} /> : <Avatar icon={<UserOutlined />} />
                                                }
                                            },
                                            {title:'Email', key: 'user', dataIndex:'user', 
                                                render: (text)=>{
                                                    return <span>{text.email}</span>
                                                }
                                            },
                                            {title:'Mã giao dịch', key: 'transactionid', dataIndex:'transactionid', 
                                                render: (text)=>{
                                                    return <span>{text}</span>
                                                }
                                            },
                                            {title:'Số tiền', key: 'amount', dataIndex:'amount', 
                                                render: (text)=>{
                                                    return <span>{formatCurrencyVND(text)}</span>
                                                }
                                            },
                                            {title:'Phương thức', key: 'paymentmethod', dataIndex:'paymentmethod', 
                                                render: (text)=>{
                                                    return <span>{text==='qr'?'Mã QR':'chưa xác định'}</span>
                                                }
                                            },
                                            {title:'Thời gian thanh toán', key: 'paymentdate', dataIndex:'paymentdate', 
                                                render: (text)=>{
                                                    return <span>{formatToVietnamTime(text)}</span>
                                                }
                                            },
                                            {title:'Giải ngân', key: 'thanhtoangiangvien', dataIndex:'thanhtoangiangvien', 
                                                render: (text)=>{
                                                    return text?<CheckOutlined style={{color:"green"}} />:<CloseOutlined style={{color:"red"}} />
                                                },align:'center'
                                            },
                                        ]}
                                        pagination={false} dataSource={item.payment} />
                                    </>}
                                ]}/>)
                            })
                            }</Card>
                        )
                    }
                </Flex>
            </Card>
        </>
    )
}

export default KhoahocTien