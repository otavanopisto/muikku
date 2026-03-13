import React, { useState } from "react";
import ReactDOM from "react-dom";

interface EventPortalProps {
  children: React.ReactNode;
  title: React.ReactNode;
  description: string;
  type: string;
  startDate: Date;
  endDate: Date;
  onRemove: () => void;
}

export const EventPortal: React.FC<EventPortalProps> = ({
  children,
  title,
  description,
  type,
  startDate,
  endDate,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRemove = () => {
    onRemove();
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className="event-portal-overlay"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="event-portal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{title}</h2>
              <p className="description">{description}</p>
              <p className="type">
                <strong>Type:</strong> {type}
              </p>
              <p className="dates">
                <strong>Dates:</strong> {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </p>
              <button onClick={handleRemove} className="remove-btn">
                Remove
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EventPortal;
