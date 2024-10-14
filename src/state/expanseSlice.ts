import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    expanseData: [] as ExpanseInterface[]
}

export const ExpanseSlice = createSlice({
    name: 'Expanse',
    initialState,
    reducers: {
        add: (state, action) => {
            var id = (state.expanseData.length > 0 ? parseInt(state.expanseData[state.expanseData.length - 1].id) + 1 : 1).toString();
            state.expanseData.push({ id: id, amount: action.payload.amount, description: action.payload.description });
        },
        remove: (state, action) => {
            state.expanseData = state.expanseData.filter((expanse) => expanse.id !== action.payload.id);
        },
        update: (state, action) => {
            var expanse = state.expanseData.find((expanse) => expanse.id === action.payload.id);
            if (expanse) {
                expanse.amount = action.payload.amount;
                expanse.description = action.payload.description;
            }
        }
    }
});

export const { add, remove, update } = ExpanseSlice.actions;

export default ExpanseSlice.reducer;