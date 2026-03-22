import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import { getSupabaseClientState } from './client';
import { createHybridClient, createListClient } from './test/supabaseMock';

vi.mock('./client', () => ({
  getSupabaseClientState: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

beforeEach(() => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('renders the landing page and loaded creators list on the homepage', async () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: [
          {
            id: 1,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Mathematician and creator.',
            imageURL: '',
          },
        ],
        error: null,
      }),
      error: null,
    });

    renderAt('/');

    expect(screen.getByRole('heading', { name: 'CREATORVERSE' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'VIEW ALL CREATORS' })).toHaveAttribute(
      'href',
      '#creators-list',
    );
    expect(screen.getByRole('link', { name: 'ADD A CREATOR' })).toHaveAttribute(
      'href',
      '#add-creator',
    );
    expect(await screen.findByRole('heading', { name: 'Add a creator' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'All creators' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Ada' })).toBeInTheDocument();
  });

  it('renders /creators as the same combined homepage experience', async () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: [
          {
            id: 1,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Mathematician and creator.',
            imageURL: '',
          },
        ],
        error: null,
      }),
      error: null,
    });

    renderAt('/creators');

    expect(screen.getByRole('heading', { name: 'CREATORVERSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Add a creator' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'All creators' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Ada' })).toBeInTheDocument();
  });

  it('renders every frozen route shell', () => {
    getSupabaseClientState.mockReturnValue({
      client: createHybridClient({
        listResponse: { data: [], error: null },
        detailResponse: { data: null, error: null },
      }),
      error: null,
    });

    renderAt('/creators/new');
    expect(screen.getByRole('heading', { name: 'New creator' })).toBeInTheDocument();

    cleanup();
    renderAt('/creators/42');
    expect(screen.getByRole('heading', { name: 'View creator' })).toBeInTheDocument();

    cleanup();
    renderAt('/creators/42/edit');
    expect(screen.getByRole('heading', { name: 'Edit creator' })).toBeInTheDocument();
  });

  it('shows a readable configuration error on protected routes when Supabase env is missing', () => {
    getSupabaseClientState.mockReturnValue({
      client: null,
      error:
        'Creatorverse is missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using the app.',
    });

    renderAt('/creators/new');

    expect(
      screen.getByRole('heading', { name: 'Creatorverse is not configured yet' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY/i),
    ).toBeInTheDocument();
  });
});
