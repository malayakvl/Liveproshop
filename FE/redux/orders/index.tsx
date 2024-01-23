import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    fetchItemAction,
    setEmptyFormAction,
    showPopupAction,
    fetchFilerItems,
    fetchOrderPdfAction,
    showDateSelectorAction,
    findSellersAction,
    showCancelConfirmationModalAction,
    clearBase64Action,
    setAchiveNameAction,
    setSingleFileNameAction,
    connectOrderAction,
    setFbCommentAction,
    setupOrderByCommentAction,
    setupExistOrderByCommentAction,
    setTmpFbCommentAction,
    clearOrderByCommentAction,
    setupReturnedUrlAction,
    redirectCheckoutAction,
    updateOrderStatusAction,
    redirectOrderNumberAction,
    setupConnectedOrderIdAction,
    setupWaitOrderByCommentAction,
    clearWaitOrderByCommentAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    count: number;
    items: Orders.DataItem[];
    itemsStatuses: any;
    item: any;
    showPopup: boolean;
    fileterData: any;
    showDateSelector: boolean;
    orderFetched: boolean;
    fileName: string;
    base64Data: string | null;
    tagSellersSuggestions: any[];
    showCancelPopup: boolean;
    achiveName: string | null;
    commentIdOrder: string | null;
    tmpCommentOrderId: string | null;
    connectedOrderNumber: string | null;
    orderReturnedUrl: string | null;
    redirectCheckout: boolean;
    redirectOrderNumber: any;
} = {
    isFetched: false,
    loading: false,
    count: 0,
    items: [],
    itemsStatuses: [],
    item: {},
    showPopup: false,
    fileterData: {
        payments: [],
        countries: [],
        shippings: [],
        amounts: []
    },
    showDateSelector: false,
    orderFetched: false,
    fileName: '',
    base64Data: null,
    tagSellersSuggestions: [],
    showCancelPopup: false,
    achiveName: null,
    commentIdOrder: null,
    tmpCommentOrderId: null,
    connectedOrderNumber: null,
    orderReturnedUrl: null,
    redirectCheckout: false,
    redirectOrderNumber: null
};

const ACTION_HANDLERS: any = {
    [fetchItemsAction]: {
        next: (
            state: State.Orders,
            action: Type.ReduxAction<Pick<State.Orders, 'count' | 'items'>>
        ): State.Orders => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Orders): State.Orders => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchItemAction]: {
        next: (
            state: State.Orders,
            action: Type.ReduxAction<Pick<State.Orders, 'item'>>
        ): State.Orders => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Orders): State.Orders => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [fetchFilerItems]: {
        next: (
            state: State.Orders,
            action: Type.ReduxAction<Pick<State.Orders, 'fileterData'>>
        ): State.Orders => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Orders): State.Orders => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [setAchiveNameAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            achiveName: action.payload
        })
    },
    [findSellersAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            tagSellersSuggestions: action.payload
        })
    },
    // [setEmptyFormAction]: {
    //     next: (state: State.Orders): State.Orders => ({
    //         ...state,
    //         item: {
    //             id: null,
    //             name: '',
    //             keywords: '',
    //             message_fr: '',
    //             message_en: '',
    //             active: true,
    //             product: null,
    //             discount: '',
    //             answer_count: '',
    //             created_at: null,
    //             updated_at: null
    //         }
    //     })
    // },
    [showPopupAction]: {
        next: (state: State.Orders, action: Action<boolean>): State.Orders => ({
            ...state,
            showPopup: action.payload
        })
    },
    [showCancelConfirmationModalAction]: {
        next: (state: State.Orders, action: Action<boolean>): State.Orders => ({
            ...state,
            showCancelPopup: action.payload
        })
    },
    [showDateSelectorAction]: {
        next: (state: State.Orders, action: Action<boolean>): State.Orders => ({
            ...state,
            showDateSelector: action.payload
        })
    },
    [fetchOrderPdfAction]: {
        next: (
            state: State.Orders,
            action: Type.ReduxAction<Pick<State.Orders, 'orderFetched' | 'fileName' | 'base64Data'>>
        ): State.Orders => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Orders): State.Orders => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [clearBase64Action]: {
        next: (state: State.Orders, action: Action<string>): State.Orders => ({
            ...state,
            base64Data: action.payload
        })
    },
    [setSingleFileNameAction]: {
        next: (state: State.Orders, action: Action<string>): State.Orders => ({
            ...state,
            downloadFileName: action.payload
        })
    },
    // [connectOrderAction]: {
    //     next: (state: State.Orders, action: Action<any>): State.Orders => ({
    //         ...state,
    //         commentOrderId: action.payload
    //     })
    // },
    [setFbCommentAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            commentIdOrder: action.payload
        })
    },
    [setTmpFbCommentAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            tmpCommentOrderId: action.payload
        })
    },
    [setupOrderByCommentAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            connectedOrderNumber: action.payload
        })
    },
    [setupWaitOrderByCommentAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            connectedOrderNumber: action.payload
        })
    },
    [setupConnectedOrderIdAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            connectedOrderNumber: action.payload
        })
    },
    [clearOrderByCommentAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            connectedOrderNumber: null
        })
    },
    [clearWaitOrderByCommentAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            connectedOrderNumber: null
        })
    },
    [setupReturnedUrlAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            orderReturnedUrl: action.payload
        })
    },
    [redirectOrderNumberAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            redirectOrderNumber: action.payload
        })
    }
};

export {
    fetchItemsAction,
    fetchItemAction,
    showPopupAction,
    setEmptyFormAction,
    fetchFilerItems,
    showDateSelectorAction,
    fetchOrderPdfAction,
    findSellersAction,
    showCancelConfirmationModalAction,
    clearBase64Action,
    setSingleFileNameAction,
    connectOrderAction,
    setFbCommentAction,
    setupOrderByCommentAction,
    setupExistOrderByCommentAction,
    setTmpFbCommentAction,
    clearOrderByCommentAction,
    setupReturnedUrlAction,
    redirectCheckoutAction,
    updateOrderStatusAction,
    redirectOrderNumberAction,
    setupConnectedOrderIdAction,
    setupWaitOrderByCommentAction,
    clearWaitOrderByCommentAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
