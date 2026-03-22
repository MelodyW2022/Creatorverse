import { useState } from 'react';
import AddCreator from './AddCreator';
import ShowCreators from './ShowCreators';

export default function LandingPage() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <main className="landing-page">
      <div className="landing-stars" aria-hidden="true" />
      <section className="landing-stage">
        <h1 className="landing-title">CREATORVERSE</h1>

        <div className="landing-actions">
          <a className="landing-button" href="#creators-list">
            VIEW ALL CREATORS
          </a>
          <a className="landing-button" href="#add-creator">
            ADD A CREATOR
          </a>
        </div>
      </section>

      <section className="landing-content" aria-label="Homepage content">
        <AddCreator
          embedded
          onCreated={() => {
            setRefreshToken((current) => current + 1);
          }}
        />
        <ShowCreators embedded refreshToken={refreshToken} />
      </section>
    </main>
  );
}
