import React, { useEffect } from "react";
import { Text, Pressable, Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { PoppinsSemiBold } from "./StyledText";
import Colors from "../constants/Colors";

const Avatar = ({
  onPress = null,
  size,
  uri = null,
  initials = "",
  color = "#ddd",
  loading = false,
  mood,
}: {
  onPress?: null | (() => void);
  size: number;
  uri?: string | null;
  initials?: string;
  color?: string;
  loading?: boolean;
  mood?: string;
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (loading) {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(1);
    }
  }, [loading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 9999,
        position: "relative",
      }}
      onPress={onPress}
    >
      {loading ? (
        <Animated.View
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: "#ccc",
              borderRadius: 9999,
            },
            animatedStyle,
          ]}
        />
      ) : uri ? (
        <>
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%", borderRadius: 9999 }}
            resizeMode="cover"
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </>
      ) : (
        <PoppinsSemiBold
          style={{
            fontFamily: "dm-sb",
            color: Colors.grey,
            textAlign: "center",
            fontSize: size * 0.3,
          }}
        >
          {initials}
        </PoppinsSemiBold>
      )}
      {mood && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            pointerEvents: "none",
          }}
        >
          <Text>{mood}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default Avatar;
