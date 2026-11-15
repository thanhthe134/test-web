const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
  loadContacts();
  document.getElementById('refreshContactsBtn').addEventListener('click', loadContacts);
  bindAddProductForm();
});

async function loadContacts() {
  const tbody = document.getElementById('contactsTableBody');
  try {
    const res = await fetch(`${API_BASE}/contacts`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    if (!json.data.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-stage-muted py-4">Chưa có yêu cầu báo giá nào.</td></tr>';
      return;
    }

    tbody.innerHTML = json.data
      .map(
        (c) => `
        <tr>
          <td>
            <div class="fw-semibold">${c.customer_name}</div>
            <div class="small text-stage-muted">${c.stage_requirements || ''}</div>
          </td>
          <td>
            <div>${c.company_agency || 'Khách trực tiếp'}</div>
            <div class="small font-mono text-cyan-neon">${c.phone}</div>
          </td>
          <td class="small text-gold-accent">${c.interested_categories}</td>
          <td>
            <select
              class="form-select form-select-sm stage-input"
              onchange="updateContactStatus(${c.contact_id}, this.value)"
            >
              <option value="pending" ${c.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
              <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Đã liên hệ</option>
              <option value="quoted" ${c.status === 'quoted' ? 'selected' : ''}>Đã báo giá</option>
            </select>
          </td>
        </tr>`
      )
      .join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger">${err.message}</td></tr>`;
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
      technical_specs: {
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

      alertBox.className = 'alert alert-success mt-3';
      alertBox.textContent = 'Đã thêm thiết bị mới vào cơ sở dữ liệu.';
      form.reset();
    } catch (err) {
      alertBox.className = 'alert alert-danger mt-3';
      alertBox.textContent = err.message || 'Không thể thêm thiết bị.';
    }
  });
}
