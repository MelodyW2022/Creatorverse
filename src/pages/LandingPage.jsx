import { useEffect, useState } from 'react';
import AddCreator from './AddCreator';
import ShowCreators from './ShowCreators';

export default function LandingPage() {
  const [refreshToken, setRefreshToken] = useState(0);

  function scrollToSection(sectionId, pushHash = true) {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    if (pushHash) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');

    if (!hash) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToSection(hash, false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="landing-page">
      <div className="landing-stars" aria-hidden="true" />
      <section className="landing-stage">
        <div className="landing-stage-inner">
          <h1 className="landing-title">CREATORVERSE</h1>

          <div className="landing-actions">
            <a
              className="landing-button"
              href="#creators-list"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('creators-list');
              }}
            >
              VIEW ALL CREATORS
            </a>
            <a
              className="landing-button"
              href="#add-creator"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('add-creator');
              }}
            >
              ADD A CREATOR
            </a>
          </div>
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
