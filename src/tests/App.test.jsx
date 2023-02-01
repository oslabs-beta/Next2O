import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../components/App.jsx';

describe('App tests', () => {
    it('should contains the heading 1', () => {
    render(<App />);
        const heading = screen.getByText(/Error/i);
        expect(heading).toBeInTheDocument()
    });
});