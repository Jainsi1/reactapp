import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_INITIATIVES, GET_BUYERS } from './graphql/query';
import { GET_QBR_SCORE, GET_QUARTERS } from 'pages/smartConnect/SRM/components/SRMQBRScoreCard/graphql/query';
import Loader from 'components/loaders/Loader';
import Page404 from 'components/Page404';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Virtual, Navigation, Pagination } from 'swiper';
import CRMCard from 'pages/smartConnect/CRM/components/CRMCard';
import BusinessTableCard from 'components/TableCard/BusinessTableCard';
import { getOrganizationId } from 'utils/user';
import DashboardCard from 'components/DashboardCard';
import GradientChart from 'components/Chart/GradientChart';
import { Col } from 'antd';

import "./crm.css"

const organization = getOrganizationId(); 

SwiperCore.use([Virtual, Navigation, Pagination]);

const CRM = () => {
  const [initiativesData, setInitiativesData] = useState(undefined);
  const [selectedCommodity, setSelectedCommodity] = useState(undefined);
  const { data: buyers, loading: buyersLoading, error: buyersError } = useQuery(GET_BUYERS, {
    fetchPolicy: 'network-only'
  });
  const { data, loading, error, refetch } = useQuery(GET_INITIATIVES, {
    fetchPolicy: 'network-only'
  });
  const {data: qbrData, loading: qbrLoading, error: qbrError} = useQuery(GET_QBR_SCORE, {
    variables: {
      data: {
        commodity_id: selectedCommodity,
        organization_id: organization,
        quarter_id: 3
      }
    },
    fetchPolicy: "network-only",
    skip: !selectedCommodity
  });

  const {data: quarters} = useQuery(GET_QUARTERS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const initiatives = {};
    if (data && buyers) {
      buyers?.getBuyers?.forEach(buyer => {
        const buyerCommodities = buyer.commodities;
        buyerCommodities.forEach(commodity => {
          initiatives[commodity.id] = {
            organizationId: buyer.id,
            organizationName: buyer.name,
            commodityName: commodity.name,
            initiatives: []
          };
        })
      });
      
      data?.getInitiatives?.map(initiative => {
        const commodityId = initiative.commodityId;
        initiatives[commodityId].initiatives.push(initiative);
      });
    }
    setInitiativesData(initiatives);
  }, [data, buyers]);
  
  useEffect(() => {
    if (!selectedCommodity && !!initiativesData) {
      setSelectedCommodity(Object.keys(initiativesData)[0]);
    }
  }, [initiativesData]);

  if (loading || buyersLoading)
    return (
      <>
        <Loader />
      </>
    );

  if (error || buyersError)
    return (
      <>
        <Page404 error={error ? error : buyersError} />
      </>
    );
  
  const RunBusinessData = initiativesData[selectedCommodity]?.initiatives
    ?.filter((obj) => obj.type === "RTB")
    ?.map((initiative) => {
      return {
        no: initiative.id,
        title: initiative.title,
        plan: initiative.plan,
        businessObjective: initiative.businessObjective,
        expectedBenefit: initiative.expectedBenefit,
        current: initiative.current,
        numTasks: initiative.numTasks,
        lead: ``
      };
    });

  const ChangeBusinessData = initiativesData[selectedCommodity]?.initiatives
    ?.filter((obj) => obj.type === "CTB")
    ?.map((initiative) => {
      return {
        no: initiative.id,
        title: initiative.title,
        plan: initiative.plan,
        businessObjective: initiative.businessObjective,
        expectedBenefit: initiative.expectedBenefit,
        current: initiative.current,
        numTasks: initiative.numTasks,
        lead: ``
      };
    });

  const renderTiles = () => {
    const tiles = [];
    Object.entries(initiativesData)?.forEach(([key, value]) => {
      const title = value.organizationName + " - " + value.commodityName;
      const initiativesCount = value.initiatives.length;
      tiles.push(
        <SwiperSlide key={key} >
          <CRMCard
            heading={title}
            initiativesCount={initiativesCount}
            onCardClicked={() => {
              setSelectedCommodity(key);
            }}
            selected={key === selectedCommodity}
          />
        </SwiperSlide>
      );
    })
    return tiles;
  }

  const renderRTB = () => {
    return (
      <div className="table-main-card">
        <BusinessTableCard
          title="Run The Business"
          data={RunBusinessData}
          selectedCommodity={selectedCommodity}
          relatedOrg={organization}
          onInitiativesChanged={refetch}
        />
      </div>
    );
  };

  const renderCTB = () => {
    return (
      <div className="table-main-card">
        <BusinessTableCard
          title="Change The Business"
          data={ChangeBusinessData}
          selectedCommodity={selectedCommodity}
          relatedOrg={organization}
          onInitiativesChanged={refetch}
        />
      </div>
    );
  };  

  const mapDataToBarChart = (data) => {

    let t = [
      ["Commodity", "COST", "COS", "QUALITY", "ENGINEERING", "SERVICES", "SUSTAINABILTIY"],
    ];

    const bars = t[0].slice(1, 7);

    data = JSON.parse(JSON.stringify(data.getQbrScore.trends))

    for (let item of data) {
      let arr = [item.name];

      for (let bar of bars) {
        arr.push(item.bars[bar] || 0)
      }

      t.push(arr)
    }

    return t;
  }

  const renderQbrTile = () => {
    return (
      <Col md={8} style={{ marginTop: '20px', background: "white"}}>
        <DashboardCard
          title={"SCORE TREND"}
          extra={qbrData?.getQbrScore?.trends?.length ?
            <GradientChart key="qbr-scoring" data={mapDataToBarChart(qbrData)}/> :
            <h4>Not enough data</h4>
          }
        />
      </Col>
    );
  };
  
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={30}
      centeredSlides={false}
      modules={[Pagination]}
      className="mySwiper"
      slideToClickedSlide={true}
    >
      {renderTiles()}
      {renderQbrTile()}
      {selectedCommodity && (
        renderRTB()
      )}
      {selectedCommodity && (
        renderCTB()
      )}
    </Swiper>
  );
}

export default CRM;