export const boxShadow = (elevation: number): string => {
  const opacity = elevation * 0.03 + 0.02;
  return `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, ${opacity})`;
};
