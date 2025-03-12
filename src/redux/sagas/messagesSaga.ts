import { call, put, takeLatest, select } from 'redux-saga/effects';
import { RootState } from '../store';
import { CreateMessageResponseDto, DeleteMessageResponseDto, GetMessagesResponseDto, UpdateMessageResponseDto } from '@rudinesurya/api-gateway-interfaces';
import { fetchMessagesByChatIdRequest, createMessageRequest, updateMessageRequest, deleteMessageRequest, fetchMessagesByChatIdFailure, fetchMessagesByChatIdSuccess, createMessageFailure, createMessageSuccess, updateMessageFailure, updateMessageSuccess, deleteMessageFailure, deleteMessageSuccess } from '../slices/messagesSlice';

const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;
const selectAuthToken = (state: RootState) => state.auth.token;

const fetchMessagesByChatIdApi = async (apiBaseUri: string, id: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/messages/chat/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData: GetMessagesResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch messages');
    }

    return responseData;
}

function* fetchMessagesByChatIdSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: GetMessagesResponseDto = yield call(fetchMessagesByChatIdApi, apiBaseUri, action.payload.id, token);
        yield put(fetchMessagesByChatIdSuccess({ messages: response.data.messages }));
    } catch (error: any) {
        yield put(fetchMessagesByChatIdFailure({ error: error.message }));
    }
}

const createMessageApi = async (apiBaseUri: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: CreateMessageResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to create message');
    }

    return responseData;
}

function* createMessageSaga(action: { payload: { data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: CreateMessageResponseDto = yield call(createMessageApi, apiBaseUri, action.payload.data, token);
        yield put(createMessageSuccess({ message: response.data.message }));
    } catch (error: any) {
        yield put(createMessageFailure({ error: error.message }));
    }
}

const updateMessageApi = async (apiBaseUri: string, id: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/messages/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: UpdateMessageResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to update message');
    }

    return responseData;
}

function* updateMessageSaga(action: { payload: { id: string; data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: UpdateMessageResponseDto = yield call(updateMessageApi, apiBaseUri, action.payload.id, action.payload.data, token);
        yield put(updateMessageSuccess({ message: response.data.message }));
    } catch (error: any) {
        yield put(updateMessageFailure({ error: error.message }));
    }
}

const deleteMessageApi = async (apiBaseUri: string, id: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData: DeleteMessageResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to delete message');
    }

    return responseData;
}

function* deleteMessageSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        yield call(deleteMessageApi, apiBaseUri, action.payload.id, token);
        yield put(deleteMessageSuccess({ id: action.payload.id }));
    } catch (error: any) {
        yield put(deleteMessageFailure({ error: error.message }));
    }
}

export function* messagesSaga() {
    yield takeLatest(fetchMessagesByChatIdRequest.type, fetchMessagesByChatIdSaga);
    yield takeLatest(createMessageRequest.type, createMessageSaga);
    yield takeLatest(updateMessageRequest.type, updateMessageSaga);
    yield takeLatest(deleteMessageRequest.type, deleteMessageSaga);
}
