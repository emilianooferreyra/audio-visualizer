import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, DevSettings, Text, View } from "react-native";

import ErrorBoundary from "@/components/ErrorBoundary";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Font loading is asynchronous.
    return null;
  }

  return (
    <ErrorBoundary
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
          }}
        >
          <Text style={{ color: "#fff" }}>
            Oops! An unexpected error has occurred.
          </Text>
          <Text style={{ color: "#fff" }}>
            Our team has been notified and will resolve it.
          </Text>
          <Button title="Reload App" onPress={() => DevSettings.reload()} />
        </View>
      }
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
