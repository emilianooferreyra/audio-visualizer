import { DeezerColors } from "@/constants/Colors";
import {
  getChartTracks,
  getGenres,
  getPlaylistsByGenre,
  searchAlbums,
  searchArtists,
  searchTracks,
} from "@/services/deezerApiService";
import { Album, Artist, Playlist, Track } from "@/types/deezer";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface RecentSearch {
  id: string;
  title: string;
  artist: string;
  image: string;
  type: "track" | "artist" | "album";
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
  }>({
    tracks: [],
    artists: [],
    albums: [],
  });
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [discoverPlaylists, setDiscoverPlaylists] = useState<Playlist[]>([]);
  const [hipHopPlaylists, setHipHopPlaylists] = useState<Playlist[]>([]);
  const [rockPlaylists, setRockPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);

      const popularTracks = await getChartTracks(4);
      const recentData: RecentSearch[] = popularTracks.map((track) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        image: track.album.cover_small,
        type: "track" as const,
      }));

      setRecentSearches(recentData);

      const genres = await getGenres();
      const popGenre = genres.find((g) => g.name === "Pop");
      const hipHopGenre = genres.find((g) => g.name === "Hip Hop");
      const rockGenre = genres.find((g) => g.name === "Rock");

      if (popGenre) {
        const playlists = await getPlaylistsByGenre(popGenre.id, 3);
        setDiscoverPlaylists(playlists);
      }

      if (hipHopGenre) {
        const playlists = await getPlaylistsByGenre(hipHopGenre.id, 3);
        setHipHopPlaylists(playlists);
      }

      if (rockGenre) {
        const playlists = await getPlaylistsByGenre(rockGenre.id, 3);
        setRockPlaylists(playlists);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ tracks: [], artists: [], albums: [] });
      return;
    }

    try {
      setLoading(true);

      const [tracks, artists, albums]: [Track[], Artist[], Album[]] =
        await Promise.all([
          searchTracks(query, 10),
          searchArtists(query, 5),
          searchAlbums(query, 5),
        ]);

      setSearchResults({ tracks, artists, albums });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ tracks: [], artists: [], albums: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    const timeoutId = setTimeout(() => {
      handleSearch(text);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const addToRecentSearches = (
    item: Track | Artist | Album,
    type: "track" | "artist" | "album"
  ) => {
    const newSearch: RecentSearch = {
      id: item.id.toString(),
      title:
        "name" in item
          ? item.name ?? ""
          : "title" in item
          ? item.title ?? ""
          : "",
      artist:
        "artist" in item && item.artist && item.artist.name
          ? item.artist.name
          : "name" in item && typeof item.name === "string"
          ? item.name
          : "",
      image:
        "album" in item && item.album && item.album.cover_small
          ? item.album.cover_small
          : "picture_small" in item
          ? item.picture_small
          : (item as Album).cover_small,
      type,
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter((search) => search.id !== newSearch.id);
      return [newSearch, ...filtered].slice(0, 4);
    });
  };

  const renderSearchResults = () => {
    if (!searchQuery.trim()) return null;

    return (
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {loading && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        )}

        {!loading && (
          <>
            {searchResults.tracks.length === 0 &&
              searchResults.artists.length === 0 &&
              searchResults.albums.length === 0 && (
                <View
                  style={{
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                  }}
                >
                  <Text
                    style={{
                      color: "#666",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    No results found for `${searchQuery}`
                  </Text>
                  <Text
                    style={{
                      color: "#999",
                      fontSize: 14,
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Try searching with different keywords
                  </Text>
                </View>
              )}

            {searchResults.tracks.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: DeezerColors.text,
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  Songs
                </Text>
                <View style={{ paddingHorizontal: 16 }}>
                  {searchResults.tracks.slice(0, 5).map((track) => (
                    <TouchableOpacity
                      key={track.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                        backgroundColor: DeezerColors.surface,
                        borderRadius: 8,
                        padding: 8,

                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,

                        borderColor: DeezerColors.divider,
                      }}
                      onPress={() => addToRecentSearches(track, "track")}
                    >
                      <Image
                        source={{ uri: track.album.cover_small }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 4,
                          marginRight: 12,
                        }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: DeezerColors.text,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                          numberOfLines={1}
                        >
                          {track.title}
                        </Text>
                        <Text
                          style={{ color: "#555", fontSize: 14 }}
                          numberOfLines={1}
                        >
                          {track.artist.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {searchResults.tracks.length > 5 && (
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      paddingVertical: 10,
                      marginHorizontal: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffff",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      View all {searchResults.tracks.length} songs
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {searchResults.artists.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: DeezerColors.text,
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  Artists
                </Text>
                <FlatList
                  data={searchResults.artists}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        marginRight: 12,
                        alignItems: "center",
                        width: 100,
                        backgroundColor: DeezerColors.primary,
                        borderRadius: 12,
                        padding: 8,

                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 1,
                      }}
                      onPress={() => addToRecentSearches(item, "artist")}
                    >
                      <Image
                        source={{ uri: item.picture_medium }}
                        style={{
                          width: 75,
                          height: 75,
                          borderRadius: 40,
                          marginBottom: 8,
                        }}
                      />
                      <Text
                        style={{
                          color: DeezerColors.text,
                          fontSize: 13,
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {searchResults.albums.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: DeezerColors.text,
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  Albums
                </Text>
                <FlatList
                  data={searchResults.albums}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        marginRight: 12,
                        marginBottom: 40,
                        width: 130,
                        backgroundColor: DeezerColors.primary,
                        borderRadius: 12,
                        padding: 8,

                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 1,
                      }}
                      onPress={() => addToRecentSearches(item, "album")}
                    >
                      <Image
                        source={{ uri: item.cover_medium }}
                        style={{
                          width: 114,
                          height: 114,
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      />
                      <Text
                        style={{
                          color: DeezerColors.text,
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      {item.nb_tracks && (
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            marginTop: 2,
                          }}
                          numberOfLines={1}
                        >
                          {item.nb_tracks} tracks
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    );
  };

  if (initialLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: DeezerColors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={DeezerColors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: DeezerColors.background,
        paddingTop: 80,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          backgroundColor: DeezerColors.surface,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: DeezerColors.divider,
        }}
      >
        <TextInput
          placeholder="Search songs, artists, albums..."
          placeholderTextColor={DeezerColors.textSecondary}
          style={{
            color: DeezerColors.text,
            fontSize: 18,
            flex: 1,
            marginRight: 8,
          }}
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
        <Search size={30} color="white" />
      </View>

      {searchQuery.trim() ? (
        renderSearchResults()
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
              Your recent Search
            </Text>
            <TouchableOpacity onPress={() => setRecentSearches([])}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                  backgroundColor: DeezerColors.surface,
                  borderRadius: 8,
                  padding: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
                onPress={() => setSearchQuery(item.title)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 4,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: "#fdfdf9", fontSize: 14 }}>
                    {item.artist}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {recentSearches.length === 0 && (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#999", fontSize: 14 }}>
                No recent searches yet
              </Text>
            </View>
          )}

          <Section title="Discover something new" data={discoverPlaylists} />
          <Section title="Discover Hip-Hop" data={hipHopPlaylists} />
          <Section title="Discover Rock" data={rockPlaylists} />
        </ScrollView>
      )}
    </View>
  );
}

function Section({ title, data }: { title: string; data: Playlist[] }) {
  if (!data || data.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: "#000",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        {title}
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              marginRight: 12,
              backgroundColor: DeezerColors.surface,
              borderRadius: 12,
              padding: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Image
              source={{ uri: item.picture_medium }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                marginBottom: 8,
              }}
            />
            <Text
              style={{
                color: DeezerColors.text,
                fontSize: 14,
                fontWeight: "500",
                width: 120,
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: DeezerColors.textSecondary,
                fontSize: 12,
                width: 120,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {item.user.name}
            </Text>
            <Text
              style={{
                color: DeezerColors.textTertiary,
                fontSize: 11,
                width: 120,
                marginTop: 1,
              }}
              numberOfLines={1}
            >
              {item.nb_tracks} songs • {item.fans.toLocaleString()} fans
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
