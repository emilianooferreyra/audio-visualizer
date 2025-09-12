import { FFT_SIZE } from "@/constants/Audio";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnalyserNode,
  AudioBuffer,
  AudioBufferSourceNode,
  AudioContext,
} from "react-native-audio-api";

interface UseAudioPlayerOptions {
  onEnded?: () => void;
  autoplayOnLoad?: boolean;
}

export const useAudioPlayer = (
  audioUrl: string,
  options: UseAudioPlayerOptions = {}
) => {
  const { onEnded, autoplayOnLoad = false } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [freqs, setFreqs] = useState<Uint8Array>(
    new Uint8Array(FFT_SIZE / 2).fill(0)
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const suppressOnEndedRef = useRef<boolean>(false);
  const drawRef = useRef<() => void>(() => {});

  // Helper utilities to avoid noisy try/catch blocks
  const safeStop = (source: AudioBufferSourceNode | null) => {
    if (!source) return;
    try {
      source.stop();
    } catch (error) {
      console.log(
        "AudioSource.stop() failed (expected if already stopped):",
        error
      );
    }
  };

  const safeDisconnect = (source: AudioBufferSourceNode | null) => {
    if (!source) return;
    try {
      source.disconnect();
    } catch (error) {
      console.log(
        "AudioSource.disconnect() failed (expected if already disconnected):",
        error
      );
    }
  };

  const stopCurrentSource = useCallback(() => {
    if (!bufferSourceRef.current) return;
    suppressOnEndedRef.current = true;
    safeStop(bufferSourceRef.current);
    safeDisconnect(bufferSourceRef.current);
    bufferSourceRef.current = null;
  }, []);

  const draw = useCallback(() => {
    if (!analyserRef.current) {
      return;
    }

    const frequencyArrayLength = analyserRef.current.frequencyBinCount;
    const freqsArray = new Uint8Array(frequencyArrayLength);
    analyserRef.current.getByteFrequencyData(freqsArray);
    setFreqs(freqsArray);

    animationFrameRef.current = requestAnimationFrame(drawRef.current!);
  }, []);

  drawRef.current = draw;

  const playAt = useCallback(
    (resumeTime = 0) => {
      if (
        !audioContextRef.current ||
        !analyserRef.current ||
        !audioBufferRef.current
      ) {
        return;
      }

      stopCurrentSource();

      const clamped = Math.max(
        0,
        Math.min(resumeTime, audioBufferRef.current.duration || 0)
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(analyserRef.current);

      source.onEnded = () => {
        if (suppressOnEndedRef.current) {
          suppressOnEndedRef.current = false;
          return;
        }
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameRef.current);
        if (typeof onEnded === "function") onEnded();
      };

      try {
        source.start(0, clamped);
      } catch (error) {
        console.log("AudioSource.start() failed:", error);
        return;
      }

      bufferSourceRef.current = source;
      startTimeRef.current = audioContextRef.current.currentTime - clamped;
      pausedTimeRef.current = clamped;
      setIsPlaying(true);

      draw();
    },
    [stopCurrentSource, onEnded, draw]
  );

  const play = () => {
    playAt(pausedTimeRef.current);
  };

  const pause = () => {
    if (bufferSourceRef.current && audioContextRef.current) {
      suppressOnEndedRef.current = true;
      safeStop(bufferSourceRef.current);
      pausedTimeRef.current =
        audioContextRef.current.currentTime - startTimeRef.current;
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);
      bufferSourceRef.current = null;
    }
  };

  const seekTo = (seconds: number) => {
    const duration = audioBufferRef.current?.duration ?? 0;
    const target = Math.max(0, Math.min(seconds, duration));
    if (isPlaying) {
      playAt(target);
    } else {
      pausedTimeRef.current = target;
    }
  };

  const seekBy = (deltaSeconds: number) => {
    const current = getCurrentPlaybackTime();
    seekTo(current + deltaSeconds);
  };

  const getCurrentPlaybackTime = useCallback(() => {
    if (!audioContextRef.current) return 0;
    if (isPlaying) {
      return audioContextRef.current.currentTime - startTimeRef.current;
    }
    return pausedTimeRef.current;
  }, [isPlaying]);

  const [percentComplete, setPercentComplete] = useState(0);
  const isPlayable = !!audioBufferRef.current;
  const duration = audioBufferRef.current?.duration ?? 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioContextRef.current || !audioBufferRef.current) {
        setPercentComplete(0);
        return;
      }
      const currentTime = getCurrentPlaybackTime();
      const total = audioBufferRef.current.duration;
      setPercentComplete(total > 0 ? currentTime / total : 0);
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, getCurrentPlaybackTime]);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (!analyserRef.current && audioContextRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = FFT_SIZE;
      analyserRef.current.smoothingTimeConstant = 0.8;
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  useEffect(() => {
    const fetchBuffer = async () => {
      stopCurrentSource();
      cancelAnimationFrame(animationFrameRef.current);

      setIsPlaying(false);
      setIsLoading(true);
      setFreqs(new Uint8Array(FFT_SIZE / 2).fill(0));
      startTimeRef.current = 0;
      pausedTimeRef.current = 0;
      audioBufferRef.current = null;

      if (!audioUrl) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        if (arrayBuffer.byteLength === 0) {
          throw new Error("Empty audio buffer received");
        }
        if (audioContextRef.current) {
          audioBufferRef.current =
            await audioContextRef.current.decodeAudioData(arrayBuffer);
          if (autoplayOnLoad) {
            playAt(0);
          }
        }
      } catch (error) {
        console.error("Error cargando audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuffer();

    return () => {
      stopCurrentSource();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [audioUrl, autoplayOnLoad, playAt, stopCurrentSource]);

  return {
    isPlaying,
    isLoading,
    freqs,
    handlePlayPause: () => (isPlaying ? pause() : play()),
    play,
    pause,
    playFromStart: () => playAt(0),
    seekTo,
    seekBy,
    percentComplete, // 0..1
    duration,
    currentTime: getCurrentPlaybackTime(),
    audioBuffer: audioBufferRef.current,
    isPlayable,
  };
};
