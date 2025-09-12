import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { getTopTracksByArtist } from "@/services/deezerApiService";
import { Track } from "@/types/deezer";
import { useCallback, useEffect, useMemo, useState } from "react";

type UsePlaylistProps = {
  artistName: string;
  trackCount: number;
};

export function usePlaylist({ artistName, trackCount }: UsePlaylistProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [autoplayOnChange, setAutoplayOnChange] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getTopTracksByArtist(artistName, trackCount);
        const normalized = list.map((t: Track) => ({
          ...t,
          preview_url: t.preview_url || t.preview || null,
        }));
        setTracks(normalized);
        setAutoplayOnChange(false);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [artistName, trackCount]);

  const currentTrack = useMemo(() => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  const currentTrackUrl = useMemo(() => {
    return currentTrack?.preview_url || "";
  }, [currentTrack]);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    setAutoplayOnChange(true);
    setCurrentTrackIndex((idx) => (idx + 1) % tracks.length);
  }, [tracks.length]);

  const handlePrevious = useCallback(() => {
    if (tracks.length === 0) return;
    setAutoplayOnChange(true);
    setCurrentTrackIndex((idx) => (idx - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const audioPlayer = useAudioPlayer(
    currentTrackUrl,
    useMemo(
      () => ({
        onEnded: handleNext,
        autoplayOnLoad: autoplayOnChange,
      }),
      [handleNext, autoplayOnChange]
    )
  );

  return {
    ...audioPlayer,
    currentTrack,
    handleNext,
    handlePrevious,
    canGoNext: tracks.length > 1,
    canGoPrevious: tracks.length > 1,
  };
}
