import { useEffect, useState } from 'react';
import CreatorCard from '../components/CreatorCard';
import { getSupabaseClientState } from '../client';

const CREATOR_FIELDS = 'id, name, url, description, imageURL';

export default function ShowCreators() {
  const [creators, setCreators] = useState([]);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCreators() {
      const { client, error } = getSupabaseClientState();

      if (error) {
        if (active) {
          setMessage(error);
          setStatus('error');
        }
        return;
      }

      setStatus('loading');
      const { data, error: queryError } = await client.from('creators').select(CREATOR_FIELDS);

      if (!active) {
        return;
      }

      if (queryError) {
        setMessage(queryError.message);
        setStatus('error');
        return;
      }

      setCreators(data ?? []);
      setStatus('ready');
    }

    loadCreators();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Homepage</p>
        <h1>Creatorverse</h1>
        <p className="page-intro">Browse a curated list of creators and jump into their details.</p>
      </header>

      {status === 'loading' ? (
        <article className="panel state-panel" role="status" aria-live="polite">
          <p className="eyebrow">Loading</p>
          <h2>Fetching creators</h2>
          <p>Loading the latest creator list from Supabase.</p>
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
