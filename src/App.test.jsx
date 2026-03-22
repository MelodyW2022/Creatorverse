import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import { getSupabaseClientState } from './client';

vi.mock('./client', () => ({
  getSupabaseClientState: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('renders every frozen route shell', () => {
    getSupabaseClientState.mockReturnValue({ client: {}, error: null });

    renderAt('/');
    expect(screen.getByRole('heading', { name: 'Creatorverse' })).toBeInTheDocument();

    cleanup();
    renderAt('/creators/new');
    expect(screen.getByRole('heading', { name: 'New creator' })).toBeInTheDocument();

    cleanup();
    renderAt('/creators/42');
    expect(screen.getByRole('heading', { name: 'View creator' })).toBeInTheDocument();

    cleanup();
    renderAt('/creators/42/edit');
    expect(screen.getByRole('heading', { name: 'Edit creator' })).toBeInTheDocument();
  });

  it('shows a readable configuration error when Supabase env is missing', () => {
    getSupabaseClientState.mockReturnValue({
      client: null,
      error:
        'Creatorverse is missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using the app.',
    });

    renderAt('/');

    expect(
      screen.getByRole('heading', { name: 'Creatorverse is not configured yet' }),
    ).toBeInTheDocument();
  });
});
