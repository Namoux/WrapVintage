
export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    imageURL: string,
    quantity: number,
    is_new: number
}

export interface User {
    id: number,
    username: string,
    password: string,
    email: string,
    adresse: string,
    is_admin: number
}

export interface EditUser extends Partial<User> {
  currentPassword?: string;
  newPassword?: string;
}