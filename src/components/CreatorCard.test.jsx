import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import CreatorCard from './CreatorCard';

describe('CreatorCard', () => {
  it('renders creator details and image fallback', () => {
    render(
      <MemoryRouter>
        <CreatorCard
          creator={{
            id: 1,
            name: 'Ada',
            url: 'https://example.com/ada',
            description: 'Math and programming history.',
            imageURL: '',
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByText('https://example.com/ada')).toBeInTheDocument();
    expect(screen.getByLabelText('No creator image')).toBeInTheDocument();
  });
});
