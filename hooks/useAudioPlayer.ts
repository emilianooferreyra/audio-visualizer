import { FFT_SIZE } from "@/constants/Audio";
import { useEffect, useRef, useState } from "react";
import {
  AnalyserNode,
  AudioBuffer,
  AudioBufferSourceNode,
  AudioContext,
} from "react-native-audio-api";

export const useAudioPlayer = (audioUrl: string) => {
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

  const play = (resumeTime = 0) => {
    if (
      !audioContextRef.current ||
      !analyserRef.current ||
      !audioBufferRef.current
    ) {
      return;
    }

    bufferSourceRef.current = audioContextRef.current.createBufferSource();
    bufferSourceRef.current.buffer = audioBufferRef.current;
    bufferSourceRef.current.connect(analyserRef.current);
    bufferSourceRef.current.start(0, resumeTime);

    startTimeRef.current = audioContextRef.current.currentTime - resumeTime;
    setIsPlaying(true);

    draw();
  };

  const pause = () => {
    if (bufferSourceRef.current) {
      bufferSourceRef.current.stop();
      pausedTimeRef.current =
        audioContextRef.current!.currentTime - startTimeRef.current;
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const draw = () => {
    if (!analyserRef.current) {
      return;
    }

    const frequencyArrayLength = analyserRef.current.frequencyBinCount;
    const freqsArray = new Uint8Array(frequencyArrayLength);
    analyserRef.current.getByteFrequencyData(freqsArray);
    setFreqs(freqsArray);

    animationFrameRef.current = requestAnimationFrame(draw);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(pausedTimeRef.current);
    }
  };

  const getCurrentPlaybackTime = () => {
    if (!audioContextRef.current) return 0;
    if (isPlaying) {
      return audioContextRef.current.currentTime - startTimeRef.current;
    }
    return pausedTimeRef.current;
  };

  const [percentComplete, setPercentComplete] = useState(0);
  const isPlayable = !!audioBufferRef.current;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioContextRef.current || !audioBufferRef.current) {
        setPercentComplete(0);
        return;
      }
      const currentTime = getCurrentPlaybackTime();
      const duration = audioBufferRef.current.duration;
      setPercentComplete(duration > 0 ? currentTime / duration : 0);
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = FFT_SIZE;
      analyserRef.current.smoothingTimeConstant = 0.8;
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  useEffect(() => {
    const fetchBuffer = async () => {
      if (bufferSourceRef.current) {
        bufferSourceRef.current.stop();
      }
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
          console.log("Audio cargado:", audioUrl);
        }
      } catch (error) {
        console.error("Error cargando audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuffer();

    return () => {
      if (bufferSourceRef.current) {
        bufferSourceRef.current.stop();
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [audioUrl]);

  return {
    isPlaying,
    isLoading,
    freqs,
    handlePlayPause,
    percentComplete,
    audioBuffer: audioBufferRef.current,
    isPlayable,
  };
};
