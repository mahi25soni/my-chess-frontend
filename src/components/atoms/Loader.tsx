"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

type Props = {};

function MainLoader({}: Props) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <motion.div
        className="relative flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Crown size={48} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function WaitingLoader() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-blue rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
            delay: i * 0.2, // Creates a wave effect
          }}
        />
      ))}
    </div>
  );
}

export { MainLoader, WaitingLoader };
