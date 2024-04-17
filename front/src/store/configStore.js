import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawConfigStore = createSlice({
    name: 'config',
    initialState: {
        icicleColor: null,
        displayedPlot: null
    },
    reducers: {
        editIcicleColor (state, action) {
            state.icicleColor = action.payload;
        },
        editDisplayedPlot (state, action) {
            state.displayedPlot = action.payload;
        }
    }
});

const {editIcicleColor, editDisplayedPlot} = rawConfigStore.actions;
const configReducer = rawConfigStore.reducer;
const configStore = configureStore({
    reducer: {
        range: configReducer
    }
});

export {editIcicleColor, editDisplayedPlot};
export {configStore, configReducer};
