import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ShowCreators from './ShowCreators';
import { getSupabaseClientState } from '../client';
import { createListClient } from '../test/supabaseMock';

vi.mock('../client', () => ({
  getSupabaseClientState: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <ShowCreators />
    </MemoryRouter>,
  );
}

describe('ShowCreators', () => {
  it('shows loading before the creators resolve', () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: [],
        error: null,
      }),
      error: null,
    });

    renderPage();

    expect(screen.getByRole('heading', { name: 'Fetching creators' })).toBeInTheDocument();
  });

  it('renders creators returned from Supabase', async () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: [
          {
            id: 1,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Builds with precision.',
            imageURL: 'https://example.com/ada.jpg',
          },
          {
            id: 2,
            name: 'Grace',
            url: 'https://example.com/grace',
            description: 'Ships reliable systems.',
            imageURL: '',
          },
        ],
        error: null,
      }),
      error: null,
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Grace' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ada' })).toHaveAttribute('href', '/creators/1');
  });

  it('shows an empty state when the database returns no creators', async () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: [],
        error: null,
      }),
      error: null,
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'No creators yet' })).toBeInTheDocument();
  });

  it('shows an error state when Supabase rejects the query', async () => {
    getSupabaseClientState.mockReturnValue({
      client: createListClient({
        data: null,
        error: { message: 'Database is unavailable' },
      }),
      error: null,
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Unable to load creators' })).toBeInTheDocument();
    expect(screen.getByText('Database is unavailable')).toBeInTheDocument();
  });
});
