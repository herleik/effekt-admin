import { DEV_ENVIRONMENT, API_URL, API_AUTH } from "../config/config";
import queryString from "querystring";

import shortid from 'shortid';
import { loginSuccess } from "./login.actions";
import { fetchTokenRequest } from "./token.actions";

import store from './../store'

export interface IAccessKey {
    key: string,
    expires: Date
}

export interface IAccessToken {
    token: string,
    expires: Date
}

export class Auth {
    static login(): any {
        AuthUtil.setAuthState();
        return window.location.assign(AuthUtil.generateLoginUrl());
    }

    static tryCachedKey() {
        let storedAccessKey = AuthUtil.getStoredAccessKey()
        if (storedAccessKey) {
            store.dispatch(loginSuccess(storedAccessKey));
            store.dispatch(fetchTokenRequest());
        }
    }

    /* Handles the callback route, tries to parse the URL parameters and stores the accessKey */
    static handleCallback() {
        let callbackVariables: ICallbackParameters = AuthUtil.parseCallback();
        if (callbackVariables.state === AuthUtil.authState) {
            let key: IAccessKey = {
                key: callbackVariables.key,
                expires: callbackVariables.expires
            };
            AuthUtil.storeAccessKey(key);
            store.dispatch(loginSuccess(key));
            store.dispatch(fetchTokenRequest());
        }
        else {
            throw new Error(`Authentication mismatch, expected ${AuthUtil.authState} got ${callbackVariables.state}`)
        }
    }

    static logOut() {

    }
}

interface ICallbackParameters {
    key: string,
    expires: Date,
    state: string
}

class AuthUtil {
    static generateLoginUrl(): string {
        return `${API_URL}/auth/login?` +
                `client_id=${API_AUTH.clientId}&` + 
                `state=${this.setAuthState()}&` + 
                `scope=${API_AUTH.permissions.join(" ")}&` + 
                `redirect_uri=${encodeURIComponent(this.getCallbackUrl())}&` + 
                `response_type=code`
    }

    static getCallbackUrl(): string {
        if (DEV_ENVIRONMENT)
            return `http://localhost:3000/callback`
        else
            return `https://storage.googleapis.com/static.gieffektivt.no/index.html#/callback`
    }

    /*
    TODO: Might be cleaner to move the fetching of cached keys to redux-saga
    */

    private static readonly AUTH_STATE_KEY: string = "auth_state";
    /* Returns a randomly generated state variable in local storage, used to compare to validate login callback */
    static get authState(): string | null {
        return localStorage.getItem(this.AUTH_STATE_KEY);
    }

    /* Stores a randomly generated state variable in local storage, used to compare to validate login callback */
    static setAuthState(): string {
        let shortId = shortid.generate();
        localStorage.setItem(this.AUTH_STATE_KEY, shortId);
        return shortId;
    }

    /* Clears the state variable in local storage, used to compare to validate login callback */
    static clearAuthState(): void {
        localStorage.removeItem(this.AUTH_STATE_KEY);
    }

    private static readonly ACCESS_KEY_KEY: string = "access_key";
    /* Gets the access key from localstorage, or returns null if no access key exists */
    static getStoredAccessKey(): IAccessKey | null{
        let accessKeyStr: string | null = localStorage.getItem(this.ACCESS_KEY_KEY);
        if (accessKeyStr == null) return null;
        try {
            return JSON.parse(accessKeyStr)
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /* Stores access key in local storage */
    static storeAccessKey(accessKey: IAccessKey): void {
        localStorage.setItem(this.ACCESS_KEY_KEY, JSON.stringify(accessKey));
    }

    /* Clears the access key from local storage */
    static clearAccessKey(): void {
        localStorage.removeItem(this.ACCESS_KEY_KEY);
    }

    /* Parses the querystring of the callback from the API authentification
       route, returns a clean object to work with */
    static parseCallback(): ICallbackParameters {
        let params = queryString.parse(window.location.search.slice(1));
        return {
            key: params.key as string,
            expires: new Date(params.expires as string),
            state: params.state as string
        };
    }
}