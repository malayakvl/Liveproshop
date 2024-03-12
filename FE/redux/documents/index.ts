import { Action, handleActions } from 'redux-actions';
import { addUploadedFile, removeUploadedFile } from './actions';

const initialState: {
    uploadedPolicyFiles: any[];
} = {
    uploadedPolicyFiles: [],
};

const ACTION_HANDLERS: any = {
    [addUploadedFile]: (
        state: State.Products,
        action: Type.ReduxAction<State.Products>
    ): State.Products => {
        return <Products.Root>{
            ...state,
            uploadedFiles: [...state.uploadedFiles, action.payload]
        };
    },
    [removeUploadedFile]: (
        state: State.Products,
        action: Type.ReduxAction<State.Products>
    ): State.Products => {
        return <Products.Root>{
            ...state,
            uploadedFiles: state.uploadedFiles.filter(
                (file) => file.lastModified !== (action.payload as any).lastModified
            )
        };
    },
};

export { addUploadedFile, removeUploadedFile };

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
