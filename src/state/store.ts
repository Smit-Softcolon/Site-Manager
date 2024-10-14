import { configureStore } from "@reduxjs/toolkit";
import expanseDataSlice from "./expanseSlice";

export const store = configureStore({
    reducer: {
        expanses: expanseDataSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;