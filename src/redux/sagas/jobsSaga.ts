import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    fetchJobsSuccess,
    fetchJobsFailure,
    fetchJobSuccess,
    fetchJobFailure,
    createJobSuccess,
    createJobFailure,
    updateJobSuccess,
    updateJobFailure,
    deleteJobSuccess,
    deleteJobFailure,
    createJobRequest,
    deleteJobRequest,
    fetchJobRequest,
    fetchJobsRequest,
    updateJobRequest,
} from '../slices/jobsSlice';
import { RootState } from '../store';
import { GetJobsResponseDto } from '../interfaces/job/get-jobs-response.dto';
import { GetJobResponseDto } from '../interfaces/job/get-job-response.dto';
import { CreateJobResponseDto } from '../interfaces/job/create-job-response.dto';
import { UpdateJobResponseDto } from '../interfaces/job/update-job-response.dto';
import { DeleteJobResponseDto } from '../interfaces/job/delete-job-response.dto';

// Selector to get API base URL from config slice
const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;

// Fetch all jobs API call
const fetchJobsApi = async (apiBaseUri: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs`);
    const responseData: GetJobsResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch jobs');
    }

    return responseData;
};

function* fetchJobsSaga() {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: GetJobsResponseDto = yield call(fetchJobsApi, apiBaseUri);
        yield put(fetchJobsSuccess(response.data.jobs));
    } catch (error: any) {
        yield put(fetchJobsFailure(error.message));
    }
}

// Fetch single job API call
const fetchJobApi = async (apiBaseUri: string, jobId: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs/${jobId}`);
    const responseData: GetJobResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch job');
    }

    return responseData;
}

function* fetchJobSaga(action: { payload: string; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: GetJobResponseDto = yield call(fetchJobApi, apiBaseUri, action.payload);
        yield put(fetchJobSuccess(response.data.job));
    } catch (error: any) {
        yield put(fetchJobFailure(error.message));
    }
}

// Create job API call
const createJobApi = async (apiBaseUri: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: CreateJobResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to create job');
    }

    return responseData;
}

function* createJobSaga(action: { payload: { data: any; token: string }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: CreateJobResponseDto = yield call(createJobApi, apiBaseUri, action.payload.data, action.payload.token);
        yield put(createJobSuccess(response.data.job));
    } catch (error: any) {
        yield put(createJobFailure(error.message));
    }
}

// Update job API call
const updateJobApi = async (apiBaseUri: string, jobId: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: UpdateJobResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to update job');
    }

    return responseData;
}

function* updateJobSaga(action: { payload: { jobId: string; data: any; token: string }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: UpdateJobResponseDto = yield call(updateJobApi, apiBaseUri, action.payload.jobId, action.payload.data, action.payload.token);
        yield put(updateJobSuccess(response.data.job));
    } catch (error: any) {
        yield put(updateJobFailure(error.message));
    }
}

// Delete job API call
const deleteJobApi = async (apiBaseUri: string, jobId: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData: DeleteJobResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to delete job');
    }

    return responseData;
}

function* deleteJobSaga(action: { payload: { jobId: string; token: string }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        yield call(deleteJobApi, apiBaseUri, action.payload.jobId, action.payload.token);
        yield put(deleteJobSuccess(action.payload.jobId));
    } catch (error: any) {
        yield put(deleteJobFailure(error.message));
    }
}

export function* jobsSaga() {
    yield takeLatest(fetchJobsRequest.type, fetchJobsSaga);
    yield takeLatest(fetchJobRequest.type, fetchJobSaga);
    yield takeLatest(createJobRequest.type, createJobSaga);
    yield takeLatest(updateJobRequest.type, updateJobSaga);
    yield takeLatest(deleteJobRequest.type, deleteJobSaga);
}
