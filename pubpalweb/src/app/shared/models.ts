export interface APIResponse {
    status: string;
    result: any;
    errormessage: any;
}

export interface UserModel {
    _id?: string;
    email: string;
    enabled?: boolean;
    firstname: string;
    lastname: string;
}
