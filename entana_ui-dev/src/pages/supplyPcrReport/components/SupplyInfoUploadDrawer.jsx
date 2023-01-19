import React, { useState } from 'react';
// import Drawer from '@mui/material/Drawer';
import { Drawer, Table } from 'antd'
import { Button } from 'antd';
import { useUploadSupplyInfo } from 'pages/SupplyIqPcr/graphql/mutation';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import * as XLSX from "xlsx";
import WithRequestData from 'components/RequestWrapper';
import { getOrganizationId } from 'utils/user';
import { GET_VENDORS_BY_ORGANIZATION_ID } from '../graphql/query';
import { sleep } from 'utils/func';
import openNotification from 'utils/Notification';

const { Dragger } = Upload;



const EXCEL_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.template.macroEnabled.12',
    'application/vnd.ms-excel.addin.macroEnabled.12',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.apple.numbers'
]

const organizationId = getOrganizationId();
const ExcelUploader = (props) => {
    const { setFileData } = props;

    function processFileUpload(options) {
        const { onSuccess, onError, file } = options;
        if (!EXCEL_TYPES.includes(file.type)) {
            onError("WRONG FILE TYPE - ONLY EXCEL FILES ALLOWED");
            return;
        };

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: "buffer" });

            const wsname = wb.SheetNames[0];

            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws);
            if (data.find(record => !record["Industry Code"])) {

                onError("WRONG FILE FORMAT - PLEASE CHECK THE FILE AGAIN");
                return;
            }

            onSuccess(data);
        };

        fileReader.onerror = (error) => {
            onError(error);
        };


    }

    function handleFileInputChange(info) {

        const { status } = info.file;
        if (status === 'done') {

            // getBase64(info.file.originFileObj, async (file) => {
            //   // handle data base or parse logic here using file

            setFileData(info.file.response);
            console.log("🚀 ~ file: SupplyInfoUploadDrawer.jsx:80 ~ //getBase64 ~ info.file.response", info.file.response)

            // message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            setFileData([]);
            message.error(`${info.file.error}`);
        }
    }


    return (
        <Dragger
            name='file'
            multiple={false}
            maxCount={1}
            customRequest={processFileUpload}
            onChange={handleFileInputChange}
            className={" h-36"}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support EXCEL FILE format only
            </p>
        </Dragger >
    );

}

const DRAWER_PLACEMENT = 'right'
const DRAWER_WIDTH = 750


export default function ExcelUploadDrawerWrapper(props) {

    return (
        <WithRequestData query={GET_VENDORS_BY_ORGANIZATION_ID} variables={{ organizationId: parseInt(organizationId) }}>
            {({ data }) => (
                <ExcelUploadDrawer vendorIds={data?.getVendorsByOrganizationId.map(e => parseInt(e.vendorId))} {...props} />
            )}
        </WithRequestData>
    )
}


const ExcelUploadDrawer = (props) => {
    // TODO: REFACTOR THIS COMPONENT

    const { open, toggle, commodities, refetch, vendorIds } = props;
    const allCommodityName = commodities.map(commodity => commodity.name);



    const [fileData, setFileData] = useState([]);
    const uploadSupplyInfo = useUploadSupplyInfo();

    const commodityByName = {}

    for (const record of fileData) {
        if (commodityByName[record["Industry Code"]]) {
            commodityByName[record["Industry Code"]].push(record);
        } else {
            commodityByName[record["Industry Code"]] = [record]
        }
    }

    const unmatchRecord = []
    const matchVendor = {

    }
    const unmatchVendor = {

    }

    for (const commodityName of Object.keys(commodityByName)) {
        if (!allCommodityName.includes(commodityName)) {
            unmatchRecord.push({
                commodityName: commodityName,
                numRecords: commodityByName[commodityName].length,
                idx: unmatchRecord.length + 1
            })
        } else {
            for (const record of commodityByName[commodityName]) {
                if (!vendorIds.includes(record["Vendor"])) {
                    if (unmatchVendor[record["Vendor"]]) {
                        unmatchVendor[record["Vendor"]].push(record)
                    } else {
                        unmatchVendor[record["Vendor"]] = [record]
                    }

                } else {
                    if (matchVendor[commodityName]) {
                        matchVendor[commodityName].push(record)
                    } else {
                        matchVendor[commodityName] = [record]
                    }
                }
            }
        }
    }


    const unmatchVenderRecord = Object.entries(unmatchVendor).map(([vendorId, record], idx) => {
        return {
            vendorId: vendorId,
            numRecords: record.length,
            idx: idx + 1
        }
    })
    const matchRecord = Object.entries(matchVendor).map(([commodityName, record], idx) => {
        return {
            commodityName: commodityName,
            numRecords: record.length,
            idx: idx + 1
        }
    })


    async function uploadExcel() {
        if (matchRecord.length === 0) {
            message.error("No match commodity found");
            return;
        }
        openNotification("warn" ,"Upload in progress. We will notify you once complete")

        for (const matchCommodity of matchRecord) {
            const commodity = commodities.find(commodity => commodity.name === matchCommodity.commodityName);
            const commodityId = commodity.id;

            const records = matchVendor[matchCommodity.commodityName];
            console.log("🚀 ~ file: SupplyInfoUploadDrawer.jsx:212 ~ uploadExcel ~ records", records)


            const worksheet = XLSX.utils.json_to_sheet(records);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            const base64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

            try {
                message.loading("Uploading..." + matchCommodity.commodityName, 3)
                await uploadSupplyInfo(
                    {
                        variables: {
                            data:
                            {
                                commodityId: parseInt(commodityId),
                                file: base64
                            }
                        }
                    })

                setTimeout(() => {
                    message.success("Upload Success" + matchCommodity.commodityName)
                }, 500);

            } catch (err) {
                message.error("Error Uploading" + matchCommodity.commodityName)
                console.error(err);
            } 
        }
        refetch();

        setTimeout(() => {
            openNotification("success","Upload completed. You can view your records now.")
        }, 2000);

        setTimeout(() => {
            toggle(false);
        }, 2500);

    }


    return (

        <Drawer
            open={open}
            onClose={() => toggle(false)}
            title="Choose Excel File to Upload"
            width={DRAWER_WIDTH}
            placement={DRAWER_PLACEMENT}
            key={DRAWER_PLACEMENT}
            onRemove={() => setFileData([])}
            extra={
                <Button type='primary' onClick={uploadExcel}>
                    Upload to Database
                </Button>
            }
        >
            <div className={'flex flex-col gap-4'}>
                <ExcelUploader
                    setFileData={setFileData}
                />
                <CustomTable
                    title="Match Commodity in Excel: "
                    dataSource={matchRecord} />
                <CustomTable
                    title="Unknown Commodity With No Match in Database"
                    dataSource={unmatchRecord} />
                <CustomTable
                    title="Unmatch VendorID: "
                    type="vendor"
                    dataSource={unmatchVenderRecord}
                />
            </div>
        </Drawer >
    )
}

const CustomTable = (props) => {
    const { title, dataSource, type } = props;

    const columns = [
        { title: "#", dataIndex: 'idx' },
        type == 'vendor' ? { title: "Vendor Id", dataIndex: 'vendorId' } : { title: "Commodity Name", dataIndex: 'commodityName' },
        { title: "Number of Records", dataIndex: 'numRecords' },
    ]
    return (
        <>
            <h2 className='t-center'>{title}</h2>
            <Table dataSource={dataSource} columns={columns} />
        </>
    )
}

