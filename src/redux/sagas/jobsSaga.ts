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
import { GetJobsResponseDto, GetJobResponseDto, CreateJobResponseDto, UpdateJobResponseDto, DeleteJobResponseDto } from '@rudinesurya/api-gateway-interfaces';

// Selector to get API base URL from config slice
const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;
const selectAuthToken = (state: RootState) => state.auth.token;

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
        yield put(fetchJobsSuccess({ jobs: response.data.jobs }));
    } catch (error: any) {
        yield put(fetchJobsFailure({ error: error.message }));
    }
}

// Fetch single job API call
const fetchJobApi = async (apiBaseUri: string, id: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs/${id}`);
    const responseData: GetJobResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch job');
    }

    return responseData;
}

function* fetchJobSaga(action: { payload: { id: string }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: GetJobResponseDto = yield call(fetchJobApi, apiBaseUri, action.payload.id);
        yield put(fetchJobSuccess({ job: response.data.job }));
    } catch (error: any) {
        yield put(fetchJobFailure({ error: error.message }));
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

function* createJobSaga(action: { payload: { data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: CreateJobResponseDto = yield call(createJobApi, apiBaseUri, action.payload.data, token);
        yield put(createJobSuccess({ job: response.data.job }));
    } catch (error: any) {
        yield put(createJobFailure({ error: error.message }));
    }
}

// Update job API call
const updateJobApi = async (apiBaseUri: string, id: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs/${id}`, {
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

function* updateJobSaga(action: { payload: { id: string; data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: UpdateJobResponseDto = yield call(updateJobApi, apiBaseUri, action.payload.id, action.payload.data, token);
        yield put(updateJobSuccess({ job: response.data.job }));
    } catch (error: any) {
        yield put(updateJobFailure({ error: error.message }));
    }
}

// Delete job API call
const deleteJobApi = async (apiBaseUri: string, id: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/jobs/${id}`, {
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

function* deleteJobSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        yield call(deleteJobApi, apiBaseUri, action.payload.id, token);
        yield put(deleteJobSuccess({ id: action.payload.id }));
    } catch (error: any) {
        yield put(deleteJobFailure({ error: error.message }));
    }
}

export function* jobsSaga() {
    yield takeLatest(fetchJobsRequest.type, fetchJobsSaga);
    yield takeLatest(fetchJobRequest.type, fetchJobSaga);
    yield takeLatest(createJobRequest.type, createJobSaga);
    yield takeLatest(updateJobRequest.type, updateJobSaga);
    yield takeLatest(deleteJobRequest.type, deleteJobSaga);
}
