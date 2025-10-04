### Lotion

- Steps to integrate Jest in NextJS
    - `npx create-next-app@latest`
    - `npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest`
    - `npm init jest@latest` -> Adds `jest.config.ts`
    - Create `jest.setup.ts`
    - Add `"test": "jest"`, `"test:watch": "jest --watch"`, `"test:coverage": "jest --coverage"` in `package.json`

- Command to clear jest cache -> `npx jest --clearCache`