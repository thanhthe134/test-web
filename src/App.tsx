import { useCallback, useEffect, useState } from 'react';
import { FigmaAdminView } from './components/figma/FigmaAdminView';
import { FigmaCollectionView } from './components/figma/FigmaCollectionView';
import {
  FigmaAboutView,
  FigmaInfoView,
  FigmaProjectsView,
} from './components/figma/FigmaExtraViews';
import { FigmaFooter } from './components/figma/FigmaFooter';
import { FigmaHeader, FigmaRoute } from './components/figma/FigmaHeader';
import { FigmaHomeView } from './components/figma/FigmaHomeView';
import { FigmaModelDetailView } from './components/figma/FigmaModelDetailView';
import { FigmaQuoteView } from './components/figma/FigmaQuoteView';
import {
  DEFAULT_MEDIA_LIBRARY,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_SETTINGS,
  PRODUCT_MODELS,
} from './data/figmaCatalog';
import { PublicCmsPayload } from './types/cms';

function getInitialRoute(): FigmaRoute {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
      return { page: 'admin' };
    }
  }
  return { page: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<FigmaRoute>(getInitialRoute);
  const [cms, setCms] = useState<PublicCmsPayload>({
    siteSettings: DEFAULT_SITE_SETTINGS,
    models: PRODUCT_MODELS,
    projects: DEFAULT_PROJECTS,
    media: DEFAULT_MEDIA_LIBRARY,
  });

  const fetchCms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/public');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        setCms(json.data as PublicCmsPayload);
      }
    } catch {
      // keep initial catalog defaults if API is temporarily unreachable
    }
  }, []);

  useEffect(() => {
    fetchCms();
  }, [fetchCms]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        setRoute({ page: 'admin' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (next: FigmaRoute) => {
    setRoute(next);
    if (next.page === 'admin') {
      window.history.replaceState(null, '', '#/admin');
    } else if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route.page === 'admin') {
    return (
      <FigmaAdminView
        cms={cms}
        onCmsUpdated={fetchCms}
        onExitAdmin={() => handleNavigate({ page: 'home' })}
      />
    );
  }

  const activeModel =
    route.page === 'detail'
      ? cms.models.find((m) => m.id === route.modelId) || cms.models[0]
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-white">
      <FigmaHeader
        route={route}
        activeCollectionSlug={activeModel?.collection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {route.page === 'home' && (
          <FigmaHomeView
            siteSettings={cms.siteSettings}
            onNavigate={handleNavigate}
          />
        )}

        {route.page === 'about' && (
          <FigmaAboutView
            siteSettings={cms.siteSettings}
            onNavigate={handleNavigate}
          />
        )}

        {route.page === 'collection' && (
          <FigmaCollectionView
            slug={route.slug}
            allModels={cms.models}
            onNavigate={handleNavigate}
          />
        )}

        {route.page === 'detail' && activeModel && (
          <FigmaModelDetailView
            model={activeModel}
            allModels={cms.models}
            onNavigate={handleNavigate}
          />
        )}

        {route.page === 'projects' && (
          <FigmaProjectsView
            projects={cms.projects}
            onNavigate={handleNavigate}
          />
        )}

        {route.page === 'info' && (
          <FigmaInfoView media={cms.media} onNavigate={handleNavigate} />
        )}

        {route.page === 'quote' && (
          <FigmaQuoteView
            prefillModel={route.prefillModel}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <FigmaFooter
        route={route}
        detailCollectionSlug={activeModel?.collection}
        detailCollectionName={activeModel?.collectionName}
        siteSettings={cms.siteSettings}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
