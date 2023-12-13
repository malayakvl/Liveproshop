declare namespace Profile {
    interface Root {
        profile: Profile;
        profilePhoto: null | any;
        crudStatus: string | null;
        validEmail: string | null;
        isPasswordChanged: boolean;
    }

    interface Profile {
        id: number;
        role_id: number;
        email: string;
        email_real: string;
        photo: string | null;
        first_name: string | null;
        last_name: string | null;
        company_name: string | null;
        identification_number: string | null;
        phone: string | null;
        address: Address;
        created_at: any;
        updated_at: any;
        profilePhoto: anny;
    }

    interface Address {
        id: number | null;
        user_id: number | null;
        country_id: number | null;
        state: string | null;
        post_code: string | null;
        address_type: string | null;
        city: string | null;
        address_line_1: string | null;
        address_line_2: string | null;
        created_at: any;
        updated_at: any;
    }
}
