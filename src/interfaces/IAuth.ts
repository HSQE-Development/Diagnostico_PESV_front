import { IUser } from "./IUser"

interface Token{
    refresh:string
    access:string
}

export interface IAuth {
    tokens:Token
    user: IUser
}