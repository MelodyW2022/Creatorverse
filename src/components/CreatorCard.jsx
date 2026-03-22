import { Link } from 'react-router-dom';

function CreatorImage({ creator }) {
  if (creator.imageURL) {
    return <img className="creator-card-image" src={creator.imageURL} alt={creator.name} />;
  }

  return (
    <div className="creator-card-image creator-card-placeholder" aria-label="No creator image">
      <span>No image</span>
    </div>
  );
}

export default function CreatorCard({ creator }) {
  return (
    <article className="panel creator-card">
      <Link className="creator-card-body" to={`/creators/${creator.id}`} aria-label={creator.name}>
        <CreatorImage creator={creator} />

        <div className="panel-copy">
          <p className="eyebrow">Creator</p>
          <h2>{creator.name}</h2>
          <p>{creator.description}</p>
          <p className="creator-card-url">{creator.url}</p>
        </div>
      </Link>

      <div className="panel-actions">
        <a className="button" href={creator.url} target="_blank" rel="noreferrer">
          Visit creator URL
        </a>
        <Link className="button button-secondary" to={`/creators/${creator.id}/edit`}>
          Edit creator
        </Link>
      </div>
    </article>
  );
}
