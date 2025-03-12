import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '@rudinesurya/api-gateway-interfaces';

interface MessagesState {
    messages: IMessage[];
    message: IMessage | null;
    loading: boolean;
    error?: string;
}

const initialState: MessagesState = {
    messages: [],
    message: null,
    loading: false,
    error: undefined,
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        fetchMessagesByChatIdRequest(state, action: PayloadAction<{ id: string; }>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchMessagesByChatIdSuccess(state, action: PayloadAction<{ messages: IMessage[] }>) {
            state.messages = action.payload.messages;
            state.loading = false;
        },
        fetchMessagesByChatIdFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        createMessageRequest(state, action: PayloadAction<{ data: any; token: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        createMessageSuccess(state, action: PayloadAction<{ message: IMessage }>) {
            state.messages.push(action.payload.message);
            state.loading = false;
        },
        createMessageFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        updateMessageRequest(state, action: PayloadAction<{ id: string; data: any; }>) {
            state.loading = true;
            state.error = undefined;
        },
        updateMessageSuccess(state, action: PayloadAction<{ message: IMessage }>) {
            const index = state.messages.findIndex((x) => x._id === action.payload.message._id);
            if (index !== -1) {
                state.messages[index] = action.payload.message;
            }
            if (state.message && state.message._id === action.payload.message._id) {
                state.message = action.payload.message;
            }
            state.loading = false;
        },
        updateMessageFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        deleteMessageRequest(state, action: PayloadAction<{ id: string; }>) {
            state.loading = true;
            state.error = undefined;
        },
        deleteMessageSuccess(state, action: PayloadAction<{ id: string }>) {
            state.messages = state.messages.filter((x) => x._id !== action.payload.id);
            state.loading = false;
        },
        deleteMessageFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchMessagesByChatIdRequest,
    fetchMessagesByChatIdSuccess,
    fetchMessagesByChatIdFailure,
    createMessageRequest,
    createMessageSuccess,
    createMessageFailure,
    updateMessageRequest,
    updateMessageSuccess,
    updateMessageFailure,
    deleteMessageRequest,
    deleteMessageSuccess,
    deleteMessageFailure
} = messagesSlice.actions;
export default messagesSlice.reducer;
