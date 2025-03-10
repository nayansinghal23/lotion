## Unit Testing 

1) npm i -D vitest vite-tsconfig-paths jsdom @vitest/ui @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event

2) Add "test": "vitest", "test:ui": "vitest --ui" inside scripts in package.json

3) Configure setup.ts & vitest.config.mts

4) Add "types": ["vitest/globals"] inside compilerOptions in tsconfig.json