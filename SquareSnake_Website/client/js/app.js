/**
 * SquareSnake FX Việt Nam — Front-end SPA Engine (JS ES6+ & Fetch API)
 * Đồng bộ trực tiếp với Back-end Node.js/Express & CSDL MySQL 4 bảng (categories, products, projects, contacts)
 */
const API_BASE = '/api';

const COLLECTION_META = {
  'led-matrix': {
    slug: 'led-matrix',
    name: 'LED Matrix',
    kicker: '01 / LED MATRIX',
    heroLine1: 'Every pixel.',
    heroLine2: 'Every possibility.',
    heroDesc:
      'Định hình sân khấu với hiệu ứng điểm ảnh lập trình đa chiều.\nKhám phá biến thể 20-pixel và 60-pixel LED Matrix.',
    heroImage: 'assets/squaresnake/led-matrix.jpg',
    rangeKicker: 'FIND YOUR FORMAT',
    rangeTitle: 'The LED Matrix range',
    inspirationKicker: 'PROGRAM INSPIRATION',
    inspirationTitle: 'A new language of light.',
    inspirations: [
      { num: '01 / Pixel chase', body: 'Xây dựng nhịp điệu với chuỗi chasing mượt mà và đường dẫn định hướng.' },
      { num: '02 / Wave forms', body: 'Biến mảng đèn thành hiệu ứng sóng ánh sáng uyển chuyển trên không trung.' },
      { num: '03 / Pattern play', body: 'Khai thác cấu trúc hình học và cường độ ánh sáng đồng bộ âm nhạc.' },
    ],
    bannerKicker: "LET'S TALK PIXELS",
    bannerTitle: 'Your show. Your configuration.',
  },
  laser: {
    slug: 'laser',
    name: 'Laser',
    kicker: '02 / LASER',
    heroLine1: 'Precision light.',
    heroLine2: 'Powerful impact.',
    heroDesc:
      'Khám phá hệ thống trình diễn Laser RGB với 4 tùy chọn công suất thực 20W, 30W, 40W và 60W.',
    heroImage: 'assets/squaresnake/laser.jpg',
    rangeKicker: 'EXPLORE THE COLLECTION',
    rangeTitle: 'The Laser range',
    inspirationKicker: 'BEAM & SHOW INSPIRATION',
    inspirationTitle: 'Make light the main event.',
    inspirations: [
      { num: '01 / Beam fans', body: 'Tạo khối hình học sắc lẹm với quạt tia Laser quét rộng toàn sân khấu.' },
      { num: '02 / Aerial textures', body: 'Tạo lớp không gian nhiều tầng trên nền khói lạnh và haze sân khấu.' },
      { num: '03 / Show cues', body: 'Đồng bộ tuyệt đối qua Pangolin FB4 & Timecode theo từng cao trào nhạc.' },
    ],
    bannerKicker: "LET'S TALK LASERS",
    bannerTitle: 'A setup shaped around your show.',
  },
  kinetic: {
    slug: 'kinetic',
    name: 'Kinetic',
    kicker: '03 / KINETIC',
    heroLine1: 'Sculpt the air.',
    heroLine2: 'Move the room.',
    heroDesc:
      'Chuyển động cơ khí chính xác. Đồng bộ ánh sáng 360°.\nKhám phá 5 hình dáng nghệ thuật: Balls, Rings, Lanterns, Milk-drop và Metal spheres.',
    heroImage: 'assets/squaresnake/kinetic-balls.jpg',
    rangeKicker: 'EXPLORE THE COLLECTION',
    rangeTitle: 'The Kinetic range',
    inspirationKicker: 'MOTION INSPIRATION',
    inspirationTitle: 'More than a lighting fixture.',
    inspirations: [
      { num: '01 / Wave motion', body: 'Hình khối chuyển động lượn sóng nhịp nhàng trên mảng tời treo trần.' },
      { num: '02 / Living sculptures', body: 'Biến đổi không gian 3D liên tục theo kịch bản đạo diễn sân khấu.' },
      { num: '03 / Light choreography', body: 'Kết hợp cơ khí servo siêu êm với nhịp điệu âm nhạc Timecode.' },
    ],
    bannerKicker: "LET'S TALK MOVEMENT",
    bannerTitle: 'A setup shaped around your show.',
  },
};

const state = {
  route: { page: 'home', slug: 'led-matrix', modelCode: '' },
  categories: [],
  products: [],
  projects: [],
  preselectedProductLabel: '',
};

