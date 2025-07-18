import type { Config } from 'tailwindcss';

   const config: Config = {
     content: [
       './app/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {
         colors: {
           cyan: {
             400: '#22d3ee',
             500: '#06b6d4',
           },
         },
       },
     },
     plugins: [require('tailwindcss-animate')],
   };

   export default config;