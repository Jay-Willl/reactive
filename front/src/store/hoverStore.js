import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawHoverStore = createSlice({
    name: 'hover',
    initialState: {
        stack: null
    },
    reducers: {
        selectStack (state, action) {
            state.stack = action.payload;
        },
        unselectStack (state) {
            state.stack = null;
        }
    }
});

const {selectStack, unselectStack} = rawHoverStore.actions;
const hoverReducer = rawHoverStore.reducer;
const hoverStore = configureStore({
    reducer: {
        hover: hoverReducer
    }
});

export {selectStack, unselectStack};
export {hoverStore, hoverReducer};
