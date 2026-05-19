import { useTransform, MotionValue } from 'framer-motion';

/**
 * Custom hook to calculate parallax translation based on scroll value.
 * @param scrollY The scroll motion value, usually from useScroll().scrollY
 * @param distance The max translation distance in pixels (can be positive or negative)
 * @param speed Optional speed multiplier, defaults to 1
 * @returns A MotionValue representing the calculated translation
 */
export function useParallax(scrollY: MotionValue<number>, distance: number, speed: number = 1): MotionValue<number> {
  return useTransform(scrollY, [0, 1000], [0, distance * speed]);
}
