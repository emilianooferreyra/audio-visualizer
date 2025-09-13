import { Search } from "lucide-react-native";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const recentSearches = [
  {
    id: "1",
    title: "Any Day",
    artist: "Riz Ahmed, Jay Sean",
    image: "https://picsum.photos/100/100?1",
  },
  {
    id: "2",
    title: "Deep Reverence (feat. Nipsey...)",
    artist: "Big Sean, Nipsey Hussle",
    image: "https://picsum.photos/100/100?2",
  },
  {
    id: "3",
    title: "Sundress",
    artist: "A$AP Rocky",
    image: "https://picsum.photos/100/100?3",
  },
  {
    id: "4",
    title: "Famous",
    artist: "French Montana",
    image: "https://picsum.photos/100/100?4",
  },
];

const discoverPlaylists = [
  {
    id: "1",
    title: "Rap Caviar",
    subtitle: "John Doe | 21 songs",
    image: "https://picsum.photos/200/200?5",
  },
  {
    id: "2",
    title: "All Out 2000s",
    subtitle: "John Doe | 21 songs",
    image: "https://picsum.photos/200/200?6",
  },
  {
    id: "3",
    title: "Rock Classics",
    subtitle: "John Doe | 21 songs",
    image: "https://picsum.photos/200/200?7",
  },
];

export default function SearchScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        paddingTop: 80,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          backgroundColor: "#222",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={{ color: "#fff", fontSize: 18, flex: 1, marginRight: 8 }}
        />
        <Search size={30} color="white" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Your recent Search
          </Text>
          <Text style={{ color: "#aaa", fontSize: 14 }}>View all</Text>
        </View>

        {recentSearches.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 4,
                marginRight: 12,
              }}
            />
            <View>
              <Text style={{ color: "#fff", fontSize: 16 }}>{item.title}</Text>
              <Text style={{ color: "#aaa", fontSize: 14 }}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Section title="Discover something new" data={discoverPlaylists} />
        <Section title="Discover Hip-Hop" data={discoverPlaylists} />
        <Section title="Discover Rock" data={discoverPlaylists} />
      </ScrollView>
    </View>
  );
}

function Section({ title, data }: { title: string; data: any[] }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                marginBottom: 6,
              }}
            />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
              {item.title}
            </Text>
            <Text style={{ color: "#aaa", fontSize: 12 }}>{item.subtitle}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
