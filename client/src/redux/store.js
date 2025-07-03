import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";   // ← import the default-exported reducer

const store = configureStore({
  reducer: {
    user: userReducer,                     // ← assign it under `user`
  },
});

export default store;
