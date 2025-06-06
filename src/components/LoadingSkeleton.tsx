"use client";
import React from "react";
import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  type?: "skills" | "projects" | "portfolio" | "profile";
  count?: number;
}

export default function LoadingSkeleton({
  type = "skills",
  count = 6,
}: LoadingSkeletonProps) {
  const pulseVariants = {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (type === "profile") {
    return (
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Image Skeleton */}
        <motion.div
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto"
          variants={pulseVariants}
          animate="pulse"
        />

        {/* Name Skeleton */}
        <motion.div
          className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-md mx-auto"
          variants={pulseVariants}
          animate="pulse"
        />

        {/* Title Skeleton */}
        <motion.div
          className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-sm mx-auto"
          variants={pulseVariants}
          animate="pulse"
        />

        {/* Bio Skeleton */}
        <div className="space-y-2 max-w-lg mx-auto">
          <motion.div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
            variants={pulseVariants}
            animate="pulse"
          />
          <motion.div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mx-auto"
            variants={pulseVariants}
            animate="pulse"
          />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-4 justify-center">
          <motion.div
            className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"
            variants={pulseVariants}
            animate="pulse"
          />
          <motion.div
            className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"
            variants={pulseVariants}
            animate="pulse"
          />
        </div>
      </motion.div>
    );
  }

  if (type === "skills") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"
            variants={pulseVariants}
            animate="pulse"
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (type === "projects") {
    return (
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 space-y-4"
            variants={pulseVariants}
            animate="pulse"
            transition={{ delay: index * 0.1 }}
          >
            {/* Title */}
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
            </div>

            {/* Tech Stack */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="h-6 w-14 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "portfolio") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden"
            variants={pulseVariants}
            animate="pulse"
            transition={{ delay: index * 0.1 }}
          >
            {/* Image */}
            <div className="aspect-video bg-gray-300 dark:bg-gray-600" />

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}
