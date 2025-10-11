import { createElement, ReactNode } from 'react'
import '@testing-library/jest-dom'

import { marketingEnglish } from './i18n/en/marketing'

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('convex/react', () => ({
    useConvexAuth: jest.fn(),
    useMutation: jest.fn(),
}))

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(() => ({
        t: jest.fn((key: string) => {
            if(key === 'marketing') return marketingEnglish;
            return null;
        }),
    }))
}))

jest.mock('@clerk/clerk-react', () => ({
    SignInButton: jest.fn(({ children, ...props }: { children: ReactNode }) => {
        return createElement('div', { "data-testid": "sign-in-button", ...props }, children)
    }),
    useUser: jest.fn(),
}))

jest.mock('next-themes', () => ({
    useTheme: jest.fn(() => ({
        setTheme: jest.fn(),
    })),
}))