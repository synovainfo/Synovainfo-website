"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Play, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  posterSrc?: string;
  title: string;
  description?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  posterSrc,
  title,
  description,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " ") {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 id="video-modal-title" className="text-lg font-bold text-white">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-zinc-400">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close video modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Player Container */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                src={videoSrc}
                poster={posterSrc}
                autoPlay
                playsInline
                className="h-full w-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4 opacity-90 transition-opacity hover:opacity-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    <Play size={18} className={isPlaying ? "fill-white" : ""} />
                  </button>
                  <button
                    onClick={toggleMute}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    aria-label="Fullscreen"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
