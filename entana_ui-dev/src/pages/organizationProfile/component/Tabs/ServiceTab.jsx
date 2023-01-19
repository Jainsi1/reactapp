import { CardWithTitle, ProductList } from './component/CustomCard'


export default function ServiceTab(props) {
    const { services } = props
    // const services = [
    //     {name : "CMC Milling"},
    //     {name : "CNC Turning"},
    //     {name : "Laser Engraving"},
    //     {name : "CNC Wire Cut"},
    // ]

    return (
        <CardWithTitle title={"Service"}>
            <ProductList products={services} isService={true} />
        </CardWithTitle>
    )
}
