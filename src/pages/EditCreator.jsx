import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSupabaseClientState } from '../client';
import CreatorForm from '../components/CreatorForm';

const CREATOR_FIELDS = 'id, name, url, description, imageURL';

export default function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCreator() {
      const { client, error } = getSupabaseClientState();

      if (error) {
        if (active) {
          setMessage(error);
          setStatus('error');
        }

        return;
      }

      setStatus('loading');
      setMessage('');
      setCreator(null);

      const { data, error: queryError } = await client
        .from('creators')
        .select(CREATOR_FIELDS)
        .eq('id', id)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (queryError) {
        setMessage(queryError.message);
        setStatus('error');
        return;
      }

      if (!data) {
        setStatus('notFound');
        return;
      }

      setCreator(data);
      setStatus('ready');
    }

    loadCreator();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleUpdateCreator(values) {
    const { client, error } = getSupabaseClientState();

    if (error) {
      throw new Error(error);
    }

    const { data, error: updateError } = await client
      .from('creators')
      .update(values)
      .eq('id', id)
      .select(CREATOR_FIELDS)
      .maybeSingle();

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (!data) {
      throw new Error('Creator could not be updated.');
    }

    navigate(`/creators/${id}`);
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Edit creator</p>
        <h1>Edit creator</h1>
        <p className="page-intro">Update a creator and return to their profile.</p>
      </header>

      {status === 'loading' ? (
        <article className="panel state-panel" role="status" aria-live="polite">
          <p className="eyebrow">Loading</p>
          <h2>Fetching creator</h2>
          <p>Loading creator {id} from Supabase.</p>
        </article>
      ) : null}

      {status === 'error' ? (
        <article className="panel state-panel" role="alert">
          <p className="eyebrow">Error</p>
          <h2>Unable to load creator</h2>
          <p>{message}</p>
        </article>
      ) : null}

      {status === 'notFound' ? (
        <article className="panel state-panel" role="alert">
          <p className="eyebrow">Not found</p>
          <h2>Creator not found</h2>
          <p>The creator with id {id} does not exist.</p>
        </article>
      ) : null}

      {status === 'ready' && creator ? (
        <CreatorForm
          title="Edit creator"
          description="Adjust the details and save the changes back to Supabase."
          initialValues={creator}
          submitLabel="Save changes"
          onSubmit={handleUpdateCreator}
        />
      ) : null}
    </section>
  );
}
