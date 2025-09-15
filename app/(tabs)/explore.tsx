import { CategoryCard } from "@/components/CategoryCard";
import { TrackItem } from "@/components/Track";
import { DeezerColors, musicPlayerColor } from "@/constants/Colors";
import {
  getChartTracks,
  getGenres,
  getPlaylistsByGenre,
} from "@/services/deezerApiService";
import { Genre, Playlist, Track } from "@/types/deezer";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Play, Settings } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ExploreScreen = () => {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const tracks = await getChartTracks(4);
      setTrendingTracks(tracks);

      const genresData = await getGenres();
      const filteredGenres = genresData
        .filter((genre) =>
          ["Pop", "Rock", "Hip Hop", "Electronic", "Jazz"].includes(genre.name)
        )
        .slice(0, 3);
      setGenres(filteredGenres);

      if (genresData.length > 0) {
        const popGenre =
          genresData.find((g) => g.name === "Pop") || genresData[0];
        const playlists = await getPlaylistsByGenre(popGenre.id, 1);
        setFeaturedPlaylists(playlists);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={musicPlayerColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#C084FC", "#EC4899", "#F59E0B"]}
        style={styles.backgroundGradient}
      />

      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Explore</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={24} color={DeezerColors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={24} color={DeezerColors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {genres.map((genre) => (
              <CategoryCard
                key={`genre-${genre.id}`}
                item={{ ...genre, color: musicPlayerColor }}
                isGenre={true}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our top picks right now</Text>

          <TouchableOpacity style={styles.featuredCard}>
            <Image
              source={{
                uri:
                  featuredPlaylists[0]?.picture_medium ||
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop&crop=center",
              }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.featuredOverlay}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredTitleContainer}>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>PLAYLIST</Text>
                  </View>
                  <Text style={styles.featuredTitle}>
                    {featuredPlaylists[0]?.title || "happy hits"}
                  </Text>
                </View>
                <Text style={styles.featuredSubtitle}>
                  {featuredPlaylists[0]?.description ||
                    "feel-good vibes to give you a boost whenever you..."}
                </Text>
                <TouchableOpacity style={styles.playButton}>
                  <Play size={20} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending tracks</Text>
          <Text style={styles.sectionSubtitle}>
            Discover the biggest hits right now
          </Text>

          <View style={styles.tracksContainer}>
            {trendingTracks.map((item) => (
              <TrackItem key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DeezerColors.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: DeezerColors.text,
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DeezerColors.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: DeezerColors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: DeezerColors.textSecondary,
    marginBottom: 20,
  },
  featuredCard: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "85%",
    justifyContent: "flex-end",
  },
  featuredContent: {
    padding: 20,
  },
  featuredTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  featuredBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  featuredSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    marginBottom: 15,
  },
  playButton: {
    alignSelf: "flex-start",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  tracksContainer: {
    gap: 12,
  },
});

export default ExploreScreen;
