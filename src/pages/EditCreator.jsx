import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCreator, getCreator, updateCreator } from '../client';
import CreatorForm from '../components/CreatorForm';

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
      try {
        setStatus('loading');
        setMessage('');
        setCreator(null);

        const data = await getCreator(id);

        if (!active) {
          return;
        }

        if (!data) {
          setStatus('notFound');
          return;
        }

        setCreator(data);
        setStatus('ready');
      } catch (loadError) {
        if (!active) {
          return;
        }

        setMessage(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : 'Unable to load this creator right now.',
        );
        setStatus('error');
      }
    }

    loadCreator();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleUpdateCreator(values) {
    const data = await updateCreator(id, values);

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

    setIsDeleting(true);
    setDeleteMessage('');

    try {
      await deleteCreator(id);
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
          <p>Loading creator {id} from the creators API.</p>
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
            description="Adjust the details and save the changes through the creators API."
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
