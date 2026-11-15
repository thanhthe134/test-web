import React from 'react';
import { ResilientImage } from '../ResilientImage';

export function getYouTubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
  }
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embedMatch?.[1]) {
    return trimmed;
  }
  return null;
}

export function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    Boolean(getYouTubeEmbedUrl(url))
  );
}

interface MediaStageViewProps {
  imageUrl: string;
  videoUrl?: string;
  alt: string;
  className?: string;
  controls?: boolean;
  autoPlayMuted?: boolean;
}

export const MediaStageView: React.FC<MediaStageViewProps> = ({
  imageUrl,
  videoUrl,
  alt,
  className = 'w-full h-full object-cover',
  controls = true,
  autoPlayMuted = false,
}) => {
  const trimmedVideo = videoUrl?.trim() || '';
  const youtubeEmbed = trimmedVideo ? getYouTubeEmbedUrl(trimmedVideo) : null;

  if (youtubeEmbed) {
    return (
      <iframe
        src={youtubeEmbed}
        title={alt}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (trimmedVideo) {
    return (
      <video
        src={trimmedVideo}
        poster={imageUrl || undefined}
        controls={controls}
        autoPlay={autoPlayMuted}
        muted={autoPlayMuted}
        loop={autoPlayMuted}
        playsInline
        className={className}
      />
    );
  }

  return <ResilientImage src={imageUrl} alt={alt} className={className} />;
};
