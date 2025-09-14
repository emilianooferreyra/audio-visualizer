import { FFT_SIZE, GROUP_QUANTITY, PLAYER_WIDTH } from "@/constants/Audio";
import { DeezerColors } from "@/constants/Colors";
import { RoundedRect, Canvas as SKCanvas } from "@shopify/react-native-skia";
import { useMemo } from "react";

interface Point {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

interface ChartProps {
  data: Uint8Array;
  isPlaying: boolean;
}

export const FrequencyChart = (props: ChartProps) => {
  const { data, isPlaying } = props;

  const width = PLAYER_WIDTH;
  const height = 200;

  const barWidth = width / (FFT_SIZE / 2 / GROUP_QUANTITY) - 5;

  const points = useMemo(() => {
    if (!data) return [];

    const p: Point[] = [];
    let runningTotal = 0;
    let barIndex = 0;

    for (let i = 0; i < FFT_SIZE / 2; i += GROUP_QUANTITY) {
      runningTotal = 0;

      for (let j = i; j < i + GROUP_QUANTITY && j < FFT_SIZE / 2; j++) {
        runningTotal += data[j] || 0;
      }

      const average = runningTotal / GROUP_QUANTITY;
      const x = barIndex * (barWidth + 5);
      const y1 = height;
      const y2 = isPlaying ? height - height * (average / 255) : height - 2;
      const color = "#a238ff";

      p.push({ x1: x, x2: x, y1, y2, color });
      barIndex++;
    }

    return p;
  }, [height, data, barWidth, isPlaying]);

  return (
    <SKCanvas
      style={{
        width: PLAYER_WIDTH,
        height: 200,
        alignSelf: "center",
        backgroundColor: DeezerColors.background,
        borderRadius: 12,
      }}
    >
      {points.map((point, index) => (
        <RoundedRect
          key={index}
          r={10}
          x={point.x1}
          y={point.y2}
          height={Math.abs(point.y1 - point.y2)}
          width={barWidth}
          color={point.color}
        />
      ))}
    </SKCanvas>
  );
};
