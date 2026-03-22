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
      <CreatorImage creator={creator} />

      <div className="panel-copy">
        <p className="eyebrow">Creator</p>
        <h2>{creator.name}</h2>
        <p>{creator.description}</p>
        <p className="creator-card-url">{creator.url}</p>
      </div>
    </article>
  );
}
