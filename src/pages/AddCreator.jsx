import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCreator } from '../client';
import CreatorForm from '../components/CreatorForm';

export default function AddCreator({ embedded = false, onCreated } = {}) {
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);

  async function handleCreateCreator(values) {
    const data = await createCreator(values);

    if (!data) {
      throw new Error('Creator could not be created.');
    }

    if (embedded) {
      onCreated?.(data);
      setFormKey((current) => current + 1);
      return;
    }

    navigate('/');
  }

  return (
    <section className={embedded ? 'landing-add-section' : 'page'}>
      <header className="page-header" id={embedded ? 'add-creator' : undefined}>
        <p className="eyebrow">Add creator</p>
        <h1>New creator</h1>
        <p className="page-intro">Create a new creator and send them back to the list.</p>
      </header>

      <CreatorForm
        key={formKey}
        title="Add a creator"
        description="Enter the creator's public details and save them through the creators API."
        submitLabel="Create creator"
        onSubmit={handleCreateCreator}
      />
    </section>
  );
}
