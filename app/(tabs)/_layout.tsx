import { Tabs, Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack.Screen name="JobDetails" options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        {/* Tab Screens */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Jobs",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="briefcase" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Bookmark"
          options={{
            title: "Bookmarks",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bookmark" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
