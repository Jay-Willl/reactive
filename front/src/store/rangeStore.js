import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawRangeStore = createSlice({
    name: 'range',
    initialState: {
        start: 5,
        end: 10
    },
    reducers: {
        editStart (state, action) {
            state.start = action.payload;
        },
        editEnd (state, action) {
            state.end = action.payload;
        }
    }
});

const {editStart, editEnd} = rawRangeStore.actions;
const rangeReducer = rawRangeStore.reducer;
const rangeStore = configureStore({
    reducer: {
        range: rangeReducer
    }
});

export {editStart, editEnd};
export {rangeStore, rangeReducer};
