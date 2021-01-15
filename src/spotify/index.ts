import axios, { AxiosResponse } from "axios";
import { Session } from "next-auth/client";

let token: string | undefined;

export const setToken = (session: Session) => {
    token = session.accessToken;
};

// API CALLS ***************************************************************************************

const headers = () => {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export const getUser = (): Promise<AxiosResponse<SpotifyApi.UserObjectPublic>> =>
    axios.get("https://api.spotify.com/v1/me", { headers: headers() });

/**
 * Get User's Followed Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/get-followed/
 */
export const getFollowing = (): Promise<AxiosResponse<SpotifyApi.UsersFollowedArtistsResponse>> =>
    axios.get("https://api.spotify.com/v1/me/following?type=artist", { headers: headers() });

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */
export const getRecentlyPlayed = (): Promise<
    AxiosResponse<SpotifyApi.UsersRecentlyPlayedTracksResponse>
> => axios.get("https://api.spotify.com/v1/me/player/recently-played", { headers: headers() });

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
 */
export const getPlaylists = (): Promise<
    AxiosResponse<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>
> => axios.get("https://api.spotify.com/v1/me/playlists", { headers: headers() });

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopArtistsShort = (): Promise<AxiosResponse<SpotifyApi.UsersTopArtistsResponse>> =>
    axios.get("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term", {
        headers: headers(),
    });
export const getTopArtistsMedium = (): Promise<AxiosResponse<SpotifyApi.UsersTopArtistsResponse>> =>
    axios.get("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term", {
        headers: headers(),
    });
export const getTopArtistsLong = (): Promise<AxiosResponse<SpotifyApi.UsersTopArtistsResponse>> =>
    axios.get("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term", {
        headers: headers(),
    });

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopTracksShort = (): Promise<AxiosResponse<SpotifyApi.UsersTopTracksResponse>> =>
    axios.get("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term", {
        headers: headers(),
    });
export const getTopTracksMedium = (): Promise<AxiosResponse<SpotifyApi.UsersTopTracksResponse>> =>
    axios.get("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", {
        headers: headers(),
    });
export const getTopTracksLong = (): Promise<AxiosResponse<SpotifyApi.UsersTopTracksResponse>> =>
    axios.get("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term", {
        headers: headers(),
    });

/**
 * Get an Artist
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/
 */
export const getArtist = (
    artistId: string
): Promise<AxiosResponse<SpotifyApi.SingleArtistResponse>> =>
    axios.get(`https://api.spotify.com/v1/artists/${artistId}`, { headers: headers() });

/**
 * Follow an Artist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const followArtist = (
    artistId: string
): Promise<AxiosResponse<SpotifyApi.FollowArtistsOrUsersResponse>> => {
    const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
    return axios({ method: "put", url, headers: headers() });
};

/**
 * Check if Current User Follows Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowArtist = (
    artistId: string
): Promise<AxiosResponse<SpotifyApi.UserFollowsUsersOrArtistsResponse>> =>
    axios.get(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`, {
        headers: headers(),
    });

/**
 * Check if Users Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowPlaylist = (
    playlistId: string,
    userId: string
): Promise<AxiosResponse<SpotifyApi.UsersFollowPlaylistReponse>> =>
    axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userId}`,
        {
            headers: headers(),
        }
    );

/**
 * Create a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
 */
export const createPlaylist = (
    userId: string,
    name: string
): Promise<AxiosResponse<SpotifyApi.CreatePlaylistResponse>> => {
    const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const data = JSON.stringify({ name });
    return axios({ method: "post", url, headers: headers(), data });
};

/**
 * Add Tracks to a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
 */
export const addTracksToPlaylist = (
    playlistId: string,
    uris: string
): Promise<AxiosResponse<SpotifyApi.AddTracksToPlaylistResponse>> => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`;
    return axios({ method: "post", url, headers: headers() });
};

/**
 * Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-playlist/
 */
export const followPlaylist = (
    playlistId: string
): Promise<AxiosResponse<SpotifyApi.FollowPlaylistReponse>> => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    return axios({ method: "put", url, headers: headers() });
};

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
 */
export const getPlaylist = (
    playlistId: string
): Promise<AxiosResponse<SpotifyApi.SinglePlaylistResponse>> =>
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers: headers() });

/**
 * Get a Playlist's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const getPlaylistTracks = (
    playlistId: string
): Promise<AxiosResponse<SpotifyApi.PlaylistTrackResponse>> =>
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers: headers() });

/**
 * Return a comma separated string of track IDs from the given array of tracks
 */
export const getTrackIds = (tracks: { track: SpotifyApi.TrackObjectSimplified }[]) =>
    tracks.map(({ track }) => track.id).join(",");

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
 */
export const getAudioFeaturesForTracks = (
    tracks: { track: SpotifyApi.TrackObjectSimplified }[]
): Promise<AxiosResponse<SpotifyApi.MultipleAudioFeaturesResponse>> => {
    const ids = getTrackIds(tracks);
    return axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
        headers: headers(),
    });
};

/**
 * Get Recommendations Based on Seeds
 * https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export const getRecommendationsForTracks = (
    tracks: { track: SpotifyApi.TrackObjectSimplified }[]
): Promise<AxiosResponse<SpotifyApi.RecommendationsFromSeedsResponse>> => {
    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
    const seed_artists = "";
    const seed_genres = "";

    return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`,
        {
            headers: headers(),
        }
    );
};

/**
 * Get a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 */
export const getTrack = (trackId: string): Promise<AxiosResponse<SpotifyApi.SingleTrackResponse>> =>
    axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { headers: headers() });

/**
 * Get Audio Analysis for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/
 */
export const getTrackAudioAnalysis = (
    trackId: string
): Promise<AxiosResponse<SpotifyApi.AudioAnalysisResponse>> =>
    axios.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`, { headers: headers() });

/**
 * Get Audio Features for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const getTrackAudioFeatures = (
    trackId: string
): Promise<AxiosResponse<SpotifyApi.AudioFeaturesResponse>> =>
    axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers: headers() });

export const getUserInfo = async () => {
    const [user, followedArtists, playlists, topArtists, topTracks] = await Promise.all([
        getUser(),
        getFollowing(),
        getPlaylists(),
        getTopArtistsLong(),
        getTopTracksLong(),
    ]);
    return {
        user: user.data,
        followedArtists: followedArtists.data,
        playlists: playlists.data,
        topArtists: topArtists.data,
        topTracks: topTracks.data,
    };
    // return axios
    //     .all([getUser(), getFollowing(), getPlaylists(), getTopArtistsLong(), getTopTracksLong()])
    //     .then(
    //         axios.spread((user, followedArtists, playlists, topArtists, topTracks) => {
    //             return {
    //                 user: user.data,
    //                 followedArtists: followedArtists.data,
    //                 playlists: playlists.data,
    //                 topArtists: topArtists.data,
    //                 topTracks: topTracks.data,
    //             };
    //         })
    //     );
};
