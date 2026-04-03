import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AddCreator from './AddCreator';
import { createCreator } from '../client';

vi.mock('../client', () => ({
  createCreator: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/creators/new']}>
      <LocationDisplay />
      <Routes>
        <Route path="/creators/new" element={<AddCreator />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AddCreator', () => {
  it('creates a creator and redirects to the creators list', async () => {
    createCreator.mockResolvedValue({
      id: 10,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    renderPage();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/ada' } });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Builds with precision.' },
    });
    fireEvent.change(screen.getByLabelText('Image URL'), {
      target: { value: 'https://example.com/ada.jpg' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create creator' }));

    expect(await screen.findByTestId('location')).toHaveTextContent('/');
  });

  it('shows a readable error when creation fails', async () => {
    createCreator.mockRejectedValue(new Error('Insert failed'));
    renderPage();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/ada' } });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Builds with precision.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create creator' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Insert failed');
    expect(screen.getByTestId('location')).toHaveTextContent('/creators/new');
  });
});
