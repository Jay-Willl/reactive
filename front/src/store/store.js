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
                stack: null,
                follow: null
            },
            config: {
                displayedPlot: 'BarChart'
            }
        },
        collectionview: {
            hover: {
                stack: null,
            },
            config: {
                displayedPlot: 'ScatterPlot'
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
        selectFollowMultiView(state, action) {
            state.multiview.hover.follow = action.payload;
        },
        unselectFollowMultiView(state) {
            state.multiview.hover.follow = null;
        },

        editDisplayedPlotMultiView(state, action) {
            state.multiview.config.displayedPlot = action.payload;
        },


        selectStackCollectionView(state, action) {
            state.collectionview.hover.stack = action.payload;
        },
        unselectStackCollectionView(state) {
            state.collectionview.hover.stack = null;
        },

        editDisplayedPlotCollectionView(state, action) {
            state.collectionview.config.displayedPlot = action.payload;
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
    selectFollowMultiView,
    unselectFollowMultiView,
    editDisplayedPlotMultiView,

    selectStackCollectionView,
    unselectStackCollectionView,
    editDisplayedPlotCollectionView
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
    selectFollowMultiView,
    unselectFollowMultiView,
    editDisplayedPlotMultiView,
    selectStackCollectionView,
    unselectStackCollectionView,
    editDisplayedPlotCollectionView
};
export {reactiveStore, reactiveReducer};
