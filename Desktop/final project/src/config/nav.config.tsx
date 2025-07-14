
import { Heart, Home , MessageCircleMore ,  BellDot } from "lucide-react";
const navItems = [
  {
    name: "Home",
    href: "/",
    iconFilled: <Home fill="currentColor" className="w-6 h-6" />,
    iconOutline: <Home  className="w-6 h-6" />,
  },
  {
    name: "Messages",
    href: "/profile",
    iconFilled: <MessageCircleMore fill="currentColor" className="w-6 h-6" />,
    iconOutline: <MessageCircleMore  className="w-6 h-6" />,
  },
  {
    name: "Notifications",
    href: "/profile",
    iconFilled: <BellDot fill="currentColor" className="w-6 h-6" />,
    iconOutline: <BellDot  className="w-6 h-6" />,
  },
  {
    name: "Profile",
    href: "/profile",
    iconFilled: <Heart fill="currentColor" className="w-6 h-6" />,
    iconOutline: <Heart  className="w-6 h-6" />,
  },
];

export default navItems;
