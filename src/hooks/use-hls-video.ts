'use client'

import { useEffect, type RefObject } from 'react'
import Hls from 'hls.js'

/**
 * Attaches an HLS stream to a <video> element with a Safari native-HLS fallback.
 *
 * `enableWorker: false` is set explicitly so playback stays stable in sandboxed
 * environments where Web Workers are unavailable.
 *
 * Respects `prefers-reduced-motion`: autoplay is skipped for users who opt out.
 */
export function useHlsVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  streamUrl: string,
): void {
  useEffect(() => {
    let hls: Hls | null = null
    const video = videoRef.current
    if (!video) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const attemptPlay = () => {
      if (prefersReducedMotion) return
      video.play().catch((error: unknown) => {
        console.warn('HLS autoplay prevented:', error)
      })
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: false,
      })
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, attemptPlay)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
      video.addEventListener('loadedmetadata', attemptPlay)
    }

    return () => {
      if (hls) {
        hls.destroy()
      } else {
        video.removeEventListener('loadedmetadata', attemptPlay)
      }
    }
  }, [videoRef, streamUrl])
}
