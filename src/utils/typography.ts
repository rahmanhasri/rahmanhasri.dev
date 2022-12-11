const Typography = require('typography');
const kirkhamTheme = require('typography-theme-kirkham');

const typography = new Typography(kirkhamTheme);

export default typography;
export const rhythm = typography.rhythm;
