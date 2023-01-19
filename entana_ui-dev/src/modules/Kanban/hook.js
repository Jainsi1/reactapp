import { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import {
    useCreateTask,
    useDeleteTask,
    useUpdateTask,
} from "./graphql/mutation";


export const useKanbanHistory = () => {
    const [state, setState] = useImmer({
        current: undefined,
        previous: undefined,
    })

    function initiate(data) {
        setState(draft => {
            draft.previous = draft.current;
            draft.current = data;
        })
    }

    function undo() {
        setState(draft => {
            draft.current = draft.previous;
        })
    }

    function save() {
        setState(draft => {
            draft.previous = draft.current;
        })
    }

    return [state, { initiate, undo, save }]
}

export const useCommonidityFilter = (taskQueryData, kanbanFunc) => {
    const [selectedCommodity, setSelectedCommodity] = useState([]);

    function onCommodityChange(commodityId) {
        const commodityIds = commodityId.map(e => e.id)

        setSelectedCommodity(commodityId);

        const commodityTasks = taskQueryData.getTasks.tasks.filter(
            (e) => commodityIds.includes(e.commodityId)
        );

        const { initiate } = kanbanFunc
        initiate(commodityTasks);
    }

    useEffect(() => {
        onCommodityChange(selectedCommodity)
    }, [taskQueryData]);// eslint-disable-line react-hooks/exhaustive-deps

    return [selectedCommodity, onCommodityChange]
}

function getMutationData(data) {
    return {
        name: data.name,
        commodityId: data.commodityId,
        status: data.status,
        moduleType: data.moduleType || null,
        dueDate: data.dueDate || null,
        priority: data.priority,
        assignedUserId: data.assignedUserId,
    };
};

export const useKanbanUpdate = (kanbanFunc, refetch) => {
    const { undo } = kanbanFunc

    const createTask = useCreateTask();
    const deleteTask = useDeleteTask();
    const updateTask = useUpdateTask();


    function onActionComplete(event) {
        const { addedRecords, changedRecords, deletedRecords } = event;

        const eventRecord = addedRecords[0] || changedRecords[0] || deletedRecords[0] || null

        if (!!!eventRecord) {
            return;
        }

        console.log(eventRecord)

        const returnData = getMutationData(eventRecord);

        if (addedRecords[0]) {
            const variables = { data: returnData };

            createTask({ variables })
                .catch(undo)
                .finally(refetch)

        } else if (changedRecords[0]) {

            const variables = { data: returnData, where: { id: changedRecords[0].Id } }

            updateTask({ variables })
                .catch(undo)
                .finally(refetch)

        } else if (deletedRecords[0]) {

            const variables = { data: returnData, where: { id: deletedRecords[0].Id } }

            deleteTask({ variables })
                .catch(undo)
                .finally(refetch)
        }
    }



    return [onActionComplete]
}