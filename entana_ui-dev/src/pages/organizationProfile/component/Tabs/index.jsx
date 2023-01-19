import { ProfileContext } from "pages/organizationProfile"
import { Tabs, Row } from "antd";
import { useContext } from 'react';
import AboutTab from "./AboutTab";
import ProductTab from "./ProductTab";
import NewsFeed from "components/NewsFeed/NewsFeed";
import LocationTab from "./LocationTab";
import CapacityTab from "./CapacityTab";
import CertificationTab from "./CertificationTab";
import ServiceTab from "./ServiceTab";
import ContactTab from "./ContactTab";
import { MdOutlinePublic } from 'react-icons/md';
import { HiLockOpen, HiLockClosed } from 'react-icons/hi'

export default function OrganizationTabsRow() {

  const data = useContext(ProfileContext);


  const { hasSuppliers, supplierCommodities, isCurrent, id, factories, services, permissions } = data;

  // NOTE : Ant Design do not support dynamic render on Childrent Tab, which mean this 
  // {tabs.map((props, idx) => <CustomTab key={idx} keyTab={idx} {...props} />)}
  // will not render the tab conents
  // We have hard code the Tab.TabPane 
  return (

    <Row>
      <Tabs defaultActiveKey="1" className={"w-full"}>
        <Tabs.TabPane tab="About" key="1">
          <AboutTab
            organization={data}
            hasSuppliers={hasSuppliers}
            permissions={permissions}
          />
        </Tabs.TabPane>

        {
          hasSuppliers &&
          <Tabs.TabPane tab="Product" key="2">
            <ProductTab
              organizationId={id}
              commodities={supplierCommodities}
            />
          </Tabs.TabPane>
        }

        <Tabs.TabPane tab="News Feed" key="3" style={{ width: "50%" }}>
          <NewsFeed
            organizationId={parseInt(id)}
            hideCreatePost={!isCurrent}
          />
        </Tabs.TabPane>
        {
          hasSuppliers && (
            <>
              <Tabs.TabPane tab="Service" key="4">
                <ServiceTab services={services} />
              </Tabs.TabPane>

              <Tabs.TabPane tab={<TabName tab="Supply Chain" permission={permissions?.locationPermission} />} key="5" disabled={!!!permissions?.locationPermission?.allow} >
                <LocationTab factories={factories} />
              </Tabs.TabPane>

              <Tabs.TabPane tab={<TabName tab="Factory Capacity" permission={permissions?.capacityPermission} />} key="6" disabled={!!!permissions?.capacityPermission?.allow} >
                <CapacityTab factories={factories} />
              </Tabs.TabPane>

              <Tabs.TabPane tab={<TabName tab="Certifications" permission={permissions?.certificationPermission} />} key="7" disabled={!!!permissions?.certificationPermission?.allow} >
                <CertificationTab factories={factories} />
              </Tabs.TabPane>
            </>
          )
        }


        <Tabs.TabPane tab="Contact" key="9">
          <ContactTab />
        </Tabs.TabPane>
      </Tabs>
    </Row>
  )
}

const PermissionIcon = ({permission}) => {
  switch (permission) {
    case "PROTECTED":
      return <HiLockOpen />
    case "PRIVATE":
      return <HiLockClosed />
    default :
      return <MdOutlinePublic />
  }
}

const TabName = (props) => {
  const { tab, permission } = props

    return (
      <div className={"flex gap-1 items-center"}>
        <span>{tab}</span>
        <PermissionIcon permission={permission.boundary} />
      </div>
    )
}