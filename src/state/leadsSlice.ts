import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    leadsData: [] as LeadsDataInterface[]
}

export const LeadsSlice = createSlice({
    name: 'Leads',
    initialState,
    reducers: {
        addLeads: (state, action) => {
            var id = (state.leadsData.length > 0 ? parseInt(state.leadsData[state.leadsData.length - 1].id) + 1 : 1).toString();
            state.leadsData.push({
                id: id,
                name: action.payload.name,
                email: action.payload.email,
                number: action.payload.number,
                desc: action.payload.desc,
                date: Date.now().toString(),
            });
        },
        removeLeads: (state, action) => {
            state.leadsData = state.leadsData.filter((lead) => lead.id !== action.payload.id);
        },
        updateLeads: (state, action) => {
            var lead = state.leadsData.find((lead) => lead.id === action.payload.id);
            if (lead) {
                lead.name = action.payload.name;
                lead.email = action.payload.email;
                lead.number = action.payload.number;
                lead.desc = action.payload.desc;
            }
        }
    }
});

export const { addLeads, removeLeads, updateLeads } = LeadsSlice.actions;

export default LeadsSlice.reducer;