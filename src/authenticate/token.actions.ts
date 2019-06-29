import { IAccessToken } from "./auth";

export const FETCH_TOKEN_REQUEST = "FETCH_TOKEN_REQUEST";
export const FETCH_TOKEN_SUCCESS = "FETCH_TOKEN_SUCCESS";

export const fetchTokenRequest = () => {
    return {
        type: FETCH_TOKEN_REQUEST
    }
}

export const fetchTokenSuccess = (payload: IAccessToken) => {
    return {
        type: FETCH_TOKEN_SUCCESS,
        payload
    }
}