import { Avatar, Button, Flex, Space} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import images from "~/assets/images";
import { API_URL, formatCurrencyVND, formatToVietnamTime } from "~/constants/constant";
const DetailCourseRegister = () => {
    const location = useLocation();
    const {courseid, idGV} = location.state;
    const [datachitiet, setDatachitiet] = useState<any>();
    const getData = async (idcousrese: any, idGV: any)=>{
        try{
            const res = await axios.get(`${API_URL}course/getinfolessongvforcourse/${idcousrese}/${idGV}`);
            setDatachitiet(res.data);
        }catch(err){console.log(err);}
    }
    useEffect(()=>{
        getData(courseid, idGV);
    },[courseid, idGV]);
    return (
        <>  
            {/* bug không truyền tham số  */}
            {datachitiet && location.state && (
                <Flex flex={1} style={{width:"100%",height:"100%", padding:30}}>
                {/* Chiếm 3 phần  */}
                <Flex vertical flex={3} style={{width:"100%",height:"100%"}}>
                    {/* Nội dung thumbail khóa học  */}
                    <h1>{datachitiet.course.title}</h1>
                    <span style={{textAlign:"justify"}}>{datachitiet.course.description}</span>
                    <Flex wrap gap={20} style={{marginTop:15}}>
                        <div><img alt="hihi" width={300} height={169} src={`${API_URL}course/thumbail/${datachitiet.course.idGV}/${datachitiet.course.thumbnail}`} 
                        style={{borderRadius: 20}}/></div>
                        <div>
                            <Space direction="vertical" size="middle">
                                <h4>Tổng số {datachitiet.tongbaigiang} bài học</h4>
                                {datachitiet.course.price!==0 ? <span>Giá: <span style={{fontWeight:"bold", color:"red"}}>{formatCurrencyVND(datachitiet.course.price)}</span></span>:
                                <span style={{fontWeight:'bold', color:'red'}}>Miễn phí</span>}
                                <span>Ngày phát hành: <span style={{fontWeight:"bold"}}>{formatToVietnamTime(datachitiet.course.createdAt).split(' ')[1]}</span></span>
                                {datachitiet.course.price !==0 ? <Button type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Mua khóa học</Button> : 
                                <Button type="primary" style={{backgroundColor:"#47d36b", borderRadius:20}}>Đăng ký học ngay</Button>}
                            </Space>
                        </div>
                    </Flex>
                    <h2 style={{margin:"10px 0px 10px 0"}}>Nội dung khóa học</h2>
                    <Space direction="vertical" size="middle">
                            {datachitiet.lesson.map((item:any)=>{
                                return <Flex key={item.id} align="center" flex={1} style={{backgroundColor:"#f8f8f8", padding:3, borderRadius:10}} wrap>
                                <Flex flex={2}><img alt="hehe" width={120} height={67} src={`${API_URL}lesson/getimage/${item.lessonid}/${item.image}`} 
                                style={{borderRadius: 10, objectFit:"cover"}} /></Flex>
                                <Flex flex={7}><span style={{fontWeight:'bold'}}>{item.title}</span></Flex>
                                <Flex flex={1} justify="center"><Avatar size="small" src={<img alt="hehe" src={images.iconplaying} />}  />   </Flex>
                            </Flex>
                            })}
                    </Space>

                </Flex>
                {/* Chiếm 1 phần  */}
                <Flex vertical gap={15} align="center" flex={1} style={{width:"100%",height:"100%", padding:20}}>
                        <div>
                            <img alt="hehe" width={240} height={350} style={{objectFit:"cover", borderRadius:10}}
                            src={`${API_URL}admin/images/${datachitiet.giangVien.email}`} />
                        </div>
                    
                        <Space direction="vertical">
                            <span style={{fontWeight:'bold', textAlign:'center', display:"block", fontSize:15, marginBottom:10}}>Thông tin giảng viên</span>
                            <span>Họ và tên: <span style={{fontWeight:'bold'}}>{datachitiet.giangVien.name}</span></span>
                            <span>Trình độ học vấn: Kỹ sư</span>
                            <span>Lĩnh vực: Công nghệ thông tin</span>
                        </Space>
                </Flex>
            </Flex>
            )}
        </>
    )
}

export default DetailCourseRegister;