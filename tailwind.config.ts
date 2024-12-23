import type { Config } from 'tailwindcss';
import { amber } from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        bodoni: ['Bodoni Moda', 'sans-serif'],
      },
      colors: {
        primary: amber,
      },
    },
  },
};
