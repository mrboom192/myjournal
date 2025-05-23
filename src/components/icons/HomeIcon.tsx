import React from "react";
import { Svg, Path } from "react-native-svg";

const HomeIcon = ({ size = 18, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 21V11.625L2.2 13L1 11.4L4 9.1V6H6V7.575L12 3L23 11.4L21.8 12.975L20 11.625V21H4ZM6 19H11V15H13V19H18V10.1L12 5.525L6 10.1V19ZM4 5C4 4.16667 4.29167 3.45833 4.875 2.875C5.45833 2.29167 6.16667 2 7 2C7.28333 2 7.52083 1.90417 7.7125 1.7125C7.90417 1.52083 8 1.28333 8 1H10C10 1.83333 9.70833 2.54167 9.125 3.125C8.54167 3.70833 7.83333 4 7 4C6.71667 4 6.47917 4.09583 6.2875 4.2875C6.09583 4.47917 6 4.71667 6 5H4Z"
        fill={color}
      />
    </Svg>
  );
};

export default HomeIcon;
