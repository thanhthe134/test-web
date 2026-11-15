import { useState } from 'react';
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
import { PRODUCT_MODELS } from './data/figmaCatalog';

export default function App() {
  const [route, setRoute] = useState<FigmaRoute>({ page: 'home' });

  const handleNavigate = (next: FigmaRoute) => {
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeModel =
    route.page === 'detail'
      ? PRODUCT_MODELS.find((m) => m.id === route.modelId) || PRODUCT_MODELS[0]
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-white">
      <FigmaHeader
        route={route}
        activeCollectionSlug={activeModel?.collection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {route.page === 'home' && <FigmaHomeView onNavigate={handleNavigate} />}

        {route.page === 'about' && <FigmaAboutView onNavigate={handleNavigate} />}

        {route.page === 'collection' && (
          <FigmaCollectionView slug={route.slug} onNavigate={handleNavigate} />
        )}

        {route.page === 'detail' && activeModel && (
          <FigmaModelDetailView model={activeModel} onNavigate={handleNavigate} />
        )}

        {route.page === 'projects' && <FigmaProjectsView onNavigate={handleNavigate} />}

        {route.page === 'info' && <FigmaInfoView onNavigate={handleNavigate} />}

        {route.page === 'quote' && (
          <FigmaQuoteView prefillModel={route.prefillModel} onNavigate={handleNavigate} />
        )}
      </main>

      <FigmaFooter
        route={route}
        detailCollectionSlug={activeModel?.collection}
        detailCollectionName={activeModel?.collectionName}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
