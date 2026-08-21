import { Navigation } from "@/modules/navigation/index.js";
import { NAVIGATION_MESSAGES } from "@/modules/navigation/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { NavigationItem } from "@/modules/navigation/index.js";
import { DEFAULT_NAVIGATION } from "./seed.navigation.js";

export const getNavigation = async (): Promise<NavigationItem[]> => {
  let navigation = await Navigation.findOne().lean();

  if (!navigation) {
    navigation = await Navigation.create({ items: DEFAULT_NAVIGATION });
  }

  return navigation.items;
};