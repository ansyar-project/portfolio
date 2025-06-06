"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
};

export default function PortofolioCard({ items }: { items: PortfolioItem[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (!items || items.length === 0) return null;

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };
  return (
    <>
      <section id="portfolio" className="px-2" ref={ref}>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500"
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating Particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/30 rounded-full animate-float" />
              <div className="absolute bottom-6 left-4 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-float-delayed" />

              {/* Image with Advanced Overlay */}
              {item.image && (
                <motion.div
                  className="relative overflow-hidden aspect-video cursor-pointer"
                  onClick={() => openLightbox(item.image!)}
                  variants={imageVariants}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Overlay with Modern Design */}
                  <motion.div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
                    variants={overlayVariants}
                    initial="hidden"
                    whileHover="visible"
                  >
                    <div className="text-white text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </motion.div>
                      <span className="text-lg font-semibold">View Image</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Content with Modern Design */}
              <div className="relative z-10 p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors duration-300 flex-1">
                    {item.title}
                  </h3>
                  {item.link && (
                    <motion.a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 group/btn shrink-0"
                      aria-label={`View ${item.title} project`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-5 h-5 text-purple-300 group-hover/btn:text-purple-200 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </motion.a>
                  )}
                </div>

                <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modern Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />

            <motion.div
              className="relative max-w-6xl max-h-full z-10"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeLightbox}
                className="absolute -top-16 right-0 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:text-purple-300 hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-20"
                aria-label="Close lightbox"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* Image Container */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-2 overflow-hidden"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Image
                  src={selectedImage}
                  alt="Portfolio item"
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
