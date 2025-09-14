import { Album, Artist, Playlist, Track } from "@/types/deezer";

const DEEZER_API_URL = "https://api.deezer.com";

export const getTopTracksByArtist = async (
  artistName: string = "Oasis",
  limit: number = 5
): Promise<Track[]> => {
  try {
    const searchResponse = await fetch(
      `${DEEZER_API_URL}/search/artist?q=${encodeURIComponent(
        artistName
      )}&limit=1`
    );

    if (!searchResponse.ok) {
      throw new Error(`Deezer API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    if (!searchData.data || searchData.data.length === 0) {
      throw new Error(`No artist found with name: ${artistName}`);
    }

    const artistId = searchData.data[0].id;
    const tracksResponse = await fetch(
      `${DEEZER_API_URL}/artist/${artistId}/top?limit=${limit}`
    );

    if (!tracksResponse.ok) {
      throw new Error(`Deezer API error: ${tracksResponse.statusText}`);
    }

    const tracksData = await tracksResponse.json();
    return tracksData.data || [];
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

export const getChartTracks = async (limit: number = 10): Promise<Track[]> => {
  try {
    const response = await fetch(
      `${DEEZER_API_URL}/chart/0/tracks?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching chart tracks:", error);
    throw error;
  }
};

export const searchTracks = async (
  query: string,
  limit: number = 20
): Promise<Track[]> => {
  try {
    if (!query.trim()) return [];

    const response = await fetch(
      `${DEEZER_API_URL}/search/track?q=${encodeURIComponent(
        query
      )}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
};

export const searchArtists = async (
  query: string,
  limit: number = 10
): Promise<Artist[]> => {
  try {
    if (!query.trim()) return [];

    const response = await fetch(
      `${DEEZER_API_URL}/search/artist?q=${encodeURIComponent(
        query
      )}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching artists:", error);
    throw error;
  }
};

export const searchAlbums = async (
  query: string,
  limit: number = 10
): Promise<Album[]> => {
  try {
    if (!query.trim()) return [];

    const response = await fetch(
      `${DEEZER_API_URL}/search/album?q=${encodeURIComponent(
        query
      )}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching albums:", error);
    throw error;
  }
};

export const getPlaylistsByGenre = async (
  genreId: number,
  limit: number = 10
): Promise<Playlist[]> => {
  try {
    const response = await fetch(
      `${DEEZER_API_URL}/genre/${genreId}/playlists?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching playlists by genre:", error);
    throw error;
  }
};

export const getGenres = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${DEEZER_API_URL}/genre`);

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const getArtistInfo = async (artistId: number): Promise<Artist> => {
  try {
    const response = await fetch(`${DEEZER_API_URL}/artist/${artistId}`);

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching artist info:", error);
    throw error;
  }
};

export const getAlbumInfo = async (albumId: number): Promise<Album> => {
  try {
    const response = await fetch(`${DEEZER_API_URL}/album/${albumId}`);

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching album info:", error);
    throw error;
  }
};

export const getPopularArtists = async (
  limit: number = 10
): Promise<Artist[]> => {
  try {
    const response = await fetch(
      `${DEEZER_API_URL}/chart/0/artists?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching popular artists:", error);
    throw error;
  }
};
