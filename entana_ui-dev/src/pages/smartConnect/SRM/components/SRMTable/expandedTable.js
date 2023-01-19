import React from 'react';
import { Table } from 'antd';
import Widget from 'components/Widget'

const ExpandedTable = ({ data = [], columns = [] }) => {
    return (
        <Widget>
            <Table className ='expanded-table'columns={columns} dataSource={data} size="small" scroll={{ x: true }} />
        </Widget>
    )
}

export default ExpandedTable;