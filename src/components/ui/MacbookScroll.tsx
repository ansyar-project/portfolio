"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export const MacbookScroll = ({
  children,
  showGradient,
}: {
  children?: React.ReactNode;
  showGradient?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-[200vh] flex flex-col items-center py-0 md:py-80 justify-start flex-shrink-0 [perspective:800px] transform md:scale-100 scale-[0.35] sm:scale-50"
    >
      <motion.div
        initial={{
          transform: "translateY(-100px) rotateX(45deg) scale(0.8)",
          opacity: 0,
        }}
        animate={{
          transform: "translateY(0px) rotateX(0deg) scale(1)",
          opacity: 1,
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="max-w-5xl -mt-12 mx-auto w-full relative p-2 md:p-8"
      >
        <div
          className={cn(
            "w-full relative rounded-2xl p-2 md:p-8 bg-[#0B0B0F] dark:bg-[#0B0B0F]",
            showGradient &&
              "bg-gradient-to-br from-purple-700 via-violet-800 to-blue-800"
          )}
        >
          <div className="absolute inset-0 rounded-2xl bg-white/[0.08] p-[1px]">
            <div className="absolute inset-[1px] rounded-2xl bg-black/40 backdrop-blur-xl" />
          </div>
          <div className="relative bg-gray-900 dark:bg-gray-900 rounded-xl p-2">
            <div className="flex items-center justify-center space-x-2 py-4">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-black rounded-lg min-h-[40vh] md:min-h-[70vh] overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
