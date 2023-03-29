declare namespace Products {
    interface Root {
        products: Product[];
        additional: {
            colors: Color[];
            sizes: Size[];
            sizesTable: any;
            styles: Style[];
            materials: Material[];
            priceRange: Range;
            qtyRange: Range;
        };
        product: Product;
        loading: boolean;
        isFetched: boolean;
        uploadedFiles: File[];
        productFiles: string[];
        checkedIds: number[];
        count: number;
        items: ProductItem[];
        activeTab: string;
        selectedColors: any[];
        selectedSizes: any[];
        selectedAdditionals: Products.Additionals;
        tagSuggestions: any[];
        setupIdent: boolean;
        copyProductIds: number[];
    }

    interface Additionals {
        colors: AdditionalColor[];
        sizes: Additional[];
        styles: Additional[];
        materials: Additional[];
        tags: Tag[];
    }

    interface Range {
        min: number;
        max: number;
    }

    interface Tag {
        name: string;
        id: number;
    }

    interface Additional {
        label: string;
        value: number;
    }
    interface AdditionalColor {
        label: string;
        value: number;
        color: string;
    }

    interface Product {
        product: any;
        configurations: any;
    }

    interface Color {
        id: number | null;
        name: string | null;
        translations: any | null;
    }

    interface Color {
        id: number | null;
        name: string | null;
        translations: any | null;
    }

    interface Size {
        id: number | null;
        name: string | null;
        translations: any | null;
    }

    interface Style {
        id: number | null;
        name: string | null;
        translations: any | null;
    }

    interface Material {
        id: number | null;
        name: string | null;
        translations: any | null;
    }

    interface ProductItem {
        id: number;
        name: string;
        previewphoto: string;
        description: string;
        configuration: any;
        publish: boolean;
        first_name: string | null;
        last_name: string | null;
        created_at: any;
        updated_at: any;
    }
}
