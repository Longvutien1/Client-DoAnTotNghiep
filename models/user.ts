export interface User{
    _id?: string,
    name: string,
    password?: string,
    email: string,
    image: string,
    birthday: string,
    age: number,
    role: number,
    status: number,
    createdAt?: string,
    updatedAt?: string
}