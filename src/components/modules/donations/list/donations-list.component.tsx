import React, { useEffect, useState } from 'react'
import ReactTable from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonationsAction, setDonationsPagination } from './donations-list.actions';
import { AppState } from '../../../../models/state';
import { shortDate } from '../../../../util/formatting';
import { DateTime } from 'luxon';
import { Redirect } from 'react-router';
import { DonationsFilterComponent } from './filters/filters.component';
import { DonationListWrapper } from './donations-list.component.style';

export const DonationsList: React.FunctionComponent = () => {
    const data = useSelector((state: AppState) => state.donations.donations)
    const pages = useSelector((state: AppState) => state.donations.pages)
    const loading = useSelector((state: AppState) => state.donations.loading)
    const pagination = useSelector((state: AppState) => state.donations.pagination)
    const filter = useSelector((state: AppState) => state.donations.filter)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDonationsAction.started());
    }, [pagination, filter, dispatch])

    const columnDefinitions = [
        {
            Header: "ID",
            accessor: "id"
        },
        {
            Header: "Donor",
            accessor: "donor"
        },
        {
            Header: "Method",
            accessor: "paymentMethod"
        }, 
        {
            Header: "Sum",
            id: "sum",
            accessor: (res: any) => res.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        },
        {
            Header: "Transaction cost",
            accessor: "transactionCost"
        }, 
        {
            Header: "KID",
            accessor: "kid"
        },
        {
            Header: "Timestamp",
            id: "timestamp",
            accessor: (res:any) => shortDate(DateTime.fromISO(res.timestamp))
        }
    ]

    const defaultSorting = [
        {id: "timestamp", desc: true}
    ]

    let [donation, setDonation] = useState<number | null>(null);
    const trProps = (tableState: any, rowInfo: any) => {
        if (rowInfo && rowInfo.row) {
            return {
                onDoubleClick: (e: any) => {
                    setDonation(rowInfo.original.id)
                }
            }
        } 
        return {}
    }

    console.log(pagination.page)

    if (donation !== null) return (<Redirect to={`/donations/${donation}`}></Redirect>)
    return (
        <DonationListWrapper>
            <ReactTable
                manual
                data={data}
                page={pagination.page}
                pages={pages}
                pageSize={pagination.limit}
                loading={loading}
                columns={columnDefinitions}
                defaultSorted={defaultSorting}
                onPageChange={(page) => dispatch(setDonationsPagination({ ...pagination, page }))}
                onSortedChange={(sorted) => dispatch(setDonationsPagination({ ...pagination, sort: sorted[0] }))}
                onPageSizeChange={(pagesize) => dispatch(setDonationsPagination({ ...pagination, limit: pagesize }))}
                renderCurrentPage={(page) => { console.log('Render', page) }}
                getTrProps={trProps}
                />

            <DonationsFilterComponent></DonationsFilterComponent>
        </DonationListWrapper>
    )
}