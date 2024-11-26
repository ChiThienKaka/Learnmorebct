import { ArrowLeftOutlined, ArrowRightOutlined, ClockCircleOutlined, FilterOutlined, PlayCircleOutlined, TeamOutlined} from "@ant-design/icons";
import { Avatar, Button, Card, Carousel, Cascader, Col, Divider, Flex, FloatButton, Image, Pagination, Rate, Row, Select, Space} from "antd";
import Meta from "antd/es/card/Meta";
import './homestyle.css'
import { Fragment, useEffect, useRef, useState } from "react";
import { API_URL,formatToVietnamTime} from "~/constants/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import images from "~/assets/images";

const Home = () =>{ 
    const navigate = useNavigate();
    const [dataCourse, setDataCourse] = useState<any[]>();
    //data chính không thay đổi để phân trang
    const dataCourseChinh = useRef<any>([]);
    const [dataCategori, setDataCategori] = useState<any>([]);
    const [dataCoursenoibat, setDataCoursenoibat] = useState<any>([]);//lấy danh sách khóa học nổi bật
    const [dataCoursenewhot, setDataCoursenewhot] = useState<any>([]);//lấy danh sách khóa học mới nhất
    const scrollNoibat = useRef<HTMLDivElement>(null);
    const scrollNewhot = useRef<HTMLDivElement>(null);
    const [selectDanhmuc, setSelectDanhmuc] = useState<any>(1);
    const [selectMienphi, setSelectMienphi] = useState<any>('0')

    // State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12; // Số phần tử trên mỗi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const getkhoahocnewhot = async()=>{
        try{
            const res = await axios.get(`${API_URL}course/getcoursenewhot`);
            setDataCoursenewhot(res.data);
        }catch(err){console.log(err);}
    }
    //điều kiện lọc
    const handlelocdanhmucprice = async() => {
        const res = await axios.post(`${API_URL}course/coursedanhmucprice`,{
            idDanhmuc: !Array.isArray(selectDanhmuc)?selectDanhmuc:selectDanhmuc.length===1 ? selectDanhmuc[0]: selectDanhmuc[1], 
            price: Number(selectMienphi)
        })
        dataCourseChinh.current= res.data;
        //lọc lại khóa học
        setCurrentPage(1);
        setDataCourse(res.data.slice(0, 12));
    }
    const getKhoahocnoibat = async () => {
        try{
            const res = await axios.get(`${API_URL}course/getcoursenoibat`);
            setDataCoursenoibat(res.data);
        }catch(err){console.log(err);}
    }
    const getDanhsachCategori = async () => {
        try{
            const res = await axios.get(`${API_URL}categori/danhsachcay`);
            setDataCategori(res.data);
        }catch(err){console.log(err);}
    }
    const getCourseByStatus  = async ()=>{
        try{
            const res = await axios.get(`${API_URL}course/getcoursestatus`);
            setDataCourse(res.data.slice(0, 12));
            dataCourseChinh.current = res.data;
        }catch(err){console.log(err);}
    }
    useEffect(()=> {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        //cập nhật lại datacourse mà không bị  ảnh hưởng
        setDataCourse(dataCourseChinh.current.slice(startIndex, endIndex));
    },[currentPage])
    useEffect(()=>{
        getCourseByStatus();
        getDanhsachCategori();
        //lấy danh sách khóa học nổi bật
        getKhoahocnoibat();
        getkhoahocnewhot();
    },[])
    //lưu lại thay đổi
    useEffect(()=>{
        console.log('danh muc',selectDanhmuc,'mienphi', selectMienphi);
        handlelocdanhmucprice();
    },[selectDanhmuc, selectMienphi])
    // fomat tiền tệ sang dạng việt nam 
    const formatCurrencyVND = (amount:any) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    // const contentStyle: React.CSSProperties = {
    //     height: '250px',
    //     color: '#fff',
    //     lineHeight: '160px',
    //     textAlign: 'center',
    //     background: '#364d79',
    //   };
    return(
    
    <div style={{marginTop:20,marginBottom:50, padding:20, width:"100%"}}>
        <Carousel autoplay>
                <div>
                    <div style={{width:"100%",backgroundColor:"#c3f0cc",padding:"0px 10px 0px 0px", borderRadius:8, display:"flex"}}>
                        <img height={260} width={600} alt="hihi" src={images.slide2}></img>
                        <Space direction="vertical" style={{fontWeight:"bold", textAlign:"justify", padding:10, color:"green"}}>
                            <h1 style={{textAlign:"center"}}>Khóa học đa dạng - Thanh toán dễ dàng - Theo dõi tiến trình học tập - Tương tác và hỗ trợ</h1>
                            <span>Cung cấp nhiều khóa học về các lĩnh vực khác nhau, tích hợp MOMO và nhiều phương thức thanh toán khác, tính năng giúp học viên theo dõi tiến độ, điểm số, và đánh giá. Hỗ trợ giảng viên quản lý học viên, chấm điểm và giải đáp thắc mắc.</span>
                        </Space>
                    </div>
                </div>
                <div>
                    <div style={{width:"100%",background: "linear-gradient(180deg, #37c35b, #a8e4bc)",padding:"0px 10px 0px 0px", borderRadius:8, display:"flex"}}>
                        <img height={260} width={600} alt="hihi" src={images.slide4}></img>
                        <Space direction="vertical" style={{fontWeight:"bold", textAlign:"justify", padding:10, color:"#ffffff"}}>
                            <h1 style={{textAlign:"center"}}>Sự chuyên nghiệp, nhiệt huyết và cam kết của đội ngũ giảng viên</h1>
                            <span>Tại Learnmore-BCT, chúng tôi tự hào sở hữu đội ngũ giảng viên giàu kinh nghiệm và đam mê, luôn cập nhật kiến thức mới và sử dụng phương pháp giảng dạy hiện đại. Các giảng viên không chỉ mang đến bài giảng chất lượng mà còn đồng hành cùng học viên trong suốt quá trình học tập. Hãy yên tâm khám phá tri thức với chúng tôi – nơi chất lượng giảng dạy là ưu tiên hàng đầu.</span>
                        </Space>
                        <img height={260} width={600} alt="hihi" src={images.slide3}></img>
                    </div>
                </div>
        </Carousel>
        <Divider />
        <h2 style={{margin:"10px 0px 10px 0px", position:"relative"}}>
            Khóa học nổi bật
            <Button icon={<ArrowLeftOutlined />} onClick={()=>{
                if(scrollNoibat.current){
                    scrollNoibat.current.scrollBy({ left: -370, behavior: "smooth" });
                }
            }} type="primary" shape="circle" size="large" style={{position:"absolute",zIndex:2, top:200, left:16, backgroundColor:"#47d36b"}}></Button>
            <Button icon={<ArrowRightOutlined />} onClick={()=>{
                if(scrollNoibat.current){
                    scrollNoibat.current.scrollBy({ left: 370, behavior: "smooth" });
                }
            }} type="primary" shape="circle" size="large" style={{position:"absolute",zIndex:2, top:200, right:0, backgroundColor:"#47d36b"}}></Button>
        </h2>
        <div ref={scrollNoibat} style={{ display: "flex",overflowY: "auto",height:350, whiteSpace: "nowrap", gap: "50px", padding: "16px",scrollbarWidth: "none", margin:"0px 16px 0px 16px"}}>
                {
                        dataCoursenoibat && dataCoursenoibat.map((item:any)=>{
                            return <Card key={item.id}  style={{maxWidth: 280,maxHeight:295,backgroundColor:"#F7F7F7", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'}}
                            cover={<img onClick={()=>{navigate('/chitietkhoahoc', {state: {courseid: item.id, idGV: item.idGV}})}}
                                style={{width:280, height:157,objectFit:"cover" }} alt="example" src={`${API_URL}course/thumbail/${item.idGV}/${item.thumbnail}`}/>}
                            className='ant-card-actions'
                            actions={[
                               <Space wrap size={"large"}>
                                    <div className="text-action"><TeamOutlined key="user" /> {item.tongnguoidung}</div>,
                                    <div className="text-action"><PlayCircleOutlined key="video" /> {item.tongbaigiang}</div>,
                                    <div className="text-action"><ClockCircleOutlined key="time" /> {formatToVietnamTime(item.createdAt).split(' ')[1]}</div>
                               </Space>
                            ]}>
                            <Meta style={{justifyContent:"center", alignItems: 'center'}}
                            // avatar={}
                            title= {<span className="text-title">{item.title}</span>}
                            description= {
                                <Space direction="vertical" style={{display:'flex'}}>
                                    <Flex gap={3} justify="space-between" align="center">
                                        <span className="text-description">{item.price !== 0 ? formatCurrencyVND(item.price) : 'Miễn phí'}</span>
                                        <Flex align="center">
                                            <Avatar src={`${API_URL}admin/images/${item.giangVien.email}`} />
                                            <div style={{fontSize:12}} className="text-author">{item.giangVien.name}</div>
                                        </Flex>
                                    </Flex>
                                    <span><span style={{fontSize:17, fontWeight:'bold'}}>5.0 </span> <Rate style={{fontSize:17}} allowHalf disabled defaultValue={5} /></span>
                                </Space>
                            }/>
                            </Card>
                        })
                     }
        </div>
        <Divider />
        <h2 style={{margin:"10px 0px 10px 0px", position:"relative"}}>
            Khóa học mới nhất
            <Button icon={<ArrowLeftOutlined />} onClick={()=>{
                if(scrollNewhot.current){
                    scrollNewhot.current.scrollBy({ left: -370, behavior: "smooth" });
                }
            }} type="primary" shape="circle" size="large" style={{position:"absolute",zIndex:2, top:200, left:16, backgroundColor:"#47d36b"}}></Button>
            <Button icon={<ArrowRightOutlined />} onClick={()=>{
                if(scrollNewhot.current){
                    scrollNewhot.current.scrollBy({ left: 370, behavior: "smooth" });
                }
            }} type="primary" shape="circle" size="large" style={{position:"absolute",zIndex:2, top:200, right:0, backgroundColor:"#47d36b"}}></Button>
        </h2>
        <div ref={scrollNewhot} style={{ display: "flex",overflowY: "auto",height:350, whiteSpace: "nowrap", gap: "50px", padding: "16px",scrollbarWidth: "none", margin:"0px 16px 0px 16px"}}>
                {
                    dataCoursenewhot && dataCoursenewhot.map((item:any)=>{
                        return <Card key={item.id}  style={{maxWidth: 280,maxHeight:300,backgroundColor:"#F7F7F7", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'}}
                        cover={<img onClick={()=>{navigate('/chitietkhoahoc', {state: {courseid: item.id, idGV: item.idGV}})}}
                            style={{width:280, height:157,objectFit:"cover" }} alt="example" src={`${API_URL}course/thumbail/${item.idGV}/${item.thumbnail}`}/>}
                        className='ant-card-actions'
                        actions={[
                           <Space wrap size={"large"}>
                                <div className="text-action"><TeamOutlined key="user" /> {item.tongnguoidung}</div>,
                                <div className="text-action"><PlayCircleOutlined key="video" /> {item.tongbaigiang}</div>,
                                <div className="text-action"><ClockCircleOutlined key="time" /> {formatToVietnamTime(item.createdAt).split(' ')[1]}</div>
                           </Space>
                        ]}>
                        <Meta style={{justifyContent:"center", alignItems: 'center'}}
                        // avatar={}
                        title= {<span className="text-title">{item.title}</span>}
                        description= {
                            <Space direction="vertical" style={{display:'flex'}}>
                                <Flex gap={3} justify="space-between" align="center">
                                    <span className="text-description">{item.price !== 0 ? formatCurrencyVND(item.price) : 'Miễn phí'}</span>
                                    <Flex align="center">
                                        <Avatar src={`${API_URL}admin/images/${item.giangVien.email}`} />
                                        <div style={{fontSize:12}} className="text-author">{item.giangVien.name}</div>
                                    </Flex>
                                </Flex>
                                <Image height={30} preview={false} src={images.newhot} alt="hihi" />
                            </Space>
                        }/>
                        </Card>
                    })
                }
        </div>
        <Divider />
        <Space wrap size={"large"}>
            <Space wrap>
                <FilterOutlined />
                <Cascader onChange={(value)=>{setSelectDanhmuc(value)}} defaultValue={[1]} value={[selectDanhmuc]} style={{width:400}} options={dataCategori&&dataCategori.map((item:any)=>{
                    if(item.child.length!==0){
                        return {
                            value:item.id,
                            label:item.name,
                            children:item.child.map((itemChild:any)=>{
                                return {value:itemChild.id, label:itemChild.name}
                            })
                        }
                    }
                    return {value:item.id, label:item.name}
                })} />
            </Space>
            <Space>
                <FilterOutlined />
                <Select
                    defaultValue="0"
                    value={selectMienphi}
                    style={{ width:200 }}
                    onChange={(value)=>setSelectMienphi(value)}
                    options={[
                        { value: '0', label: 'Tất cả khóa học' },
                        { value: '1', label: 'Miễn phí' },
                        { value: '2', label: 'Trả phí' },
                    ]}/>
            </Space>
        </Space>
        <Row style={{marginTop:30}} gutter={[10, 60]}>
            {
                dataCourse && dataCourseChinh.current && (
                     dataCourse.map((item)=>{
                        return <Col key={`${item.id}col`} xs={24} sm={12} md={8} lg={6}><Card key={item.id}  style={{maxWidth: 280,maxHeight:283,backgroundColor:"#F7F7F7", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'}}
                        cover={<img onClick={()=>{navigate('/chitietkhoahoc', {state: {courseid: item.id, idGV: item.idGV}})}}
                            style={{width:280, height:157,objectFit:"cover" }} alt="example" src={`${API_URL}course/thumbail/${item.idGV}/${item.thumbnail}`}/>}
                        className='ant-card-actions'
                        actions={[
                           <Space wrap size={"large"}>
                                <div className="text-action"><TeamOutlined key="user" /> {item.tongnguoidung}</div>,
                                <div className="text-action"><PlayCircleOutlined key="video" /> {item.tongbaigiang}</div>,
                                <div className="text-action"><ClockCircleOutlined key="time" /> {formatToVietnamTime(item.createdAt).split(' ')[1]}</div>
                           </Space>
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
        <>
            {
                dataCourseChinh.current && <Pagination align="center" style={{marginTop:50}} current={currentPage} onChange={handlePageChange}
                pageSize={pageSize}
                total={dataCourseChinh.current.length} />
            }
        </>
    </div>
    );
}
export default Home;
