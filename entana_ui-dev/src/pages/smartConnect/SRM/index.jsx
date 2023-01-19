import React, { useState, createContext } from "react";
import PageHeader from "components/PageHeader";

// import SupplierEventManagement from "components/SupplierEventManagement";
// import Graph from "components/Graph";
// import SRMTable from "./components/SRMTable";
import SRMQBRScoreCard from "./components/SRMQBRScoreCard";
import OrganizationList from "./components/OrganizationList";
import { Col } from 'antd'

import "./srm.css";
import "swiper/css";
import "swiper/css/navigation";
import SRMDropdown from "./components/SRMDropdown";
import SupplierDropdown from "./components/SupplierDropdown";

import { useCommoditySuppliers, useEOLRiskItems, useInitiatives } from "./hook";
import CustomTableCard, { EOLTableCard } from "./components/SRMTable";

export const SRMContext = createContext({})

const useSRMContext = (commodity) => {
  const commodityIds = commodity.map((c) => c.id).join(",");

  const [suppliers] = useCommoditySuppliers(commodityIds);
  const [eolRiskItemsMap] = useEOLRiskItems(commodityIds);
  const [currentSupplier, selectSupplier] = useState();
  const [initiativeDataMap, getInitiativesByCommodity] = useInitiatives(commodityIds);
  const [visibleSuppliers, setVisibleSuppliers] = useState([]);

  const value = {
    commodity,
    currentSupplier,
    eolRiskItemsMap,
    initiativeDataMap,
    suppliers,
    visibleSuppliers
  }

  return [value, { selectSupplier, getInitiativesByCommodity, setVisibleSuppliers }]
}

const SRM = () => {
  const [commodity, setCommodity] = useState([]);
  const [visible, setVisible] = useState({});
  const [state, { selectSupplier, setVisibleSuppliers }] = useSRMContext(commodity);

  const { currentSupplier } = state;

  return (
    <>
      <SRMContext.Provider value={state}>
        <PageHeader
          title="Smart Connect"
          setSelectedCommodities={setCommodity}
        >
          <Col className="dashboard-dropdown-smartconnect">
            <div>
              <SupplierDropdown
                setVisibleSuppliers={setVisibleSuppliers}
              />
            </div>
          </Col>
          <Col className="dashboard-dropdown-smartconnect">
            <div><SRMDropdown setVisible={setVisible}/></div>
          </Col>
        </PageHeader>

        <OrganizationList selectSupplier={selectSupplier}/>
        <br/>
        {visible.QBR && currentSupplier && <SRMQBRScoreCard currentSupplier={currentSupplier}/>}
        {visible.RTB && currentSupplier && <CustomTableCard title="Run The Business" filter="RTB"/>}
        {visible.CTB && currentSupplier && <CustomTableCard title="Change The Business" filter="CTB"/>}
        {visible.EOL && currentSupplier && <EOLTableCard title="EOL Risk" filter="EOL"/>}
      </SRMContext.Provider>
      {/* <br />

       {eventManagementVisibility && <SupplierEventManagement />}
       {orgHierarchyVisibility &&  <Graph />}
       */}
    </>
  );
};

export default SRM;
