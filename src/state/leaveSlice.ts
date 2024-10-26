import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    leaveRequests: [] as LeaveInterface[]
}

export const LeaveSlice = createSlice({
    name: 'Leave',
    initialState,
    reducers: {
        addLeave: (state, action) => {
            console.log(action.payload, "payload");
            
            try {
                var id = (state.leaveRequests.length > 0 ? parseInt(state.leaveRequests[state.leaveRequests.length - 1].id) + 1 : 1).toString();
                state.leaveRequests.push({
                    id: id,
                    fromDt: action.payload.startDate,
                    toDt: action.payload.endDate,
                    reason: action.payload.leaveReason,
                    status: 'Pending',
                });
            } catch (e) {
                console.log(e);
            } finally {
                console.log('Leave added');
            }
        },
        removeLeave: (state, action) => {
            state.leaveRequests = state.leaveRequests.filter((leave) => leave.id !== action.payload.id);
        },
    }
});

export const { addLeave, removeLeave } = LeaveSlice.actions;

export default LeaveSlice.reducer;