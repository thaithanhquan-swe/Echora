interface YouTubePlayerEvent {
  target: YouTubePlayer
  data?: number
}

interface YouTubePlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  loadVideoById(video: string | { videoId: string; startSeconds?: number }): void
  cueVideoById(video: string | { videoId: string; startSeconds?: number }): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(volume: number): void
  mute(): void
  unMute(): void
  getCurrentTime(): number
  getDuration(): number
  getPlayerState(): number
  destroy(): void
}

interface YouTubePlayerOptions {
  width?: string | number
  height?: string | number
  videoId?: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void
    onStateChange?: (event: YouTubePlayerEvent) => void
    onError?: (event: YouTubePlayerEvent) => void
    onAutoplayBlocked?: (event: YouTubePlayerEvent) => void
  }
}

interface YouTubeNamespace {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer
}

interface Window {
  YT?: YouTubeNamespace
  onYouTubeIframeAPIReady?: () => void
}
