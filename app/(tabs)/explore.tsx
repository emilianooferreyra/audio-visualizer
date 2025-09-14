import { DeezerColors } from "@/constants/Colors";
import {
  getChartTracks,
  getGenres,
  getPlaylistsByGenre,
} from "@/services/deezerApiService";
import { Genre, Playlist, Track } from "@/types/deezer";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  Heart,
  Mic2,
  MoreHorizontal,
  Play,
  Podcast,
  Settings,
  Target,
} from "lucide-react-native";
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

  const staticCategories = [
    { id: 1, title: "Concerts", icon: Mic2, color: "#8B5CF6" },
    { id: 2, title: "Music quizzes", icon: Target, color: "#8B5CF6" },
    { id: 3, title: "Podcasts", icon: Podcast, color: "#8B5CF6" },
  ];

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

  const CategoryCard = ({ item }: { item: any; isGenre?: boolean }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title || item.name}</Text>
        <View
          style={[styles.categoryIcon, { backgroundColor: item.color + "30" }]}
        >
          {item.icon ? (
            <item.icon size={16} color={item.color} />
          ) : (
            <Text style={{ color: item.color || "#8B5CF6", fontSize: 12 }}>
              {(item.name || item.title)?.charAt(0)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const TrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity style={styles.trackItem}>
      <View style={styles.trackContent}>
        <View style={styles.albumArt}>
          <Image
            source={{ uri: item.album.cover_medium }}
            style={styles.albumImage}
          />
        </View>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist.name}
          </Text>
        </View>
        <View style={styles.trackActions}>
          <TouchableOpacity style={styles.heartButton}>
            <Heart size={24} color={DeezerColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={24} color={DeezerColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={DeezerColors.primary} />
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
            {staticCategories.map((item) => (
              <CategoryCard key={`static-${item.id}`} item={item} />
            ))}
            {genres.map((genre) => (
              <CategoryCard
                key={`genre-${genre.id}`}
                item={{ ...genre, color: "#8B5CF6" }}
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
  categoryCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    backgroundColor: DeezerColors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: DeezerColors.divider,
  },
  categoryContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DeezerColors.text,
  },
  categoryIcon: {
    alignSelf: "flex-end",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
  trackItem: {
    backgroundColor: DeezerColors.surface,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: DeezerColors.divider,
  },
  trackContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  albumImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DeezerColors.text,
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 14,
    color: DeezerColors.textSecondary,
  },
  trackActions: {
    flexDirection: "row",
    gap: 15,
  },
  heartButton: {
    padding: 5,
  },
  moreButton: {
    padding: 5,
  },
});

export default ExploreScreen;
