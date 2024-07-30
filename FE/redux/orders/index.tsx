import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    fetchLiveItemsAction,
    fetchItemAction,
    setEmptyFormAction,
    showPopupAction,
    fetchFilerItems,
    fetchOrderPdfAction,
    showDateSelectorAction,
    findSellersAction,
    showCancelConfirmationModalAction,
    showShippedConfirmationModalAction,
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
    clearWaitOrderByCommentAction,
    setupConnectedStoreNameAction,
    openBrowserAction,
    setGoogleDeepLinkAction,
    setupOrderAmountAction,
    fetchOrderTotalAmountAction,
    fetchOrderTotalAmountActionUpdated,
    reloadAfterCombineAction,
    setupOrderAmountUpdatedAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    count: number;
    items: Orders.DataItem[];
    liveItems: Orders.DataItem[];
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
    showShippedPopup: boolean;
    achiveName: string | null;
    commentIdOrder: string | null;
    tmpCommentOrderId: string | null;
    connectedOrderNumber: string | null;
    orderReturnedUrl: string | null;
    redirectCheckout: boolean;
    redirectOrderNumber: any;
    storeName: any;
    googleBrowserLink: any;
    prevOrderAmount: number;
    currOrderAmount: number;
    reloadOrderAfterCombine: boolean;
    latestLiveOrder: number;
} = {
    isFetched: false,
    loading: false,
    count: 0,
    items: [],
    liveItems: [],
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
    showShippedPopup: false,
    achiveName: null,
    commentIdOrder: null,
    tmpCommentOrderId: null,
    connectedOrderNumber: null,
    orderReturnedUrl: null,
    redirectCheckout: false,
    redirectOrderNumber: null,
    storeName: null,
    googleBrowserLink: null,
    prevOrderAmount: 0,
    currOrderAmount: 0,
    reloadOrderAfterCombine: false,
    latestLiveOrder: 0
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
    [fetchLiveItemsAction]: {
        next: (
            state: State.Orders,
            action: Type.ReduxAction<Pick<State.Orders, 'count' | 'liveItems'>>
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
    [showShippedConfirmationModalAction]: {
        next: (state: State.Orders, action: Action<boolean>): State.Orders => ({
            ...state,
            showShippedPopup: action.payload
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
    },
    [setupConnectedStoreNameAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            storeName: action.payload
        })
    },
    [setGoogleDeepLinkAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            googleBrowserLink: action.payload
        })
    },
    [setupOrderAmountAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            prevOrderAmount: action.payload
        })
    },
    [setupOrderAmountUpdatedAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            currOrderAmount: action.payload
        })
    },
    [reloadAfterCombineAction]: {
        next: (state: State.Orders, action: Action<any>): State.Orders => ({
            ...state,
            reloadOrderAfterCombine: action.payload
        })
    }
};

export {
    fetchItemsAction,
    fetchLiveItemsAction,
    fetchItemAction,
    showPopupAction,
    setEmptyFormAction,
    fetchFilerItems,
    showDateSelectorAction,
    fetchOrderPdfAction,
    findSellersAction,
    showCancelConfirmationModalAction,
    showShippedConfirmationModalAction,
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
    clearWaitOrderByCommentAction,
    setupConnectedStoreNameAction,
    openBrowserAction,
    setGoogleDeepLinkAction,
    setupOrderAmountAction,
    fetchOrderTotalAmountAction,
    reloadAfterCombineAction,
    fetchOrderTotalAmountActionUpdated
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
