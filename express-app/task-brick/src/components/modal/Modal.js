import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1050 }}>
      <button onClick={onClose}>Close</button>
      {children}
    </div>,
    modalRoot
  );
};

export default Modal;
