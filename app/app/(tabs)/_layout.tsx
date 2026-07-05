import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMode } from "@/features/mode";

const INACTIVE_COLOR = "#555";

function SOSButton() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={fab.wrapper} pointerEvents="box-none">
      <Animated.View style={[fab.shadow, { transform: [{ scale: pulse }] }]}>
        <TouchableOpacity
          style={fab.button}
          activeOpacity={0.8}
          onPress={() => router.push("/modal/battle-report" as never)}
        >
          <Animated.Text style={fab.text}>SOS</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { vocab, colors } = useMode();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/login" />;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: colors.card,
          },
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: "#fff",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: vocab.tabHome,
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: "house.fill", android: "home", web: "home" }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="companion"
          options={{
            title: vocab.tabCompanion,
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: "sparkles", android: "star", web: "star" }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: vocab.tabJournal,
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: "book.fill", android: "book", web: "book" }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="progres"
          options={{
            title: vocab.tabProgress,
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{
                  ios: "chart.bar.fill",
                  android: "bar_chart",
                  web: "bar_chart",
                }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: vocab.tabProfile,
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: "person.fill", android: "person", web: "person" }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
      <SOSButton />
    </View>
  );
}

const fab = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 78,
    right: 20,
    zIndex: 999,
  },
  shadow: {
    shadowColor: "#e03131",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e03131",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ff6b6b",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
