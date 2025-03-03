import { call, put, select, takeLatest } from 'redux-saga/effects';
import { loginSuccess, loginFailure, logoutRequest, registerFailure, registerSuccess, loginRequest, registerRequest, logout } from '../slices/authSlice';
import { RootState } from '../store';
import Cookies from 'js-cookie';
import { CreateUserResponseDto } from '../interfaces/user/create-user-response.dto';
import { LoginUserResponseDto } from '../interfaces/user/login-user-response.dto';
import { LogoutUserResponseDto } from '../interfaces/user/logout-user-response.dto';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;
const selectAuthToken = (state: RootState) => state.auth.token;

const loginApi = async (apiBaseUri: string, payload: LoginPayload) => {
    const response = await fetch(`${apiBaseUri}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const responseData: LoginUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Login failed');
    }

    return responseData;
};

function* loginSaga(action: { payload: LoginPayload; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: LoginUserResponseDto = yield call(loginApi, apiBaseUri, action.payload);
        Cookies.set('token', response.data.token, { expires: 7 });
        yield put(loginSuccess({ token: response.data.token }));
    } catch (error: any) {
        yield put(loginFailure(error.message));
    }
}

const registerApi = async (apiBaseUri: string, payload: RegisterPayload) => {
    const response = await fetch(`${apiBaseUri}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const responseData: CreateUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Registration failed');
    }

    return responseData;
};

function* registerSaga(action: { payload: RegisterPayload; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: CreateUserResponseDto = yield call(registerApi, apiBaseUri, action.payload);
        Cookies.set('token', response.data.token, { expires: 7 });
        yield put(registerSuccess({ token: response.data.token }));
    } catch (error: any) {
        yield put(registerFailure(error.message));
    }
}

const logoutApi = async (apiBaseUri: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/users/logout`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData: LogoutUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Logout failed');
    }

    return responseData;
};

function* logoutSaga() {
    const apiBaseUri: string = yield select(selectApiBaseUri);
    const token: string = yield select(selectAuthToken);
    const response: LogoutUserResponseDto = yield call(logoutApi, apiBaseUri, token);
    // Remove cookies on logout
    Cookies.remove('token');

    yield put(logout());
}

export function* authSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
    yield takeLatest(registerRequest.type, registerSaga);
    yield takeLatest(logoutRequest.type, logoutSaga);
}
