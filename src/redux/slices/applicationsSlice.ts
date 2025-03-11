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
        fetchApplicationRequest(state, action: PayloadAction<string>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchApplicationSuccess(state, action: PayloadAction<IApplication>) {
            state.application = action.payload;
            state.loading = false;
        },
        fetchApplicationFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        fetchApplicationsRequest(state, action: PayloadAction<string>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchApplicationsSuccess(state, action: PayloadAction<IApplication[]>) {
            state.applications = action.payload;
            state.loading = false;
        },
        fetchApplicationsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        createApplicationRequest(state, action: PayloadAction<{ data: any; token: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        createApplicationSuccess(state, action: PayloadAction<IApplication>) {
            state.application = action.payload;
            state.loading = false;
        },
        createApplicationFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchApplicationRequest,
    fetchApplicationSuccess,
    fetchApplicationFailure,
    fetchApplicationsRequest,
    fetchApplicationsSuccess,
    fetchApplicationsFailure,
    createApplicationRequest,
    createApplicationSuccess,
    createApplicationFailure
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
