import { Text, TextProps } from "react-native";

export function PoppinsRegular(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "Poppins_400Regular" }]}
    />
  );
}

export function PoppinsSemiBold(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "Poppins_600SemiBold" }]}
    />
  );
}
