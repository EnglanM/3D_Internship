import { Controller, animated, config, useTrail } from "@react-spring/web";
import React from "react";

interface LoadingOverlayProps {
  show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = (props) => {
  const [isDoneFading, setIsDoneFading] = React.useState(false);

  const fadeOutController = new Controller({
    from: { opacity: 1 },
  });

  React.useEffect(() => {
    if (props.show) return;

    fadeOutController.start({
      opacity: 0,
      onRest: () => setIsDoneFading(true),
    });

    return () => {
      fadeOutController.stop();
    };
  }, [props.show]);

  if (isDoneFading) return null;

  return (
    <animated.div
      style={fadeOutController.springs}
      className="bg-black fixed inset-0 w-full h-full flex items-center justify-center flex-col py-10 gap-2"
    >
      <span className="text-xs font-bold text-white opacity-30 tracking-widest">
        JUMP CRIB v1.0
      </span>
      <span className="text-white text-4xl font-black uppercase tracking-widest animate-pulse">
        Loading
      </span>
    </animated.div>
  );
};

export default LoadingOverlay;
