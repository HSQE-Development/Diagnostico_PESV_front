
/** @type {import('vite').UserConfig} */


import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': "/src",
    },
  },
})
