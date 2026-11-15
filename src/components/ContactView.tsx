import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, PhoneCall, Send } from 'lucide-react';
import { QuoteCategoryOption, QuoteFormData } from '../types/equipment';

interface ContactViewProps {
  prefilledCategories?: QuoteCategoryOption[];
  prefilledNote?: string;
}

const CATEGORY_OPTIONS: QuoteCategoryOption[] = [
  'Kinetic Ball',
  'Kinetic Ring',
  'Laser',
  'LED Matrix',
];

export const ContactView: React.FC<ContactViewProps> = ({
  prefilledCategories = [],
  prefilledNote = '',
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    phone: '',
    company: '',
    eventDate: '',
    selectedCategories: prefilledCategories,
    stageDimensions: '',
    notes: prefilledNote,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories:
        prefilledCategories.length > 0 ? prefilledCategories : prev.selectedCategories,
      notes: prefilledNote || prev.notes,
    }));
  }, [prefilledCategories, prefilledNote]);

  const toggleCategory = (cat: QuoteCategoryOption) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(cat);
      const next = exists
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat];
      return { ...prev, selectedCategories: next };
    });
    if (errors.selectedCategories) {
      setErrors((prev) => ({ ...prev, selectedCategories: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof QuoteFormData, string>> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên người liên hệ.';
    }

    const cleanedPhone = formData.phone.replace(/[\s.-]/g, '');
    if (!cleanedPhone) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại hoặc Zalo.';
    } else if (!/^(0|\+84)[0-9]{8,10}$/.test(cleanedPhone)) {
      nextErrors.phone = 'Số điện thoại chưa đúng định dạng (ví dụ: 0912 345 678).';
    }

    if (formData.selectedCategories.length === 0) {
      nextErrors.selectedCategories = 'Vui lòng chọn ít nhất 1 nhóm thiết bị quan tâm.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const stageNotes = [formData.stageDimensions.trim(), formData.notes.trim()]
        .filter(Boolean)
        .join(' · ');

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          company_agency: formData.company.trim(),
          event_date: formData.eventDate,
          interested_categories: formData.selectedCategories,
          stage_requirements: stageNotes,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể gửi yêu cầu báo giá.');
      }

      setSubmittedCode(json.reference_code || 'SS-BG-1000');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Lỗi kết nối máy chủ khi gửi yêu cầu.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedCode(null);
    setFormData({
      fullName: '',
      phone: '',
      company: '',
      eventDate: '',
      selectedCategories: [],
      stageDimensions: '',
      notes: '',
    });
    setErrors({});
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="mb-10">
        <p className="text-xs font-medium text-[#F5C518] mb-2">
          Tư vấn kỹ thuật &amp; dự toán nhanh
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Liên Hệ &amp; Yêu Cầu Báo Giá
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-2 max-w-2xl">
          Gửi thông số sân khấu để đội ngũ kỹ sư SquareSnake Việt Nam lên phương án bố trí thiết
          bị, tải trọng truss và báo giá trọn gói trong vòng 30 phút.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Headquarters, Warehouses & 24/7 Hotline */}
        <div className="lg:col-span-5 space-y-5">
          {/* 24/7 Technical Hotline Card */}
          <div className="rounded-[12px] bg-[#161B26] border border-[#263042] p-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[8px] bg-[#FF2A5F]/15 border border-[#FF2A5F]/40 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5 text-[#FF2A5F]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#F5C518]">Hotline kỹ thuật 24/7</p>
                <a
                  href="tel:0909886247"
                  className="font-display text-2xl font-extrabold text-white tabular-nums hover:text-[#00F0FF] transition-colors block mt-1"
                >
                  0909 886 247
                </a>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Hỗ trợ khẩn cấp &amp; điều phối kỹ sư lập trình DMX / Madrix / Pangolin FB4
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#263042] space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-[#94A3B8]">
                <Mail className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>baogia@squaresnake.vn</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#94A3B8]">
                <Clock className="w-4 h-4 text-[#F5C518] shrink-0" />
                <span>Phản hồi dự toán &amp; sơ đồ 3D trong 30 phút</span>
              </div>
            </div>
          </div>

          {/* Hanoi Warehouse */}
          <div className="rounded-[12px] bg-[#161B26] border border-[#263042] p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F5C518] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Trụ sở &amp; Kho thiết bị Hà Nội
                </h2>
                <p className="text-sm text-[#94A3B8] mt-1 leading-relaxed">
                  Lô B4-12 Khu công nghiệp Thạch Bàn, Quận Long Biên, TP. Hà Nội
                </p>
                <p className="text-xs font-mono tabular-nums text-[#00F0FF] mt-2">
                  Sẵn kho: 140+ Kinetic · 18 Laser Pro · 120 LED Matrix
                </p>
              </div>
            </div>
          </div>

          {/* HCMC Warehouse */}
          <div className="rounded-[12px] bg-[#161B26] border border-[#263042] p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Chi nhánh &amp; Kho thiết bị TP.HCM
                </h2>
                <p className="text-sm text-[#94A3B8] mt-1 leading-relaxed">
                  Số 88 Đường Nguyễn Văn Linh, Phường Tân Thuận Tây, Quận 7, TP. Hồ Chí Minh
                </p>
                <p className="text-xs font-mono tabular-nums text-[#F5C518] mt-2">
                  Sẵn kho: 160+ Kinetic · 22 Laser Pro · 116 LED Matrix
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Quote Request Form */}
        <div className="lg:col-span-7 rounded-[12px] bg-[#161B26] border border-[#263042] p-6 sm:p-8">
          {submittedCode ? (
            <div className="py-6 space-y-6" role="status" aria-live="polite">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#00F0FF]" />
                </div>
                <div>
                  <p className="text-xs font-mono text-[#F5C518] tabular-nums">
                    MÃ YÊU CẦU: {submittedCode}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-white mt-1">
                    Đã Tiếp Nhận Yêu Cầu Báo Giá
                  </h2>
                  <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
                    Cảm ơn <strong className="text-white">{formData.fullName}</strong>. Kỹ sư phụ
                    trách dự án của SquareSnake Việt Nam sẽ liên hệ qua số{' '}
                    <strong className="text-[#00F0FF] tabular-nums">{formData.phone}</strong> trong
                    vòng 30 phút để gửi bảng cấu hình và báo giá chi tiết.
                  </p>
                </div>
              </div>

              <div className="rounded-[10px] bg-[#0B0E14] border border-[#263042] p-5 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#94A3B8]">Đơn vị / Agency:</span>
                  <span className="text-white font-medium text-right">
                    {formData.company || 'Khách hàng trực tiếp'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#94A3B8]">Ngày diễn ra sự kiện:</span>
                  <span className="text-white font-mono tabular-nums text-right">
                    {formData.eventDate || 'Chưa ấn định'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#94A3B8]">Nhóm thiết bị quan tâm:</span>
                  <span className="text-[#F5C518] font-medium text-right">
                    {formData.selectedCategories.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#94A3B8]">Kích thước sân khấu:</span>
                  <span className="text-white font-mono tabular-nums text-right">
                    {formData.stageDimensions || 'Cần kỹ sư khảo sát thực tế'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 min-h-[44px] rounded-[8px] border border-[#263042] bg-[#0B0E14] hover:border-[#F5C518] text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                Gửi thêm yêu cầu mới
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="border-b border-[#263042] pb-4">
                <h2 className="font-display text-xl font-bold text-white">
                  Biểu Mẫu Yêu Cầu Tư Vấn &amp; Báo Giá
                </h2>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Các trường có dấu <span className="text-[#FF2A5F]">*</span> là bắt buộc để kỹ sư
                  liên hệ trực tiếp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quote-fullName"
                    className="block text-xs font-semibold text-white mb-1.5"
                  >
                    Họ và tên <span className="text-[#FF2A5F]">*</span>
                  </label>
                  <input
                    id="quote-fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    placeholder="Nguyễn Minh Tuấn"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518] transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#FF2A5F] mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-phone"
                    className="block text-xs font-semibold text-white mb-1.5"
                  >
                    Số điện thoại / Zalo <span className="text-[#FF2A5F]">*</span>
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="0912 345 678"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white font-mono tabular-nums placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518] transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#FF2A5F] mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quote-company"
                    className="block text-xs font-semibold text-white mb-1.5"
                  >
                    Tên đơn vị / Agency
                  </label>
                  <input
                    id="quote-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ví dụ: Apex Event Production"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quote-date"
                    className="block text-xs font-semibold text-white mb-1.5"
                  >
                    Ngày diễn ra sự kiện
                  </label>
                  <input
                    id="quote-date"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#F5C518] transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Checkbox Pills for Equipment Groups */}
              <div>
                <span className="block text-xs font-semibold text-white mb-2">
                  Nhóm thiết bị quan tâm <span className="text-[#FF2A5F]">*</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((option) => {
                    const checked = formData.selectedCategories.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggleCategory(option)}
                        className={`px-4 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-semibold border transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] ${
                          checked
                            ? 'bg-[#F5C518] border-[#F5C518] text-[#0B0E14]'
                            : 'bg-[#0B0E14] border-[#263042] text-[#94A3B8] hover:text-white hover:border-[#384660]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.selectedCategories && (
                  <p className="text-xs text-[#FF2A5F] mt-1.5">{errors.selectedCategories}</p>
                )}
              </div>

              {/* Stage Dimensions */}
              <div>
                <label
                  htmlFor="quote-dimensions"
                  className="block text-xs font-semibold text-white mb-1.5"
                >
                  Kích thước sân khấu dự kiến (Dài × Rộng × Cao trần)
                </label>
                <input
                  id="quote-dimensions"
                  type="text"
                  value={formData.stageDimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, stageDimensions: e.target.value })
                  }
                  placeholder="Ví dụ: 24m × 14m × 12m (Sân khấu trong nhà / Ngoài trời)"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518] transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="quote-notes"
                  className="block text-xs font-semibold text-white mb-1.5"
                >
                  Mô tả thêm về kịch bản hiệu ứng hoặc thiết bị cụ thể
                </label>
                <textarea
                  id="quote-notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Cần 48 quả Kinetic Ball 250mm đồng bộ timecode với bàn GrandMA3..."
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#F5C518] transition-colors resize-y"
                />
              </div>

              {submitError && (
                <p className="text-xs text-[#FF2A5F]" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 min-h-[48px] rounded-[8px] bg-[#FF2A5F] hover:bg-[#E01E4F] disabled:opacity-60 text-white text-sm font-bold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu báo giá'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
