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
        fetchJobsSuccess(state, action: PayloadAction<{ jobs: IJob[] }>) {
            state.jobs = action.payload.jobs;
            state.loading = false;
        },
        fetchJobsFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        // Fetch a single job
        fetchJobRequest(state, action: PayloadAction<{ id: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchJobSuccess(state, action: PayloadAction<{ job: IJob }>) {
            state.selectedJob = action.payload.job;
            state.loading = false;
        },
        fetchJobFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        // Create a job
        createJobRequest(state, action: PayloadAction<{ data: any; }>) {
            state.loading = true;
            state.error = undefined;
        },
        createJobSuccess(state, action: PayloadAction<{ job: IJob }>) {
            state.jobs.push(action.payload.job);
            state.loading = false;
        },
        createJobFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        // Update a job
        updateJobRequest(state, action: PayloadAction<{ id: string; data: any; }>) {
            state.loading = true;
            state.error = undefined;
        },
        updateJobSuccess(state, action: PayloadAction<{ job: IJob }>) {
            const index = state.jobs.findIndex((job) => job._id === action.payload.job._id);
            if (index !== -1) {
                state.jobs[index] = action.payload.job;
            }
            if (state.selectedJob && state.selectedJob._id === action.payload.job._id) {
                state.selectedJob = action.payload.job;
            }
            state.loading = false;
        },
        updateJobFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        // Delete a job
        deleteJobRequest(state, action: PayloadAction<{ id: string; }>) {
            state.loading = true;
            state.error = undefined;
        },
        deleteJobSuccess(state, action: PayloadAction<{ id: string }>) {
            state.jobs = state.jobs.filter((job) => job._id !== action.payload.id);
            state.loading = false;
        },
        deleteJobFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
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
