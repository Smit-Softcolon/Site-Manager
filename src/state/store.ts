import { configureStore } from "@reduxjs/toolkit";
import expanseDataSlice from "./expanseSlice";
import mapSliceData from "./fetchLocation";

export const store = configureStore({
    reducer: {
        expanses: expanseDataSlice,
        mapData: mapSliceData
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;