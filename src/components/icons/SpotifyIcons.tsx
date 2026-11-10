import React from "react"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  filled?: boolean
}

// 1. Official Spotify Logo with the 3 curved waves
export const SpotifyLogo: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 0C5.372 0 0 5.373 0 12c0 6.628 5.372 12 12 12 6.627 0 12-5.372 12-12C24 5.373 18.627 0 12 0zm5.503 17.306c-.216.353-.674.464-1.027.248-2.812-1.718-6.35-2.107-10.518-1.155-.403.092-.806-.16-.898-.564-.092-.403.16-.806.564-.898 4.564-1.043 8.484-.598 11.632 1.341.353.217.464.675.247 1.028zm1.47-3.262c-.272.443-.852.583-1.295.311-3.218-1.977-8.125-2.55-11.932-1.393-.497.15-1.026-.134-1.176-.631-.15-.497.134-1.026.631-1.176 4.356-1.322 9.774-.682 13.46 1.593.444.272.584.852.312 1.296zm.126-3.41c-3.858-2.29-10.222-2.502-13.896-1.386-.59.18-1.218-.156-1.398-.747-.18-.59.156-1.218.747-1.398 4.225-1.282 11.25-1.032 15.688 1.603.53.314.704 1.002.39 1.532-.314.53-1.002.704-1.531.396z" />
  </svg>
)

// 2. Spotify Home Icon
export const SpotifyHomeIcon: React.FC<IconProps> = ({ size = 24, filled = false, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    {filled ? (
      <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33A2 2 0 0 1 22 7.577V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-5h-3v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
    ) : (
      <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845A2 2 0 0 0 2 7.577V21a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-5h3v5a1 1 0 0 0 1 1H21a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33zM4 8.01l8-4.619 8 4.619V20h-4.5v-5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v5H4V8.01z" />
    )}
  </svg>
)

// 3. Spotify Search Icon
export const SpotifySearchIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
  </svg>
)

// 4. Spotify Iconic Library Icon (bookshelf / leaning books)
export const SpotifyLibraryIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1.5-.866zM16 20V4h4v16h-4zM7.17 3.102a1 1 0 0 0-1.34-1.34l-3.24 3.24A1 1 0 0 0 2.5 5.5v15a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-16a1 1 0 0 0-.33-.708zM4.5 7.12l1.62-1.62H7.5v14.5h-3V7.12z" />
  </svg>
)

// 5. Spotify Play Icon
export const SpotifyPlayIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
  </svg>
)

// 6. Spotify Pause Icon
export const SpotifyPauseIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z" />
  </svg>
)

// 7. Spotify Skip Back
export const SpotifySkipBackIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M3.3 4a.7.7 0 0 1 .7.7v14.6a.7.7 0 0 1-1.4 0V4.7a.7.7 0 0 1 .7-.7zm17.35 1.008a.7.7 0 0 0-1.05-.606L6.5 11.394a.7.7 0 0 0 0 1.212l13.1 6.992a.7.7 0 0 0 1.05-.606V5.008z" />
  </svg>
)

// 8. Spotify Skip Forward
export const SpotifySkipForwardIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M20.7 4a.7.7 0 0 0-.7.7v14.6a.7.7 0 0 0 1.4 0V4.7a.7.7 0 0 0-.7-.7zM3.35 5.008a.7.7 0 0 1 1.05-.606L17.5 11.394a.7.7 0 0 1 0 1.212L4.4 19.598a.7.7 0 0 1-1.05-.606V5.008z" />
  </svg>
)

// 9. Spotify Shuffle Icon
export const SpotifyShuffleIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M13.151 4.152a.75.75 0 0 0-1.06 1.06l3.44 3.44-1.636 1.637a7.502 7.502 0 0 0-2.197 5.305v.906a5.502 5.502 0 0 1-1.611 3.89l-5.69 5.69a.75.75 0 0 0 1.06 1.06l5.69-5.69a7.502 7.502 0 0 0 2.197-5.305v-.906a5.502 5.502 0 0 1 1.611-3.89l1.636-1.637 3.44 3.44a.75.75 0 0 0 1.06-1.06l-4.72-4.72a.75.75 0 0 0-1.06 0l-2.16 2.16zM4.397 5.212a.75.75 0 1 0-1.06 1.06l4.242 4.243a7.5 7.5 0 0 1 1.543 2.165l1.173-1.173a9 9 0 0 0-1.716-2.053L4.397 5.212zm15.451 12.136a.75.75 0 0 0-1.06 0l-3.44 3.44-1.173-1.173a9 9 0 0 0 1.716-2.053l4.242-4.243a.75.75 0 1 0-1.06-1.06l-4.242 4.243a7.5 7.5 0 0 1-1.543 2.165l1.173 1.173 3.44-3.44a.75.75 0 0 0 0-1.06l-.053.008z" />
  </svg>
)

