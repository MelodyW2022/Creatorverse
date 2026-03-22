import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { getSupabaseClientState } from './client';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';
import LandingPage from './pages/LandingPage';
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

function CreatorShell() {
  const { error } = getSupabaseClientState();

  if (error) {
    return <AppErrorState message={error} />;
  }

  return (
    <main className="app-shell app-shell-inner">
      <header className="topbar">
        <Link className="brand" to="/">
          Creatorverse
        </Link>
        <nav className="topbar-nav" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/creators">Creators</Link>
          <Link to="/creators/new">Add creator</Link>
        </nav>
      </header>

      <Outlet />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/creators" element={<LandingPage />} />
      <Route element={<CreatorShell />}>
        <Route path="/creators/new" element={<AddCreator />} />
        <Route path="/creators/:id" element={<ViewCreator />} />
        <Route path="/creators/:id/edit" element={<EditCreator />} />
      </Route>
    </Routes>
  );
}
