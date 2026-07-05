import { useSignIn } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";

// Required for OAuth redirect on native
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn() {
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Identifiants incorrects. Réessaie.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError(null);
      const { createdSessionId, setActive: ssoSetActive } = await startSSOFlow(
        { strategy: "oauth_google" },
      );
      if (createdSessionId && ssoSetActive) {
        await ssoSetActive({ session: createdSessionId });
      }
    } catch {
      setError("Connexion Google échouée. Réessaie.");
    }
  }

  async function handleAppleSignIn() {
    try {
      setError(null);
      const { createdSessionId, setActive: ssoSetActive } = await startSSOFlow(
        { strategy: "oauth_apple" },
      );
      if (createdSessionId && ssoSetActive) {
        await ssoSetActive({ session: createdSessionId });
      }
    } catch {
      setError("Connexion Apple échouée. Réessaie.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Claiire</Text>
        <Text style={styles.subtitle}>
          Ton compagnon de bien-être
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEmailSignIn}
          disabled={loading || !email || !password}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.oauthButton} onPress={handleGoogleSignIn}>
          <Text style={styles.oauthButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.oauthButton}
            onPress={handleAppleSignIn}
          >
            <Text style={styles.oauthButtonText}>Continuer avec Apple</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("/(auth)/register" as never)}
        >
          <Text style={styles.linkText}>
            Pas encore de compte ? Créer un compte
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  primaryButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a2a4a",
  },
  dividerText: {
    color: "#888",
    fontSize: 14,
  },
  oauthButton: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  oauthButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 8,
  },
  linkText: {
    color: "#6c47ff",
    fontSize: 14,
  },
});
