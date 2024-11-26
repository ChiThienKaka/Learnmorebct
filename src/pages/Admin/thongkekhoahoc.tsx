import { Flex, Select, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,LabelList, Line } from "recharts";
import { API_URL } from "~/constants/constant";
const ThongkeKhoahoc = () => {
    const [data, setData] = useState<any>([]);//dữ liệu toàn bộ khóa học theo ngày trong tháng
    const [month, setMonth] = useState('11');
    const [year, setYear] = useState('2024');
    const getdataCouse = async () => {
        try{
            // Lấy dữ liệu từ API hoặc database
            const res = await axios.post(`${API_URL}admin/thongkekhoahoc`,{
                month: month,
                year: year
            });
            console.log(res.data);
            setData(res.data);
        }catch(err){console.log(err);}
    }
    useEffect(()=>{
        getdataCouse();
    },[])
    useEffect(()=>{
        getdataCouse();
    },[year,month])
    return (
        //lưu ý các giá trị cần là số 
        <>
        <Flex justify="flex-start" style={{margin:"20px 0px 20px 0px"}}>
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
            {
        data && <div style={{ textAlign: "center"}}>
        {/* Tiêu đề */}
        <h2>Số lượng khóa học đăng theo ngày</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 60 }} >
            {/* <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}> */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* Trục X và Y */}
              <XAxis  dataKey="createdDate" label={{ value: "Ngày tháng", position: "insideBottom", offset: -5 }} />
              <YAxis 
              domain={[0, "dataMax + 1"]} 
            //   tăng độ đài trục y
              label={{ value: "Số lượng", angle: -90, position: "insideLeft" }} />
              {/* Tooltip và Legend */}
              <Tooltip formatter={(value, name) => [`${value}`, 'Khóa học']} />
              {/* chú thích  */}
              <Legend verticalAlign="top" />
              {/* Các cột */}
              <Bar dataKey="totalCourse" fill="#eb803c" barSize={30} 
              name="Khóa học">
                {/* nhãn  */}
                <LabelList dataKey="totalCourse" position="top" formatter={(value:any) => `${value}`} />
              </Bar>
            {/* biểu đồ đường  */}
            <Line
          type="monotone"
          dataKey="totalCourse"
          stroke="green"
          strokeWidth={1}
          dot={{ r: 3}}
          activeDot={{ r: 5 }}
          name="Khóa học"
        />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      }
        </>
    )
}

export default ThongkeKhoahoc;