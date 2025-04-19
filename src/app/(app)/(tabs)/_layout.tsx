import React, { ReactNode } from "react";
import { Tabs } from "expo-router";

import HomeHeader from "@/src/components/HomeHeader";
import { TabBar } from "@/src/components/TabBar/TabBar";

export default function TabLayout(): ReactNode {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "home",
          header: () => <HomeHeader />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
