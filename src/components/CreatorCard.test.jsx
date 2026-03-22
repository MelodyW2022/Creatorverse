import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CreatorCard from './CreatorCard';

describe('CreatorCard', () => {
  it('navigates to the creator details page from the card body', () => {
    render(
      <MemoryRouter>
        <CreatorCard
          creator={{
            id: 7,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Builds with precision.',
            imageURL: 'https://example.com/ada.jpg',
          }}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Ada' }));

    expect(screen.getByRole('link', { name: 'Ada' })).toHaveAttribute('href', '/creators/7');
    expect(screen.getByRole('link', { name: 'Visit creator URL' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByRole('link', { name: 'Edit creator' })).toHaveAttribute(
      'href',
      '/creators/7/edit',
    );
  });
});
