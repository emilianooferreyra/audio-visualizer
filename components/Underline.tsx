import { PLAYER_WIDTH } from "@/constants/Audio";
import { Rect, Canvas as SKCanvas } from "@shopify/react-native-skia";
import { GestureResponderEvent, Pressable } from "react-native";

export const Underline = ({
  percentComplete,
  onSeek,
}: {
  percentComplete: number;
  onSeek?: (percent: number) => void;
}) => {
  const handlePress = (e: GestureResponderEvent) => {
    if (!onSeek) return;
    const { locationX } = e.nativeEvent;
    const percent = Math.max(0, Math.min(locationX / PLAYER_WIDTH, 1));
    onSeek(percent);
  };

  return (
    <Pressable onPress={handlePress} disabled={!onSeek}>
      <SKCanvas
        style={{
          height: 25,
          marginTop: 4 * 3,
          width: PLAYER_WIDTH,
          alignSelf: "center",
        }}
      >
        <Rect x={0} y={12.5} width={PLAYER_WIDTH} height={1} color="gray" />
        <Rect
          x={0}
          y={12.5 - 2}
          width={PLAYER_WIDTH * Math.max(0, Math.min(percentComplete, 1))}
          height={5}
          color="#4A90E2"
        />
      </SKCanvas>
    </Pressable>
  );
};
