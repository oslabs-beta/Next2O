import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../components/App.jsx';

describe('App tests', () => {
    it('should render main UI', () => {
    render(<App />);
        const debug = screen.getByText(/Debug/i);
        expect(debug).toBeInTheDocument()
    });
});