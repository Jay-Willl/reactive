import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawStore = createSlice({
    name: 'reactive',
    initialState: {
        overview: {
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
        multiview: {
            hover: {
                stack: null
            },
            config: {
                displayedPlot: null
            }
        }
    },
    reducers: {
        selectStackOverView(state, action) {
            state.overview.hover.stack = action.payload;
        },
        unselectStackOverView(state) {
            state.overview.hover.stack = null;
        },

        editStart(state, action) {
            state.overview.range.start = action.payload;
        },
        editEnd(state, action) {
            state.overview.range.end = action.payload;
        },
        editScale(state, action) {
            state.overview.range.scale = action.payload;
        },

        editIcicleColor(state, action) {
            state.overview.config.icicleColor = action.payload;
        },
        editDisplayedPlotOverView(state, action) {
            state.overview.config.displayedPlot = action.payload;
        },

        selectStackMultiView(state, action) {
            state.multiview.hover.stack = action.payload;
        },
        unselectStackMultiView(state) {
            state.multiview.hover.stack = null;
        },

        editDisplayedPlotMultiView(state, action) {
            state.multiview.config.displayedPlot = action.payload;
        }
    }
});

const {
    selectStackOverView,
    unselectStackOverView,
    editStart,
    editEnd,
    editScale,
    editIcicleColor,
    editDisplayedPlotOverView,

    selectStackMultiView,
    unselectStackMultiView,
    editDisplayedPlotMultiView
} = rawStore.actions;

const reactiveReducer = rawStore.reducer;
const reactiveStore = configureStore({
    reducer: {
        reactive: reactiveReducer
    }
});

export {
    selectStackOverView,
    unselectStackOverView,
    editStart,
    editEnd,
    editScale,
    editIcicleColor,
    editDisplayedPlotOverView,
    selectStackMultiView,
    unselectStackMultiView,
    editDisplayedPlotMultiView
};
export {reactiveStore, reactiveReducer};