document.addEventListener('DOMContentLoaded', async () => {
  bindNavigationDelegates();
  await Promise.all([fetchCategories(), fetchProducts(), fetchProjects()]);
  navigateFromHash();
  window.addEventListener('hashchange', navigateFromHash);
});

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/products/categories`);
    const json = await res.json();
    if (json.success) state.categories = json.data || [];
  } catch (err) {
    console.error('Lỗi tải categories:', err);
  }
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const json = await res.json();
    if (json.success) state.products = json.data || [];
  } catch (err) {
    console.error('Lỗi tải products:', err);
  }
}

async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const json = await res.json();
    if (json.success) state.projects = json.data || [];
  } catch (err) {
    console.error('Lỗi tải projects:', err);
  }
}

function bindNavigationDelegates() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-route]');
    if (!trigger) return;

    const href = trigger.getAttribute('href');
    if (href && href.endsWith('.html')) return;

    e.preventDefault();
    const page = trigger.dataset.route;
    const slug = trigger.dataset.slug || 'led-matrix';
    const model = trigger.dataset.model || '';
    const scrollTarget = trigger.dataset.scroll || '';

    if (page === 'quote' && trigger.dataset.quoteProduct) {
      state.preselectedProductLabel = trigger.dataset.quoteProduct;
    }

    setRoute({ page, slug, modelCode: model }, scrollTarget);
  });
}

function setRoute(next, scrollTarget = '') {
  state.route = next;
  if (next.page === 'home') {
    history.replaceState(null, '', '#home');
  } else if (next.page === 'collection') {
    history.replaceState(null, '', `#collection/${next.slug}`);
  } else if (next.page === 'model') {
    history.replaceState(null, '', `#model/${next.modelCode}`);
  } else {
    history.replaceState(null, '', `#${next.page}`);
  }
  renderActiveView();
  updateNavActiveIndicator();

  if (scrollTarget) {
    setTimeout(() => {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function navigateFromHash() {
  const hash = (window.location.hash || '#home').replace(/^#/, '');
  if (hash.startsWith('collection/')) {
    const slug = hash.split('/')[1] || 'led-matrix';
    state.route = { page: 'collection', slug, modelCode: '' };
  } else if (hash.startsWith('model/')) {
    const code = hash.split('/')[1] || '';
    state.route = { page: 'model', slug: 'led-matrix', modelCode: code };
  } else if (['about', 'projects', 'info', 'quote'].includes(hash)) {
    state.route = { page: hash, slug: 'led-matrix', modelCode: '' };
  } else {
    state.route = { page: 'home', slug: 'led-matrix', modelCode: '' };
  }
  renderActiveView();
  updateNavActiveIndicator();
}

function updateNavActiveIndicator() {
  document.querySelectorAll('.ss-nav-link').forEach((el) => el.classList.remove('active'));
  const page = state.route.page;
  if (page === 'home') {
    document.querySelector('[data-route="home"]')?.classList.add('active');
  } else if (page === 'about') {
    document.querySelector('[data-route-group="about"]')?.classList.add('active');
  } else if (page === 'collection' || page === 'model') {
    document.querySelector('[data-route-group="products"]')?.classList.add('active');
  } else if (page === 'projects') {
    document.querySelector('[data-route="projects"]')?.classList.add('active');
  } else if (page === 'info') {
    document.querySelector('[data-route-group="info"]')?.classList.add('active');
  }
}

function normalizeImageUrl(url) {
  if (!url) return 'assets/squaresnake/hero-concert.jpg';
  return url.startsWith('/assets/') ? url.slice(1) : url;
}

function renderActiveView() {
  const root = document.getElementById('appRoot');
  const { page } = state.route;
  if (page === 'home') {
    root.innerHTML = renderHomeView();
  } else if (page === 'collection') {
    root.innerHTML = renderCollectionView(state.route.slug);
  } else if (page === 'model') {
    root.innerHTML = renderModelDetailView(state.route.modelCode);
  } else if (page === 'about') {
    root.innerHTML = renderAboutView();
  } else if (page === 'projects') {
    root.innerHTML = renderProjectsView();
  } else if (page === 'info') {
    root.innerHTML = renderInfoView();
  } else if (page === 'quote') {
    root.innerHTML = renderQuoteView();
    bindQuoteForm();
  }
}

function renderHomeView() {
  const collections = [
    COLLECTION_META['led-matrix'],
    COLLECTION_META.laser,
    COLLECTION_META.kinetic,
  ];
  const featured = state.products.slice(0, 6);

  return `
    <!-- HERO SECTION -->
    <section class="py-5 border-bottom border-divider">
      <div class="container py-lg-4">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <p class="ss-kicker mb-3">LIGHT. MOTION. IMPACT.</p>
            <h1 class="display-4 fw-semibold font-display text-white mb-4" style="letter-spacing: -0.025em; line-height: 1.06;">
              Built for the<br/>unforgettable.
            </h1>
            <p class="text-muted-ss mb-4 lh-lg">
              LED Matrix, Laser công suất lớn &amp; hệ thống cơ khí Kinetic.<br/>
              Showroom Kỹ thuật số 24/7 của Công ty SquareSnake FX Việt Nam.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <button type="button" class="btn-ss-gold" data-route="collection" data-slug="kinetic">
                <span>Khám phá Kinetic &amp; Laser</span>
                <span>↗</span>
              </button>
              <button type="button" class="btn-ss-dark" data-route="quote">
                <span>Request a quote</span>
                <span>↗</span>
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="ss-media-frame">
              <img src="assets/squaresnake/hero-concert.jpg" alt="SquareSnake FX Concert Stage" />
            </div>
            <p class="text-muted-ss text-uppercase mt-2 mb-0" style="font-size: 10px; letter-spacing: 0.08em;">
              VISUAL CONCEPT / SQUARESNAKE FX VIETNAM
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 CORE COLLECTIONS (LED MATRIX, LASER, KINETIC) -->
    <section class="py-5 border-bottom border-divider">
      <div class="container py-lg-3">
        <p class="ss-kicker mb-2">THREE CORE COLLECTIONS</p>
        <h2 class="h2 fw-semibold font-display text-white mb-4">Hệ thống thiết bị hiệu ứng chủ lực</h2>
        <div class="row g-4">
          ${collections
            .map(
              (col) => `
            <div class="col-md-4">
              <article class="ss-card ss-card-hover h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="ss-media-frame border-0 border-bottom border-subtle">
                    <img src="${col.heroImage}" alt="${col.name}" />
                  </div>
                  <div class="p-4">
                    <p class="ss-kicker mb-2">${col.kicker}</p>
                    <h3 class="h4 fw-semibold font-display text-white mb-2">${col.name}</h3>
                    <p class="small text-muted-ss mb-0">${col.heroDesc.replace(/\n/g, ' ')}</p>
                  </div>
                </div>
                <div class="px-4 pb-4">
                  <button type="button" class="btn-ss-dark w-100 justify-content-between" data-route="collection" data-slug="${col.slug}">
                    <span>Explore ${col.name}</span>
                    <span class="text-gold">↗</span>
                  </button>
                </div>
              </article>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- LIVE CATALOG FROM MYSQL -->
    <section class="py-5 border-bottom border-divider">
      <div class="container py-lg-3">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <p class="ss-kicker mb-2">MYSQL LIVE CATALOG</p>
            <h2 class="h3 fw-semibold font-display text-white mb-0">Thiết bị nổi bật sẵn kho</h2>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn-ss-dark" data-route="collection" data-slug="led-matrix">LED Matrix</button>
            <button type="button" class="btn-ss-dark" data-route="collection" data-slug="laser">Laser</button>
            <button type="button" class="btn-ss-dark" data-route="collection" data-slug="kinetic">Kinetic</button>
          </div>
        </div>
        <div class="row g-4">
          ${featured
            .map(
              (p) => `
            <div class="col-md-6 col-lg-4">
              <article class="ss-card ss-card-hover h-100 d-flex flex-column justify-content-between p-4">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="ss-kicker">${p.category_name}</span>
                    <span class="font-mono small text-muted-ss">${p.model_code}</span>
                  </div>
                  <h3 class="h5 fw-semibold text-white mb-2">${p.product_name}</h3>
                  <p class="small text-muted-ss mb-3">${p.short_description}</p>
                </div>
                <button type="button" class="btn-ss-dark w-100 justify-content-between" data-route="model" data-model="${p.model_code}">
                  <span>Xem thông số kỹ thuật</span>
                  <span class="text-gold">↗</span>
                </button>
              </article>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- GOLD BANNER -->
    <section class="py-5">
      <div class="container">
        <div class="ss-gold-banner p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <p class="fw-semibold text-uppercase mb-2" style="font-size: 11px; letter-spacing: 0.12em;">
              MAKE IT PART OF YOUR NEXT SHOW
            </p>
            <h2 class="h2 fw-semibold font-display mb-1">Let’s talk about your project.</h2>
            <p class="small mb-0 opacity-75">Gửi thông số sân khấu để nhận phương án kỹ thuật &amp; báo giá cạnh tranh.</p>
          </div>
          <button type="button" class="btn-ss-banner-dark text-nowrap" data-route="quote">
            <span>Request a quote</span>
            <span>↗</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderCollectionView(slug) {
  const col = COLLECTION_META[slug] || COLLECTION_META['led-matrix'];
  const models = state.products.filter((p) => p.category_slug === col.slug);

  return `
    <div class="container pt-4 pb-2">
      <div class="d-flex align-items-center gap-2 small text-muted-ss">
        <a href="#home" data-route="home" class="text-muted-ss text-decoration-none">Trang Chủ</a>
        <span>/</span>
        <span class="text-white">${col.name}</span>
      </div>
    </div>

    <section class="py-4 pb-5 border-bottom border-divider">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5">
            <p class="ss-kicker mb-3">${col.kicker}</p>
            <h1 class="display-4 fw-semibold font-display text-white mb-4" style="letter-spacing: -0.025em; line-height: 1.06;">
              ${col.heroLine1}<br/>${col.heroLine2}
            </h1>
            <p class="text-muted-ss lh-lg mb-4">${col.heroDesc.replace(/\n/g, '<br/>')}</p>
            <button type="button" class="btn-ss-gold" data-route="quote" data-quote-product="${col.name}">
              <span>Request pricing</span>
              <span>↗</span>
            </button>
          </div>
          <div class="col-lg-7">
            <div class="ss-media-frame">
              <img src="${col.heroImage}" alt="${col.name}" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 border-bottom border-divider">
      <div class="container">
        <p class="ss-kicker mb-2">${col.rangeKicker}</p>
        <h2 class="h2 fw-semibold font-display text-white mb-4">${col.rangeTitle}</h2>
        <div class="row g-4">
          ${models
            .map(
              (m) => `
            <div class="col-md-6 col-lg-4">
              <article class="ss-card ss-card-hover h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="ss-media-frame border-0 border-bottom border-subtle">
                    <img src="${normalizeImageUrl(m.image_url)}" alt="${m.product_name}" />
                  </div>
                  <div class="p-4">
                    <p class="ss-kicker mb-2">${m.model_code}</p>
                    <h3 class="h4 fw-semibold font-display text-white mb-2">${m.product_name}</h3>
                    <p class="small text-muted-ss mb-0">${m.short_description}</p>
                  </div>
                </div>
                <div class="px-4 pb-4">
                  <button type="button" class="btn-ss-dark w-100 justify-content-between" data-route="model" data-model="${m.model_code}">
                    <span>Explore specs</span>
                    <span class="text-gold">↗</span>
                  </button>
                </div>
              </article>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="py-5 border-bottom border-divider">
      <div class="container">
        <p class="ss-kicker mb-2">${col.inspirationKicker}</p>
        <h2 class="h3 fw-semibold font-display text-white mb-4">${col.inspirationTitle}</h2>
        <div class="row g-4">
          ${col.inspirations
            .map(
              (item) => `
            <div class="col-md-4">
              <div class="ss-card p-4 h-100">
                <p class="ss-kicker mb-2">${item.num}</p>
                <p class="small text-secondary mb-0 lh-lg">${item.body}</p>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="ss-gold-banner p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <p class="fw-semibold text-uppercase mb-2" style="font-size: 11px; letter-spacing: 0.12em;">${col.bannerKicker}</p>
            <h2 class="h2 fw-semibold font-display mb-0">${col.bannerTitle}</h2>
          </div>
          <button type="button" class="btn-ss-banner-dark" data-route="quote" data-quote-product="${col.name}">
            <span>Contact for pricing</span>
            <span>↗</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderModelDetailView(modelCode) {
  const product =
    state.products.find((p) => p.model_code === modelCode || String(p.product_id) === modelCode) ||
    state.products[0];

  if (!product) {
    return `<div class="container py-5 text-muted-ss">Đang tải dữ liệu thiết bị từ MySQL...</div>`;
  }

  const specs = product.technical_specs || {};
  const siblings = state.products.filter(
    (p) => p.category_slug === product.category_slug && p.model_code !== product.model_code
  );
  const specRows = [
    ['Phiên bản / Variant', specs.variant || product.model_code],
    ['Kích thước / Dimensions', specs.dimensions || 'Theo datasheet'],
    ['Công suất / Hành trình cáp', specs.cable_travel_or_power || 'Theo cấu hình'],
    ['Tốc độ / Tần số quét', specs.speed || 'Chuyên dụng sân khấu'],
    ['Chuẩn điều khiển', specs.control_protocol || 'DMX512 / Art-Net'],
    ['Điện áp & Trọng lượng', `${specs.voltage || 'AC 100–240V'} · ${specs.weight || ''}`],
  ];

  return `
    <div class="container pt-4 pb-2">
      <div class="d-flex align-items-center gap-2 small text-muted-ss">
        <a href="#home" data-route="home" class="text-muted-ss text-decoration-none">Trang Chủ</a>
        <span>/</span>
        <a href="#collection/${product.category_slug}" data-route="collection" data-slug="${product.category_slug}" class="text-muted-ss text-decoration-none">${product.category_name}</a>
        <span>/</span>
        <span class="text-white">${product.product_name}</span>
      </div>
    </div>

    <!-- TOP MODEL HERO -->
    <section class="py-4 pb-5 border-bottom border-divider">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5">
            <p class="ss-kicker mb-3">${product.category_name} / ${product.model_code}</p>
            <h1 class="display-4 fw-semibold font-display text-white mb-4" style="letter-spacing: -0.025em; line-height: 1.06;">
              ${product.product_name}
            </h1>
            <p class="text-muted-ss lh-lg mb-4">${product.short_description}</p>
            <button type="button" class="btn-ss-gold" data-route="quote" data-quote-product="${product.product_name} (${product.model_code})">
              <span>Request pricing</span>
              <span>↗</span>
            </button>
            <p class="small text-muted-ss mt-2 mb-0">Gửi số lượng &amp; yêu cầu lắp đặt để nhận báo giá.</p>
          </div>
          <div class="col-lg-7">
            <div class="ss-media-frame">
              ${
                product.video_demo_url && /\.(mp4|webm|mov)$/i.test(product.video_demo_url)
                  ? `<video src="${product.video_demo_url}" controls autoplay muted loop playsinline></video>`
                  : `<img src="${normalizeImageUrl(product.image_url)}" alt="${product.product_name}" />`
              }
            </div>
            <p class="text-muted-ss text-uppercase mt-2 mb-0" style="font-size: 10px; letter-spacing: 0.08em;">
              VISUAL CONCEPT / TECHNICAL MODEL ${product.model_code}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TECHNICAL SPECIFICATIONS (6-ROW TABLE + SIDEBOX) -->
    <section class="py-5 border-bottom border-divider">
      <div class="container">
        <p class="ss-kicker mb-2">THE DETAILS</p>
        <h2 class="h2 fw-semibold font-display text-white mb-4">Technical specifications</h2>
        <div class="row g-5">
          <div class="col-lg-8">
            <div class="border-top border-divider">
              ${specRows
                .map(
                  ([label, val]) => `
                <div class="ss-spec-row">
                  <span class="ss-spec-label">${label}</span>
                  <span class="ss-spec-val font-mono">${val}</span>
                </div>`
                )
                .join('')}
            </div>
          </div>
          <div class="col-lg-4">
            <div class="ss-card p-4">
              <h3 class="h5 fw-semibold text-white mb-3">Plan the right setup.</h3>
              <p class="small text-muted-ss lh-lg mb-3">
                Chia sẻ kích thước sân khấu, cao độ giàn truss và hiệu ứng mong muốn. Kỹ sư
                SquareSnake FX sẽ cung cấp datasheet chi tiết và phương án cấu hình tối ưu.
              </p>
              <p class="small text-gold mb-0">
                Trạng thái kho: ${product.status === 'available' ? 'Sẵn sàng phục vụ sự kiện' : 'Đang bảo trì kỹ thuật'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SHOW APPLICATIONS -->
    <section class="py-5 border-bottom border-divider">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="ss-media-frame">
              <img src="${normalizeImageUrl(product.image_url)}" alt="${product.product_name} show concept" />
            </div>
          </div>
          <div class="col-lg-6">
            <p class="ss-kicker mb-2">SHOW APPLICATIONS</p>
            <h2 class="h2 fw-semibold font-display text-white mb-3">See the possibilities.</h2>
            <p class="text-white fw-semibold mb-2">Beam fans. Kinetic choreography. Pixel depth.</p>
            <p class="small text-muted-ss lh-lg mb-0">
              Hệ thống tương thích hoàn toàn với GrandMA3, Avolites, Madrix và Pangolin FB4 giúp
              đạo diễn ánh sáng lập trình kịch bản đồng bộ Timecode chính xác từng khung hình.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ALSO IN THIS COLLECTION -->
    ${
      siblings.length
        ? `<section class="py-5 border-bottom border-divider">
            <div class="container">
              <p class="ss-kicker mb-3">ALSO IN THIS COLLECTION</p>
              <div class="row g-3">
                ${siblings
                  .map(
                    (s) => `
                  <div class="col-sm-6 col-md-4 col-lg-3">
                    <button type="button" class="btn-ss-dark w-100 justify-content-between" data-route="model" data-model="${s.model_code}">
                      <span>${s.product_name}</span>
                      <span class="text-gold">↗</span>
                    </button>
                  </div>`
                  )
                  .join('')}
              </div>
            </div>
          </section>`
        : ''
    }

    <!-- GOLD CTA -->
    <section class="py-5">
      <div class="container">
        <div class="ss-gold-banner p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <p class="fw-semibold text-uppercase mb-2" style="font-size: 11px; letter-spacing: 0.12em;">MAKE IT PART OF YOUR NEXT SHOW</p>
            <h2 class="h2 fw-semibold font-display mb-1">Let’s talk about your project.</h2>
            <p class="small mb-0 opacity-75">Hỏi lịch trống thiết bị, cấu hình đồng bộ và báo giá cạnh tranh.</p>
          </div>
          <button type="button" class="btn-ss-banner-dark" data-route="quote" data-quote-product="${product.product_name}">
            <span>Contact for pricing</span>
            <span>↗</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderAboutView() {
  return `
    <div class="container pt-4 pb-2">
      <div class="d-flex align-items-center gap-2 small text-muted-ss">
        <a href="#home" data-route="home" class="text-muted-ss text-decoration-none">Trang Chủ</a>
        <span>/</span>
        <span class="text-white">Về Chúng Tôi</span>
      </div>
    </div>
    <section class="py-5 border-bottom border-divider">
      <div class="container">
        <div class="row align-items-start g-5">
          <div class="col-lg-6">
            <p class="ss-kicker mb-3">VỀ SQUARESNAKE FX VIỆT NAM</p>
            <h1 class="display-5 fw-semibold font-display text-white mb-4">Kỹ thuật chính xác.<br/>Hiệu ứng đỉnh cao.</h1>
            <p class="text-muted-ss lh-lg mb-4">
              Công ty TNHH SquareSnake FX Việt Nam chuyên cung cấp, cho thuê và trực tiếp lập trình
              vận hành hệ thống LED Matrix, Laser công suất lớn và cơ khí Kinetic cho concert, triển lãm
              và sự kiện quy mô lớn tại Hà Nội, TP.HCM và toàn quốc.
            </p>
            <button type="button" class="btn-ss-gold" data-route="quote">
              <span>Liên hệ hợp tác dự án</span>
              <span>↗</span>
            </button>
          </div>
          <div class="col-lg-6">
            <div class="ss-media-frame">
              <img src="assets/squaresnake/hero-concert.jpg" alt="SquareSnake FX" />
            </div>
          </div>
        </div>
        <div class="row g-4 mt-4 pt-4 border-top border-divider">
          ${[
            ['200+', 'Sự kiện đã vận hành'],
            ['500+', 'Thiết bị sẵn kho HN & HCM'],
            ['24/7', 'Kỹ sư trực chiến Timecode'],
            ['03', 'Hệ thống chủ lực chuyên sâu'],
          ]
            .map(
              ([num, title]) => `
            <div class="col-6 col-lg-3">
              <div class="ss-card p-4 h-100">
                <div class="h2 fw-bold text-gold tabular-nums mb-1">${num}</div>
                <div class="small text-secondary">${title}</div>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderProjectsView() {
  return `
    <div class="container pt-4 pb-2">
      <div class="d-flex align-items-center gap-2 small text-muted-ss">
        <a href="#home" data-route="home" class="text-muted-ss text-decoration-none">Trang Chủ</a>
        <span>/</span>
        <span class="text-white">Trường Hợp Dự Án</span>
      </div>
    </div>
    <section class="py-5">
      <div class="container">
        <p class="ss-kicker mb-2">CASE STUDIES</p>
        <h1 class="h1 fw-semibold font-display text-white mb-5">Trường Hợp Dự Án Tiêu Biểu</h1>
        <div class="row g-4">
          ${state.projects
            .map(
              (proj, idx) => `
            <div class="col-md-4">
              <article class="ss-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="ss-media-frame border-0 border-bottom border-subtle">
                    <img src="${normalizeImageUrl(proj.thumbnail_url)}" alt="${proj.event_name}" />
                  </div>
                  <div class="p-4">
                    <p class="ss-kicker mb-2">0${idx + 1} / ${proj.location}</p>
                    <h2 class="h5 fw-semibold text-white mb-2">${proj.event_name}</h2>
                    <p class="small text-gold mb-2">${proj.equipment_used}</p>
                    <p class="small text-muted-ss mb-0">${proj.summary}</p>
                  </div>
                </div>
                <div class="px-4 pb-4">
                  <button type="button" class="btn-ss-dark w-100 justify-content-between" data-route="quote" data-quote-product="${proj.event_name}">
                    <span>Tư vấn cấu hình tương tự</span>
                    <span class="text-gold">↗</span>
                  </button>
                </div>
              </article>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderInfoView() {
  return `
    <div class="container pt-4 pb-2">
      <div class="d-flex align-items-center gap-2 small text-muted-ss">
        <a href="#home" data-route="home" class="text-muted-ss text-decoration-none">Trang Chủ</a>
        <span>/</span>
        <span class="text-white">Trung Tâm Thông Tin</span>
      </div>
    </div>
    <section class="py-5 border-bottom border-divider">
      <div class="container">
        <p class="ss-kicker mb-2">TECHNICAL RESOURCE CENTER</p>
        <h1 class="h1 fw-semibold font-display text-white mb-4">Trung Tâm Thông Tin Kỹ Thuật</h1>
        <div class="row g-4 mb-5">
          ${[
            ['01 / CONTROL PROTOCOLS', 'Chuẩn DMX512, Art-Net & Pangolin FB4', 'Đồng bộ Timecode trực tiếp với bàn GrandMA3, Avolites, Madrix và Pangolin Beyond qua mạng LAN tốc độ cao.'],
            ['02 / RIGGING & SAFETY', 'Tiêu chuẩn Truss & Phanh từ Kinetic', 'Cảm biến quá tải kép, phanh điện từ tự khóa khi mất nguồn và cáp thép an toàn độc lập.'],
            ['03 / LASER SAFETY', 'An toàn tia Laser 20W – 60W', 'Khảo sát cao độ lắp đặt tối thiểu, vùng quét an toàn (Audience Scanning) và nút dừng khẩn cấp E-Stop.'],
          ]
            .map(
              ([num, title, body]) => `
            <div class="col-md-4">
              <div class="ss-card p-4 h-100">
                <p class="ss-kicker mb-2">${num}</p>
                <h2 class="h5 fw-semibold text-white mb-2">${title}</h2>
                <p class="small text-muted-ss mb-0">${body}</p>
              </div>
            </div>`
            )
            .join('')}
        </div>

        <!-- SYSTEM MODELING (draw.io & PlantUML) -->
        <div id="diagramsSection" class="pt-4 border-top border-divider">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
            <div>
              <p class="ss-kicker mb-2">MÔ HÌNH HÓA HỆ THỐNG (DRAW.IO / PLANTUML)</p>
              <h2 class="h3 fw-semibold font-display text-white mb-0">Sơ đồ Use Case, Sitemap, Kiến trúc 3 Tầng &amp; ERD 4 Bảng MySQL</h2>
            </div>
            <a href="/diagrams/SquareSnake_System_Diagrams.drawio" download class="btn-ss-gold text-decoration-none">
              <span>Tải file draw.io (4 trang)</span>
              <span>↓</span>
            </a>
          </div>
          <div class="row g-3">
            ${[
              ['01 / USE CASE DIAGRAM', 'Sơ đồ Use Case Khách hàng & Admin', '/diagrams/01-use-case.puml'],
              ['02 / WEBSITE SITEMAP', 'Sơ đồ cấu trúc trang & luồng điều hướng', '/diagrams/02-sitemap.puml'],
              ['03 / CLIENT–SERVER 3-TIER', 'HTML5/BS5 ↔ Node.js/Express ↔ MySQL', '/diagrams/03-client-server-architecture.puml'],
              ['04 / DATABASE ERD (4 TABLES)', 'categories — products — projects — contacts', '/diagrams/04-database-erd.puml'],
            ]
              .map(
                ([k, t, url]) => `
              <div class="col-md-6 col-lg-3">
                <div class="ss-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <p class="ss-kicker mb-2">${k}</p>
                    <h3 class="h6 fw-semibold text-white mb-3">${t}</h3>
                  </div>
                  <a href="${url}" download class="btn-ss-dark text-decoration-none w-100 justify-content-between">
                    <span>Tải PlantUML (.puml)</span>
                    <span class="text-gold">↓</span>
                  </a>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderQuoteView() {
  const prefill = state.preselectedProductLabel || '';
  return `
    <div class="container pt-4 pb-2">
      <div class="d-flex align-items-center gap-2 small text-muted-ss">
        <a href="#home" data-route="home" class="text-muted-ss text-decoration-none">Trang Chủ</a>
        <span>/</span>
        <span class="text-white">Request a quote</span>
      </div>
    </div>

    <section class="py-4 pb-5">
      <div class="container">
        <div class="row g-5 align-items-start">
          <div class="col-lg-5">
            <p class="ss-kicker mb-3">LET'S CREATE SOMETHING EXTRAORDINARY</p>
            <h1 class="display-4 fw-semibold font-display text-white mb-4" style="letter-spacing: -0.025em; line-height: 1.06;">
              Your next show<br/>starts here.
            </h1>
            <p class="text-muted-ss lh-lg mb-4">
              Hãy cho chúng tôi biết ý tưởng của bạn. Đội ngũ kỹ sư SquareSnake FX sẽ đề xuất
              cấu hình thiết bị tối ưu và gửi báo giá chi tiết.
            </p>
            <div class="mb-4 small">
              <p class="fw-semibold text-white mb-3">Một số thông tin giúp lập báo giá chuẩn xác:</p>
              <div class="d-flex gap-3 mb-2"><span class="text-gold font-mono">01</span><span class="text-secondary">Dòng thiết bị và model mong muốn</span></div>
              <div class="d-flex gap-3 mb-2"><span class="text-gold font-mono">02</span><span class="text-secondary">Số lượng dự kiến và địa điểm lắp đặt</span></div>
              <div class="d-flex gap-3"><span class="text-gold font-mono">03</span><span class="text-secondary">Ngày diễn ra sự kiện &amp; yêu cầu kỹ thuật</span></div>
            </div>
            <div class="ss-media-frame">
              <img src="assets/squaresnake/hero-concert.jpg" alt="Illustrative Show Concept" />
            </div>
            <p class="text-muted-ss text-uppercase mt-2 mb-0" style="font-size: 10px; letter-spacing: 0.08em;">
              ILLUSTRATIVE SHOW CONCEPT
            </p>
          </div>

          <div class="col-lg-7">
            <div class="ss-card p-4 p-lg-5">
              <h2 class="h3 fw-semibold font-display text-white mb-1">Tell us about your project</h2>
              <p class="small text-muted-ss mb-4">Các trường có dấu * là bắt buộc. Dữ liệu được lưu vào bảng MySQL <code class="text-gold">contacts</code>.</p>

              <form id="quoteForm" novalidate>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="customerName" class="form-label small fw-medium">Full name *</label>
                    <input type="text" id="customerName" class="form-control ss-input" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div class="col-md-6">
                    <label for="companyAgency" class="form-label small fw-medium">Company / Agency</label>
                    <input type="text" id="companyAgency" class="form-control ss-input" placeholder="Tên công ty / Agency" />
                  </div>
                  <div class="col-md-6">
                    <label for="customerPhone" class="form-label small fw-medium">Số điện thoại / Zalo *</label>
                    <input type="text" id="customerPhone" class="form-control ss-input" placeholder="0909 886 247" required />
                  </div>
                  <div class="col-md-6">
                    <label for="customerEmail" class="form-label small fw-medium">Email</label>
                    <input type="email" id="customerEmail" class="form-control ss-input" placeholder="you@company.com" />
                  </div>
                  <div class="col-md-8">
                    <label for="productModelInput" class="form-label small fw-medium">Product &amp; model *</label>
                    <input
                      type="text"
                      id="productModelInput"
                      class="form-control ss-input"
                      value="${prefill.replace(/"/g, '&quot;')}"
                      placeholder="VD: 40W Laser hoặc Kinetic Rings"
                    />
                  </div>
                  <div class="col-md-4">
                    <label for="eventDate" class="form-label small fw-medium">Event date</label>
                    <input type="date" id="eventDate" class="form-control ss-input" />
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-medium d-block">Chọn nhanh nhóm thiết bị</label>
                    <div class="d-flex flex-wrap gap-2" id="quoteChips">
                      <label class="ss-chip-check"><input type="checkbox" value="20-pixel / 60-pixel LED Matrix" /><span>LED Matrix</span></label>
                      <label class="ss-chip-check"><input type="checkbox" value="Laser 20W - 60W" /><span>Laser Pro</span></label>
                      <label class="ss-chip-check"><input type="checkbox" value="Kinetic Balls" /><span>Kinetic Balls</span></label>
                      <label class="ss-chip-check"><input type="checkbox" value="Kinetic Rings" /><span>Kinetic Rings</span></label>
                    </div>
                  </div>
                  <div class="col-12">
                    <label for="stageRequirements" class="form-label small fw-medium">Project details *</label>
                    <textarea
                      id="stageRequirements"
                      rows="4"
                      class="form-control ss-input"
                      placeholder="Địa điểm, kích thước sân khấu, chiều cao trần và yêu cầu kỹ thuật..."
                      required
                    ></textarea>
                  </div>
                  <div class="col-12 mt-4">
                    <button type="submit" class="btn-ss-gold w-100 py-3">
                      <span>Request a competitive quote</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              </form>
              <div id="quoteAlert" class="mt-3 d-none p-3 small"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function bindQuoteForm() {
  const form = document.getElementById('quoteForm');
  const alertBox = document.getElementById('quoteAlert');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');

    const checked = Array.from(document.querySelectorAll('#quoteChips input:checked')).map((i) => i.value);
    const typedModel = document.getElementById('productModelInput').value.trim();
    if (typedModel && !checked.includes(typedModel)) checked.unshift(typedModel);

    const payload = {
      customer_name: document.getElementById('customerName').value.trim(),
      phone: document.getElementById('customerPhone').value.trim(),
      email: document.getElementById('customerEmail').value.trim(),
      company_agency: document.getElementById('companyAgency').value.trim(),
      event_date: document.getElementById('eventDate').value || null,
      interested_categories: checked.length ? checked : ['Tư vấn chung'],
      stage_requirements: document.getElementById('stageRequirements').value.trim(),
    };

    if (!payload.customer_name || !payload.phone) {
      alertBox.className = 'mt-3 p-3 small border border-danger text-danger bg-obsidian';
      alertBox.textContent = 'Vui lòng nhập Họ tên và Số điện thoại liên hệ.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      alertBox.className = 'mt-3 p-3 small border text-gold bg-obsidian';
      alertBox.style.borderColor = '#E5C148';
      alertBox.textContent = `Đã lưu yêu cầu thành công vào MySQL (Mã tham chiếu: ${json.reference_code}). Đội ngũ SquareSnake FX sẽ liên hệ ngay.`;
      form.reset();
    } catch (err) {
      alertBox.className = 'mt-3 p-3 small border border-danger text-danger bg-obsidian';
      alertBox.textContent = err.message || 'Không thể gửi yêu cầu báo giá.';
    }
  });
}
