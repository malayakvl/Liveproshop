import { Action, handleActions } from 'redux-actions';
import { fetchStoresAction } from './actions';

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
            publish: false,
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
    [fetchStoresAction]: {
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
    }
};

export { fetchStoresAction };

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
