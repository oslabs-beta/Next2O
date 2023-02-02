import { render, screen } from '@testing-library/react';
import React from 'react';
import DisplaySeo from '../components/DisplaySeo.jsx';

describe('App tests', () => {
    it('should display run lighthouse button', () => {
    render(<DisplaySeo />);
        const button = screen.getByText(/Run lighthouse/i);
        expect(button).toBeInTheDocument()
    });
});