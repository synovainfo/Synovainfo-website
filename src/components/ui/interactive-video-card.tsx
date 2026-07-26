"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { VideoModal } from "@/components/ui/video-modal";

interface InteractiveVideoCardProps {
  title: string;
  category: string;
  duration?: string;
  posterSrc: string;
  videoSrc: string;
  description: string;
  badge?: string;
}

export function InteractiveVideoCard({
  title,
  category,
  duration = "2:30",
  posterSrc,
  videoSrc,
  description,
  badge = "HD DEMO",
}: InteractiveVideoCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => setModalOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 dark:bg-zinc-900"
      >
        {/* Poster Media */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
          <Image
            src={posterSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md border border-amber-500/30">
            <Sparkles size={12} />
            <span>{badge}</span>
          </div>

          {/* Duration */}
          <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
            {duration}
          </div>

          {/* Animated Play Button Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30 transition-colors group-hover:bg-amber-400"
            >
              <Play size={24} className="ml-1 fill-zinc-950" />
            </motion.div>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {category}
          </div>
          <h4 className="mt-1 text-lg font-bold text-white transition-colors group-hover:text-amber-400">
            {title}
          </h4>
          <p className="mt-2 text-xs line-clamp-2 text-zinc-400">
            {description}
          </p>
        </div>
      </motion.div>

      {/* Modal Popup */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        title={title}
        description={description}
      />
    </>
  );
}
