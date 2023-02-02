import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import MainUI from '../components/MainUI.jsx';

describe('App tests', () => {
    it('should contain debug and heading buttons', () => {
    render(<MainUI />);
        const debug = screen.getByText(/Debug/i);
        expect(debug).toBeInTheDocument()
        const performance = screen.getByText(/Performance/i);
        expect(performance).toBeInTheDocument()
    });
    it('should show error count of 0 with no errors', () => {
        const props = []
        render(<MainUI errors={props} />)
        const errorCount = screen.getByText(/Errors: 0/i)
        expect(errorCount).toBeInTheDocument()
    });
    it('should show error count of 1 with 1 error item', () => {
        const props = [{id: {height: 2, width: 4}, msg: 'testing'}]
        render(<MainUI errors={props} />)
        const errorCount = screen.getByText(/Errors: 1/i)
        expect(errorCount).toBeInTheDocument()
        const message = screen.getByText(/testing/i)
        expect(message).toBeInTheDocument()
    });
    it('should show error count height, width, and message', () => {
        const props = [{id: {height: 2, width: 4}, msg: 'testing'}]
        render(<MainUI errors={props} />)
        const message = screen.getByText(/testing/i);
        expect(message).toBeInTheDocument();
        const height = screen.getByText(/Height: 2/i);
        expect(height).toBeInTheDocument();
        const width = screen.getByText(/Width: 4/i);
        expect(width).toBeInTheDocument();
    });
    it('should display performance and debugging pop-up on hover', async () => {
        const user = userEvent.setup()
        render(<MainUI/>)
        await user.hover(screen.getByText(/Performance/i))
        const performanceHover = screen.getByText(/PERFORMANCE/i)
        expect(performanceHover).toBeInTheDocument()
        await user.hover(screen.getByText(/Debug/i))
        const debugHover = screen.getByText(/DEBUGGING/i)
        expect(debugHover).toBeInTheDocument()
    });
    it('should display run lighthouse button on click', async () => {
        const user = userEvent.setup()
        render(<MainUI/>)
        await user.click(screen.getByTestId('performance-button'))
        const lighthouseButton = screen.getByText(/Run lighthouse/i)
        expect(lighthouseButton).toBeInTheDocument()
    });
});