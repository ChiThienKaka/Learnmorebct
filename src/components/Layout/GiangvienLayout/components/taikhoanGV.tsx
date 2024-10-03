import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex } from "antd";
import {PopHeaderGV} from "./index"
import { selectAuth } from "~/redux/selector";
import { useSelector } from "react-redux";
import { API_URL } from "~/constants/constant";
function TaikhoanGV() {
    const auth = useSelector(selectAuth);
    return ( 
     
            <Flex wrap gap={"small"} style={{justifyContent:"center", alignItems:"center"}}>
                <Button type="text">Bài giảng của tôi</Button>
                <Button shape="circle" icon={<BellOutlined />} />
                <PopHeaderGV><Avatar src={`${API_URL}admin/images/${auth?.email}`}>U</Avatar></PopHeaderGV>
            </Flex>
     );
}

export default TaikhoanGV;