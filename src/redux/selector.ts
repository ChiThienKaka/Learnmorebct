import { RootState } from "./store"

export const selectAuth = (state:RootState) => state.auth.user;
export const checkAuth = (state:RootState) => state.auth.isAuthenticated;