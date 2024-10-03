import Home from "~/pages/Home/home"
import Blog from "~/pages/Blog/blog"
import DefaultLayout from "~/components/Layout/DefaultLayout";
import GiangVien from "~/pages/Admin/giangvien";
import AdminLayout from "~/components/Layout/AdminLayout";
import {CreateGV, CreateCourseForm, CreateLectureList} from "~/pages/GiangVien/giangvien"
import GiangVienLayout from "~/components/Layout/GiangvienLayout";
import ErrorGiangVien from "~/pages/ERROR/errorgiangvien";
import WordPreview from "~/pages/Admin/components/WordPreview";
import {DetailCourseRegister, HoctapCourse} from "~/pages/Home/index";
import { Component } from "react";
//publicRoutes co the truy cap tu bat ki dau
const publicRoutes = [
    {path: '/', Component: Home, layout: DefaultLayout},
    {path: '/blog', Component: Blog, layout: DefaultLayout},
    {path: '/preview', Component: WordPreview, layout:null},
    {path: '/errorgiangvien', Component: ErrorGiangVien, layout:null},
    {path: '/admin', Component: GiangVien, layout: AdminLayout},
    {path: '/createGV1', Component: CreateCourseForm, layout:GiangVienLayout},
    {path: '/createGV2', Component: CreateLectureList, layout:GiangVienLayout},
    {path: '/chitietkhoahoc', Component: DetailCourseRegister, layout: DefaultLayout},
    {path: '/hoctap', Component: HoctapCourse, layout: null},
]
//privateRoutes phai dang nhap thi moi truy cap duoc
const privateRoutes= [
    // {path: '/createGV', Component: CreateGV, layout:GiangVienLayout}
] as []

export {publicRoutes, privateRoutes};