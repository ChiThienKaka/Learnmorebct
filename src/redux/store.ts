import { combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from "~/components/Layout/DefaultLayout/components/authSlice/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Cấu hình redux-persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

// Kết hợp các reducer thành rootReducer
const rootReducer = combineReducers({
    auth: authReducer,
});

// Tạo persisted reducer
const persistedReducer= persistReducer(persistConfig, rootReducer);

// tạo store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Bỏ qua các action này
            },
        }),
})

// Tạo persistor
export const persistor = persistStore(store);


export default store;
export type RootState = ReturnType<typeof store.getState>; //lấy ra các trạng thái của store