export const generateRandomColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
};

export const getLuminance = (hex) => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const [lumR, lumG, lumB] = [r, g, b].map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

export const getAvatarColors = () => {
  const backgroundColor = generateRandomColor();
  const luminance = getLuminance(backgroundColor);
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  return {
    backgroundColor,
    textColor,
  }
}