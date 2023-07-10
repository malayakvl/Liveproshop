import { Action, handleActions } from 'redux-actions';
import {
    setPaginationAction,
    toggleSidebarAction,
    closeSidebarAction,
    setErrorToastAction,
    setSuccessToastAction,
    setInfoToastAction,
    deleteToastAction,
    checkIdsAction,
    initIdsAction,
    checkAllIdsAction,
    uncheckAllIdsAction,
    setModalConfirmationMetaAction,
    setModalCalendlyMetaAction,
    setSwitchHeaderAction,
    showLoaderAction,
    setActivePageAction,
    setSwitchToggleAction,
    sidebarCloseAction,
    toggleTextingMenuAction
} from './actions';
import { PaginationType, OrderStatus } from '../../constants';

const initPagination = { limit: 25, offset: 0, sort: 'DESC', column: 'created_at', query: '' };

const initialState: State.Layouts = {
    pagination: {
        [PaginationType.NOTIFICATIONS]: { ...initPagination },
        [PaginationType.PRODUCTS]: {
            ...initPagination,
            filters: {
                product_name: '',
                color_id: [],
                size_id: [],
                price: [],
                quantity: [],
                material_id: []
            }
        },
        [PaginationType.CHATBOT]: { ...initPagination },
        [PaginationType.SHIPPING]: { ...initPagination },
        [PaginationType.BUYERS]: {
            ...initPagination,
            sort: 'ASC',
            column: 'first_name',
            filters: {
                name: '',
                country_id: [],
                total_amount: [],
                seller_id: [],
                buyer_id: []
            }
        },
        [PaginationType.LIVESESSIONS]: {
            ...initPagination,
            filters: { status: [], duration: [], cart_duration: [], event_date: '' }
        },
        [PaginationType.PAYMENTS]: {
            ...initPagination,
            filters: {
                order_number: '',
                shipping_id: [],
                country_id: [],
                payment_id: [],
                status: [OrderStatus.PAYED],
                total_amount: [],
                created_at: [],
                seller_id: []
            }
        },
        [PaginationType.ORDERS]: {
            ...initPagination,
            filters: {
                order_number: '',
                shipping_id: [],
                country_id: [],
                payment_id: [],
                status: [],
                total_amount: [],
                created_at: [],
                seller_id: []
            }
        },
        [PaginationType.SELLERS]: {
            ...initPagination,
            column: 'total_orders',
            filters: {
                country_id: [],
                total_orders: [],
                total_sessions: [],
                total_buyers: [],
                total_amount: [],
                seller_id: [],
                created_at: []
            }
        },
        [PaginationType.WAITING]: {
            ...initPagination,
            column: 'oi.total_quantity',
            filters: {
                product_search: '',
                total_amount: [],
                total_qty: [],
                created_at: []
            }
        },
        [PaginationType.DASHBOARD]: {
            ...initPagination,
            limit: 5,
            filters: {
                // order_number: '',
                // shipping_id: [],
                // country_id: [],
                // payment_id: [],
                // status: [],
                // total_amount: [],
                created_at: []
            }
        }
    },
    isSidebarOpen: false,
    isMobileDevice: false,
    isDataLoading: false,
    toasts: [],
    checkedIds: [],
    switchHeader: false,
    switchToggled: false,
    modalConfirmationMeta: null,
    modalCalendlyMeta: null,
    activeTab: {
        inventory: { tab: 'products' }
    },
    showTextingMenu: false
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS: any = {
    [setPaginationAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<{
            type: Type.PaginationType;
            modifier: Partial<Layouts.Pagination>;
        }>
    ): State.Layouts => ({
        ...state,
        pagination: {
            ...state.pagination,
            [action.payload.type]: {
                ...state.pagination[action.payload.type],
                ...action.payload.modifier
            }
        }
    }),
    [setActivePageAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<{
            type: string;
            modifier: string;
        }>
    ): State.Layouts => ({
        ...state,
        activeTab: {
            ...state.activeTab,
            [action.payload.type]: {
                tab: action.payload.modifier
            }
        }
    }),
    [initIdsAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<State.Layouts>
    ): State.Layouts => {
        return <Layouts.Root>(<unknown>{
            ...state,
            checkedIds: action.payload
        });
    },
    [checkIdsAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<State.Layouts>
    ): State.Layouts => {
        return <Layouts.Root>{
            ...state,
            checkedIds: state.checkedIds.map((data) =>
                (data as any).id === action.payload ? { ...data, checked: !data.checked } : data
            )
        };
    },
    [checkAllIdsAction]: (state: State.Layouts): State.Layouts => {
        return <Layouts.Root>{
            ...state,
            checkedIds: state.checkedIds.map((data) =>
                (data as any).id ? { ...data, checked: true } : data
            )
        };
    },
    [uncheckAllIdsAction]: (state: State.Layouts): State.Layouts => {
        return <Layouts.Root>{
            ...state,
            checkedIds: state.checkedIds.map((data) =>
                (data as any).id ? { ...data, checked: false } : data
            )
        };
    },
    [toggleSidebarAction]: (state: State.Layouts): State.Layouts => ({
        ...state,
        isSidebarOpen: !state.isSidebarOpen
    }),
    [sidebarCloseAction]: (state: State.Layouts): State.Layouts => ({
        ...state,
        isSidebarOpen: false
    }),
    [showLoaderAction]: {
        next: (state: State.Layouts, action: Action<boolean>): State.Layouts => ({
            ...state,
            isDataLoading: action.payload
        })
    },
    [setSwitchHeaderAction]: {
        next: (state: State.Layouts, action: Action<boolean>): State.Layouts => ({
            ...state,
            switchHeader: action.payload
        })
    },
    [setSwitchToggleAction]: {
        next: (state: State.Layouts, action: Action<boolean>): State.Layouts => ({
            ...state,
            switchToggled: action.payload
        })
    },
    [closeSidebarAction]: (state: State.Layouts): State.Layouts => ({
        ...state,
        isSidebarOpen: false
    }),
    [setErrorToastAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<Layouts.ToastMessage>
    ): State.Layouts => ({
        ...state,
        toasts: [...state.toasts, { id: Date.now(), type: 'error', message: action.payload }]
    }),
    [setSuccessToastAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<Layouts.ToastMessage>
    ): State.Layouts => ({
        ...state,
        toasts: [...state.toasts, { id: Date.now(), type: 'success', message: action.payload }]
    }),
    [setInfoToastAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<Layouts.ToastMessage>
    ): State.Layouts => ({
        ...state,
        toasts: [...state.toasts, { id: Date.now(), type: 'info', message: action.payload }]
    }),
    [deleteToastAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<number>
    ): State.Layouts => ({
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload)
    }),
    [setModalConfirmationMetaAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<Layouts.ModalConfirmationMeta>
    ): State.Layouts => ({
        ...state,
        modalConfirmationMeta: action.payload && {
            ...action.payload
        }
    }),
    [setModalCalendlyMetaAction]: (
        state: State.Layouts,
        action: Type.ReduxAction<Layouts.ModalCalendlyMeta>
    ): State.Layouts => ({
        ...state,
        modalCalendlyMeta: action.payload && {
            ...action.payload
        }
    }),
    [toggleTextingMenuAction]: {
        next: (state: State.Layouts, action: Action<boolean>): State.Layouts => ({
            ...state,
            showTextingMenu: action.payload
        })
    },

};

export {
    setPaginationAction,
    initIdsAction,
    checkAllIdsAction,
    uncheckAllIdsAction,
    checkIdsAction,
    toggleSidebarAction,
    closeSidebarAction,
    setErrorToastAction,
    setSuccessToastAction,
    setInfoToastAction,
    deleteToastAction,
    setModalConfirmationMetaAction,
    setModalCalendlyMetaAction,
    setSwitchToggleAction,
    sidebarCloseAction,
    toggleTextingMenuAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
