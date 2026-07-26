import { Wrench, Microscope, Palette, Heart, Star, BarChart3, type LucideIcon } from 'lucide-react';

/** Map RIASEC group key to its Lucide icon component */
export const RIASEC_ICONS: Record<string, LucideIcon> = {
  R: Wrench,
  I: Microscope,
  A: Palette,
  S: Heart,
  E: Star,
  C: BarChart3,
};
