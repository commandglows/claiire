import { useCallback, useEffect } from "react";
import { Alert, BackHandler, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppDesignTokens } from "@/constants/AppDesignTokens";

type ResourceProps = {
  title: string;
  detail: string;
  action: string;
  href: string;
};

function Resource({ title, detail, action, href }: ResourceProps) {
  async function openResource() {
    try {
      const supported = await Linking.canOpenURL(href);
      if (!supported) {
        Alert.alert(`${action} indisponible`, "Cette action n'est pas disponible sur cet appareil.");
        return;
      }
      await Linking.openURL(href);
    } catch {
      Alert.alert(`${action} indisponible`, "Claiire n'a pas pu ouvrir cette ressource. Tu peux réessayer ou choisir une autre option.");
    }
  }

  function confirmOpen() {
    const warning = href.startsWith("sms:")
      ? "Ce SMS peut apparaître dans l'historique du téléphone. Continue seulement si cela ne t'expose pas davantage."
      : href.startsWith("tel:")
        ? "Cet appel peut apparaître dans l'historique du téléphone. Continue seulement si cela ne t'expose pas davantage."
        : "Cette page peut apparaître dans l'historique du navigateur. Continue seulement si cela ne t'expose pas davantage.";
    Alert.alert(
      "Avant de continuer",
      warning,
      [
        { text: "Annuler", style: "cancel" },
        { text: action, onPress: () => void openResource() },
      ],
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
      <TouchableOpacity style={styles.resourceButton} onPress={confirmOpen} accessibilityRole="button" accessibilityLabel={action} accessibilityHint={detail}>
        <Text style={styles.resourceButtonText}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SituationHelpScreen() {
  const router = useRouter();
  const exitToNeutral = useCallback(() => {
    if (router.canDismiss()) router.dismissAll();
    router.replace("/(tabs)/index" as never);
  }, [router]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      exitToNeutral();
      return true;
    });
    return () => subscription.remove();
  }, [exitToNeutral]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.close} onPress={exitToNeutral} accessibilityRole="button" accessibilityLabel="Quitter l'aide humaine">
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.eyebrow}>AIDE HUMAINE · FRANCE</Text>
        <Text style={styles.title}>Choisis l'option la plus sûre pour toi.</Text>
        <Text style={styles.intro}>Claiire ne contacte personne à ta place. Si ton téléphone ou ta navigation sont surveillés, appeler ou ouvrir un site peut laisser une trace.</Text>

        <Resource title="Danger immédiat" detail="Police ou gendarmerie. Le 112 fonctionne aussi comme numéro d'urgence européen." action="Appeler le 17" href="tel:17" />
        <Resource title="Si tu ne peux pas parler" detail="Le 114 est accessible par SMS aux personnes sourdes, malentendantes, sourdaveugles ou aphasiques." action="Envoyer un SMS au 114" href="sms:114" />
        <Resource title="Écoute et orientation" detail="Le 3919 est anonyme et gratuit. Ce n'est pas un numéro d'urgence." action="Appeler le 3919" href="tel:3919" />
        <Resource title="Échanger en ligne" detail="La plateforme officielle permet d'échanger avec des policiers ou gendarmes formés." action="Ouvrir la plateforme officielle" href="https://www.service-public.fr/cmi" />

        <TouchableOpacity style={styles.exit} onPress={exitToNeutral} accessibilityRole="button" accessibilityLabel="Quitter cette page et revenir à l'accueil">
          <Text style={styles.exitText}>Quitter cette page</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const T = AppDesignTokens;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.background },
  content: { padding: T.layout.v20, paddingBottom: T.layout.v40, gap: T.layout.v14 },
  close: { width: T.layout.v44, height: T.layout.v44, alignItems: "center", justifyContent: "center", alignSelf: "flex-end" },
  closeText: { color: T.colors.textMuted, fontSize: T.layout.v32 },
  eyebrow: { color: T.colors.accentSoft, fontSize: T.layout.v12, fontWeight: T.typography.bold, letterSpacing: T.layout.v1 },
  title: { color: T.colors.text, fontSize: T.layout.v28, lineHeight: T.layout.v36, fontWeight: T.typography.heavy },
  intro: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22, marginBottom: T.layout.v8 },
  card: { backgroundColor: T.colors.surface, borderRadius: T.layout.v14, padding: T.layout.v16, gap: T.layout.v8, borderWidth: T.layout.v1, borderColor: T.colors.border },
  cardTitle: { color: T.colors.text, fontSize: T.layout.v18, fontWeight: T.typography.bold },
  detail: { color: T.colors.textMuted, fontSize: T.layout.v14, lineHeight: T.layout.v20 },
  resourceButton: { minHeight: T.layout.v48, borderRadius: T.layout.v12, backgroundColor: T.colors.surfaceAccent, borderWidth: T.layout.v1, borderColor: T.colors.accentMuted, alignItems: "center", justifyContent: "center", paddingHorizontal: T.layout.v12 },
  resourceButtonText: { color: T.colors.accentSoft2, fontSize: T.layout.v15, fontWeight: T.typography.semibold, textAlign: "center" },
  exit: { minHeight: T.layout.v48, alignItems: "center", justifyContent: "center", marginTop: T.layout.v8 },
  exitText: { color: T.colors.textMuted, fontSize: T.layout.v14, fontWeight: T.typography.medium },
});
