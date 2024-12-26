import type { Config } from 'tailwindcss';
import { amber } from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        ledger: ['Ledger', 'sans-serif'],
      },
      colors: {
        primary: amber,
      },
    },
  },
};
