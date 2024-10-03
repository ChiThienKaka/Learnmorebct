import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes,privateRoutes } from './routes/route';
import DefaultLayout from './components/Layout/DefaultLayout';
import AdminLayout from './components/Layout/AdminLayout';
import ProtectedRoute from './routes/protectedRoute';
import AdminGiangVien from './pages/Admin/giangvien';
import {CourseXetDuyet, ChitietCourse} from './pages/Admin/admin'
import GiangVienLayout from './components/Layout/GiangvienLayout';
import {CreateGV, CreateCourseForm, CreateLectureList, ListCourse, ListLesson} from '~/pages/GiangVien/giangvien'
function App() {
  return (
    <Router>
        <div className="App">
            <Routes>
                {/* Router không cần đăng nhập  */}
                {publicRoutes.map((route, index)=>{
                  //khai bao Layout, neu khong khai bao layout thi se lay layout mac dinh
                  const Page = route.Component;
                  let Layout:any = DefaultLayout;
                  if(route.layout){
                    Layout = route.layout;
                  }else if(route.layout === null){
                     Layout = Fragment;
                  }
                    return (<Route key={index} path={route.path} element= {<Layout><Page/></Layout>}></Route>)
                })}

                {/* tạo riêng các đường dẫn của giangvien  */}
                <Route path='/giangvien' element={<ProtectedRoute requiredRole='giangvien'><GiangVienLayout /></ProtectedRoute>}>
                    <Route index element={<CreateCourseForm />} />
                    <Route path="createGV" element={<CreateGV />} />
                    <Route path="createGV1" element={<CreateCourseForm />} />
                    <Route path="createGV2" element={<CreateLectureList />} />
                    <Route path="listcourse" element={<ListCourse />} />
                    <Route path="listlesson" element={<ListLesson />} />
                </Route>
               
                {/* tạo riêng các đượng dẫn của admin */}
                <Route path={'/admin'} element= {<ProtectedRoute requiredRole='admin'><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminGiangVien />} />
                  <Route path="giangvienad" element={<AdminGiangVien />} />
                  <Route path="courseadxd" element={<CourseXetDuyet />} />
                  <Route path="chitietcoursead" element={<ChitietCourse />} />
                </Route>
            </Routes>
        </div>
    </Router>
  );
}

export default App;
