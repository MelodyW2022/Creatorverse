import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ShowCreators from './ShowCreators';
import { listCreators } from '../client';

vi.mock('../client', () => ({
  listCreators: vi.fn(),
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
    listCreators.mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByRole('heading', { name: 'Fetching creators' })).toBeInTheDocument();
  });

  it('renders creators returned from Supabase', async () => {
    listCreators.mockResolvedValue([
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
    ]);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Grace' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ada' })).toHaveAttribute('href', '/creators/1');
  });

  it('shows an empty state when the database returns no creators', async () => {
    listCreators.mockResolvedValue([]);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'No creators yet' })).toBeInTheDocument();
  });

  it('shows an error state when Supabase rejects the query', async () => {
    listCreators.mockRejectedValue(new Error('Database is unavailable'));

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Unable to load creators' })).toBeInTheDocument();
    expect(screen.getByText('Database is unavailable')).toBeInTheDocument();
  });
});
