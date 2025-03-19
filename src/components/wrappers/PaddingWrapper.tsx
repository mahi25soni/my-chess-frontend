import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PaddingWrapper({ children }: Props) {
  return <div className="p-8">{children}</div>;
}
