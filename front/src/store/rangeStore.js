import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawRangeStore = createSlice({
    name: 'range',
    initialState: {
        start: 0,
        end: 0,
        scale: 1
    },
    reducers: {
        editStart (state, action) {
            state.start = action.payload;
        },
        editEnd (state, action) {
            state.end = action.payload;
        },
        editScale (state, action) {
            state.scale = action.payload;
        }
    }
});

const {editStart, editEnd, editScale} = rawRangeStore.actions;
const rangeReducer = rawRangeStore.reducer;
const rangeStore = configureStore({
    reducer: {
        range: rangeReducer
    }
});

export {editStart, editEnd, editScale};
export {rangeStore, rangeReducer};
