import { useEffect, useState } from 'react';
import { AdminView } from './components/AdminView';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { ProductDetailView } from './components/ProductDetailView';
import { ProductsView } from './components/ProductsView';
import { ProjectsView } from './components/ProjectsView';
import { ShowreelModal } from './components/ShowreelModal';
import { EQUIPMENT_CATALOG } from './data/equipmentData';
import {
  AppView,
  EquipmentItem,
  ProductCategoryKey,
  ProjectCase,
  QuoteCategoryOption,
} from './types/equipment';

function mapEquipmentToQuoteOption(item: EquipmentItem): QuoteCategoryOption {
  if (item.systemType === 'kinetic-ball') return 'Kinetic Ball';
  if (item.systemType === 'kinetic-ring') return 'Kinetic Ring';
  if (item.systemType === 'laser-pro') return 'Laser';
  return 'LED Matrix';
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalog, setCatalog] = useState<EquipmentItem[]>(EQUIPMENT_CATALOG);
  const [selectedProductId, setSelectedProductId] = useState<string>(EQUIPMENT_CATALOG[0].id);
  const [showreelOpen, setShowreelOpen] = useState(false);

  const [prefilledCategories, setPrefilledCategories] = useState<QuoteCategoryOption[]>([]);
  const [prefilledNote, setPrefilledNote] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setCatalog(json.data);
        }
      })
      .catch(() => {
        // Fallback smoothly to local bundled catalog if server isn't reachable
      });
    return () => {
      active = false;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    scrollToTop();
  };

  const handleNavigateProducts = (category: ProductCategoryKey = 'all') => {
    setSelectedCategory(category);
    setCurrentView('products');
    scrollToTop();
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('detail');
    scrollToTop();
  };

  const handleRequestQuoteForItem = (equipment: EquipmentItem) => {
    const option = mapEquipmentToQuoteOption(equipment);
    setPrefilledCategories([option]);
    setPrefilledNote(
      `Yêu cầu báo giá chi tiết cho thiết bị: ${equipment.name} (Mã ${equipment.code}).`
    );
    setCurrentView('contact');
    scrollToTop();
  };

  const handleRequestProjectQuote = (project: ProjectCase) => {
    const mapped: QuoteCategoryOption[] = [];
    if (project.equipmentUsed.some((e) => e.includes('Kinetic Ball') || e.includes('Sphere'))) {
      mapped.push('Kinetic Ball');
    }
    if (project.equipmentUsed.some((e) => e.includes('Ring'))) {
      mapped.push('Kinetic Ring');
    }
    if (project.equipmentUsed.some((e) => e.includes('Laser'))) {
      mapped.push('Laser');
    }
    if (project.equipmentUsed.some((e) => e.includes('LED Matrix'))) {
      mapped.push('LED Matrix');
    }
    setPrefilledCategories(mapped.length > 0 ? mapped : ['Kinetic Ball']);
    setPrefilledNote(
      `Tham khảo cấu hình tương tự dự án "${project.title}" (Kích thước sân khấu mẫu: ${project.stageDimension}).`
    );
    setCurrentView('contact');
    scrollToTop();
  };

  const handleEquipmentAdded = (item: EquipmentItem) => {
    setCatalog((prev) => [...prev, item]);
  };

  const activeProduct =
    catalog.find((item) => item.id === selectedProductId) || catalog[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-white">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenQuote={() => {
          setPrefilledCategories([]);
          setPrefilledNote('');
          handleNavigate('contact');
        }}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigateProducts={handleNavigateProducts}
            onSelectProduct={handleSelectProduct}
            onNavigateProjects={() => handleNavigate('projects')}
            onOpenShowreel={() => setShowreelOpen(true)}
            onNavigateQuote={() => handleNavigate('contact')}
          />
        )}

        {currentView === 'products' && (
          <ProductsView
            catalog={catalog}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'detail' && (
          <ProductDetailView
            equipment={activeProduct}
            catalog={catalog}
            onBackToCatalog={() => handleNavigate('products')}
            onRequestQuoteForItem={handleRequestQuoteForItem}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsView
            onNavigateProducts={handleNavigateProducts}
            onRequestProjectQuote={handleRequestProjectQuote}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            prefilledCategories={prefilledCategories}
            prefilledNote={prefilledNote}
          />
        )}

        {currentView === 'admin' && (
          <AdminView onEquipmentAdded={handleEquipmentAdded} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        onExploreEquipment={() => handleNavigateProducts('all')}
      />
    </div>
  );
}
