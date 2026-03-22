import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CreatorForm from './CreatorForm';

describe('CreatorForm', () => {
  it('blocks submission when required fields are empty', async () => {
    const handleSubmit = vi.fn();

    render(
      <CreatorForm
        title="Add creator"
        description="Create a creator record."
        submitLabel="Create creator"
        onSubmit={handleSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create creator' }));

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('URL is required.')).toBeInTheDocument();
    expect(screen.getByText('Description is required.')).toBeInTheDocument();
  });
});
