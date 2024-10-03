
import { EyeOutlined, LockOutlined } from "@ant-design/icons";
import {Button, Flex, Table, Tag, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "~/constants/constant";
const CourseXetDuyet = ()=>{
    const navigate = useNavigate();
    // fomat tiền tệ sang dạng việt nam 
    const formatCurrencyVND = (amount:any) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    //chuyển sang ngày giờ việt nam
    const formatToVietnamTime = (isoString:any) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',  // Múi giờ Việt Nam
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };
    
    const [data, setData] = useState<any[]>([]);
    //Lấy dữ liệu về
    const getAPIGiangVienCourses = async() => {
        const res = await axios.get(`${API_URL}admin/duyetCouseGV`);
        setData(res.data);
    }
    useEffect(()=>{
        getAPIGiangVienCourses();
    },[])
    //Duyệt khóa học khi nhận vào id khóa học
    const duyetCourseStatusById = async (id: any, status: boolean) => {
        try{
            await axios.put(`${API_URL}course/updatecourse/${id}`, {status: status});
            getAPIGiangVienCourses();
        }catch(err){console.log(err)};
    }


    //chỉnh sửa các thuộc tính để render khóa học
    const columns = [
        // Đây là cột 1 
        { title: 'Khóa học',width:700, dataIndex: 'title', key: 'title', render: (text:any, record:any)=>{return <>
        <Flex gap={8} align="center" style={{width:'100%'}}>
            <Flex>
                <img alt="thumbnail" width={120} height={67} style={{objectFit:"cover", borderRadius:8}}
                src={`${API_URL}course/thumbail/${record.idGV}/${record.thumbnail}`} />
            </Flex>
            <Flex vertical gap={1}>
                <div><span style={{fontWeight:"bold"}}>{text}</span></div>
                <div><span>{record.description}</span></div>
                <div><span style={{fontWeight:'bold', color:'red'}}>{formatCurrencyVND(record.price)}</span>
                <span>{record.status?<Tag style={{marginLeft:5}} color="green">Đã duyệt</Tag>:<Tag style={{marginLeft:5}} color="red">Chưa duyệt</Tag>}</span></div>
            </Flex>     
        </Flex></>}},
        // Đây là cột 2
        { title: 'Giảng viên', dataIndex: 'giangVien', key: 'giangVien', render: (text:any, record:any)=>{return <>
            <Flex gap={8} align="center" style={{width:'100%'}}>
                <Flex>
                    <img alt="thumbail" width={50} height={50} style={{objectFit:"cover", borderRadius:100}}
                    src={`${API_URL}admin/images/${text.email}`} />
                </Flex>
                <Flex vertical gap={1}>
                    <div><span style={{fontWeight:"bold"}}>{text.name}</span></div>
                    <div><span>{text.email}</span></div>
                    <div><span style={{fontSize:10}}>Ngày tạo khóa học: {formatToVietnamTime(record.createdAt)}</span></div>
                </Flex>     
            </Flex></>}},
        // Đây là cột 3
         { title: 'Phê duyệt', dataIndex: 'id', key: 'id', render: (text:any, record:any)=>{return <>
            <Flex gap={8} align="center" style={{width:'100%'}}>
                <Button type="primary" onClick={()=>duyetCourseStatusById(record.id, true)} style={{backgroundColor:"#47d36b", borderRadius:20}}>Duyệt</Button>
                <Tooltip title="Ẩn khóa học">
                <Button onClick={()=>duyetCourseStatusById(record.id, false)}
                type="primary" style={{backgroundColor:"red"}} shape="circle" icon={<LockOutlined />}></Button>
                </Tooltip>
                <Tooltip title="Xem chi tiết khóa học">
                <Button onClick={()=>navigate('/admin/chitietcoursead',{state:text})} shape="circle" icon={<EyeOutlined />}></Button></Tooltip>
            </Flex></>}}
      ];
    //   const data = [
    //     { key: '1', courseName: 'Lập trình React', instructor: 'Thien', createdAt: '2023-10-01', status: 'Đã duyệt' },
    //     { key: '2', courseName: 'Lập trình Node.js', instructor: 'Tuan', createdAt: '2023-10-02', status: 'Chưa duyệt' },
    //   ];
    return (
        <>
            <h3>Danh sách khóa học</h3>
            <Table tableLayout="auto" pagination={{pageSize:4}} columns={columns} dataSource={data} />
        </>
    );
}

export default CourseXetDuyet;
