const API_BASE = '/api';

let currentCategory = 'all';
let currentSearch = '';
let cachedProducts = [];
let selectedModalProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  bindFilterEvents();
  bindQuoteForm();
  loadProducts();
  loadProjects();
});

async function loadProducts() {
  const params = new URLSearchParams();
  if (currentCategory !== 'all') params.set('category', currentCategory);
  if (currentSearch.trim()) params.set('search', currentSearch.trim());

  try {
    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    cachedProducts = json.data || [];
    renderFeaturedCards(cachedProducts.filter((p) => p.is_featured).slice(0, 4));
    renderProductGrid(cachedProducts);
  } catch (error) {
    console.error('Lỗi tải danh sách thiết bị:', error);
    document.getElementById('productsGrid').innerHTML =
      '<div class="col-12"><div class="stage-card p-4 text-stage-muted">Không thể kết nối máy chủ API. Vui lòng khởi chạy server Node.js.</div></div>';
  }
}

function renderFeaturedCards(items) {
  const container = document.getElementById('featuredGrid');
  if (!container || container.dataset.loaded === 'true') return;
  if (items.length === 0) return;

  container.dataset.loaded = 'true';
  container.innerHTML = items
    .map(
      (item) => `
      <div class="col-sm-6 col-lg-3">
        <div class="stage-card stage-card-hover p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="small font-mono text-gold-accent mb-1">${item.model_code}</div>
            <h3 class="h5 fw-bold font-display mb-2">${item.product_name}</h3>
            <p class="small text-stage-muted mb-3">${item.short_description}</p>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-stage-outline w-100"
            onclick="openProductDetail(${item.product_id})"
          >
            Xem thông số chi tiết
          </button>
        </div>
      </div>`
    )
    .join('');
}

function renderProductGrid(items) {
  const grid = document.getElementById('productsGrid');
  if (!items.length) {
    grid.innerHTML =
      '<div class="col-12"><div class="stage-card p-5 text-center text-stage-muted">Không tìm thấy thiết bị phù hợp.</div></div>';
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const specs = item.technical_specs || {};
      return `
      <div class="col-md-6 col-lg-4">
        <article class="stage-card stage-card-hover p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center small text-stage-muted mb-2">
              <span class="text-gold-accent fw-semibold">${item.category_name}</span>
              <span class="font-mono">${item.model_code}</span>
            </div>
            <h3 class="h5 fw-bold font-display mb-2">${item.product_name}</h3>
            <p class="small text-stage-muted mb-3">${item.short_description}</p>
            <div class="border-top border-stage pt-3 small">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-stage-muted">Công suất / Cáp:</span>
                <span class="font-mono text-white text-end">${specs.cable_travel_or_power || 'N/A'}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-stage-muted">Điều khiển:</span>
                <span class="font-mono text-cyan-neon text-end">${specs.control_protocol || 'DMX512'}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-stage-outline btn-sm w-100 mt-4 fw-semibold"
            onclick="openProductDetail(${item.product_id})"
          >
            Xem chi tiết
          </button>
        </article>
      </div>`;
    })
    .join('');
}

window.openProductDetail = async function (productId) {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`);
    const json = await res.json();
    if (!json.success) return;

    const p = json.data;
    selectedModalProduct = p;
    const specs = p.technical_specs || {};

    document.getElementById('modalProductTitle').textContent = `${p.product_name} (${p.model_code})`;
    document.getElementById('modalProductBody').innerHTML = `
      <p class="text-stage-muted mb-3">${p.short_description}</p>
      <div class="table-responsive">
        <table class="table table-dark table-bordered border-stage small mb-0">
          <tbody>
            <tr><th class="text-stage-muted w-40">Nhóm thiết bị</th><td>${p.category_name}</td></tr>
            <tr><th class="text-stage-muted">Kích thước</th><td class="font-mono">${specs.dimensions || '-'}</td></tr>
            <tr><th class="text-stage-muted">Hành trình / Công suất</th><td class="font-mono">${specs.cable_travel_or_power || '-'}</td></tr>
            <tr><th class="text-stage-muted">Tốc độ vận hành</th><td class="font-mono">${specs.speed || '-'}</td></tr>
            <tr><th class="text-stage-muted">Chuẩn điều khiển</th><td class="font-mono text-cyan-neon">${specs.control_protocol || '-'}</td></tr>
            <tr><th class="text-stage-muted">Điện áp</th><td class="font-mono">${specs.voltage || '-'}</td></tr>
            <tr><th class="text-stage-muted">Trọng lượng</th><td class="font-mono">${specs.weight || '-'}</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const modalEl = document.getElementById('productDetailModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  } catch (err) {
    console.error('Lỗi tải chi tiết sản phẩm:', err);
  }
};

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const json = await res.json();
    if (!json.success) return;

    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = (json.data || [])
      .map(
        (proj) => `
        <div class="col-lg-6">
          <article class="stage-card p-4 h-100">
            <div class="small text-gold-accent fw-semibold mb-1">
              ${proj.client_name} · ${proj.location}
            </div>
            <h3 class="h5 fw-bold font-display mb-2">${proj.event_name}</h3>
            <p class="small text-stage-muted mb-3">${proj.summary}</p>
            <div class="small font-mono text-cyan-neon pt-2 border-top border-stage">
              ${proj.equipment_used}
            </div>
          </article>
        </div>`
      )
      .join('');
  } catch (err) {
    console.error('Lỗi tải dự án:', err);
  }
}

function bindFilterEvents() {
  const filterBtns = document.querySelectorAll('#categoryFilters button');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('btn-gold-primary');
        b.classList.add('btn-stage-outline');
      });
      btn.classList.remove('btn-stage-outline');
      btn.classList.add('btn-gold-primary');
      currentCategory = btn.dataset.category;
      loadProducts();
    });
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    loadProducts();
  });

  document.getElementById('modalQuoteBtn').addEventListener('click', () => {
    const modalEl = document.getElementById('productDetailModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    if (selectedModalProduct) {
      document.getElementById('stageRequirements').value =
        `Yêu cầu báo giá thiết bị: ${selectedModalProduct.product_name} (${selectedModalProduct.model_code}).`;
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
}

function bindQuoteForm() {
  const form = document.getElementById('quoteForm');
  const alertBox = document.getElementById('quoteAlert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');

    const checkedCategories = Array.from(
      document.querySelectorAll('#quoteCategoryPills input:checked')
    ).map((cb) => cb.value);

    const payload = {
      customer_name: document.getElementById('customerName').value.trim(),
      phone: document.getElementById('customerPhone').value.trim(),
      company_agency: document.getElementById('companyAgency').value.trim(),
      event_date: document.getElementById('eventDate').value || null,
      interested_categories: checkedCategories,
      stage_requirements: document.getElementById('stageRequirements').value.trim(),
    };

    if (!payload.customer_name || !payload.phone || checkedCategories.length === 0) {
      alertBox.className = 'alert alert-danger mt-3';
      alertBox.textContent = 'Vui lòng nhập Họ tên, Số điện thoại và chọn ít nhất 1 nhóm thiết bị.';
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

      alertBox.className = 'alert alert-success mt-3';
      alertBox.textContent = `Đã tiếp nhận yêu cầu (${json.reference_code}). Kỹ sư SquareSnake sẽ liên hệ trong 30 phút.`;
      form.reset();
    } catch (err) {
      alertBox.className = 'alert alert-danger mt-3';
      alertBox.textContent = err.message || 'Gửi yêu cầu thất bại.';
    }
  });
}
