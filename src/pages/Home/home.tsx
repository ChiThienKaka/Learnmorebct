import { ClockCircleOutlined, PlayCircleOutlined, TeamOutlined} from "@ant-design/icons";
import { Avatar, Card, Col, Flex, Row} from "antd";
import Meta from "antd/es/card/Meta";
import './homestyle.css'
import { useEffect, useState } from "react";
import { API_URL} from "~/constants/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () =>{ 
    const navigate = useNavigate();
    const [dataCourse, setDataCourse] = useState<any[]>();
    const getCourseByStatus  = async ()=>{
        try{
            const res = await axios.get(`${API_URL}course/getcoursestatus`);
            setDataCourse(res.data);
        }catch(err){console.log(err);}
    }
    useEffect(()=>{
        getCourseByStatus();
    },[])

    // fomat tiền tệ sang dạng việt nam 
    const formatCurrencyVND = (amount:any) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    return(
    <Row style={{marginTop:20, padding:20}} gutter={[10, 60]}>
        {
            dataCourse && (
                 dataCourse.map((item)=>{
                    return <Col key={`${item.id}col`} xs={24} sm={12} md={8} lg={6}><Card key={item.id}  style={{maxWidth: 280,maxHeight:283,backgroundColor:"#F7F7F7", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'}}
                    cover={<img onClick={()=>{navigate('/chitietkhoahoc', {state: {courseid: item.id, idGV: item.idGV}})}}
                        style={{width:280, height:157,objectFit:"cover" }} alt="example" src={`${API_URL}course/thumbail/${item.idGV}/${item.thumbnail}`}/>}
                    className='ant-card-actions'
                    actions={[
                        <div className="text-action"><TeamOutlined key="user" /> 112.133</div>,
                        <div className="text-action"><PlayCircleOutlined key="video" /> 9</div>,
                        <div className="text-action"><ClockCircleOutlined key="time" /> 12h03p</div>
                    ]}>
                    <Meta style={{justifyContent:"center", alignItems: 'center'}}
                    // avatar={}
                    title= {<span className="text-title">{item.title}</span>}
                    description= {<Flex gap={3} justify="space-between" align="center">
                        <span className="text-description">{item.price !== 0 ? formatCurrencyVND(item.price) : 'Miễn phí'}</span>
                        <Flex align="center">
                            <Avatar src={`${API_URL}admin/images/${item.giangVien.email}`} />
                            <div style={{fontSize:12}} className="text-author">{item.giangVien.name}</div>
                        </Flex>
                    </Flex>}/>
                    </Card></Col>
                })
            )
        }
        {/* card mẫu  */}
        {/* <Card  style={{marginTop:20,marginLeft:20,maxWidth: 280,maxHeight:283,backgroundColor:"#F7F7F7", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'}}
                        cover={<img style={{maxWidth:280, maxHeight:157,objectFit:"cover" }} alt="example" src="https://files.fullstack.edu.vn/f8-prod/courses/7.png"/>}
                        className='ant-card-actions'
                        actions={[
                            <div className="text-action"><TeamOutlined key="user" /> 112.133</div>,
                            <div className="text-action"><PlayCircleOutlined key="video" /> 9</div>,
                            <div className="text-action"><ClockCircleOutlined key="time" /> 12h03p</div>
                        ]}>
                        <Meta style={{justifyContent:"center", alignItems: 'center'}}
                        avatar={<Flex gap={3} vertical justify="center" align="center">
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                            <div style={{fontSize:10}} className="text-author">Chí Thiện</div>
                        </Flex>}
                        title= {<span className="text-title">Tên khóa học</span>}
                        description= {<span className="text-description">1.200.000đ</span>}/>
        </Card> */}
    </Row>
    );
}
export default Home;
