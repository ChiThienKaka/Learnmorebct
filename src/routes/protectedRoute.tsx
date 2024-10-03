import { useSelector} from "react-redux";
import { selectAuth} from "~/redux/selector";
import ErrorGiangVien from "~/pages/ERROR/errorgiangvien";
import Login from "~/components/Layout/DefaultLayout/components/login";
import { useNavigate } from "react-router-dom";
import { API_URL } from "~/constants/constant";
import axios from "axios";
import { useEffect, useState } from "react";
interface Props{
    children: React.ReactNode;
    requiredRole: string; //vai trò có thể truy cập
}

function ProtectedRoute(props: Props) {
    const [stastusGV, setStatusGV] = useState(false);
    const navigate = useNavigate();
    const {children, requiredRole} = props;
    const auth = useSelector(selectAuth);// lấy ra người dùng nào đăng nhập
    const res = async () =>{
        if(auth==null){
            return <Login isModalOpen={true} onCancel={()=>navigate('/')} />
        }
        //lấy dữ liệu status check quyền giảng viên
        if(auth.role==='giangvien'){
            const response = await axios.post(`${API_URL}auth/status`,{id: auth.id});
            setStatusGV(response.data.statusGV);
        }
    }
    useEffect(()=>{
        res();
    },[stastusGV]);


    if(auth?.role !== requiredRole){
        return <ErrorGiangVien />
    }

    // check quyền đã được bật chưa
    if(auth?.role === 'giangvien'){
        if(stastusGV===false) {
            return <ErrorGiangVien />
        }
    }
    return (
        <>{children}</>
    );
}

export default ProtectedRoute;