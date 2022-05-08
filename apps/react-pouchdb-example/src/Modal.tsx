import React from "react";

export function Modal({
  open = false,
  onClose,
  children,
}: {
  open?: boolean;
  onClose(): void;
  children: React.ReactChild;
}): React.ReactElement {
  const className = open ? "modal is-active" : "modal";

  return (
    <div className={className}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">{children}</div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => onClose()}
      ></button>
    </div>
  );
}
