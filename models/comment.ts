/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./user";

export interface Comment{
    id?: string,
    user: User ,
    movieId: string,
    desc: string,
    type: string,
    replies?:any,
    createdAt?: string,
    updatedAt?: string
}