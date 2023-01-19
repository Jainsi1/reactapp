import { Swiper, SwiperSlide } from "swiper/react";
import SRMCard from "../SRMCard";
import SwiperCore, { Virtual, Navigation, Pagination } from "swiper";
import { useContext, useEffect, } from "react";


import { SRMContext } from "pages/smartConnect/SRM";

SwiperCore.use([Virtual, Navigation, Pagination]);


export default function OrganizationList(props) {

  const { selectSupplier } = props;

  const {
    currentSupplier,
    suppliers,
    visibleSuppliers,
    commodity,
    initiativeDataMap,
    eolRiskItemsMap
  } = useContext(SRMContext)

  console.log("OrganizationList", { currentSupplier, suppliers, visibleSuppliers })

  useEffect(() => {
    if (suppliers) {
      selectSupplier(suppliers[ 0 ])
    }
  }, [suppliers])

  return (
    <>
      {suppliers.length ?
        (
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            centeredSlides={false}
            modules={[Pagination]}
            className="mySwiper"
            slideToClickedSlide={true}
          >
            {
              suppliers
                ?.filter(e => visibleSuppliers.includes(e.id))
                ?.map((record, idx) => {
                  console.log(idx)
                  const { id, name, commodityId, subInfoNumber } = record;
                  return (
                    <SwiperSlide key={idx}>
                      <SRMCard
                        key={idx}
                        id={record.id}
                        heading={name}
                        mainNumber={initiativeDataMap?.[ commodityId ]?.[ id ]?.length || 0}
                        mainInfoNumber={eolRiskItemsMap?.[ commodityId ]?.[ id ]?.length || 0}
                        subInfoNumber={subInfoNumber}
                        calNumber={"11/20/2022"}
                        subCalNumber={"12/16/2022"}
                        onCardClicked={() => { selectSupplier(record) }}
                        selected={currentSupplier && id === currentSupplier.id && commodityId == currentSupplier.commodityId}
                        commodity={commodity.filter(e => e.id == commodityId)[ 0 ]?.name}
                      />
                    </SwiperSlide>
                  );
                })
            }
          </Swiper>
        )
        : <h1>There are no suppliers with this commodity in the system. Please select a different commodity.</h1>
      }
    </>
  )
}