import { Field, TimeSlot } from "./field";

export interface IUser {
    id?: string,
    name?: string,
    email: string,
    password?: string,
    image?: string,
    // birthday?: string,
    // age?: number,
    role?: number,
    status?: number
}

export interface RootStateType {
    timeSlot: {
        value: TimeSlot[];
    };
    field: {
        value: Field[];
    };
}