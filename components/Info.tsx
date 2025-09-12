import { Track } from "@/types/deezer";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextTicker from "react-native-text-ticker";
import { FrequencyChart } from "./FrecuencyChart";
import { Underline } from "./Underline";

import {
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react-native";

const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds || 0));
  const mPart = Math.floor(s / 60);
  const sPart = s % 60;
  const mm = `${mPart}`;
  const ss = sPart < 10 ? `0${sPart}` : `${sPart}`;
  return `${mm}:${ss}`;
};

interface Props {
  isLoading: boolean;
  isPlaying: boolean;
  percentComplete: number; // 0..1
  currentTrack: Track | null;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  frequencyData?: Uint8Array;
  onNext: () => void;
  onPrevious: () => void;
  handlePlayPause: () => void;
  onSeekPercent?: (percent: number) => void;
  onSeekBySeconds?: (delta: number) => void;
  currentTimeSec?: number;
  durationSec?: number;
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
  onSeekPercent,
  currentTimeSec = 0,
  durationSec = 0,
}: Props) => {
  return (
    <View style={styles.mainContainer}>
      <Underline percentComplete={percentComplete} onSeek={onSeekPercent} />

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(currentTimeSec)}</Text>
        <Text style={styles.timeText}>{formatTime(durationSec)}</Text>
      </View>

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
          <TextTicker
            style={styles.titleText}
            duration={12000}
            loop
            bounce={false}
            repeatSpacer={50}
            marqueeDelay={800}
          >
            {currentTrack?.name || currentTrack?.title || "No Track Selected"}
          </TextTicker>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={onPrevious}
            disabled={!canGoPrevious}
            style={[
              styles.playPauseButton,
              { opacity: canGoPrevious ? 1 : 0.5 },
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
            style={[styles.playPauseButton, { opacity: canGoNext ? 1 : 0.5 }]}
          >
            <SkipForward size={30} color="white" />
          </TouchableOpacity>
        </View>
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
    alignItems: "flex-start",
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
    marginTop: 12,
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  playPauseButton: {
    backgroundColor: "gray",
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
  seekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  seekButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#1f1f1f",
  },
  seekText: {
    color: "white",
    fontSize: 14,
  },
  timeRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#999",
  },
});

export default Info;
