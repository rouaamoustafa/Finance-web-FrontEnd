import React from "react";
import "../styling-sheet/FinanceTable.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
