import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import EditCreator from './EditCreator';
import { getSupabaseClientState } from '../client';
import { createHybridClient } from '../test/supabaseMock';

vi.mock('../client', () => ({
  getSupabaseClientState: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderPage(clientState) {
  getSupabaseClientState.mockReturnValue(clientState);

  return render(
    <MemoryRouter initialEntries={['/creators/7/edit']}>
      <LocationDisplay />
      <Routes>
        <Route path="/creators/:id/edit" element={<EditCreator />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('EditCreator', () => {
  it('prefills the form with creator data', async () => {
    renderPage({
      client: createHybridClient({
        listResponse: { data: [], error: null },
        detailResponse: {
          data: {
            id: 7,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Builds with precision.',
            imageURL: 'https://example.com/ada.jpg',
          },
          error: null,
        },
      }),
      error: null,
    });

    expect(await screen.findByDisplayValue('Ada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/ada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Builds with precision.')).toBeInTheDocument();
  });

  it('updates the creator and redirects to the detail page', async () => {
    renderPage({
      client: createHybridClient({
        listResponse: { data: [], error: null },
        detailResponse: {
          data: {
            id: 7,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Builds with precision.',
            imageURL: 'https://example.com/ada.jpg',
          },
          error: null,
        },
        updateResponse: {
          data: {
            id: 7,
            name: 'Ada Lovelace',
            url: 'https://example.com/ada',
            description: 'Builds with precision.',
            imageURL: 'https://example.com/ada.jpg',
          },
          error: null,
        },
      }),
      error: null,
    });

    await screen.findByDisplayValue('Ada');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByTestId('location')).toHaveTextContent('/creators/7');
  });

  it('shows not found when the creator does not exist', async () => {
    renderPage({
      client: createHybridClient({
        listResponse: { data: [], error: null },
        detailResponse: { data: null, error: null },
      }),
      error: null,
    });

    expect(await screen.findByRole('heading', { name: 'Creator not found' })).toBeInTheDocument();
  });

  it('shows a readable error when update fails', async () => {
    renderPage({
      client: createHybridClient({
        listResponse: { data: [], error: null },
        detailResponse: {
          data: {
            id: 7,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Builds with precision.',
            imageURL: 'https://example.com/ada.jpg',
          },
          error: null,
        },
        updateResponse: { data: null, error: { message: 'Update failed' } },
      }),
      error: null,
    });

    await screen.findByDisplayValue('Ada');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed');
    expect(screen.getByTestId('location')).toHaveTextContent('/creators/7/edit');
  });
});
