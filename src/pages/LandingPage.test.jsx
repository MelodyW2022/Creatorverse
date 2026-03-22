import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';
import { getSupabaseClientState } from '../client';
import { createListClient } from '../test/supabaseMock';

vi.mock('../client', () => ({
  getSupabaseClientState: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('LandingPage', () => {
  it('renders the splash screen actions', () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: [],
        error: null,
      }),
      error: null,
    });

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
      '/creators/new',
    );
    expect(screen.getByRole('heading', { name: 'All creators' })).toBeInTheDocument();
  });
});
