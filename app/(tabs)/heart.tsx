import { DeezerColors } from "@/constants/Colors";
import { ImageBackground, StyleSheet } from "react-native";

export default function HeartScreen() {
  return (
    <ImageBackground
      source={require("../../assets/gifs/giphy-1991813956.gif")}
      resizeMode="cover"
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  text: {
    color: DeezerColors.text,
    fontSize: 35,
  },
});
