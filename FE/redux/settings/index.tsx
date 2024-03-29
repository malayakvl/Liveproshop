import { handleActions } from 'redux-actions';
import {
    fetchFormAction,
    addUploadedPolicyFile,
    removeUploadedPolicyFile,
    addUploadedTermsAndCondFile,
    removeUploadedTermsAndCondFile,
    addUploadedDeliveryFile,
    removeUploadedDeliveryFile,
    addUploadedReturnFile,
    removeUploadedReturnFile
} from './actions';

const initialState: {
    loading: boolean;
    item: Settings.SettingItem;
    uploadedPolicyFiles: any[];
    uploadedTermsFiles: any[];
    uploadedDeliveryFiles: any[];
    uploadedReturnFiles: any[];
} = {
    loading: false,
    uploadedPolicyFiles: [],
    uploadedTermsFiles: [],
    uploadedDeliveryFiles: [],
    uploadedReturnFiles: [],
    item: {
        user_id: 0,
        cart_duration: '',
        type: '',
        free_shipping_timer: false,
        free_shipping_status: '',
        created_at: '',
        updated_at: '',
        doctype: true,
        privacy_doc: '',
        terms_doc: '',
        delivery_doc: '',
        return_doc: '',
        privacy_link: '',
        terms_link: '',
        delivery_link: '',
        return_link: ''
    }
};

const ACTION_HANDLERS: any = {
    [fetchFormAction]: {
        next: (
            state: State.Settings,
            action: Type.ReduxAction<Pick<State.Settings, 'item'>>
        ): State.Settings => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Settings): State.Settings => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [addUploadedPolicyFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedPolicyFiles: [action.payload]
        };
    },
    [removeUploadedPolicyFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedPolicyFiles: []
        };
    },
    [addUploadedTermsAndCondFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedTermsFiles: [action.payload]
        };
    },
    [removeUploadedTermsAndCondFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedTermsFiles: []
        };
    },
    [addUploadedDeliveryFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedDeliveryFiles: [action.payload]
        };
    },
    [removeUploadedDeliveryFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedDeliveryFiles: []
        };
    },
    [addUploadedReturnFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedReturnFiles: [action.payload]
        };
    },
    [removeUploadedReturnFile]: (
        state: State.Settings,
        action: Type.ReduxAction<State.Settings>
    ): State.Settings => {
        return {
            ...state,
            uploadedReturnFiles: []
        };
    }
};

export {
    fetchFormAction,
    addUploadedPolicyFile,
    removeUploadedPolicyFile,
    addUploadedTermsAndCondFile,
    removeUploadedTermsAndCondFile,
    addUploadedDeliveryFile,
    removeUploadedDeliveryFile,
    addUploadedReturnFile,
    removeUploadedReturnFile
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
