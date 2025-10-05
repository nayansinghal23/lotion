import { fireEvent, render, screen } from '@testing-library/react'
import { useConvexAuth } from 'convex/react'

import { marketingEnglish } from '@/i18n/en/marketing'
import Heading from './heading'

describe('Heading', () => {
    it('render heading and description', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        })

        render(<Heading />)
        const heading = screen.getByText(new RegExp(marketingEnglish.title, 'i'));
        const name = screen.getByText(marketingEnglish.name);
        const description1 = screen.getByText(new RegExp(marketingEnglish.description1, 'i'));
        const description2 = screen.getByText(new RegExp(marketingEnglish.description2, 'i'));

        expect(heading).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(description1).toBeInTheDocument();
        expect(description2).toBeInTheDocument();
    })

    it('render spinner when authentication state is loading', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
        })

        render(<Heading />)
        const spinner = screen.getByText('Spinner');

        expect(spinner).toBeInTheDocument();
    });

    it('render Get Jotion free CTA and on click check for authentication', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        })

        render(<Heading />)
        const cta = screen.getByTestId('sign-in-button')
        const ctaText = screen.getByText(marketingEnglish.login);

        expect(cta).toBeInTheDocument();
        expect(cta).toHaveAttribute('mode', 'modal');
        expect(ctaText).toBeInTheDocument();

        fireEvent.click(cta);
    })

    it('render Enter Jotion CTA and navigate to /documents on click only when user is authenticated', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
        })

        render(<Heading />)
        const cta = screen.getByRole('link');

        expect(cta).toBeInTheDocument();
        expect(cta.innerHTML).toContain(marketingEnglish.enter);
        expect(cta).toHaveAttribute('href', '/documents');
    })
})