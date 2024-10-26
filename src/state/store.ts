import { configureStore } from "@reduxjs/toolkit";
import expanseDataSlice from "./expanseSlice";
import mapSliceData from "./fetchLocation";
import LeadsSlice from "./leadsSlice";
import leaveSlice from "./leaveSlice";

export const store = configureStore({
    reducer: {
        expanses: expanseDataSlice,
        mapData: mapSliceData,
        leads: LeadsSlice,
        leave: leaveSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;