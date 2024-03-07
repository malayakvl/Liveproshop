import { Action, handleActions } from 'redux-actions';
import {
    fetchAdditionalAction,
    addUploadedFile,
    removeUploadedFile,
    fetchProductsAction,
    fetchProductAction,
    bulkDeleteAction,
    setActiveTabAction,
    setEmptyProductAction,
    setSelectedColorsAction,
    setSelectedSizesAction,
    setSelectedAdditionalAction,
    findTagAction,
    setIdentAction,
    copyIdsAction,
    findProductsAction
} from './actions';

const initialState: {
    uploadedFiles: any[];
    product: Products.Product;
    checkedIds: any[];
    additional: {
        sizes: any[];
        colors: any[];
        sizesTable: any[];
        materials: any[];
        tags: any[];
        priceRange: any;
        qtyRange: any;
        price: any[];
        quantity: any[];
    };
    selectedAdditionals: Products.Additionals;
    isFetched: boolean;
    count: number;
    loading: boolean;
    items: any[];
    products: any[];
    activeTab: string;
    tagSuggestions: any[];
    setupIdent: boolean;
    copyProductIds: number[];
} = {
    additional: {
        colors: [],
        sizes: [],
        sizesTable: [],
        materials: [],
        tags: [],
        priceRange: {},
        qtyRange: {},
        price: [],
        quantity: []
    },
    selectedAdditionals: {
        colors: [],
        sizes: [],
        styles: [],
        materials: [],
        tags: []
    },
    products: [],
    product: {
        product: {
            isPublish: false,
            configured: false,
            name: '',
            description: '',
            price: '',
            quantity: '',
            keywords: '',
            sku: '',
            photos: [],
            selectedColors: [],
            selectedSizes: [],
            selectedStyles: [],
            selectedMaterials: []
        },
        configurations: []
    } as unknown as Products.Product,
    loading: false,
    isFetched: false,
    uploadedFiles: [],
    checkedIds: [],
    count: 0,
    items: [],
    tagSuggestions: [],
    activeTab: 'products',
    setupIdent: false,
    copyProductIds: []
};

const ACTION_HANDLERS: any = {
    [fetchAdditionalAction]: {
        next: (
            state: State.Products,
            action: Type.ReduxAction<Pick<State.Products, 'additional'>>
        ): State.Products => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Products): State.Products => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [setSelectedAdditionalAction]: {
        next: (state: State.Products, action: Action<any>): State.Products => ({
            ...state,
            selectedAdditionals: action.payload
        })
    },
    [setSelectedColorsAction]: {
        next: (state: State.Products, action: Action<any>): State.Products => ({
            ...state,
            products: action.payload
        })
    },
    [setSelectedSizesAction]: {
        next: (state: State.Products, action: Action<any>): State.Products => ({
            ...state,
            selectedSizes: action.payload
        })
    },
    [findTagAction]: {
        next: (state: State.Products, action: Action<any>): State.Products => ({
            ...state,
            tagSuggestions: action.payload
        })
    },
    [findProductsAction]: {
        next: (state: State.Products, action: Action<any>): State.Products => ({
            ...state,
            tagSuggestions: action.payload
        })
    },
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
    [fetchProductsAction]: {
        next: (
            state: State.Products,
            action: Type.ReduxAction<Pick<State.Products, 'count' | 'items'>>
        ): State.Products => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Products): State.Products => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchProductAction]: {
        next: (
            state: State.Products,
            action: Type.ReduxAction<Pick<State.Products, 'product'>>
        ): State.Products => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true,
            uploadedFiles: []
        }),
        throw: (state: State.Products): State.Products => ({
            ...state,
            loading: false,
            isFetched: true,
            uploadedFiles: []
        })
    },
    [bulkDeleteAction]: (state: State.Products): State.Products => {
        return <Products.Root>{
            ...state
        };
    },
    [setActiveTabAction]: {
        next: (state: State.Products, action: Action<string>): State.Products => ({
            ...state,
            activeTab: action.payload
        })
    },
    [copyIdsAction]: {
        next: (state: State.Products, action: Action<any>): State.Products => ({
            ...state,
            copyProductIds: action.payload
        })
    },
    [setIdentAction]: {
        next: (state: State.Products, action: Action<boolean>): State.Products => ({
            ...state,
            setupIdent: action.payload
        })
    },
    [setEmptyProductAction]: (state: State.Products): State.Products => {
        return <Products.Root>(<unknown>{
            ...state,
            product: {
                product: {
                    publish: false,
                    configured: false,
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    keywords: '',
                    sku: '',
                    selectedColors: [],
                    selectedSizes: []
                },
                configurations: []
            },
            isFetched: true,
            selectedAdditionals: {
                colors: [],
                sizes: [],
                styles: [],
                materials: [],
                tags: []
            },
            uploadedFiles: []
        });
    }
};

export {
    fetchAdditionalAction,
    addUploadedFile,
    removeUploadedFile,
    bulkDeleteAction,
    fetchProductsAction,
    fetchProductAction,
    setSelectedSizesAction,
    setSelectedColorsAction,
    setSelectedAdditionalAction,
    findTagAction,
    setIdentAction,
    findProductsAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
