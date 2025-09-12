import { PLAYER_WIDTH } from "@/constants/Audio";
import { Rect, Canvas as SKCanvas } from "@shopify/react-native-skia";

export const Underline = ({ percentComplete }: { percentComplete: number }) => {
  return (
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
        width={PLAYER_WIDTH * percentComplete}
        height={5}
        color="#4A90E2"
      />
    </SKCanvas>
  );
};
