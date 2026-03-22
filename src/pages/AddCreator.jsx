import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClientState } from '../client';
import CreatorForm from '../components/CreatorForm';

const CREATOR_FIELDS = 'id, name, url, description, imageURL';

export default function AddCreator({ embedded = false, onCreated } = {}) {
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);

  async function handleCreateCreator(values) {
    const { client, error } = getSupabaseClientState();

    if (error) {
      throw new Error(error);
    }

    const { data, error: insertError } = await client
      .from('creators')
      .insert([values])
      .select(CREATOR_FIELDS)
      .maybeSingle();

    if (insertError) {
      throw new Error(insertError.message);
    }

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
        description="Enter the creator's public details and save them to Supabase."
        submitLabel="Create creator"
        onSubmit={handleCreateCreator}
      />
    </section>
  );
}
