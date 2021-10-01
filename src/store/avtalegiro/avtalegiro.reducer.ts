import { isType } from "typescript-fsa";
import { AvtaleGiroAgreementsState } from "../../models/state";
import { toastError } from "../../util/toasthelper";
import { fetchAvtaleGiroAgreementsAction, fetchAvtaleGiroHistogramAction, fetchAvtaleGiroReportAction, SET_AVTALEGIRO_FILTER_ACTIVE, SET_AVTALEGIRO_FILTER_AMOUNT, SET_AVTALEGIRO_FILTER_DONOR, SET_AVTALEGIRO_FILTER_KID, SET_AVTALEGIRO_PAGINATION } from "./avtalegiro.actions";

const defaultAvtaleGiroAgreementState: AvtaleGiroAgreementsState = {
    activeAgreementCount: 0,
    averageAgreementSum: 0,
    totalAgreementSum: 0,
    medianAgreementSum: 0,
    startedThisMonth: 0,
    stoppedThisMonth: 0,
    agreements: [],
    loading: false,
    pages: 1,
    pagination: {
        page: 0,
        limit: 20,
        sort: {
            id: 'amount',
            desc: true
        }
    },
    filter: {
        amount: {
            from: 0,
            to: 1000000
        },
        KID: "",
        donor: "",
        statuses: []
    }
}

export const avtaleGiroReducer = (state = defaultAvtaleGiroAgreementState, action: any): AvtaleGiroAgreementsState => {

    // Fetch multiple agreements
    if(isType(action, fetchAvtaleGiroAgreementsAction.done)) {
        return {
            ...state,
            loading: false,
            agreements: action.payload.result.rows,
            pages: action.payload.result.pages
        }
    }
    else if (isType(action, fetchAvtaleGiroAgreementsAction.started)) {
        return { ...state, loading: true }
    }
    else if (isType(action, fetchAvtaleGiroAgreementsAction.failed)) {
        return { ...state, loading: false }
    }

    /*

    // Fetch single agreement
    if(isType(action, fetchVippsAgreementAction.done)) {
        return {
            ...state,
            currentAgreement: action.payload.result,
            loading: false
        }
    }
    else if (isType(action, fetchVippsAgreementAction.started)) {
        return { ...state, loading: true }
    }
    else if (isType(action, fetchVippsAgreementAction.failed)) {
        return { ...state, loading: false }
    }
    */

    // Fetch agreement report
    if(isType(action, fetchAvtaleGiroReportAction.done)) {
        return {
            ...state,
            loading: false,
            ...action.payload.result
        }
    }
    else if (isType(action, fetchAvtaleGiroReportAction.started)) {
        return { ...state, loading: true }
    }
    else if (isType(action, fetchAvtaleGiroReportAction.failed)) {
        return { ...state, loading: false }
    }


    /**
     * PAGINATION ACTIONS
    */
    switch(action.type) {
        case SET_AVTALEGIRO_PAGINATION:
            return { ...state, pagination: action.payload }
    }

    /**
     * FILTER ACTIONS
    */


    
    if (isType(action, fetchAvtaleGiroHistogramAction.done)) {
        return {
            ...state,
            histogram: action.payload.result
        }
    } else if (isType(action, fetchAvtaleGiroHistogramAction.failed)) {
        toastError("Failed to fetch AvtaleGiro histogram", action.payload.error.message)
    }

    switch(action.type) {
        case SET_AVTALEGIRO_FILTER_AMOUNT:
            return {...state, pagination: { ...state.pagination, page: 0 }, filter: { ...state.filter, amount: action.payload }}
        case SET_AVTALEGIRO_FILTER_DONOR:
            return {...state, pagination: { ...state.pagination, page: 0 }, filter: { ...state.filter, donor: action.payload }}
        case SET_AVTALEGIRO_FILTER_ACTIVE:
            return {...state, pagination: { ...state.pagination, page: 0 }, filter: { ...state.filter, statuses: action.payload }}
        case SET_AVTALEGIRO_FILTER_KID:
            return {...state, pagination: { ...state.pagination, page: 0 }, filter: {...state.filter, KID: action.payload}}
    }

    return state;
}