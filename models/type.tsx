import { Field, TimeSlot } from "./field";
import { FootballField } from "./football_field";
import { Notification } from "./notification";

export interface IUser {
    _id?: string,
    name?: string,
    email: string,
    password: string,
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
    auth: {
        value: IUser
    };
    footballField: {
        value: FootballField
    };
    notification:{
        value: Notification[]
    }
}





