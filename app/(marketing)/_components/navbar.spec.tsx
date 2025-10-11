import { fireEvent, render, screen } from "@testing-library/react";
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";

import Navbar from "./navbar";

describe('Navbar', () => {
    it('should render themes', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
        });
        (useUser as jest.Mock).mockReturnValue({
            user: null,
        });
        render(<Navbar />);

        const lightModeIcon = screen.getByLabelText('light mode icon');
        const darkModeIcon = screen.getByLabelText('dark mode icon');
        const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

        expect(lightModeIcon).toBeInTheDocument();
        expect(lightModeIcon).toHaveClass('rotate-0 scale-100 dark:-rotate-90 dark:scale-0');

        expect(darkModeIcon).toBeInTheDocument();
        expect(darkModeIcon).toHaveClass('rotate-90 scale-0 dark:rotate-0 dark:scale-100');

        fireEvent.click(toggleButton);
    })

    it('should render login CTA when not authenticated', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        });
        (useUser as jest.Mock).mockReturnValue({
            user: null,
        });
        render(<Navbar />);
        const signInButton = screen.getByTestId("sign-in-button");

        expect(signInButton).toBeInTheDocument();
        expect(signInButton).toHaveAttribute('mode', 'modal');

        fireEvent.click(signInButton);
    })
});