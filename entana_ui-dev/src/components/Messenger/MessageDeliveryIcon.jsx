import doubleTick from 'assets/images/doubleTick.svg'
import doubleTickBlue from 'assets/images/doubleTickBlue.svg'
import clock from 'assets/images/clock.svg'
import singleTick from 'assets/images/single-tick.svg'

const MessageDeliveryIcon = ({ delivered_at, seen_at, created_at }) => {
  const getDeliveredIcon = () => {
    if (delivered_at && !seen_at) {
      return doubleTick;
    } else if (delivered_at && seen_at) {
      return doubleTickBlue
    } else if ( !created_at) {
      return clock
    } else {
      return singleTick
    }
  }

  return (
    <img style={{ marginLeft: "4px" }} src={getDeliveredIcon()} width={14} height={14}/>
  )
}
export default MessageDeliveryIcon