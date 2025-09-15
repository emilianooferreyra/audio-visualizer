import SearchResultsView from "@/components/SearchResultsView";
import { DeezerColors, musicPlayerColor } from "@/constants/Colors";
import {
  getChartTracks,
  searchAlbums,
  searchArtists,
  searchTracks,
} from "@/services/deezerApiService";
import { Album, Artist, Track } from "@/types/deezer";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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

  const updateRecentSearches = (
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
        <ActivityIndicator size="large" color={musicPlayerColor} />
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
        <SearchResultsView
          searchQuery={searchQuery}
          loading={loading}
          searchResults={searchResults}
          onResultPress={updateRecentSearches}
        />
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
                  borderColor: DeezerColors.divider,
                  borderRadius: 12,
                  padding: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 3,
                  borderWidth: 1,
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
        </ScrollView>
      )}
    </View>
  );
}
