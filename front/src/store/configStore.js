import {createSlice, configureStore} from "@reduxjs/toolkit";

const rawConfigStore = createSlice({
    name: 'config',
    initialState: {
        icicleColor: null
    },
    reducers: {
        editIcicleColor (state, action) {
            state.icicleColor = action.payload;
        }
    }
});

const {editIcicleColor} = rawConfigStore.actions;
const configReducer = rawConfigStore.reducer;
const configStore = configureStore({
    reducer: {
        range: configReducer
    }
});

export {editIcicleColor};
export {configStore, configReducer};
