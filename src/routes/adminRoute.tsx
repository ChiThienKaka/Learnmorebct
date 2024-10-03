import AdminGiangVien from '~/pages/Admin/giangvien';
import {Route, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
function AdminRoutes() {
    return (
        
           <Fragment>
                <Route path="giangvienad" element={<AdminGiangVien />} />
                <Route path="thien" element={<AdminGiangVien />} />
                <Route path="quang" element={<AdminGiangVien />} />
           </Fragment>
        
    );
}

export default AdminRoutes;