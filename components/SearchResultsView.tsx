import { DeezerColors, musicPlayerColor } from "@/constants/Colors";
import { Album, Artist, Track } from "@/types/deezer";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchResultsViewProps {
  searchQuery: string;
  loading: boolean;
  searchResults: {
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
  };
  onResultPress: (
    item: Track | Artist | Album,
    type: "track" | "artist" | "album"
  ) => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  searchQuery,
  loading,
  searchResults,
  onResultPress,
}) => {
  if (!searchQuery.trim()) {
    return null;
  }

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
                    onPress={() => onResultPress(track, "track")}
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
                      backgroundColor: musicPlayerColor,
                      borderRadius: 12,
                      padding: 8,

                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 1,
                    }}
                    onPress={() => onResultPress(item, "artist")}
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
                        color: DeezerColors.surface,
                        fontSize: 16,
                        fontWeight: "bold",
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
                      backgroundColor: musicPlayerColor,
                      borderRadius: 12,
                      padding: 8,

                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 1,
                    }}
                    onPress={() => onResultPress(item, "album")}
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
                        color: DeezerColors.surface,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {item.nb_tracks && (
                      <Text
                        style={{
                          color: DeezerColors.surface,
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

export default SearchResultsView;
