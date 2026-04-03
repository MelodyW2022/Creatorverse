import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCreator } from '../client';

function CreatorImage({ creator }) {
  if (creator.imageURL) {
    return <img className="creator-detail-image" src={creator.imageURL} alt={creator.name} />;
  }

  return (
    <div className="creator-detail-image creator-card-placeholder" aria-label="No creator image">
      <span>No image</span>
    </div>
  );
}

export default function ViewCreator() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCreator() {
      try {
        setStatus('loading');
        const data = await getCreator(id);

        if (!active) {
          return;
        }

        if (!data) {
          setCreator(null);
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

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Creator details</p>
        <h1>View creator</h1>
        <p className="page-intro">Open the creator profile, visit the source, or handle missing data.</p>
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
        <article className="panel creator-detail">
          <CreatorImage creator={creator} />

          <div className="panel-copy">
            <p className="eyebrow">Creator</p>
            <h2>{creator.name}</h2>
            <p>{creator.description}</p>
            <p className="creator-card-url">{creator.url}</p>
          </div>

          <div className="panel-actions">
            <a className="button" href={creator.url} target="_blank" rel="noreferrer">
              Visit creator URL
            </a>
            <Link className="button button-secondary" to={`/creators/${creator.id}/edit`}>
              Edit creator
            </Link>
            <Link className="button button-secondary" to="/creators">
              Back to creators
            </Link>
          </div>
        </article>
      ) : null}
    </section>
  );
}
