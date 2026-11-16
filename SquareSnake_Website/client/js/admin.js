const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
  bindTabs();
  bindMediaUpload();
  bindAddProductForm();
  bindAddProjectForm();

  document.getElementById('refreshContactsBtn').addEventListener('click', loadContacts);
  document.getElementById('contactStatusFilter').addEventListener('change', loadContacts);
  document.getElementById('refreshProductsBtn').addEventListener('click', loadProducts);
  document.getElementById('refreshProjectsBtn').addEventListener('click', loadProjects);

  loadContacts();
  loadProducts();
  loadProjects();
});

function bindTabs() {
  const buttons = document.querySelectorAll('#adminTabs button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.className = 'btn-ss-dark';
      });
      btn.className = 'btn-ss-gold';

      document.querySelectorAll('.admin-panel').forEach((p) => p.classList.add('d-none'));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('d-none');
    });
  });
}

async function loadContacts() {
  const tbody = document.getElementById('contactsTableBody');
  const statusFilter = document.getElementById('contactStatusFilter').value;
  const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';

  try {
    const res = await fetch(`${API_BASE}/contacts${query}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    if (!json.data.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center text-muted-ss py-4">Chưa có yêu cầu báo giá nào.</td></tr>';
      return;
    }

    tbody.innerHTML = json.data
      .map(
        (c) => `
        <tr>
          <td>
            <div class="fw-semibold text-white">${c.customer_name}</div>
            <div class="small text-muted-ss">${c.stage_requirements || ''}</div>
          </td>
          <td>
            <div class="small text-white">${c.company_agency || 'Khách trực tiếp'}</div>
            <div class="small font-mono text-gold">${c.phone}</div>
            ${c.email ? `<div class="small text-muted-ss">${c.email}</div>` : ''}
          </td>
          <td class="small text-gold">${c.interested_categories}</td>
          <td>
            <select
              class="form-select form-select-sm ss-input"
              onchange="updateContactStatus(${c.contact_id}, this.value)"
            >
              <option value="pending" ${c.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
              <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Đã liên hệ</option>
              <option value="quoted" ${c.status === 'quoted' ? 'selected' : ''}>Đã báo giá</option>
            </select>
          </td>
          <td class="text-end">
            <button type="button" class="btn-ss-dark btn-sm text-danger" onclick="deleteContact(${c.contact_id})">
              Xóa
            </button>
          </td>
        </tr>`
      )
      .join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger">${err.message}</td></tr>`;
  }
}

window.updateContactStatus = async function (contactId, status) {
  try {
    await fetch(`${API_BASE}/contacts/${contactId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái:', err);
  }
};

window.deleteContact = async function (contactId) {
  try {
    const res = await fetch(`${API_BASE}/contacts/${contactId}`, { method: 'DELETE' });
    if (res.ok) loadContacts();
  } catch (err) {
    console.error('Lỗi xóa contact:', err);
  }
};

function bindMediaUpload() {
  const fileInput = document.getElementById('prodMediaFile');
  const hint = document.getElementById('uploadStatusHint');
  if (!fileInput) return;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    hint.textContent = 'Đang tải tệp lên máy chủ Express...';

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type,
            dataBase64: reader.result,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);

        if (json.type === 'video') {
          document.getElementById('prodVideoUrl').value = json.url;
        } else {
          document.getElementById('prodImageUrl').value = json.url;
        }
        hint.textContent = `Đã tải lên thành công: ${json.url}`;
      } catch (err) {
        hint.textContent = `Lỗi upload: ${err.message}`;
      }
    };
    reader.readAsDataURL(file);
  });
}

async function loadProducts() {
  const tbody = document.getElementById('productsTableBody');
  try {
    const res = await fetch(`${API_BASE}/products`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    tbody.innerHTML = (json.data || [])
      .map(
        (p) => `
        <tr>
          <td>
            <div class="fw-semibold text-white">${p.product_name}</div>
            <div class="small font-mono text-gold">${p.model_code}</div>
          </td>
          <td class="small text-secondary">${p.category_name}</td>
          <td>
            <select
              class="form-select form-select-sm ss-input"
              onchange="updateProductStatus(${p.product_id}, this.value)"
            >
              <option value="available" ${p.status === 'available' ? 'selected' : ''}>Sẵn sàng</option>
              <option value="maintenance" ${p.status === 'maintenance' ? 'selected' : ''}>Bảo trì</option>
            </select>
          </td>
          <td class="text-end">
            <button type="button" class="btn-ss-dark btn-sm text-danger" onclick="deleteProduct(${p.product_id})">
              Xóa
            </button>
          </td>
        </tr>`
      )
      .join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger">${err.message}</td></tr>`;
  }
}

window.updateProductStatus = async function (productId, status) {
  try {
    await fetch(`${API_BASE}/products/${productId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái sản phẩm:', err);
  }
};

window.deleteProduct = async function (productId) {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, { method: 'DELETE' });
    if (res.ok) loadProducts();
  } catch (err) {
    console.error('Lỗi xóa sản phẩm:', err);
  }
};

function bindAddProductForm() {
  const form = document.getElementById('addProductForm');
  const alertBox = document.getElementById('adminProductAlert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');

    const payload = {
      category_id: Number(document.getElementById('prodCategory').value),
      product_name: document.getElementById('prodName').value.trim(),
      model_code: document.getElementById('prodCode').value.trim(),
      short_description: document.getElementById('prodDesc').value.trim(),
      image_url: document.getElementById('prodImageUrl').value.trim(),
      video_demo_url: document.getElementById('prodVideoUrl').value.trim(),
      technical_specs: {
        variant: document.getElementById('prodCode').value.trim(),
        dimensions: 'Theo tiêu chuẩn nhà sản xuất',
        cable_travel_or_power: document.getElementById('prodPower').value.trim() || 'Đang cập nhật',
        speed: 'Tùy chỉnh DMX',
        control_protocol: document.getElementById('prodControl').value.trim() || 'DMX512 / Art-Net',
        voltage: 'AC 100–240V, 50/60Hz',
        weight: 'Đang cập nhật',
      },
      is_featured: false,
      status: 'available',
    };

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      alertBox.className = 'mt-3 p-3 small border text-gold bg-obsidian';
      alertBox.style.borderColor = '#E5C148';
      alertBox.textContent = 'Đã thêm thiết bị mới vào bảng products (MySQL).';
      form.reset();
      loadProducts();
    } catch (err) {
      alertBox.className = 'mt-3 p-3 small border border-danger text-danger bg-obsidian';
      alertBox.textContent = err.message || 'Không thể thêm thiết bị.';
    }
  });
}

async function loadProjects() {
  const tbody = document.getElementById('projectsTableBody');
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    tbody.innerHTML = (json.data || [])
      .map(
        (p) => `
        <tr>
          <td>
            <div class="fw-semibold text-white">${p.event_name}</div>
            <div class="small text-muted-ss">${p.client_name} · ${p.location}</div>
          </td>
          <td class="small text-gold">${p.equipment_used}</td>
          <td class="text-end">
            <button type="button" class="btn-ss-dark btn-sm text-danger" onclick="deleteProject(${p.project_id})">
              Xóa
            </button>
          </td>
        </tr>`
      )
      .join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-danger">${err.message}</td></tr>`;
  }
}

window.deleteProject = async function (projectId) {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, { method: 'DELETE' });
    if (res.ok) loadProjects();
  } catch (err) {
    console.error('Lỗi xóa dự án:', err);
  }
};

function bindAddProjectForm() {
  const form = document.getElementById('addProjectForm');
  const alertBox = document.getElementById('adminProjectAlert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');

    const payload = {
      event_name: document.getElementById('projName').value.trim(),
      client_name: document.getElementById('projClient').value.trim(),
      location: document.getElementById('projLocation').value.trim(),
      event_date: document.getElementById('projDate').value,
      equipment_used: document.getElementById('projEquip').value.trim(),
      summary: document.getElementById('projSummary').value.trim(),
      thumbnail_url: document.getElementById('projThumb').value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      alertBox.className = 'mt-3 p-3 small border text-gold bg-obsidian';
      alertBox.style.borderColor = '#E5C148';
      alertBox.textContent = 'Đã lưu dự án mới vào bảng projects (MySQL).';
      form.reset();
      loadProjects();
    } catch (err) {
      alertBox.className = 'mt-3 p-3 small border border-danger text-danger bg-obsidian';
      alertBox.textContent = err.message || 'Không thể lưu dự án.';
    }
  });
}
