import Cube from 'assets/images/cubes-solid.svg';

import { Row, Col } from "antd";

import DashboardStatics from './DashboardStatics';

import { GET_SUPPLY_INFO, GET_SUPPLY_INFO_STATUS } from 'pages/SupplyIqPcr/graphql/query';

import WithRequestData from 'components/RequestWrapper'

import Accept from './asset/PCR_Accept.svg';
import Reject from './asset/PCR_Reject.svg';
import NoReply from './asset/PCR_noreply.svg';
import { Tooltip } from "antd";

const SUPPLIER_LIMIT = 2;
const SUPPLIER_NAME_LIMIT = 15;

export default function SupplyPcrWidget(props) {

    const { selectedCommodity } = props;

    return (
        <WithRequestData
            query={GET_SUPPLY_INFO_STATUS}
            variables={{ commodityIds: selectedCommodity.map((commodity) => commodity.id) }}
        >
            {
                ({ data }) => <SupplyPcrWidgetContent data={data} />
            }
        </WithRequestData>
    )
}

const SupplyPcrWidgetContent = (props) => {

    const { data } = props;


    const supplyInfoOrders = data?.getSupplyInfoStatus;
    const summaryInfo = supplyInfoOrders[0]
    const dataInfo = supplyInfoOrders.slice(1);

    function getCardHeader(orderInfo) {
        let header = 'N/A';

        if (!!orderInfo) {
            const accepted = orderInfo.accepted;
            return `${accepted} OF ${orderInfo.total} ACCEPTED`
        }
        return header;
    }


    return (
        <DashboardStatics
            title="Supply PCR status"
            header={getCardHeader(summaryInfo)}
            image={Cube}
            imageColor="cube-image"
            toolTip="Supply PCR status"
            extra={<SupplierInfo supplyInfoOrders={dataInfo} />}
        />
    )

};

const SupplierInfo = (props) => {

    const { supplyInfoOrders } = props;

    return (
        <span className="last-card-paragraph-highlight">
            <div className="product">
                {supplyInfoOrders.map((order, index) => <SupplyInfoRow key={index} order={order} />)}
            </div>
        </span>
    )
}

const SupplyInfoRow = (props) => {
    const { order } = props;

    return (
        <Row className="product-card">
            <Tooltip title={order.fullName}>
                <Col className="bold-text-product" >{order.shortName}</Col>
            </Tooltip>
            {/* <Col className="normal-text-product">{order.header}</Col> */}
            <Col className="normal-text-product">
                {order?.accepted} {" "}
                <img style={{ width: "15px" }} src={Accept} /> {", "}
                {order?.rejected} {" "}
                <img style={{ width: "15px" }} src={Reject} /> {", "}
                {order?.noResponse} {" "}
                <img style={{ width: "15px" }} src={NoReply} />
            </Col>
        </Row>
    )
}

