import { BellOutlined, FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Flex, Modal } from "antd";
import { useState } from "react";
import app from "~/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import images from "~/assets/images";
function ModalLogin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      // handleLogin();
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      // handleLogout();
      setIsModalOpen(false);
    };
    const [user, setUser] = useState<any>(null);

  // const auth = getAuth(app);
  // const googleProvider = new GoogleAuthProvider();

  // const handleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     console.log(result.user);
  //   } catch (error) {
  //     console.error("Error signing in with Google", error);
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     await auth.signOut();
  //     setUser(null);
  //   } catch (error) {
  //     console.error("Error signing out", error);
  //   }
  // };
    return ( 
    <>
      <Button shape="circle" icon={<BellOutlined />} onClick={showModal} />
      <Modal okText=" " cancelButtonProps={{type:"text"}} cancelText=" " open={isModalOpen} okType="text" onOk={handleOk} onCancel={handleCancel}>
        <Flex justify="center" align="center" vertical gap={10}> 
            <img width={60} height={60} src={images.logo} alt="logo"/>
            <h2>Đăng nhập vào LearnMore-BCT</h2>
            <Button iconPosition="start" block icon={<GoogleOutlined />} type="default" >Đăng nhập với Google</Button>
            <Button iconPosition="start" block icon={<FacebookOutlined />} type="default" >Đăng nhập với Facebook</Button>
        </Flex>
      </Modal>
    </>
     );
}

export default ModalLogin;