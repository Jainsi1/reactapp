import React from 'react';

const AddNewTaskBtn = React.forwardRef((props, ref) => {
    const { commodityId } = props

    function onAddNewTask() {
        ref.current.openDialog("Add", {
            status: "To do",
            priority: "Low",
            commodityId: commodityId,
        })
    }

    return (
        <button className="add-task-button" onClick={onAddNewTask}>
            Add new task
        </button>
    )
})

export default AddNewTaskBtn;