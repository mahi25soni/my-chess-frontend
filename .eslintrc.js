module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:prettier/recommended",
    "plugin:jsx-a11y/recommended", // Accessibility rules
    "plugin:@next/next/recommended", // Next.js-specific rules
  ],
  plugins: ["react", "prettier", "tailwindcss", "jsx-a11y"],
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": "off",
    "no-unused-vars": "error",
    "no-undef": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/no-onchange": "warn",
  },
};
