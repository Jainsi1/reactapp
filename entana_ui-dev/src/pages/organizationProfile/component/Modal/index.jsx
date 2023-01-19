import PictureModal from "./PictureModal";
import ProfileModal from './ProfileModal';

import { ProfileContext } from "pages/organizationProfile"
import { useContext } from "react"

export const PROFILE = 'profile'
export const PICTURE = 'picture'
export const CLOSE = ''

export function modalReducer(state, action) {
    switch (action.type) {
        case PROFILE:
            return PROFILE
        case PICTURE:
            return PICTURE
        case CLOSE:
            return CLOSE
        default :
            return CLOSE
    }
}

export default function EditorModal(props) {
    const { modal, dispatch } = props
    const data = useContext(ProfileContext)

    let Modal = ''
    if (modal === PICTURE) { Modal = PictureModal }
    else { Modal = ProfileModal }

    return (
        <Modal
            data={data}
            closeModal={() => dispatch({type : CLOSE})}
            visible={modal != CLOSE}
        />
    )
}