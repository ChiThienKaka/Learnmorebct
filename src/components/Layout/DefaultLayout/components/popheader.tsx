import { Avatar, Button, Flex, Popover } from "antd";
import { ReactNode } from "react";
import AccountUpgrade from "./accountupgrade";
// Pop cac chuc nang cua user tren trang header cua DefaultLayout 
const PopHeader: React.FC<{children:ReactNode}> = ({children})=>{
    return <Popover trigger={"click"}
    placement="bottomRight"
    title={<Flex style={{minWidth:230}} vertical>
        <Flex gap={15} justify="center" align="center">
            <div><Avatar size={50}>T</Avatar></div>
            <div>
                <div style={{fontSize:16}}>Bùi Chí Thiện</div>
                <div style={{fontSize:14, color:"#757575"}}>@chithien</div>
            </div>
        </Flex>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Trang chủ</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Viết Blog</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <Button type="link" style={{color:"#666666", justifyContent:"start"}}>Bài viết của tôi</Button>
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
        <AccountUpgrade />
        <hr style={{margin:"10px 0 10px 0",borderTop: '1px solid rgba(0, 0, 0, 0.01)'}}></hr>
    </Flex>}
  >
        {children}
  </Popover>
}

export default PopHeader;