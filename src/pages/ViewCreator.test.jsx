import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ViewCreator from './ViewCreator';
import { getCreator } from '../client';

vi.mock('../client', () => ({
  getCreator: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderPage(path = '/creators/1') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/creators/:id" element={<ViewCreator />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ViewCreator', () => {
  it('shows loading before the creator resolves', () => {
    getCreator.mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByRole('heading', { name: 'Fetching creator' })).toBeInTheDocument();
  });

  it('renders a creator returned from Supabase', async () => {
    getCreator.mockResolvedValue({
      id: 1,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visit creator URL' })).toHaveAttribute(
      'href',
      'https://example.com/ada',
    );
    expect(screen.getByRole('link', { name: 'Edit creator' })).toHaveAttribute(
      'href',
      '/creators/1/edit',
    );
  });

  it('shows not found when the creator does not exist', async () => {
    getCreator.mockResolvedValue(null);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Creator not found' })).toBeInTheDocument();
  });

  it('shows an error state when Supabase rejects the query', async () => {
    getCreator.mockRejectedValue(new Error('Record lookup failed'));

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Unable to load creator' })).toBeInTheDocument();
    expect(screen.getByText('Record lookup failed')).toBeInTheDocument();
  });
});
