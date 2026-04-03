import { useEffect, useState } from 'react';
import CreatorCard from '../components/CreatorCard';
import { listCreators } from '../client';

export default function ShowCreators({ embedded = false, refreshToken = 0 } = {}) {
  const [creators, setCreators] = useState([]);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCreators() {
      try {
        setStatus('loading');
        const data = await listCreators();

        if (!active) {
          return;
        }

        setCreators(data);
        setStatus('ready');
      } catch (loadError) {
        if (!active) {
          return;
        }

        setMessage(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : 'Unable to load creators right now.',
        );
        setStatus('error');
      }
    }

    loadCreators();

    return () => {
      active = false;
    };
  }, [refreshToken]);

  return (
    <section className={embedded ? 'creators-section' : 'page'}>
      <header className="page-header" id={embedded ? 'creators-list' : undefined}>
        <p className="eyebrow">Creators</p>
        <h2>All creators</h2>
        <p className="page-intro">Browse the creators in the database and open any profile.</p>
      </header>

      {status === 'loading' ? (
        <article className="panel state-panel" role="status" aria-live="polite">
          <p className="eyebrow">Loading</p>
          <h2>Fetching creators</h2>
          <p>Loading the latest creator list from the creators API.</p>
        </article>
      ) : null}

      {status === 'error' ? (
        <article className="panel state-panel" role="alert">
          <p className="eyebrow">Error</p>
          <h2>Unable to load creators</h2>
          <p>{message}</p>
        </article>
      ) : null}

      {status === 'ready' && creators.length === 0 ? (
        <article className="panel state-panel">
          <p className="eyebrow">Empty</p>
          <h2>No creators yet</h2>
          <p>The database returned no creators.</p>
        </article>
      ) : null}

      {status === 'ready' && creators.length > 0 ? (
        <section className="creator-list" aria-label="Creators">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </section>
      ) : null}
    </section>
  );
}
