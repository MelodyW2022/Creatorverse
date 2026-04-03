import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import EditCreator from './EditCreator';
import { deleteCreator, getCreator, updateCreator } from '../client';

vi.mock('../client', () => ({
  deleteCreator: vi.fn(),
  getCreator: vi.fn(),
  updateCreator: vi.fn(),
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

function renderPage() {
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
    getCreator.mockResolvedValue({
      id: 7,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    renderPage();

    expect(await screen.findByDisplayValue('Ada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/ada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Builds with precision.')).toBeInTheDocument();
  });

  it('updates the creator and redirects to the detail page', async () => {
    getCreator.mockResolvedValue({
      id: 7,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    updateCreator.mockResolvedValue({
      id: 7,
      name: 'Ada Lovelace',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    renderPage();

    await screen.findByDisplayValue('Ada');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByTestId('location')).toHaveTextContent('/creators/7');
  });

  it('deletes the creator after confirmation and redirects to the creators list', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    getCreator.mockResolvedValue({
      id: 7,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    deleteCreator.mockResolvedValue(undefined);
    renderPage();

    await screen.findByDisplayValue('Ada');
    fireEvent.click(screen.getByRole('button', { name: 'Delete creator' }));

    expect(await screen.findByTestId('location')).toHaveTextContent('/creators');
  });

  it('does not delete when confirmation is canceled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    getCreator.mockResolvedValue({
      id: 7,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    renderPage();

    await screen.findByDisplayValue('Ada');
    fireEvent.click(screen.getByRole('button', { name: 'Delete creator' }));

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(deleteCreator).not.toHaveBeenCalled();
    expect(screen.getByTestId('location')).toHaveTextContent('/creators/7/edit');
  });

  it('shows not found when the creator does not exist', async () => {
    getCreator.mockResolvedValue(null);
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Creator not found' })).toBeInTheDocument();
  });

  it('shows a readable error when update fails', async () => {
    getCreator.mockResolvedValue({
      id: 7,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    updateCreator.mockRejectedValue(new Error('Update failed'));
    renderPage();

    await screen.findByDisplayValue('Ada');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed');
    expect(screen.getByTestId('location')).toHaveTextContent('/creators/7/edit');
  });

  it('shows a readable error when delete fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    getCreator.mockResolvedValue({
      id: 7,
      name: 'Ada',
      url: 'https://example.com/ada',
      description: 'Builds with precision.',
      imageURL: 'https://example.com/ada.jpg',
    });
    deleteCreator.mockRejectedValue(new Error('Delete failed'));
    renderPage();

    await screen.findByDisplayValue('Ada');
    fireEvent.click(screen.getByRole('button', { name: 'Delete creator' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Delete failed');
    expect(screen.getByTestId('location')).toHaveTextContent('/creators/7/edit');
  });
});
