import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IJob } from '@rudinesurya/api-gateway-interfaces';

interface JobsState {
    jobs: IJob[];
    selectedJob: IJob | null;
    loading: boolean;
    error?: string;
}

const initialState: JobsState = {
    jobs: [],
    selectedJob: null,
    loading: false,
    error: undefined,
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        // Fetch all jobs
        fetchJobsRequest(state) {
            state.loading = true;
            state.error = undefined;
        },
        fetchJobsSuccess(state, action: PayloadAction<IJob[]>) {
            state.jobs = action.payload;
            state.loading = false;
        },
        fetchJobsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch a single job
        fetchJobRequest(state, action: PayloadAction<string>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchJobSuccess(state, action: PayloadAction<IJob>) {
            state.selectedJob = action.payload;
            state.loading = false;
        },
        fetchJobFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Create a job
        createJobRequest(state, action: PayloadAction<{ data: any; token: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        createJobSuccess(state, action: PayloadAction<IJob>) {
            state.jobs.push(action.payload);
            state.loading = false;
        },
        createJobFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Update a job
        updateJobRequest(state, action: PayloadAction<{ jobId: string; data: any; token: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        updateJobSuccess(state, action: PayloadAction<IJob>) {
            const index = state.jobs.findIndex((job) => job._id === action.payload._id);
            if (index !== -1) {
                state.jobs[index] = action.payload;
            }
            if (state.selectedJob && state.selectedJob._id === action.payload._id) {
                state.selectedJob = action.payload;
            }
            state.loading = false;
        },
        updateJobFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Delete a job
        deleteJobRequest(state, action: PayloadAction<{ jobId: string; token: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        deleteJobSuccess(state, action: PayloadAction<string>) {
            state.jobs = state.jobs.filter((job) => job._id !== action.payload);
            state.loading = false;
        },
        deleteJobFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchJobsRequest,
    fetchJobsSuccess,
    fetchJobsFailure,
    fetchJobRequest,
    fetchJobSuccess,
    fetchJobFailure,
    createJobRequest,
    createJobSuccess,
    createJobFailure,
    updateJobRequest,
    updateJobSuccess,
    updateJobFailure,
    deleteJobRequest,
    deleteJobSuccess,
    deleteJobFailure,
} = jobsSlice.actions;
export default jobsSlice.reducer;
