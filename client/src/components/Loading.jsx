import React from "react";
import { CircularProgress } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="grid place-items-center">
      <CircularProgress size="lg" aria-label="Cargand0..." />
    </div>
  );
};

export default Loading;
