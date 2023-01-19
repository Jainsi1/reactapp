import React, { useEffect, useState } from 'react'

import { useLazyQuery, useQuery } from "@apollo/client";

import Loader from "components/loaders/Loader";
import Page404 from "components/Page404";

export default function WithRequestData(props) {
    const { children, query, ...queryOptions } = props
    // @TODO: Should not be fetching all the tasks, need to add filter to tasks api

    const { data, loading, error, refetch } = useQuery(query, {
        fetchPolicy:"network-only",
        ...queryOptions,
    });

    if (loading) return <Loader />;
    if (error) return <Page404 error={error} />;

    return (
        <>
            {
                data && children({ data, refetch })
            }
        </>
    )
}
