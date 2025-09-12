import { Track } from "@/types/deezer";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FrequencyChart } from "./FrecuencyChart";
import { Underline } from "./Underline";

import {
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react-native";

interface Props {
  isLoading: boolean;
  isPlaying: boolean;
  percentComplete: number;
  currentTrack: Track | null;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  frequencyData?: Uint8Array;
  onNext: () => void;
  onPrevious: () => void;
  handlePlayPause: () => void;
  onTracksLoaded?: (tracks: Track[]) => void;
}

const Info = ({
  isLoading,
  isPlaying,
  percentComplete,
  currentTrack,
  frequencyData,
  canGoPrevious = false,
  canGoNext = false,
  handlePlayPause,
  onPrevious,
  onNext,
}: Props) => {
  return (
    <View style={styles.mainContainer}>
      <Underline percentComplete={percentComplete} />

      {frequencyData && frequencyData.length > 0 && (
        <View style={styles.chartContainer}>
          <FrequencyChart data={frequencyData} isPlaying={isPlaying} />
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.trackInfoContainer}>
          <Text style={styles.artistText} numberOfLines={1}>
            {currentTrack?.artists
              ?.map((a: { name: string }) => a.name)
              .join(", ") ||
              currentTrack?.artist?.name ||
              "Unknown Artist"}
          </Text>
          <Text style={styles.titleText} numberOfLines={1}>
            {currentTrack?.name || currentTrack?.title || "No Track Selected"}
          </Text>
          {!isLoading && !!currentTrack && (
            <Text style={styles.previewNotAvailableText}>
              {isPlaying ? "Reproduciendo..." : "Pausado"}
            </Text>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={onPrevious}
              disabled={!canGoPrevious}
              style={[
                styles.playPauseButton,
                { opacity: canGoPrevious ? 0.5 : 1 },
              ]}
            >
              <SkipBack size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlayPause}
              disabled={isLoading}
              style={[styles.playPauseButton, { opacity: isLoading ? 0.5 : 1 }]}
            >
              {isLoading ? (
                <Loader2 size={30} color="white" />
              ) : isPlaying ? (
                <Pause size={30} color="white" />
              ) : (
                <Play size={30} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNext}
              disabled={!canGoNext}
              style={[styles.playPauseButton, { opacity: canGoNext ? 0.5 : 1 }]}
            >
              <SkipForward size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "60%",
  },
  chartContainer: {
    height: 100,
    width: "100%",
    marginVertical: 10,
  },
  container: {
    width: "100%",
    gap: 20,
    minHeight: 120,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    margin: 10,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
  trackInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  artistText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  previewNotAvailableText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  playPauseButton: {
    backgroundColor: "black",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  controlText: {
    fontSize: 24,
  },
  playPauseText: {
    fontSize: 30,
    color: "white",
  },
});

export default Info;
