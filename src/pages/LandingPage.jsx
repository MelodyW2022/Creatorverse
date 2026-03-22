import { Link } from 'react-router-dom';
import ShowCreators from './ShowCreators';

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-stars" aria-hidden="true" />
      <section className="landing-stage">
        <h1 className="landing-title">CREATORVERSE</h1>

        <div className="landing-actions">
          <a className="landing-button" href="#creators-list">
            VIEW ALL CREATORS
          </a>
          <Link className="landing-button" to="/creators/new">
            ADD A CREATOR
          </Link>
        </div>
      </section>

      <section className="landing-creators" aria-label="Creators list">
        <ShowCreators embedded />
      </section>
    </main>
  );
}
