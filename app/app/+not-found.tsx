import { StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { AppDesignTokens } from '@/constants/AppDesignTokens';

import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: AppDesignTokens.layout.v20,
  },
  title: {
    fontSize: AppDesignTokens.layout.v20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: AppDesignTokens.layout.v15,
    paddingVertical: AppDesignTokens.layout.v15,
  },
  linkText: {
    fontSize: AppDesignTokens.layout.v14,
    color: AppDesignTokens.colors.info,
  },
});
