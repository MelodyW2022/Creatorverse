import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';
import { listCreators } from '../client';

vi.mock('../client', () => ({
  createCreator: vi.fn(),
  listCreators: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('LandingPage', () => {
  it('renders the splash screen actions and embedded add section', () => {
    listCreators.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'CREATORVERSE' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'VIEW ALL CREATORS' })).toHaveAttribute(
      'href',
      '#creators-list',
    );
    expect(screen.getByRole('link', { name: 'ADD A CREATOR' })).toHaveAttribute(
      'href',
      '#add-creator',
    );
    expect(screen.getByRole('heading', { name: 'Add a creator' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'All creators' })).toBeInTheDocument();
  });
});
