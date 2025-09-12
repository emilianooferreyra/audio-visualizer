import { FrequencyChart } from "@/components/FrecuencyChart";
import Info from "@/components/Info";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Track } from "@/types/deezer";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import {
  AudioBuffer,
  AudioBufferSourceNode,
  AudioContext,
} from "react-native-audio-api";

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
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

export default function HomeScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [percentComplete, setPercentComplete] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    audioContextRef.current = new AudioContext();

    return () => {
      stopPlayback();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopPlayback = () => {
    if (bufferSourceRef.current) {
      bufferSourceRef.current.stop();
      bufferSourceRef.current = null;
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlayPause = async () => {
    if (tracks.length === 0 || !audioContextRef.current) return;

    try {
      if (isPlaying) {
        if (bufferSourceRef.current) {
          const currentTime =
            audioContextRef.current.currentTime - startTimeRef.current;
          pausedTimeRef.current = currentTime;
          stopPlayback();
        }
      } else {
        if (bufferSourceRef.current === null) {
          await playTrack(tracks[currentTrackIndex], pausedTimeRef.current);
        } else {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBufferRef.current;
          source.connect(audioContextRef.current.destination);

          source.onEnded = () => {
            handleNext();
          };

          source.start(
            0,
            pausedTimeRef.current % (audioBufferRef.current?.duration || 0)
          );

          bufferSourceRef.current = source;
          startTimeRef.current =
            audioContextRef.current.currentTime - pausedTimeRef.current;
          setIsPlaying(true);
          updatePlaybackProgress();
        }
      }
    } catch (error) {
      console.error("Error al reproducir/pausar:", error);
    }
  };

  const playTrack = async (track: Track, startTime = 0) => {
    if (!audioContextRef.current) return;

    try {
      setIsLoading(true);
      stopPlayback();

      const response = await fetch(track.preview_url || "");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      source.onEnded = () => {
        handleNext();
      };

      source.start(0, startTime);

      bufferSourceRef.current = source;
      audioBufferRef.current = audioBuffer;
      startTimeRef.current = audioContextRef.current.currentTime - startTime;
      setIsPlaying(true);

      updatePlaybackProgress();
    } catch (error) {
      console.error("Error al reproducir la canción:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlaybackProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      if (audioContextRef.current && audioBufferRef.current) {
        const currentTime =
          audioContextRef.current.currentTime - startTimeRef.current;
        const duration = audioBufferRef.current.duration;
        const progress = Math.min(100, (currentTime / duration) * 100);
        setPercentComplete(progress);

        if (!isPlaying) {
          pausedTimeRef.current = currentTime;
        }
      }
    }, 100);
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    playTrack(tracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (tracks.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    playTrack(tracks[prevIndex]);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.playerContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Visualizer</ThemedText>
        </ThemedView>

        <FrequencyChart data={new Uint8Array()} isPlaying={false} />
        <Info
          handlePlayPause={handlePlayPause}
          isLoading={isLoading}
          isPlaying={isPlaying}
          percentComplete={percentComplete}
          currentTrack={tracks[currentTrackIndex]}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={tracks.length > 1}
          canGoPrevious={tracks.length > 1}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}
