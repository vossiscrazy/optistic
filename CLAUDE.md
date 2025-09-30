# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite project using React 19 with Fast Refresh via Babel. It's a minimal starter template for building React applications.

## Development Commands

- `npm run dev` - Start development server with HMR (Hot Module Replacement)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on the codebase

## Project Structure

- `src/main.jsx` - Application entry point that mounts the root React component
- `src/App.jsx` - Main application component
- `src/styles.css` - Global stylesheet (imported after reset)
- `src/reset.css` - Meyer CSS Reset v2.0
- `src/assets/fonts/` - Custom fonts (Cormorant and Inter variable fonts)
- `public/` - Static assets served directly

## Configuration

- **Build Tool**: Vite 7 with `@vitejs/plugin-react` for Babel-based Fast Refresh
- **Linting**: ESLint 9 with flat config format
  - Extends React Hooks recommended rules and React Refresh config
  - Custom rule: unused vars allowed if they start with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
  - Ignores `dist/` directory
- **React Version**: 19.1.1 with StrictMode enabled

## Design System

- **Color Palette**: Tailwind CSS neutral palette (50-950) defined as CSS variables in `:root`
- **Dark Mode**: App uses dark mode exclusively with `--neutral-900` background and `--neutral-100` text
- **Typography**:
  - **Headings**: Cormorant variable font, uppercase, weights 100-900
    - H1: 4rem, weight 600
    - H2: 3rem, weight 600
    - H3: 2.25rem, weight 600
    - Only h1, h2, and h3 are used in this project
  - **Body**: Inter variable font, 1rem, line-height 1.6
- **Fonts**: Variable TrueType fonts loaded from `src/assets/fonts/`

## Notes

- This project uses ES modules (`"type": "module"` in package.json)
- ECMAScript version: 2020/latest with JSX support
- No TypeScript currently configured
- No test framework configured
- Global styles are applied in order: reset.css → styles.css
