export const colorSchemes = {
  sunset: [
    "hsl(35, 100%, 65%)",
    "hsl(15, 100%, 65%)",
    "hsl(350, 100%, 75%)",
    "hsl(300, 80%, 70%)",
  ],
  ocean: [
    "hsl(180, 100%, 50%)",
    "hsl(200, 100%, 50%)",
    "hsl(220, 100%, 60%)",
    "hsl(160, 70%, 55%)",
  ],
  forest: [
    "hsl(120, 60%, 35%)",
    "hsl(120, 40%, 55%)",
    "hsl(30, 40%, 40%)",
    "hsl(90, 50%, 60%)",
  ],
  pastel: [
    "hsl(0, 100%, 80%)",
    "hsl(177, 70%, 80%)",
    "hsl(190, 80%, 85%)",
    "hsl(152, 60%, 85%)",
    "hsl(45, 100%, 90%)",
  ],
  neon: [
    "hsl(315, 100%, 75%)",
    "hsl(180, 100%, 75%)",
    "hsl(60, 100%, 70%)",
    "hsl(270, 100%, 75%)",
  ],
  vintage: [
    "hsl(30, 50%, 75%)",
    "hsl(180, 25%, 70%)",
    "hsl(45, 40%, 75%)",
    "hsl(20, 30%, 65%)",
  ],
  monochrome: [
    "hsl(0, 0%, 50%)",
    "hsl(0, 0%, 60%)",
    "hsl(0, 0%, 70%)",
    "hsl(0, 0%, 80%)",
  ],
  earth: [
    "hsl(25, 50%, 65%)",
    "hsl(120, 25%, 60%)",
    "hsl(40, 30%, 70%)",
    "hsl(210, 20%, 70%)",
  ],
  cosmic: [
    "hsl(240, 60%, 60%)",
    "hsl(270, 70%, 65%)",
    "hsl(300, 80%, 75%)",
    "hsl(180, 50%, 70%)",
  ],
};

export type ColorSchemeName = keyof typeof colorSchemes;

export const getRandomColorFromScheme = (
  schemeName: ColorSchemeName
): string => {
  const scheme = colorSchemes[schemeName];
  return scheme[Math.floor(Math.random() * scheme.length)];
};

export const getColorScheme = (schemeName: ColorSchemeName): string[] => {
  return colorSchemes[schemeName];
};
