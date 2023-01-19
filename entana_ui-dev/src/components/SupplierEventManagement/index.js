import moment from "moment";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";


export default function SupplierEventManagement() {

  const localizer = momentLocalizer(moment);

  const myEventsList = [
    {
      start: new Date(),
      end: new Date(),
      title: "special event",
      color: 'red'
    },
    {
      start: '2022/04/17',
      end: '2022/04/17',
      title: "event",
      className: 'event-handler'
    }
  ];

  return (
    <div className="srm-calender">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  )
}
