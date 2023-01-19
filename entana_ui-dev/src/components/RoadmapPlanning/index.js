import React from 'react';
import "swiper/css";
import "swiper/css/navigation";
import "modules/Kanban/task.css";

const RoadmapPlanning = ({ Id, name, priority }) => {
    
  return (
    <div>
      <div className="e-card-header">
        <div className="e-card-header-caption">
            <div className="e-card-header-title e-tooltip-text">{name}</div>
        </div>
      </div>
      <div className="e-card-footer">
      {priority && (
        <div className={`task-priority task-priority-${priority.toLowerCase()}`}>
          <span className="task-priority-text">{priority}</span>
        </div>
      )
      }
      </div>
    </div>
  )
}

export default RoadmapPlanning