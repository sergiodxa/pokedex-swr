module.exports = {
  plugins: [
    "tailwindcss",
    process.env.NODE_ENV === "production"
      ? [
          "@fullhuman/postcss-purgecss",
          {
            content: [
              "./src/components/**/*.{js,jsx,ts,tsx}",
              "./src/hooks/**/*.{js,jsx,ts,tsx}",
              "./src/pages/**/*.{js,jsx,ts,tsx}",
              "./src/utils/**/*.{js,jsx,ts,tsx}",
              "./node_modules/@ableco/baseline/dist/index.esm.js",
              "./node_modules/@baseline/icons/dist/index.esm.js",
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        ]
      : undefined,
    "autoprefixer",
  ],
};
