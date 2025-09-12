import { FrequencyChart } from "@/components/FrecuencyChart";
import Info from "@/components/Info";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { usePlaylist } from "@/hooks/usePlaylist";
import { Image, StyleSheet } from "react-native";

export default function HomeScreen() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    freqs,
    handlePlayPause,
    percentComplete,
    duration,
    seekTo,
    seekBy,
    handleNext,
    handlePrevious,
    canGoNext,
    canGoPrevious,
  } = usePlaylist({ artistName: "Oasis", trackCount: 5 });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={(() => {
        const albumUri =
          currentTrack?.album?.cover_medium ||
          currentTrack?.album?.cover ||
          currentTrack?.album?.images?.[0]?.url;
        if (albumUri) {
          return (
            <Image
              source={{ uri: albumUri }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          );
        }
        return (
          <Image
            source={require("@/assets/gifs/giphy-1991813956.gif")}
            style={styles.headerImage}
          />
        );
      })()}
    >
      <ThemedView style={styles.playerContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Visualizer</ThemedText>
        </ThemedView>

        <FrequencyChart data={freqs} isPlaying={isPlaying} />
        <Info
          handlePlayPause={() => (currentTrack ? handlePlayPause() : undefined)}
          isLoading={isLoading}
          isPlaying={isPlaying}
          percentComplete={percentComplete}
          currentTrack={currentTrack}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          onSeekPercent={(p) => {
            if (!duration) return;
            seekTo(p * duration);
          }}
          onSeekBySeconds={(d) => seekBy(d)}
          currentTimeSec={percentComplete * (duration || 0)}
          durationSec={duration}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  playerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
});
