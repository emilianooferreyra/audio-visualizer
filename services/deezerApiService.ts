import { Track } from "@/types/deezer";

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
