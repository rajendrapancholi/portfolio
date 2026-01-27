declare module "tailwindcss/lib/util/flattenColorPalette" {
  /**
   * Flattens a nested color palette object (e.g., { blue: { 500: '#...' } })
   * into a single-level object ({ 'blue-500': '#...' }).
   */
  export default function flattenColorPalette(
    colors: Record<string, any>,
  ): Record<string, string>;
}
