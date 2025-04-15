import HomeIcon from "../components/icons/HomeIcon";
import ProfileIcon from "../components/icons/ProfileIcon";

type IconRenderProps = { color?: string; size?: number };

export const icon: Record<string, (props: IconRenderProps) => JSX.Element> = {
  index: ({ color = "#000", size = 28 }) => (
    <HomeIcon size={size} color={color} />
  ),
  profile: ({ color = "#000", size = 28 }) => (
    <ProfileIcon size={size} color={color} />
  ),
};
