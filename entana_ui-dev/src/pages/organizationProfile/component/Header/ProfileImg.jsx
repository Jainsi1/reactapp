import { ProfileContext } from "pages/organizationProfile"
import { useContext } from "react"
import { Col } from "antd"

const ProfileImageEdit = (props) => {
    const { dispatch, action } = props
  
    return (
      <div className={"absolute right-5"} >
        <span className={"cursor-pointer"} onClick={() => dispatch(action)}>
          Edit
        </span>
      </div>
    )
  }
  
  const ProfileImg = ({ imgSrc }) => {
  
    return (
      <>
        {
          imgSrc ?
            <img className="Samsung-Logo" width="45%" src={imgSrc} alt="Samsung" /> :
            <span className="ant-avatar no-image" />
        }
      </>
  
    )
  }
  
  
  export default function ProfileImgCol (props) {
    const { isCurrent, image } = useContext(ProfileContext)
    
    return (
      <Col xs={24} md={6}>
        <div className={"w-full text-center"}>
          {isCurrent && <ProfileImageEdit {...props} />}
          <ProfileImg imgSrc={image} />
        </div>
      </Col>
    )
  }