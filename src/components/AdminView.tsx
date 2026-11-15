import React, { useEffect, useState } from 'react';
import { CheckCircle2, PlusCircle, RefreshCw } from 'lucide-react';
import { ContactRecord, ContactStatus, EquipmentItem } from '../types/equipment';

interface AdminViewProps {
  onEquipmentAdded: (item: EquipmentItem) => void;
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  pending: 'Chờ xử lý',
  contacted: 'Đã liên hệ',
  quoted: 'Đã báo giá',
};

export const AdminView: React.FC<AdminViewProps> = ({ onEquipmentAdded }) => {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Product Form State
  const [categoryKey, setCategoryKey] = useState<'kinetic' | 'laser' | 'led-matrix'>('kinetic');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [powerOrTravel, setPowerOrTravel] = useState('');
  const [controlProtocol, setControlProtocol] = useState('Art-Net / DMX512 / Madrix');
  const [stockCount, setStockCount] = useState('24');
  const [description, setDescription] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contacts');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Lỗi tải dữ liệu');
      setContacts(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể kết nối máy chủ API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (contactId: number, status: ContactStatus) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setContacts((prev) =>
          prev.map((c) => (c.contact_id === contactId ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError(null);
    setProductSuccess(null);

    if (!name.trim() || !code.trim()) {
      setProductError('Vui lòng nhập Tên thiết bị và Mã model.');
      return;
    }

    setSubmittingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          categoryKey,
          powerOrTravel: powerOrTravel.trim(),
          controlProtocol: controlProtocol.trim(),
          stockCount: Number(stockCount) || 20,
          description: description.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể thêm thiết bị.');
      }

      onEquipmentAdded(json.data);
      setProductSuccess(`Đã lưu thiết bị "${json.data.name}" vào danh mục máy chủ.`);
      setName('');
      setCode('');
      setPowerOrTravel('');
      setDescription('');
    } catch (err) {
      setProductError(err instanceof Error ? err.message : 'Lỗi kết nối API.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#00F0FF] mb-2">
            Cổng quản trị Back-end RESTful API
          </p>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Quản Lý Báo Giá &amp; Danh Mục Thiết Bị
          </h1>
        </div>
        <button
          type="button"
          onClick={fetchContacts}
          className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] border border-[#263042] bg-[#161B26] hover:border-[#00F0FF] text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Quote Requests Table */}
        <div className="lg:col-span-8 rounded-[12px] bg-[#161B26] border border-[#263042] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#263042] flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              Yêu Cầu Báo Giá Đã Tiếp Nhận
            </h2>
            <span className="text-xs font-mono tabular-nums text-[#F5C518]">
              Tổng: {contacts.length} hồ sơ
            </span>
          </div>

          {error ? (
            <div className="p-6 text-sm text-[#FF2A5F]">{error}</div>
          ) : loading ? (
            <div className="p-6 text-sm text-[#94A3B8]">Đang tải dữ liệu từ máy chủ...</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#94A3B8]">
              Chưa có yêu cầu báo giá nào được gửi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#263042] text-xs text-[#94A3B8] bg-[#0B0E14]/60">
                    <th className="py-3 px-4 font-semibold">Mã / Khách hàng</th>
                    <th className="py-3 px-4 font-semibold">Liên hệ</th>
                    <th className="py-3 px-4 font-semibold">Thiết bị &amp; Sân khấu</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263042] text-sm">
                  {contacts.map((c) => (
                    <tr key={c.contact_id} className="hover:bg-[#0B0E14]/40 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <div className="text-xs font-mono text-[#F5C518] tabular-nums">
                          {c.reference_code}
                        </div>
                        <div className="font-semibold text-white mt-0.5">{c.customer_name}</div>
                        <div className="text-xs text-[#94A3B8]">{c.company_agency}</div>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono tabular-nums text-[#00F0FF] text-xs">
                          {c.phone}
                        </div>
                        <div className="text-xs text-[#94A3B8] mt-1 tabular-nums">
                          Ngày SK: {c.event_date || 'Chưa ấn định'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <div className="text-xs font-medium text-white">
                          {c.interested_categories.join(', ')}
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                          {c.stage_requirements}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <select
                          aria-label={`Trạng thái báo giá ${c.reference_code}`}
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c.contact_id, e.target.value as ContactStatus)
                          }
                          className="px-2.5 py-1.5 rounded-[6px] bg-[#0B0E14] border border-[#263042] text-xs font-medium text-white focus:outline-none focus:border-[#F5C518]"
                        >
                          {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Add Equipment Form */}
        <div className="lg:col-span-4 rounded-[12px] bg-[#161B26] border border-[#263042] p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#263042]">
            <PlusCircle className="w-5 h-5 text-[#F5C518]" />
            <h2 className="font-display text-lg font-bold text-white">Thêm Thiết Bị Mới</h2>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label htmlFor="admin-cat" className="block text-xs font-semibold text-white mb-1">
                Phân hệ thiết bị
              </label>
              <select
                id="admin-cat"
                value={categoryKey}
                onChange={(e) =>
                  setCategoryKey(e.target.value as 'kinetic' | 'laser' | 'led-matrix')
                }
                className="w-full min-h-[40px] px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white focus:outline-none focus:border-[#F5C518]"
              >
                <option value="kinetic">Hệ thống Kinetic</option>
                <option value="laser">Ánh sáng Laser</option>
                <option value="led-matrix">LED Matrix</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-name" className="block text-xs font-semibold text-white mb-1">
                Tên thiết bị *
              </label>
              <input
                id="admin-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Kinetic Bar Linear 1.5m"
                className="w-full min-h-[40px] px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="admin-code" className="block text-xs font-semibold text-white mb-1">
                  Mã Model *
                </label>
                <input
                  id="admin-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SS-KB150"
                  className="w-full min-h-[40px] px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm font-mono text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518]"
                />
              </div>
              <div>
                <label htmlFor="admin-stock" className="block text-xs font-semibold text-white mb-1">
                  Số lượng kho
                </label>
                <input
                  id="admin-stock"
                  type="number"
                  min={1}
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm font-mono tabular-nums text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-power" className="block text-xs font-semibold text-white mb-1">
                Công suất / Hành trình cáp
              </label>
              <input
                id="admin-power"
                type="text"
                value={powerOrTravel}
                onChange={(e) => setPowerOrTravel(e.target.value)}
                placeholder="Hành trình 10m · 120W RGBW"
                className="w-full min-h-[40px] px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <div>
              <label htmlFor="admin-ctrl" className="block text-xs font-semibold text-white mb-1">
                Chuẩn điều khiển
              </label>
              <input
                id="admin-ctrl"
                type="text"
                value={controlProtocol}
                onChange={(e) => setControlProtocol(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm font-mono text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <div>
              <label htmlFor="admin-desc" className="block text-xs font-semibold text-white mb-1">
                Mô tả kỹ thuật
              </label>
              <textarea
                id="admin-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ứng dụng cho sân khấu concert..."
                className="w-full px-3 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            {productError && <p className="text-xs text-[#FF2A5F]">{productError}</p>}

            {productSuccess && (
              <div className="flex items-start gap-2 text-xs text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-[8px] p-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{productSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3 px-4 min-h-[44px] rounded-[8px] bg-[#FF2A5F] hover:bg-[#E01E4F] disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              {submittingProduct ? 'Đang lưu...' : 'Lưu thiết bị vào hệ thống'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
