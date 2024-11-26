import { Avatar, Button, Flex, Popover } from "antd";
import { ReactNode } from "react";
import AccountUpgrade from "./accountupgrade";
import { selectAuth } from "~/redux/selector";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./authSlice/authSlice";
import { UserOutlined } from "@ant-design/icons";
import images from "~/assets/images";
import { API_URL } from "~/constants/constant";
interface Prop {
    children: ReactNode;
    usercurrent: {id: string; email: string; role: string; name?: string; avatar?: string}
}
// Pop cac chuc nang cua user tren trang header cua DefaultLayout 
const PopHeader = (props: Prop)=>{
    const {children, usercurrent} = props;
    const dispatch = useDispatch();
    console.log('usercurrent', usercurrent);
    return <Popover trigger={"click"}
    placement="bottomRight"
    title={<Flex style={{minWidth:230}} vertical>
        <Flex gap={15} justify="center" align="center">
            <div><Avatar src={
                 usercurrent.avatar ? <Avatar size={"large"} src={`${API_URL}auth/getavatarnd/${usercurrent.id}/${usercurrent.avatar}`} />:
                 <Avatar size={"large"} icon={<UserOutlined />} />
            } size={50}></Avatar></div>
            <div>
                <div style={{fontSize:16}}>{usercurrent.name??usercurrent.email.split('@')[0]}</div>
                <div style={{fontSize:14, color:"#757575"}}>{usercurrent.email}</div>
            </div>
        </Flex>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Trang chủ</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Viết Blog</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Bài viết của tôi</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <AccountUpgrade usercurrent={usercurrent} />
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button onClick={()=>dispatch(logout())}  type="text" style={{color:"#666666", justifyContent:"start"}}>Đăng xuất</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
    </Flex>}
  >
        {children}
  </Popover>
}

export default PopHeader;