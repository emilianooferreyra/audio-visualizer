import { DeezerColors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CategoryCard = ({ item }: { item: any; isGenre?: boolean }) => (
  <TouchableOpacity style={styles.categoryCard}>
    <View style={styles.categoryContent}>
      <Text style={styles.categoryTitle}>{item.title || item.name}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    backgroundColor: DeezerColors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: DeezerColors.divider,
  },
  categoryContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  categoryTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: DeezerColors.text,
  },
  categoryIcon: {
    alignSelf: "flex-end",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
