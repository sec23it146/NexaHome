import { X } from "lucide-react";

const Modal = ({ title, children, onClose }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal-panel">
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-btn" onClick={onClose} title="Close"><X size={18} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
