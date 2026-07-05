import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useAuth, ClerkProvider, ClerkLoaded } from "@clerk/expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { useNotifications } from "@/features/notifications/useNotifications";
import { CelebrationOverlay } from "@/features/gamification/components/CelebrationOverlay";
import { XPToast } from "@/features/gamification/components/XPToast";
import { useEmergencySync } from "@/features/offline/useEmergencySync";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
);

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  clearToken: (key: string) => SecureStore.deleteItemAsync(key),
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RootLayoutNav />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useNotifications();
  useEmergencySync();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, segments, router]);

  if (!isLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CelebrationOverlay />
      <XPToast />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal/log-sleep"
          options={{ presentation: "modal", title: "Sommeil", headerShown: false }}
        />
        <Stack.Screen
          name="modal/log-mood"
          options={{ presentation: "modal", title: "Humeur", headerShown: false }}
        />
        <Stack.Screen
          name="modal/crisis-support"
          options={{ presentation: "modal", title: "SOS", headerShown: false }}
        />
        <Stack.Screen
          name="modal/achievement"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="modal/log-habit"
          options={{ presentation: "modal", title: "Habitude", headerShown: false }}
        />
        <Stack.Screen
          name="modal/recap"
          options={{ presentation: "modal", title: "Récap", headerShown: false }}
        />
        <Stack.Screen
          name="modal/settings"
          options={{ presentation: "modal", title: "Réglages", headerShown: false }}
        />
        <Stack.Screen
          name="modal/calendar"
          options={{ presentation: "modal", title: "Calendrier", headerShown: false }}
        />
        <Stack.Screen
          name="modal/routine"
          options={{ presentation: "modal", title: "Routines", headerShown: false }}
        />
        <Stack.Screen
          name="modal/battle-report"
          options={{ presentation: "modal", title: "Battle Report", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
