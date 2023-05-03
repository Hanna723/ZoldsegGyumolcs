export interface User {
    id: string;
    email: string;
    address: {
        city: string;
        country: string;
        postal_code: string;
        street: string;
        number: string;
    }
}