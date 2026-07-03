import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  test('renders the default label when none is provided', () => {
    render(<Loader />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  test('renders a custom label when provided', () => {
    render(<Loader label="Loading your portal…" />);
    expect(screen.getByText('Loading your portal…')).toBeInTheDocument();
  });
});