import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  Heart,
  Mic2,
  MoreHorizontal,
  Play,
  Settings,
  Target,
} from "lucide-react-native";
import React from "react";
import {
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
  const categories = [
    { id: 1, title: "Concerts", icon: Mic2, color: "#8B5CF6" },
    { id: 2, title: "Music quizzes", icon: Target, color: "#8B5CF6" },
    { id: 3, title: "Podcasts", icon: Mic2, color: "#8B5CF6" },
  ];

  const trendingTracks = [
    {
      id: 1,
      title: "Flowers",
      artist: "Miley Cyrus",
      image: "https://picsum.photos/80/80?random=1",
      albumColor: "#4F46E5",
    },
    {
      id: 2,
      title: "Dance The Night",
      artist: "Dua Lipa",
      image: "https://picsum.photos/80/80?random=2",
      albumColor: "#EC4899",
    },
    {
      id: 3,
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "https://picsum.photos/80/80?random=3",
      albumColor: "#F59E0B",
    },
    {
      id: 4,
      title: "Anti-Hero",
      artist: "Taylor Swift",
      image: "https://picsum.photos/80/80?random=4",
      albumColor: "#10B981",
    },
  ];

  const CategoryCard = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <View
          style={[styles.categoryIcon, { backgroundColor: item.color + "30" }]}
        >
          <item.icon size={16} color={item.color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const TrackItem = ({ item }: any) => (
    <TouchableOpacity style={styles.trackItem}>
      <View style={styles.trackContent}>
        <View style={[styles.albumArt, { backgroundColor: item.albumColor }]}>
          <Image source={{ uri: item.image }} style={styles.albumImage} />
        </View>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <Text style={styles.trackArtist}>{item.artist}</Text>
        </View>
        <View style={styles.trackActions}>
          <TouchableOpacity style={styles.heartButton}>
            <Heart size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#C084FC", "#EC4899", "#F59E0B"]}
        style={styles.backgroundGradient}
      />

      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Explore</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Top Picks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our top picks right now</Text>

          <TouchableOpacity style={styles.featuredCard}>
            <Image
              source={{ uri: "https://picsum.photos/400/200?random=featured" }}
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
                  <Text style={styles.featuredTitle}>happy hits</Text>
                </View>
                <Text style={styles.featuredSubtitle}>
                  feel-good vibes to give{"\n"}
                  you a boost whenever you...
                </Text>
                <TouchableOpacity style={styles.playButton}>
                  <Play size={20} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Trending Tracks */}
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
    backgroundColor: "#F8F9FA",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.3,
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
    color: "#1F2937",
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    backgroundColor: "#1F2937",
    overflow: "hidden",
  },
  categoryContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  categoryIcon: {
    alignSelf: "flex-end",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconText: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
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
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    color: "#1F2937",
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 14,
    color: "#6B7280",
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  activeTab: {},
  tabLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabLabel: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
});

export default ExploreScreen;
