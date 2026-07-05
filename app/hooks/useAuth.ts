import { useAuth as useClerkAuth, useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAuth() {
  const { isSignedIn, isLoaded: authLoaded } = useClerkAuth();
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const convexUser = useQuery(
    api.users.getCurrentUser,
    isSignedIn ? {} : "skip",
  );

  return {
    isSignedIn: isSignedIn ?? false,
    isLoaded: authLoaded && userLoaded,
    clerkUser,
    convexUser,
    needsOnboarding:
      isSignedIn && convexUser !== undefined && convexUser !== null
        ? !convexUser.onboardingCompleted
        : false,
  };
}
