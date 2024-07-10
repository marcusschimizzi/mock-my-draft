export const hexToRgb = (hex: string): string => {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbToHex = (rgb: string): string => {
  const [r, g, b] = rgb
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map((color) => parseInt(color.trim(), 10));

  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};
