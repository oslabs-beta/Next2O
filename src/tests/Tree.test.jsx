import { render, screen } from '@testing-library/react';
import React from 'react';
import Tree from '../components/Tree.jsx';

describe('App tests', () => {
    it('should contain tree', () => {
    render(<Tree />);
        const tree = screen.getByText(/Tree/i);
        expect(tree).toBeInTheDocument()
    });
});