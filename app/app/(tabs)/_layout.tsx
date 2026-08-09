import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs, useRouter } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useMode } from "@/features/mode";
import { AppDesignTokens } from '@/constants/AppDesignTokens';

const INACTIVE_COLOR = AppDesignTokens.colors.textSubtle;

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
          headerTintColor: AppDesignTokens.colors.text,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: vocab.tabHome,
            tabBarIcon: ({ color }) => (
              <AppIcon name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="companion"
          options={{
            title: vocab.tabCompanion,
            tabBarIcon: ({ color }) => (
              <AppIcon name="sparkles" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: vocab.tabJournal,
            tabBarIcon: ({ color }) => (
              <AppIcon name="book" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progres"
          options={{
            title: vocab.tabProgress,
            tabBarIcon: ({ color }) => (
              <AppIcon name="progress" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: vocab.tabProfile,
            tabBarIcon: ({ color }) => (
              <AppIcon name="user" color={color} />
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
    bottom: AppDesignTokens.layout.v78,
    right: AppDesignTokens.layout.v20,
    zIndex: AppDesignTokens.layout.v999,
  },
  shadow: {
    shadowColor: AppDesignTokens.colors.danger,
    shadowOffset: { width: AppDesignTokens.layout.v0, height: AppDesignTokens.layout.v4 },
    shadowOpacity: AppDesignTokens.layout.v0p5,
    shadowRadius: AppDesignTokens.layout.v12,
    elevation: AppDesignTokens.layout.v10,
  },
  button: {
    width: AppDesignTokens.layout.v56,
    height: AppDesignTokens.layout.v56,
    borderRadius: AppDesignTokens.layout.v28,
    backgroundColor: AppDesignTokens.colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: AppDesignTokens.colors.dangerSoft,
  },
  text: {
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v14,
    fontWeight: "900",
    letterSpacing: AppDesignTokens.layout.v1,
  },
});
