import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigState {
    apiBaseUri: string;
    error?: string;
}

const initialState: ConfigState = {
    apiBaseUri: '', // initially empty
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        fetchConfigRequest(state) {
            state.error = undefined;
        },
        fetchConfigSuccess(state, action: PayloadAction<{ apiBaseUri: string }>) {
            state.apiBaseUri = action.payload.apiBaseUri;
            state.error = undefined;
        },
        fetchConfigFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const {
    fetchConfigRequest,
    fetchConfigSuccess,
    fetchConfigFailure,
} = configSlice.actions;

export default configSlice.reducer;
