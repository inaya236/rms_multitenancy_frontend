// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [daisyui]
// }
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         slideOverlay: {
//           '0%': { left: '100%' },
//           '100%': { left: '0%' },
//         },
//       },
//       animation: {
//         slideOverlay: 'slideOverlay 1s ease-in-out forwards',
//       },
//     },
//   },
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
 plugins: [require("daisyui")],
 daisyui: {
    themes: ["light"], // 👈 ADD THIS
  },
}