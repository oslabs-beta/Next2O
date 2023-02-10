import { render, screen } from '@testing-library/react';
import React from 'react';
import Tree from '../components/Tree.jsx';

describe('App tests', () => {
    it('should contain tree', () => {
    render(<Tree />);
    });
});