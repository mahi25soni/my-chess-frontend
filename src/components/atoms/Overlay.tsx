import React from "react";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

export default function Overlay({ onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] "
      onClick={onClose}
    >
      {children}
    </div>
  );
}
