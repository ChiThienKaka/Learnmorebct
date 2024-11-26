import { createSlice } from "@reduxjs/toolkit";

//Khởi tạo state
const initialState : {
    isAuthenticated: boolean,//trạng thái đăng nhập
    user: {id:string, email: string, role: string, name?:string, avatar?:string} | null,
    role: ''
} = {
  isAuthenticated: false,//trạng thái đăng nhập
  user: null,
  role: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.role = action.payload.role;
        },
        logout: (state)=>{
            state.isAuthenticated = false;
            state.user = null;
            state.role = '';
        }
    }
})

export const  {login, logout} = authSlice.actions;// Tự động tạo action creators

export default authSlice.reducer;