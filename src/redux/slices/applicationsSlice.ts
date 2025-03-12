import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApplication } from '@rudinesurya/api-gateway-interfaces';

interface ApplicationsState {
    applications: IApplication[];
    application: IApplication | null;
    loading: boolean;
    error?: string;
}

const initialState: ApplicationsState = {
    applications: [],
    application: null,
    loading: false,
    error: undefined,
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        fetchApplicationRequest(state, action: PayloadAction<{ id: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchApplicationSuccess(state, action: PayloadAction<{ application: IApplication }>) {
            state.application = action.payload.application;
            state.loading = false;
        },
        fetchApplicationFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        fetchApplicationsByJobIdRequest(state, action: PayloadAction<{ id: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchApplicationsByJobIdSuccess(state, action: PayloadAction<{ applications: IApplication[] }>) {
            state.applications = action.payload.applications;
            state.loading = false;
        },
        fetchApplicationsByJobIdFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        createApplicationRequest(state, action: PayloadAction<{ data: any; }>) {
            state.loading = true;
            state.error = undefined;
        },
        createApplicationSuccess(state, action: PayloadAction<{ application: IApplication }>) {
            state.application = action.payload.application;
            state.loading = false;
        },
        createApplicationFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchApplicationRequest,
    fetchApplicationSuccess,
    fetchApplicationFailure,
    fetchApplicationsByJobIdRequest,
    fetchApplicationsByJobIdSuccess,
    fetchApplicationsByJobIdFailure,
    createApplicationRequest,
    createApplicationSuccess,
    createApplicationFailure
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
