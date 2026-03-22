import { Link, Route, Routes } from 'react-router-dom';
import { getSupabaseClientState } from './client';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';

function AppErrorState({ message }) {
  return (
    <main className="app-shell app-shell-error">
      <section className="panel error-panel" role="alert" aria-live="polite">
        <p className="eyebrow">Configuration error</p>
        <h1>Creatorverse is not configured yet</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}

export default function App() {
  const { error } = getSupabaseClientState();

  if (error) {
    return <AppErrorState message={error} />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          Creatorverse
        </Link>
        <nav className="topbar-nav" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/creators/new">Add creator</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ShowCreators />} />
        <Route path="/creators/new" element={<AddCreator />} />
        <Route path="/creators/:id" element={<ViewCreator />} />
        <Route path="/creators/:id/edit" element={<EditCreator />} />
      </Routes>
    </main>
  );
}
