import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import { AppDesignTokens } from '@/constants/AppDesignTokens';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor={AppDesignTokens.colors.black80}
          darkColor={AppDesignTokens.colors.white80}>
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor={AppDesignTokens.colors.white05}
          lightColor={AppDesignTokens.colors.black05}>
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor={AppDesignTokens.colors.black80}
          darkColor={AppDesignTokens.colors.white80}>
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text
            style={styles.helpLinkText}
            lightColor={AppDesignTokens.colors.accentAlt}
          >
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: AppDesignTokens.layout.v50,
  },
  homeScreenFilename: {
    marginVertical: AppDesignTokens.layout.v7,
  },
  codeHighlightContainer: {
    borderRadius: AppDesignTokens.layout.v3,
    paddingHorizontal: AppDesignTokens.layout.v4,
  },
  getStartedText: {
    fontSize: AppDesignTokens.layout.v17,
    lineHeight: AppDesignTokens.layout.v24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: AppDesignTokens.layout.v15,
    marginHorizontal: AppDesignTokens.layout.v20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: AppDesignTokens.layout.v15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
