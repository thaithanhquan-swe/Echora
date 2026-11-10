export interface Song {
  id: string
  title: string
  artist: string
  artistId: string
  album: string
  albumId: string
  duration: number // in seconds
  coverUrl: string
  audioUrl: string
  playbackSource?: "audius" | "spotify-preview" | "unavailable"
  plays?: number
  isLiked?: boolean
  explicit?: boolean
  addedAt?: string
  lyrics?: { time: number; text: string }[]
}

export interface Album {
  id: string
  title: string
  artist: string
  artistId: string
  coverUrl: string
  releaseYear: number
  songs: Song[]
  colorTheme?: string
  description?: string
}

export interface Artist {
  id: string
  name: string
  avatarUrl: string
  bannerUrl: string
  followers: number
  verified: boolean
  bio: string
  topSongs: Song[]
  albums: Album[]
}

export interface Playlist {
  id: string
  title: string
  description: string
  coverUrl: string
  owner: string
  songs: Song[]
  followers?: number
  isCustom?: boolean
  colorTheme?: string
  isPinned?: boolean
}

export interface RadioStation {
  id: string
  title: string
  artistImageUrl: string
  color: string
  description: string
  songs: Song[]
}

export interface Category {
  id: string
  title: string
  color: string
  imageUrl: string
}

export type ViewType = 
  | 'home'
  | 'search'
  | 'playlist'
  | 'album'
  | 'artist'
  | 'liked-songs'

export interface NavigationState {
  view: ViewType
  id?: string
}
