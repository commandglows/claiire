import { View, Text } from "react-native";

import type { ComponentType } from "react";

type MockIconProps = {
  size?: number;
  color?: string;
};

export const LucideIconMock: ComponentType<MockIconProps> = () => (
  <View>
    <Text>icon</Text>
  </View>
);

export const Activity = LucideIconMock;
export const ArrowUp = LucideIconMock;
export const Award = LucideIconMock;
export const ChevronRight = LucideIconMock;
export const Home = LucideIconMock;
export const Menu = LucideIconMock;
export const MessageCircle = LucideIconMock;
export const Search = LucideIconMock;
export const Settings = LucideIconMock;
export const ShieldAlert = LucideIconMock;
export const X = LucideIconMock;
