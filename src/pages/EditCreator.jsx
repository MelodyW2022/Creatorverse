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
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDeleteCreator() {
    const shouldDelete = window.confirm('Delete this creator? This action cannot be undone.');

    if (!shouldDelete) {
      return;
    }

    const { client, error } = getSupabaseClientState();

    if (error) {
      setDeleteMessage(error);
      return;
    }

    setIsDeleting(true);
    setDeleteMessage('');

    try {
      const { error: deleteError } = await client.from('creators').delete().eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      navigate('/creators');
    } catch (deleteError) {
      setDeleteMessage(
        deleteError instanceof Error && deleteError.message
          ? deleteError.message
          : 'Unable to delete this creator right now.',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Edit creator</p>
        <h1>Edit creator</h1>
        <p className="page-intro">Update a creator, or remove them from the list.</p>
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
        <>
          {deleteMessage ? (
            <article className="panel state-panel" role="alert">
              <p className="eyebrow">Delete error</p>
              <h2>Unable to delete creator</h2>
              <p>{deleteMessage}</p>
            </article>
          ) : null}

          <CreatorForm
            title="Edit creator"
            description="Adjust the details and save the changes back to Supabase."
            initialValues={creator}
            submitLabel="Save changes"
            onSubmit={handleUpdateCreator}
          />

          <article className="panel">
            <div className="panel-copy">
              <p className="eyebrow">Danger zone</p>
              <h3>Delete this creator</h3>
              <p>This removes the creator from the database and sends you back to the list.</p>
            </div>

            <div className="panel-actions">
              <button
                className="button button-danger"
                type="button"
                onClick={handleDeleteCreator}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete creator'}
              </button>
            </div>
          </article>
        </>
      ) : null}
    </section>
  );
}
