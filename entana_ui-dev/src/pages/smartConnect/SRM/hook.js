import { useLazyQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";


import {
    GET_COMMODITY_SUPPLIERS,
    GET_INITIATIVES_BY_COMMODITY,
    GET_EOL_RISK_ITEMS,
} from "./graphql/query";




export const useCommoditySuppliers = (commodityIds) => {
    const [suppliersData, setSuppliersData] = useState([]);

    const [
        getCommoditySuppliers,
        {
            loading,
            error,
            data
        },
    ] = useLazyQuery(GET_COMMODITY_SUPPLIERS, { fetchPolicy: 'network-only' });

    useEffect(() => {
        if (commodityIds) {
            getCommoditySuppliers({
                variables: {
                    where: {
                        commodityIds: commodityIds,
                    },
                },
            });
        }
    }, [commodityIds])

    useEffect(() => {
        if (data) {
            const _suppliers = []

            data?.getCommoditySuppliers?.forEach((e) => {
                const supplyerCommodityId = e.commodityId
                e?.suppliers.forEach((record) => {
                    _suppliers.push({
                        commodityId: supplyerCommodityId,
                        ...record,
                    })
                })
            })

            setSuppliersData(_suppliers);
        } else if (error) {
            console.error(error);
        }
    }, [loading])


    return [suppliersData, getCommoditySuppliers]
}

export const useEOLRiskItems = (commodityIds) => {
    const [eolRiskItemsMap, setEolRiskItemsMap] = useState({});

    const [
        getEOLRiskItems,
        {
            loading,
            error,
            data,
        },
    ] = useLazyQuery(GET_EOL_RISK_ITEMS, { fetchPolicy: 'network-only' });



    useEffect(() => {
        // TEMPORARY APPROACH
        // REPEAT QUERY FOR EACH COMMODITY
        // NEED TO BE OPTIMIZED WITH BACKEND QUERY

        // for (const commodityId of listCommodityIds) {
        //     if (commodityId) {
        //         getEOLRiskItems({
        //             variables: {
        //                 commodityId: commodityId,
        //             },
        //         });
        //     }
        // }


        if (commodityIds && commodityIds.length > 0) {
            let listCommodityIds = commodityIds.split(',')
            getEOLRiskItems({
                variables: {
                    commodityIds: listCommodityIds,
                }
            })
        }

    }, [commodityIds])


    useEffect(() => {

        if (data) {
            const map = {};

            data.getEOLRiskItems?.forEach((item) => {
                if (item.commodityId in map && item.relatedOrgId in map[item.commodityId]) {

                    map[item.commodityId][item.relatedOrgId].push(
                        {
                            no: map[item.relatedOrgId].length + 1,
                            ...item,
                            isPor: !!item.isPor ? "Yes" : "No"
                        }
                    );
                } else if (item.commodityId in map) {
                    map[item.commodityId][item.relatedOrgId] = [];
                } else {
                    map[item.commodityId] = {};
                }
            });

            setEolRiskItemsMap({
                ...eolRiskItemsMap,
                ...map
            });
        }

        else if (error) {
            console.error(error);
        }

    }, [loading]);


    return [eolRiskItemsMap]
}

export const useInitiatives = (commodityIds) => {
    const [initiativesMap, setInitiativesMap] = useState({});

    const [
        getInitiativesByCommodity,
        {
            loading,
            error,
            data
        },
    ] = useLazyQuery(GET_INITIATIVES_BY_COMMODITY, { fetchPolicy: 'network-only' });

    useEffect(() => {
        // TEMPORARY APPROACH
        // REPEAT QUERY FOR EACH COMMODITY
        // NEED TO BE OPTIMIZED WITH BACKEND QUERY

        // for (const commodityId of listCommodityIds) {

        //     if (commodityId) {
        //         getInitiativesByCommodity({
        //             variables: {
        //                 commodityId: commodityId,
        //             },
        //         });
        //     }
        // }

        if (commodityIds && commodityIds.length > 0) {
            const listCommodityIds = commodityIds.split(',')

            getInitiativesByCommodity({
                variables: {
                    commodityIds: listCommodityIds,
                }
            })
        }

    }, [commodityIds])


    useEffect(() => {

        if (data) {
            const map = {};

            data.getInitiativesByCommodity?.forEach((initiative) => {

                if (initiative.commodityId in map && initiative.relatedOrgId in map[initiative.commodityId]) {
                    map[initiative.commodityId][initiative.relatedOrgId].push(initiative);
                } else if (initiative.commodityId in map) {
                    map[initiative.commodityId][initiative.relatedOrgId] = [initiative];
                } else {
                    map[initiative.commodityId] = {};
                    map[initiative.commodityId][initiative.relatedOrgId] = [initiative];
                }
            });

            setInitiativesMap({
                ...initiativesMap,
                ...map
            });
        }

        else if (error) {
            console.error(error);
        }

    }, [loading]);


    return [initiativesMap, getInitiativesByCommodity];
}