// 10. Spotify Repeat Icon
export const SpotifyRepeatIcon: React.FC<IconProps & { mode?: "off" | "all" | "one" }> = ({
  size = 24,
  mode = "off",
  className = "",
  ...props
}) => (
  <div className="relative inline-flex items-center justify-center">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h14A3.75 3.75 0 0 1 21.5 4.75v3.5a.75.75 0 0 1-1.5 0v-3.5A2.25 2.25 0 0 0 17.75 2.5h-14A2.25 2.25 0 0 0 1.5 4.75v10.5A2.25 2.25 0 0 0 3.75 17.5h11.69l-2.72-2.72a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06-1.06l2.72-2.72H3.75A3.75 3.75 0 0 1 0 15.25V4.75zm22.5 4a.75.75 0 0 1 1.5 0v10.5A3.75 3.75 0 0 1 20.25 23H8.56l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h11.69a2.25 2.25 0 0 0 2.25-2.25V8.75z" />
    </svg>
    {mode === "one" && (
      <span className="absolute -top-1 -right-1 text-[9px] font-extrabold bg-spotify-green text-black rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
        1
      </span>
    )}
  </div>
)

// 11. Spotify Heart Icon
export const SpotifyHeartIcon: React.FC<IconProps> = ({ size = 24, filled = false, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#1ed760" : "none"}
    stroke={filled ? "#1ed760" : "currentColor"}
    strokeWidth={filled ? "0" : "1.8"}
    className={className}
    {...props}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={filled ? "#1ed760" : "currentColor"}
    />
  </svg>
)

// 12. Spotify Lyrics Microphone Icon
export const SpotifyMicIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M14.997 3.149a4 4 0 0 0-5.994 0l-5.694 6.07a4 4 0 0 0-.25 5.341l6.733 6.733a.75.75 0 0 0 1.06 0l9.84-9.84a.75.75 0 0 0 0-1.06l-5.695-7.244zm-4.9 1.026a2.5 2.5 0 0 1 3.806 0l4.75 6.043-3.666 3.666-4.89-4.89 0-.001zm-2.062 6.76 3.83 3.83-2.073 2.074a2.5 2.5 0 0 1-3.328.17l-1.634-1.634a2.5 2.5 0 0 1 .17-3.328l3.035-1.112z" />
  </svg>
)

// 13. Spotify Queue Icon
export const SpotifyQueueIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M15 15H3v-1.5h12V15zm0-4.5H3V9h12v1.5zm0-4.5H3V4.5h12V6zm6 7.5L16.5 10v7l4.5-3.5z" />
  </svg>
)

// 14. Spotify Connect Device
export const SpotifyDeviceIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M6 3h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3v2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h2v-2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v10h12V5H6z" />
  </svg>
)

// 15. Spotify Volume Icons
export const SpotifyVolumeIcon: React.FC<IconProps & { volume: number; isMuted?: boolean }> = ({
  size = 24,
  volume,
  isMuted = false,
  className = "",
  ...props
}) => {
  if (isMuted || volume === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M13.86 3.47a.75.75 0 0 0-1.061 0l-4.47 4.47H4.25A2.25 2.25 0 0 0 2 10.19v3.62a2.25 2.25 0 0 0 2.25 2.25h4.08l4.47 4.47a.75.75 0 0 0 1.28-.53V4a.75.75 0 0 0-.22-.53zM16.72 9.22a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 0 1-1.06 1.06l-1.72-1.72-1.72 1.72a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06z" />
      </svg>
    )
  }

  if (volume < 0.5) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M9.741.85a.75.75 0 0 1 .375.65v21a.75.75 0 0 1-1.28.53L4.365 18.55H1.75A1.75 1.75 0 0 1 0 16.8V7.2A1.75 1.75 0 0 1 1.75 5.45h2.615L8.836.32a.75.75 0 0 1 .905-.47zm4.27 7.02a.75.75 0 0 1 1.06 0c2.196 2.197 2.196 5.76 0 7.957a.75.75 0 1 1-1.06-1.06 4.125 4.125 0 0 0 0-5.837.75.75 0 0 1 0-1.06z" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M9.741.85a.75.75 0 0 1 .375.65v21a.75.75 0 0 1-1.28.53L4.365 18.55H1.75A1.75 1.75 0 0 1 0 16.8V7.2A1.75 1.75 0 0 1 1.75 5.45h2.615L8.836.32a.75.75 0 0 1 .905-.47zm4.27 7.02a.75.75 0 0 1 1.06 0c2.196 2.197 2.196 5.76 0 7.957a.75.75 0 1 1-1.06-1.06 4.125 4.125 0 0 0 0-5.837.75.75 0 0 1 0-1.06zm2.83-2.83a.75.75 0 0 1 1.06 0c3.758 3.758 3.758 9.851 0 13.61a.75.75 0 1 1-1.06-1.06 8.125 8.125 0 0 0 0-11.49.75.75 0 0 1 0-1.06z" />
    </svg>
  )
}

// 16. Spotify Fullscreen Icon
export const SpotifyFullscreenIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M3 3h6v1.5H4.5V9H3V3zm18 0v6h-1.5V4.5H15V3h6zM3 21v-6h1.5v4.5H9V21H3zm18 0h-6v-1.5h4.5V15H21v6z" />
  </svg>
)

// 17. Spotify Clock Icon (Song table header)
export const SpotifyClockIcon: React.FC<IconProps> = ({ size = 16, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.75 14h-1.5v-5.25a.75.75 0 0 1 .75-.75h3v1.5h-2.25V16z" />
  </svg>
)

// 18. Verified Artist Check Badge
export const SpotifyVerifiedBadge: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.5l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4-8.2 8.2z"
      fill="#3d91f4"
    />
  </svg>
)
