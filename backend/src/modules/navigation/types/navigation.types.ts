export interface NavigationItem {
  id: string;
  title: string;
  order: number;
  visible: boolean;
  children: NavigationItem[];
  icon?: string;
  route?: string;
  permission?: string;
}