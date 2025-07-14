export interface ItemType {
  name: string;
  href: string;
  iconFilled: React.ReactNode;
  iconOutline: React.ReactNode;
}
export interface NavItemProps {
  item: ItemType;
  index: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isActive: boolean;
}

export type activeMenuProps = {
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
};
