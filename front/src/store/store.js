import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawStore = createSlice({
    name: 'reactive',
    initialState: {
        hover: {
            stack: null
        },
        range: {
            start: 0,
            end: 0,
            scale: 0
        },
        config: {
            icicleColor: null,
            displayedPlot: null
        }
    },
    reducers: {
        selectStack(state, action) {
            state.hover.stack = action.payload;
        },
        unselectStack(state) {
            state.hover.stack = null;
        },

        editStart(state, action) {
            state.range.start = action.payload;
        },
        editEnd(state, action) {
            state.range.end = action.payload;
        },
        editScale(state, action) {
            state.range.scale = action.payload;
        },

        editIcicleColor(state, action) {
            state.config.icicleColor = action.payload;
        },
        editDisplayedPlot(state, action) {
            state.config.displayedPlot = action.payload;
        }
    }
});

const {
    selectStack,
    unselectStack,
    editStart,
    editEnd,
    editScale,
    editIcicleColor,
    editDisplayedPlot
} = rawStore.actions;

const reactiveReducer = rawStore.reducer;
const reactiveStore = configureStore({
    reducer: {
        reactive: reactiveReducer
    }
});

export {
    selectStack,
    unselectStack,
    editStart,
    editEnd,
    editScale,
    editIcicleColor,
    editDisplayedPlot
};
export {reactiveStore, reactiveReducer};
