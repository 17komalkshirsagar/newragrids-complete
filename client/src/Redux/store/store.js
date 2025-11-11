import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/slice/auth.slice"
import userSlice from "../store/slice/user.slice"
    
import { userApi } from "../user.api";
import { authApi } from "../admin.api";
import { userrApi } from "../userr.api";





const reduxStore = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userrApi.reducerPath]: userrApi.reducer,

        auth: authSlice,
        user: userSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(


            userApi.middleware,
            authApi.middleware,
            userrApi.middleware,

        )
})



export default reduxStore