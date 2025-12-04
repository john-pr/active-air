# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Theme (Night/Day)

This app includes a simple theme context to manage light/dark (day/night) modes.

- **Provider:** `src/app/ThemeContext.jsx` exports `ThemeProvider` which is already wrapped around the app in `src/main.jsx`.
- **Hook:** use `useTheme()` from `src/app/hooks.js` to access `{ theme, setTheme, toggleTheme, isDark }`.
- **Persistence:** theme choice is saved to `localStorage` under key `appTheme` and defaults to the user's `prefers-color-scheme` if available.
- **Styling:** the provider toggles the `dark` class on the document root so Tailwind or utility CSS can react to dark mode.
