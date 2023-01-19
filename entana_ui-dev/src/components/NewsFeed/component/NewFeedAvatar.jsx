
import { Popover } from 'antd';
import { Avatar } from 'antd';
import { Tooltip } from 'antd';

const NewFeedAvatar = ({ src, hoverText, size }) => {
    return (
        <Popover
            title={hoverText}
            placement="topLeft"
            trigger="hover"
        >
            <Avatar 
                className="tw-w-full tw-h-full tw-rounded-full avatar-hover" 
                src={src} 
                size={size} />
        </Popover>
    )
}

export default NewFeedAvatar;