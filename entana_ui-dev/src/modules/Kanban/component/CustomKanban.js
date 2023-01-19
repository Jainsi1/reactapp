import {
    KanbanComponent,
    ColumnsDirective,
    ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import TaskCard from "components/TaskCard";
import KanbanDialogFormTemplate from "components/KanbanDialogTemplate/index.js";
import React from "react";

const CustomKanban = React.forwardRef((props, ref) => {
    const { onActionComplete, data } = props;

    return (
        <KanbanComponent
            ref={ref}
            actionComplete={onActionComplete}
            style={{ paddingTop: 10 }}
            id="kanban"
            keyField="status"
            dataSource={data}
            cardSettings={{
                template: TaskCard,
                headerField: "Id",
                contentField: "name",
                showHeader: false,
            }}
            dialogSettings={{
                template: KanbanDialogFormTemplate,
            }}
        >
            <ColumnsDirective>
                <ColumnDirective
                    headerText="To Do"
                    keyField="To do"
                    allowToggle={true}
                />
                <ColumnDirective
                    headerText="In Progress"
                    keyField="In progress"
                    allowToggle={true}
                />
                <ColumnDirective
                    headerText="Completed"
                    keyField="Completed"
                    allowToggle={true}
                />
            </ColumnsDirective>
        </KanbanComponent>
    )
})


export default CustomKanban