import { useSignIn } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
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
          placeholderTextColor={AppDesignTokens.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={AppDesignTokens.colors.textMuted}
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
            <ActivityIndicator color={AppDesignTokens.colors.text} />
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
    backgroundColor: AppDesignTokens.colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: AppDesignTokens.layout.v24,
    gap: AppDesignTokens.layout.v12,
  },
  title: {
    fontSize: AppDesignTokens.layout.v28,
    fontWeight: "bold",
    color: AppDesignTokens.colors.text,
    textAlign: "center",
    marginBottom: AppDesignTokens.layout.v4,
  },
  subtitle: {
    fontSize: AppDesignTokens.layout.v14,
    color: AppDesignTokens.colors.textMuted,
    textAlign: "center",
    marginBottom: AppDesignTokens.layout.v24,
  },
  error: {
    color: AppDesignTokens.colors.dangerSoft,
    fontSize: AppDesignTokens.layout.v14,
    textAlign: "center",
    marginBottom: AppDesignTokens.layout.v8,
  },
  input: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v16,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  primaryButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v16,
    alignItems: "center",
    marginTop: AppDesignTokens.layout.v8,
  },
  primaryButtonText: {
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v12,
    marginVertical: AppDesignTokens.layout.v8,
  },
  dividerLine: {
    flex: 1,
    height: AppDesignTokens.layout.v1,
    backgroundColor: AppDesignTokens.colors.border,
  },
  dividerText: {
    color: AppDesignTokens.colors.textMuted,
    fontSize: AppDesignTokens.layout.v14,
  },
  oauthButton: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  oauthButtonText: {
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v16,
    fontWeight: "500",
  },
  linkButton: {
    alignItems: "center",
    marginTop: AppDesignTokens.layout.v8,
  },
  linkText: {
    color: AppDesignTokens.colors.accent,
    fontSize: AppDesignTokens.layout.v14,
  },
});
