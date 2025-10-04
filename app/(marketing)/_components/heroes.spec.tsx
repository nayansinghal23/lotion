import { render, screen } from '@testing-library/react'

import Heroes from './heroes'

describe('Heroes', () => {
    it('render images on dark & light modes', () => {
        render(<Heroes />)
        const darkImage = screen.getByAltText('notion-parade');
        const lightImage = screen.getByAltText('notion-parade-light');

        expect(darkImage).toBeInTheDocument();
        expect(lightImage).toBeInTheDocument();

        expect(darkImage).toHaveClass("dark:hidden");
        expect(lightImage).toHaveClass("hidden dark:block");
    })
})