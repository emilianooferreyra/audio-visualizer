import { DeezerColors } from "@/constants/Colors";
import { Track } from "@/types/deezer";
import { Heart, MoreHorizontal } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const TrackItem = ({ item }: { item: Track }) => (
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

const styles = StyleSheet.create({
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
