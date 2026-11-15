import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  FileText,
  Film,
  Image as ImageIcon,
  Inbox,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  CmsMediaItem,
  CmsProjectCase,
  CollectionSlug,
  CustomerInboxItem,
  FigmaProductModel,
  PublicCmsPayload,
  SiteSettings,
} from '../../types/cms';
import { SquareSnakeLogoMark } from './FigmaHeader';
import { MediaStageView } from './MediaRenderer';

type AdminTab = 'inbox' | 'products' | 'media' | 'content';

interface FigmaAdminViewProps {
  cms: PublicCmsPayload;
  onCmsUpdated: () => Promise<void>;
  onExitAdmin: () => void;
}

const TOKEN_STORAGE_KEY = 'squaresnake_admin_token';

const STATUS_LABELS: Record<'pending' | 'contacted' | 'quoted', string> = {
  pending: 'Chờ xử lý',
  contacted: 'Đã liên hệ',
  quoted: 'Đã báo giá',
};

const STATUS_TEXT_COLORS: Record<'pending' | 'contacted' | 'quoted', string> = {
  pending: 'text-[#E5C148]',
  contacted: 'text-[#38BDF8]',
  quoted: 'text-[#22C55E]',
};

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc tệp từ máy tính.'));
    reader.readAsDataURL(file);
  });
}

export const FigmaAdminView: React.FC<FigmaAdminViewProps> = ({
  cms,
  onCmsUpdated,
  onExitAdmin,
}) => {
  const [token, setToken] = useState<string>(
    () => sessionStorage.getItem(TOKEN_STORAGE_KEY) || ''
  );
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('inbox');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Inbox state
  const [inboxItems, setInboxItems] = useState<CustomerInboxItem[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxFilter, setInboxFilter] = useState<
    'all' | 'pending' | 'contacted' | 'quoted'
  >('all');
  const [inboxSearch, setInboxSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingInbox, setSavingInbox] = useState(false);

  // Product editor state
  const [productCollectionFilter, setProductCollectionFilter] = useState<
    'all' | CollectionSlug
  >('all');
  const [editingModel, setEditingModel] = useState<FigmaProductModel | null>(null);
  const [isNewModel, setIsNewModel] = useState(false);
  const [savingModel, setSavingModel] = useState(false);
  const [uploadingModelMedia, setUploadingModelMedia] = useState(false);

  // Media library state
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Sân khấu trình diễn');
  const [externalMediaType, setExternalMediaType] = useState<'image' | 'video'>(
    'video'
  );
  const [externalMediaUrl, setExternalMediaUrl] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Site settings + Projects state
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(
    cms.siteSettings
  );
  const [savingSettings, setSavingSettings] = useState(false);
  const [editingProject, setEditingProject] = useState<CmsProjectCase | null>(
    null
  );
  const [isNewProject, setIsNewProject] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => {
    setSettingsDraft(cms.siteSettings);
  }, [cms.siteSettings]);

  const showNotice = (type: 'ok' | 'err', text: string) => {
    setNotice({ type, text });
  };

  const authHeaders = (extra?: Record<string, string>) => ({
    Authorization: `Bearer ${token}`,
    ...(extra || {}),
  });

  // Verify stored token on mount
  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok && mounted) {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken('');
        }
      } catch {
        // ignore transient errors
      } finally {
        if (mounted) setAuthChecked(true);
      }
    };
    verify();
    return () => {
      mounted = false;
    };
  }, [token]);

  const fetchInbox = async (activeToken = token) => {
    if (!activeToken) return;
    setInboxLoading(true);
    try {
      const res = await fetch('/api/admin/inbox', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken('');
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInboxItems(json.data);
        if (json.data.length > 0 && selectedContactId === null) {
          setSelectedContactId(json.data[0].contact_id);
          setNoteDraft(json.data[0].admin_note || '');
        }
      }
    } catch {
      showNotice('err', 'Không thể tải danh sách hộp thư khách hàng.');
    } finally {
      setInboxLoading(false);
    }
  };

  useEffect(() => {
    if (token && authChecked) {
      fetchInbox(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authChecked]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.token) {
        throw new Error(json.message || 'Đăng nhập thất bại.');
      }
      sessionStorage.setItem(TOKEN_STORAGE_KEY, json.token);
      setToken(json.token);
      setPassword('');
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : 'Không thể xác thực tài khoản.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setInboxItems([]);
  };

  // Upload helper used across Media Library, Products, Site Hero, and Projects
  const uploadFileToServer = async (
    file: File,
    title?: string,
    category?: string
  ): Promise<CmsMediaItem> => {
    if (file.size > 35 * 1024 * 1024) {
      throw new Error('Dung lượng tệp tối đa là 35MB.');
    }
    const dataBase64 = await readFileAsDataUrl(file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        dataBase64,
        title: title || file.name,
        category: category || 'Tải lên từ Admin',
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.message || 'Tải tệp lên thất bại.');
    }
    await onCmsUpdated();
    return json.data as CmsMediaItem;
  };

  // Filtered inbox rows
  const filteredInbox = useMemo(() => {
    const q = inboxSearch.trim().toLowerCase();
    return inboxItems.filter((item) => {
      if (inboxFilter !== 'all' && item.status !== inboxFilter) return false;
      if (!q) return true;
      return [
        item.reference_code,
        item.customer_name,
        item.phone,
        item.company_agency,
        item.stage_requirements,
        ...item.interested_categories,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [inboxItems, inboxFilter, inboxSearch]);

  const selectedContact = useMemo(
    () => inboxItems.find((c) => c.contact_id === selectedContactId) || null,
    [inboxItems, selectedContactId]
  );

  const inboxCounts = useMemo(() => {
    return {
      total: inboxItems.length,
      pending: inboxItems.filter((i) => i.status === 'pending').length,
      contacted: inboxItems.filter((i) => i.status === 'contacted').length,
      quoted: inboxItems.filter((i) => i.status === 'quoted').length,
    };
  }, [inboxItems]);

  const handleUpdateInbox = async (
    contactId: number,
    status: 'pending' | 'contacted' | 'quoted',
    adminNote: string
  ) => {
    setSavingInbox(true);
    try {
      const res = await fetch(`/api/admin/inbox/${contactId}`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status, admin_note: adminNote }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể cập nhật yêu cầu.');
      }
      setInboxItems((prev) =>
        prev.map((item) =>
          item.contact_id === contactId ? (json.data as CustomerInboxItem) : item
        )
      );
      showNotice('ok', 'Đã lưu trạng thái và ghi chú xử lý cho yêu cầu.');
    } catch (err) {
      showNotice(
        'err',
        err instanceof Error ? err.message : 'Lỗi cập nhật hộp thư.'
      );
    } finally {
      setSavingInbox(false);
    }
  };

  const handleDeleteInbox = async (contactId: number) => {
    try {
      const res = await fetch(`/api/admin/inbox/${contactId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể xóa tin nhắn.');
      }
      const nextList = inboxItems.filter((i) => i.contact_id !== contactId);
      setInboxItems(nextList);
      if (selectedContactId === contactId) {
        setSelectedContactId(nextList[0]?.contact_id ?? null);
        setNoteDraft(nextList[0]?.admin_note || '');
      }
      showNotice('ok', 'Đã xóa yêu cầu khỏi hộp thư.');
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi khi xóa.');
    }
  };

  // Product Handlers
  const filteredModels = useMemo(() => {
    if (productCollectionFilter === 'all') return cms.models;
    return cms.models.filter((m) => m.collection === productCollectionFilter);
  }, [cms.models, productCollectionFilter]);

  const openNewModelForm = () => {
    setIsNewModel(true);
    setEditingModel({
      id: '',
      collection: 'kinetic',
      collectionName: 'Kinetic',
      kicker: 'KINETIC / NEW MODEL',
      shortLabel: '',
      titleLine1: '',
      titleLine2: 'Kinetic',
      fullName: '',
      cardTag: '',
      heroSummary: '',
      imageUrl: '/assets/squaresnake/kinetic-balls.jpg',
      videoUrl: '',
      galleryImages: [],
      specs: [
        { label: 'Model', value: '' },
        { label: 'Control protocol', value: 'DMX512 / Art-Net' },
        { label: 'Power requirements', value: 'AC 100-240V' },
      ],
      specsFootnote: 'Thông số kỹ thuật được quản lý bởi SquareSnake FX CMS.',
      applicationsLead: 'Hiệu ứng chuyển động sân khấu chuyên nghiệp.',
      applicationsBody: 'Tùy biến theo không gian sự kiện và kịch bản Timecode.',
      applicationsFootnote: 'Hình ảnh và video thực tế cập nhật trực tiếp từ Admin.',
    });
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel || !editingModel.fullName.trim()) {
      showNotice('err', 'Vui lòng nhập Tên đầy đủ cho sản phẩm.');
      return;
    }
    setSavingModel(true);
    try {
      const endpoint = isNewModel
        ? '/api/admin/models'
        : `/api/admin/models/${editingModel.id}`;
      const method = isNewModel ? 'POST' : 'PUT';
      const res = await fetch(endpoint, {
        method,
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(editingModel),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể lưu sản phẩm.');
      }
      await onCmsUpdated();
      setEditingModel(null);
      setIsNewModel(false);
      showNotice(
        'ok',
        isNewModel
          ? 'Đã đăng thiết bị mới lên trang khách hàng.'
          : 'Đã cập nhật thông tin thiết bị.'
      );
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi lưu sản phẩm.');
    } finally {
      setSavingModel(false);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/models/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể xóa thiết bị.');
      }
      await onCmsUpdated();
      if (editingModel?.id === id) setEditingModel(null);
      showNotice('ok', 'Đã xóa thiết bị khỏi danh mục.');
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi xóa sản phẩm.');
    }
  };

  // Media Handlers
  const handleDirectMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      await uploadFileToServer(
        file,
        mediaTitle.trim() || file.name,
        mediaCategory.trim() || 'Thư viện media'
      );
      setMediaTitle('');
      showNotice('ok', `Đã tải lên thành công: ${file.name}`);
    } catch (err) {
      showNotice(
        'err',
        err instanceof Error ? err.message : 'Không thể tải tệp lên.'
      );
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleAddExternalMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalMediaUrl.trim()) {
      showNotice('err', 'Vui lòng nhập URL ảnh hoặc video (MP4 / YouTube).');
      return;
    }
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          title: mediaTitle.trim() || 'Video / Hình ảnh sân khấu',
          type: externalMediaType,
          url: externalMediaUrl.trim(),
          category: mediaCategory.trim() || 'Liên kết ngoài',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể lưu liên kết media.');
      }
      await onCmsUpdated();
      setMediaTitle('');
      setExternalMediaUrl('');
      showNotice('ok', 'Đã thêm liên kết media vào thư viện.');
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi lưu media.');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể xóa tệp.');
      }
      await onCmsUpdated();
      showNotice('ok', 'Đã xóa tệp khỏi thư viện.');
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi xóa tệp.');
    }
  };

  // Site Settings & Projects Handlers
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(settingsDraft),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể lưu cấu hình trang.');
      }
      await onCmsUpdated();
      showNotice('ok', 'Đã cập nhật nội dung Trang chủ, Giới thiệu & Chân trang.');
    } catch (err) {
      showNotice(
        'err',
        err instanceof Error ? err.message : 'Lỗi cập nhật cấu hình.'
      );
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) {
      showNotice('err', 'Vui lòng nhập Tên dự án.');
      return;
    }
    setSavingProject(true);
    try {
      const endpoint = isNewProject
        ? '/api/admin/projects'
        : `/api/admin/projects/${editingProject.id}`;
      const method = isNewProject ? 'POST' : 'PUT';
      const res = await fetch(endpoint, {
        method,
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(editingProject),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể lưu dự án.');
      }
      await onCmsUpdated();
      setEditingProject(null);
      setIsNewProject(false);
      showNotice('ok', 'Đã lưu trường hợp dự án thành công.');
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi lưu dự án.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể xóa dự án.');
      }
      await onCmsUpdated();
      if (editingProject?.id === id) setEditingProject(null);
      showNotice('ok', 'Đã xóa dự án.');
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Lỗi xóa dự án.');
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center">
        <p className="text-sm text-[#9E9EA7]">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  // Admin Login Gate
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col justify-center items-center px-5 py-12">
        <div className="w-full max-w-md bg-[#141417] border border-[#242429] p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <SquareSnakeLogoMark />
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase">
                SQUARESNAKE FX CMS
              </p>
              <h1 className="font-display text-xl font-bold text-white">
                Đăng nhập Quản trị viên
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-user"
                className="block text-xs font-medium text-[#D4D4D8] mb-2"
              >
                Tài khoản quản trị
              </label>
              <input
                id="admin-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white focus:outline-none focus:border-[#E5C148]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-pass"
                className="block text-xs font-medium text-[#D4D4D8] mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị"
                className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white focus:outline-none focus:border-[#E5C148]"
              />
            </div>

            <div className="py-2.5 px-3.5 bg-[#0B0B0D] border border-[#242429] text-xs text-[#9E9EA7] flex items-center justify-between">
              <span>Tài khoản mặc định:</span>
              <span className="font-mono text-[#E5C148] select-all">
                admin / SquareSnake@2026
              </span>
            </div>

            {loginError && (
              <p className="text-xs text-[#FF4D6D]" role="alert">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full h-11 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loggingIn ? 'Đang xác thực...' : 'Vào bảng điều khiển'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#242429] flex justify-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-2 text-xs text-[#9E9EA7] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang khách hàng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const TAB_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'inbox',
      label: 'Inbox Khách Hàng',
      icon: <Inbox className="w-4 h-4" />,
      badge: inboxCounts.pending,
    },
    {
      id: 'products',
      label: 'Sản Phẩm & Thông Số',
      icon: <Layers className="w-4 h-4" />,
      badge: cms.models.length,
    },
    {
      id: 'media',
      label: 'Thư Viện Ảnh & Video',
      icon: <Film className="w-4 h-4" />,
      badge: cms.media.length,
    },
    {
      id: 'content',
      label: 'Nội Dung & Dự Án',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const activeTabLabel = TAB_ITEMS.find((t) => t.id === activeTab)?.label || '';

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col lg:flex-row">
      {/* Left Sidebar (240px on Desktop) */}
      <aside className="lg:w-64 shrink-0 bg-[#141417] border-b lg:border-b-0 lg:border-r border-[#242429] flex flex-col justify-between">
        <div>
          <div className="h-[72px] px-5 border-b border-[#242429] flex items-center gap-3">
            <SquareSnakeLogoMark />
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.06em] text-white uppercase truncate">
                SQUARESNAKE CMS
              </p>
              <p className="text-[11px] text-[#9E9EA7]">Cổng quản trị</p>
            </div>
          </div>

          <nav
            aria-label="Menu quản trị"
            className="p-3 flex lg:flex-col gap-1 overflow-x-auto"
          >
            {TAB_ITEMS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setNotice(null);
                  }}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#E5C148] text-[#0B0B0D] font-semibold'
                      : 'text-[#D4D4D8] hover:bg-[#1C1C21] hover:text-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </span>
                  {typeof tab.badge === 'number' && (
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? 'text-[#0B0B0D]' : 'text-[#9E9EA7]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-4 border-t border-[#242429] space-y-2">
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full px-3.5 py-2.5 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Xem trang khách hàng</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-3.5 py-2 text-xs text-[#9E9EA7] hover:text-[#FF4D6D] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Breadcrumb Bar */}
        <header className="h-[72px] px-5 sm:px-8 border-b border-[#242429] bg-[#0B0B0D] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#9E9EA7] min-w-0">
            <span className="hidden sm:inline">SquareSnake CMS</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-white font-semibold truncate">
              {activeTabLabel}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onExitAdmin}
              className="lg:hidden px-3 py-2 border border-[#242429] bg-[#141417] text-xs text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              Trang khách
            </button>
            <button
              type="button"
              onClick={() => {
                onCmsUpdated();
                fetchInbox();
              }}
              className="px-3.5 py-2 border border-[#242429] bg-[#141417] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>
        </header>

        {/* Workspace Viewport */}
        <main className="flex-1 p-5 sm:p-8 max-w-[1280px] w-full">
          {notice && (
            <div
              role="status"
              className={`mb-6 px-4 py-3 border text-xs flex items-center justify-between gap-4 ${
                notice.type === 'ok'
                  ? 'bg-[#141417] border-[#22C55E]/60 text-[#22C55E]'
                  : 'bg-[#141417] border-[#FF4D6D]/60 text-[#FF4D6D]'
              }`}
            >
              <span>{notice.text}</span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {/* TAB 1: INBOX KHÁCH HÀNG */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              {/* Summary Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tổng yêu cầu', val: inboxCounts.total, color: 'text-white' },
                  { label: 'Chờ xử lý', val: inboxCounts.pending, color: 'text-[#E5C148]' },
                  { label: 'Đã liên hệ', val: inboxCounts.contacted, color: 'text-[#38BDF8]' },
                  { label: 'Đã gửi báo giá', val: inboxCounts.quoted, color: 'text-[#22C55E]' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#141417] border border-[#242429] p-4"
                  >
                    <p className="text-xs text-[#9E9EA7]">{stat.label}</p>
                    <p
                      className={`font-display text-2xl font-bold mt-1 tabular-nums ${stat.color}`}
                    >
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#141417] border border-[#242429]">
                  {(
                    [
                      ['all', 'Tất cả'],
                      ['pending', 'Chờ xử lý'],
                      ['contacted', 'Đã liên hệ'],
                      ['quoted', 'Đã báo giá'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setInboxFilter(key)}
                      className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        inboxFilter === key
                          ? 'bg-[#E5C148] text-[#0B0B0D]'
                          : 'text-[#9E9EA7] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 text-[#9E9EA7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inboxSearch}
                    onChange={(e) => setInboxSearch(e.target.value)}
                    placeholder="Tìm tên, email, mã SS-BG..."
                    className="w-full h-10 pl-9 pr-3 bg-[#141417] border border-[#242429] text-xs text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148]"
                  />
                </div>
              </div>

              {/* Inbox Split Grid: List + Detail Inspector */}
              {inboxLoading ? (
                <div className="bg-[#141417] border border-[#242429] p-8 text-xs text-[#9E9EA7]">
                  Đang tải hộp thư khách hàng...
                </div>
              ) : filteredInbox.length === 0 ? (
                <div className="bg-[#141417] border border-[#242429] p-10 text-center space-y-2">
                  <p className="text-sm font-medium text-white">
                    Chưa có yêu cầu báo giá nào khớp bộ lọc
                  </p>
                  <p className="text-xs text-[#9E9EA7]">
                    Khi khách hàng gửi biểu mẫu từ trang &ldquo;Request a quote&rdquo;, tin nhắn sẽ
                    hiển thị tại đây ngay lập tức.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Table / List */}
                  <div className="lg:col-span-7 bg-[#141417] border border-[#242429] overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#242429] text-[11px] text-[#9E9EA7] uppercase">
                          <th className="py-3 px-4 font-medium">Mã</th>
                          <th className="py-3 px-4 font-medium">Khách hàng</th>
                          <th className="py-3 px-4 font-medium">Thiết bị</th>
                          <th className="py-3 px-4 font-medium">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#242429] text-xs">
                        {filteredInbox.map((item) => {
                          const isSelected =
                            selectedContact?.contact_id === item.contact_id;
                          return (
                            <tr
                              key={item.contact_id}
                              onClick={() => {
                                setSelectedContactId(item.contact_id);
                                setNoteDraft(item.admin_note || '');
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#1D1D22]'
                                  : 'hover:bg-[#19191E]'
                              }`}
                            >
                              <td className="py-3 px-4 font-mono tabular-nums text-[#E5C148] whitespace-nowrap">
                                {item.reference_code}
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-medium text-white">
                                  {item.customer_name}
                                </p>
                                <p className="text-[11px] text-[#9E9EA7]">
                                  {item.company_agency}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-[#D4D4D8]">
                                {item.interested_categories.join(', ')}
                              </td>
                              <td
                                className={`py-3 px-4 font-medium whitespace-nowrap ${STATUS_TEXT_COLORS[item.status]}`}
                              >
                                {STATUS_LABELS[item.status]}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Detail Panel */}
                  {selectedContact && (
                    <div className="lg:col-span-5 bg-[#141417] border border-[#242429] p-6 space-y-5">
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#242429]">
                        <div>
                          <p className="font-mono text-xs text-[#E5C148] tabular-nums">
                            {selectedContact.reference_code} ·{' '}
                            {new Date(selectedContact.created_at).toLocaleDateString(
                              'vi-VN'
                            )}
                          </p>
                          <h2 className="font-display text-lg font-semibold text-white mt-1">
                            {selectedContact.customer_name}
                          </h2>
                          <p className="text-xs text-[#9E9EA7]">
                            {selectedContact.company_agency}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteInbox(selectedContact.contact_id)
                          }
                          title="Xóa tin nhắn"
                          className="p-2 text-[#9E9EA7] hover:text-[#FF4D6D] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between gap-4">
                          <span className="text-[#9E9EA7]">Liên hệ (Email/SĐT):</span>
                          <span className="text-white font-medium text-right break-all">
                            {selectedContact.phone}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#9E9EA7]">Ngày sự kiện:</span>
                          <span className="text-white font-mono tabular-nums">
                            {selectedContact.event_date}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#9E9EA7]">Thiết bị quan tâm:</span>
                          <span className="text-[#E5C148] text-right">
                            {selectedContact.interested_categories.join(' · ')}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#242429]">
                        <p className="text-[11px] text-[#9E9EA7] uppercase mb-1.5">
                          Yêu cầu chi tiết từ khách hàng
                        </p>
                        <p className="text-xs text-[#D4D4D8] leading-relaxed bg-[#0B0B0D] border border-[#242429] p-3.5">
                          {selectedContact.stage_requirements}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-[#242429]">
                        <label className="block text-[11px] text-[#9E9EA7] uppercase">
                          Cập nhật trạng thái xử lý
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['pending', 'contacted', 'quoted'] as const).map(
                            (st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  handleUpdateInbox(
                                    selectedContact.contact_id,
                                    st,
                                    noteDraft
                                  )
                                }
                                className={`py-2 px-2 text-xs font-medium border transition-colors cursor-pointer ${
                                  selectedContact.status === st
                                    ? 'bg-[#E5C148] border-[#E5C148] text-[#0B0B0D] font-semibold'
                                    : 'bg-[#0B0B0D] border-[#242429] text-[#D4D4D8] hover:border-[#E5C148]'
                                }`}
                              >
                                {STATUS_LABELS[st]}
                              </button>
                            )
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="inbox-note"
                            className="block text-[11px] text-[#9E9EA7] uppercase mb-1.5"
                          >
                            Ghi chú nội bộ của Admin
                          </label>
                          <textarea
                            id="inbox-note"
                            rows={2}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Ví dụ: Đã gọi tư vấn, hẹn khảo sát sân khấu..."
                            className="w-full p-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={savingInbox}
                          onClick={() =>
                            handleUpdateInbox(
                              selectedContact.contact_id,
                              selectedContact.status,
                              noteDraft
                            )
                          }
                          className="w-full py-2.5 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingInbox ? 'Đang lưu...' : 'Lưu ghi chú'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SẢN PHẨM & THÔNG SỐ */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#141417] border border-[#242429]">
                  {(
                    [
                      ['all', 'Tất cả'],
                      ['led-matrix', 'LED Matrix'],
                      ['laser', 'Laser'],
                      ['kinetic', 'Kinetic'],
                    ] as const
                  ).map(([slug, label]) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => setProductCollectionFilter(slug)}
                      className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                        productCollectionFilter === slug
                          ? 'bg-[#E5C148] text-[#0B0B0D]'
                          : 'text-[#9E9EA7] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={openNewModelForm}
                  className="px-4 py-2.5 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm thiết bị mới</span>
                </button>
              </div>

              {/* Editor Form */}
              {editingModel && (
                <form
                  onSubmit={handleSaveModel}
                  className="bg-[#141417] border border-[#E5C148]/60 p-6 space-y-5"
                >
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#242429]">
                    <h2 className="font-display text-lg font-semibold text-white">
                      {isNewModel
                        ? 'Thêm thiết bị mới'
                        : `Chỉnh sửa: ${editingModel.fullName}`}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingModel(null);
                        setIsNewModel(false);
                      }}
                      className="text-xs text-[#9E9EA7] hover:text-white cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[#D4D4D8] mb-1.5">
                        Dòng thiết bị *
                      </label>
                      <select
                        value={editingModel.collection}
                        onChange={(e) =>
                          setEditingModel({
                            ...editingModel,
                            collection: e.target.value as CollectionSlug,
                          })
                        }
                        className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                      >
                        <option value="led-matrix">LED Matrix</option>
                        <option value="laser">Laser</option>
                        <option value="kinetic">Kinetic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[#D4D4D8] mb-1.5">
                        Tên đầy đủ *
                      </label>
                      <input
                        type="text"
                        value={editingModel.fullName}
                        onChange={(e) =>
                          setEditingModel({
                            ...editingModel,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Ví dụ: 80W Outdoor Laser"
                        className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#D4D4D8] mb-1.5">
                        Nhãn ngắn (Short Label)
                      </label>
                      <input
                        type="text"
                        value={editingModel.shortLabel}
                        onChange={(e) =>
                          setEditingModel({
                            ...editingModel,
                            shortLabel: e.target.value,
                          })
                        }
                        placeholder="Ví dụ: 80W"
                        className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#D4D4D8] mb-1.5">
                        Tiêu đề dòng 1 / dòng 2
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editingModel.titleLine1}
                          onChange={(e) =>
                            setEditingModel({
                              ...editingModel,
                              titleLine1: e.target.value,
                            })
                          }
                          placeholder="Dòng 1"
                          className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                        />
                        <input
                          type="text"
                          value={editingModel.titleLine2}
                          onChange={(e) =>
                            setEditingModel({
                              ...editingModel,
                              titleLine2: e.target.value,
                            })
                          }
                          placeholder="Dòng 2"
                          className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#D4D4D8] mb-1.5">
                        Mô tả thẻ (Card Tag)
                      </label>
                      <input
                        type="text"
                        value={editingModel.cardTag}
                        onChange={(e) =>
                          setEditingModel({
                            ...editingModel,
                            cardTag: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Mô tả tổng quan (Hero Summary)
                    </label>
                    <textarea
                      rows={2}
                      value={editingModel.heroSummary}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          heroSummary: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                    />
                  </div>

                  {/* Image & Video Upload / URL for Product */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#242429]">
                    <div className="space-y-2">
                      <label className="block text-xs text-[#D4D4D8]">
                        Ảnh đại diện sản phẩm (URL hoặc tải ảnh lên)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingModel.imageUrl}
                          onChange={(e) =>
                            setEditingModel({
                              ...editingModel,
                              imageUrl: e.target.value,
                            })
                          }
                          className="flex-1 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                        />
                        <label className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0">
                          <ImageIcon className="w-3.5 h-3.5 text-[#E5C148]" />
                          <span>
                            {uploadingModelMedia ? 'Đang tải...' : 'Tải ảnh'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (ev) => {
                              const f = ev.target.files?.[0];
                              if (!f) return;
                              setUploadingModelMedia(true);
                              try {
                                const uploaded = await uploadFileToServer(
                                  f,
                                  editingModel.fullName || f.name,
                                  editingModel.collectionName
                                );
                                setEditingModel((prev) =>
                                  prev ? { ...prev, imageUrl: uploaded.url } : prev
                                );
                                showNotice('ok', 'Đã tải ảnh sản phẩm lên.');
                              } catch (err) {
                                showNotice(
                                  'err',
                                  err instanceof Error ? err.message : 'Lỗi tải ảnh.'
                                );
                              } finally {
                                setUploadingModelMedia(false);
                                ev.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs text-[#D4D4D8]">
                        Video trình diễn sản phẩm (MP4 / YouTube URL hoặc tải video)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingModel.videoUrl || ''}
                          onChange={(e) =>
                            setEditingModel({
                              ...editingModel,
                              videoUrl: e.target.value,
                            })
                          }
                          placeholder="/uploads/...mp4 hoặc https://youtube.com/watch?v=..."
                          className="flex-1 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                        />
                        <label className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0">
                          <Film className="w-3.5 h-3.5 text-[#E5C148]" />
                          <span>Tải video</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={async (ev) => {
                              const f = ev.target.files?.[0];
                              if (!f) return;
                              setUploadingModelMedia(true);
                              try {
                                const uploaded = await uploadFileToServer(
                                  f,
                                  `${editingModel.fullName} Video`,
                                  editingModel.collectionName
                                );
                                setEditingModel((prev) =>
                                  prev ? { ...prev, videoUrl: uploaded.url } : prev
                                );
                                showNotice('ok', 'Đã tải video sản phẩm lên.');
                              } catch (err) {
                                showNotice(
                                  'err',
                                  err instanceof Error ? err.message : 'Lỗi tải video.'
                                );
                              } finally {
                                setUploadingModelMedia(false);
                                ev.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Technical Specifications Editor */}
                  <div className="pt-2 border-t border-[#242429] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#D4D4D8]">
                        Bảng thông số kỹ thuật
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingModel({
                            ...editingModel,
                            specs: [
                              ...editingModel.specs,
                              { label: 'Thông số mới', value: '' },
                            ],
                          })
                        }
                        className="text-xs text-[#E5C148] hover:underline cursor-pointer"
                      >
                        + Thêm dòng thông số
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingModel.specs.map((spec, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2">
                          <input
                            type="text"
                            value={spec.label}
                            onChange={(e) => {
                              const next = [...editingModel.specs];
                              next[idx] = { ...next[idx], label: e.target.value };
                              setEditingModel({ ...editingModel, specs: next });
                            }}
                            className="col-span-5 h-9 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-[#D4D4D8]"
                          />
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => {
                              const next = [...editingModel.specs];
                              next[idx] = { ...next[idx], value: e.target.value };
                              setEditingModel({ ...editingModel, specs: next });
                            }}
                            className="col-span-6 h-9 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = editingModel.specs.filter(
                                (_, i) => i !== idx
                              );
                              setEditingModel({ ...editingModel, specs: next });
                            }}
                            className="col-span-1 h-9 flex items-center justify-center border border-[#242429] text-[#9E9EA7] hover:text-[#FF4D6D] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingModel(null);
                        setIsNewModel(false);
                      }}
                      className="px-4 py-2.5 border border-[#242429] text-xs text-[#D4D4D8] hover:text-white cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={savingModel}
                      className="px-5 py-2.5 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingModel ? 'Đang lưu...' : 'Lưu thiết bị'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Product List */}
              <div className="bg-[#141417] border border-[#242429] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#242429] text-[11px] text-[#9E9EA7] uppercase">
                      <th className="py-3 px-4 font-medium">Thiết bị</th>
                      <th className="py-3 px-4 font-medium">Dòng</th>
                      <th className="py-3 px-4 font-medium">Media</th>
                      <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242429] text-xs">
                    {filteredModels.map((m) => (
                      <tr key={m.id} className="hover:bg-[#19191E]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.imageUrl}
                              alt={m.fullName}
                              className="w-12 h-8 object-cover bg-[#0B0B0D] border border-[#242429] shrink-0"
                            />
                            <div>
                              <p className="font-medium text-white">{m.fullName}</p>
                              <p className="text-[11px] text-[#9E9EA7] truncate max-w-md">
                                {m.heroSummary}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#E5C148] whitespace-nowrap">
                          {m.collectionName}
                        </td>
                        <td className="py-3 px-4 text-[#9E9EA7] whitespace-nowrap">
                          {m.videoUrl ? 'Ảnh + Video' : 'Ảnh'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsNewModel(false);
                              setEditingModel(m);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 border border-[#242429] hover:border-[#E5C148] text-xs text-white cursor-pointer"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteModel(m.id)}
                            className="px-2.5 py-1.5 border border-[#242429] hover:border-[#FF4D6D] text-xs text-[#9E9EA7] hover:text-[#FF4D6D] cursor-pointer"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: THƯ VIỆN ẢNH & VIDEO */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* Upload & External Link Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Direct Upload */}
                <div className="bg-[#141417] border border-[#242429] p-6 space-y-4">
                  <h2 className="font-display text-base font-semibold text-white">
                    Tải ảnh hoặc video từ máy tính
                  </h2>
                  <p className="text-xs text-[#9E9EA7]">
                    Hỗ trợ JPG, PNG, WebP, GIF và Video MP4, WebM, MOV (tối đa 35MB). Tệp tải lên
                    sẽ xuất hiện ngay tại mục Thư viện trên trang khách hàng.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      placeholder="Tiêu đề ảnh / video"
                      className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                    />
                    <input
                      type="text"
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      placeholder="Nhóm (VD: Concert, Laser...)"
                      className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                    />
                  </div>

                  <label className="w-full py-6 border border-dashed border-[#383842] hover:border-[#E5C148] bg-[#0B0B0D] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-[#E5C148]" />
                    <span className="text-xs font-medium text-white">
                      {uploadingMedia
                        ? 'Đang tải tệp lên máy chủ...'
                        : 'Chọn tệp Ảnh hoặc Video để tải lên'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      disabled={uploadingMedia}
                      onChange={handleDirectMediaUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Add External URL */}
                <form
                  onSubmit={handleAddExternalMedia}
                  className="bg-[#141417] border border-[#242429] p-6 space-y-4"
                >
                  <h2 className="font-display text-base font-semibold text-white">
                    Hoặc gắn liên kết Video YouTube / URL ngoài
                  </h2>
                  <p className="text-xs text-[#9E9EA7]">
                    Phù hợp với video showreel dung lượng lớn đã đăng trên YouTube hoặc máy chủ
                    lưu trữ riêng.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={externalMediaType}
                      onChange={(e) =>
                        setExternalMediaType(e.target.value as 'image' | 'video')
                      }
                      className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                    >
                      <option value="video">Video / YouTube</option>
                      <option value="image">Hình ảnh URL</option>
                    </select>
                    <input
                      type="text"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      placeholder="Tên hiển thị"
                      className="col-span-2 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                    />
                  </div>

                  <input
                    type="text"
                    value={externalMediaUrl}
                    onChange={(e) => setExternalMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://.../video.mp4"
                    className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white focus:outline-none focus:border-[#E5C148]"
                  />

                  <button
                    type="submit"
                    className="w-full h-10 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm vào thư viện</span>
                  </button>
                </form>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cms.media.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#141417] border border-[#242429] flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-[#0B0B0D]">
                        <MediaStageView
                          imageUrl={item.type === 'image' ? item.url : ''}
                          videoUrl={item.type === 'video' ? item.url : ''}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#9E9EA7] mt-0.5">
                          {item.category} · {item.type === 'video' ? 'Video' : 'Ảnh'}
                        </p>
                        <p className="text-[11px] font-mono text-[#6E6E77] mt-2 truncate">
                          {item.url}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 flex items-center justify-between gap-2 pt-3 border-t border-[#242429]">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(item.url);
                          setCopiedId(item.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                        className="px-3 py-1.5 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === item.id ? 'Đã chép' : 'Copy URL'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(item.id)}
                        className="px-3 py-1.5 border border-[#242429] hover:border-[#FF4D6D] text-xs text-[#9E9EA7] hover:text-[#FF4D6D] cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NỘI DUNG TRANG & DỰ ÁN */}
          {activeTab === 'content' && (
            <div className="space-y-10">
              {/* Site Settings Form */}
              <form
                onSubmit={handleSaveSiteSettings}
                className="bg-[#141417] border border-[#242429] p-6 space-y-5"
              >
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#242429]">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white">
                      Chỉnh sửa thông tin Trang chủ, Giới thiệu &amp; Chân trang
                    </h2>
                    <p className="text-xs text-[#9E9EA7] mt-0.5">
                      Mọi thay đổi được lưu trực tiếp và hiển thị ngay trên giao diện khách hàng.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-5 py-2.5 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingSettings ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Tiêu đề Hero (Dòng 1)
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.heroTitleLine1}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          heroTitleLine1: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Tiêu đề Hero (Dòng 2)
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.heroTitleLine2}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          heroTitleLine2: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#D4D4D8] mb-1.5">
                    Mô tả ngắn Hero Trang chủ
                  </label>
                  <textarea
                    rows={2}
                    value={settingsDraft.heroDescription}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        heroDescription: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Ảnh nền Hero (URL hoặc tải mới)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settingsDraft.heroImageUrl}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            heroImageUrl: e.target.value,
                          })
                        }
                        className="flex-1 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                      />
                      <label className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5 text-[#E5C148]" />
                        <span>Tải ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (ev) => {
                            const f = ev.target.files?.[0];
                            if (!f) return;
                            try {
                              const up = await uploadFileToServer(
                                f,
                                'Hero Background',
                                'Trang chủ'
                              );
                              setSettingsDraft((prev) => ({
                                ...prev,
                                heroImageUrl: up.url,
                              }));
                              showNotice('ok', 'Đã tải ảnh nền Hero.');
                            } catch (err) {
                              showNotice(
                                'err',
                                err instanceof Error ? err.message : 'Lỗi tải ảnh.'
                              );
                            } finally {
                              ev.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Video nền Hero (Tùy chọn MP4)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settingsDraft.heroVideoUrl}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            heroVideoUrl: e.target.value,
                          })
                        }
                        placeholder="Để trống nếu dùng ảnh tĩnh"
                        className="flex-1 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                      />
                      <label className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1 cursor-pointer shrink-0">
                        <Film className="w-3.5 h-3.5 text-[#E5C148]" />
                        <span>Tải video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={async (ev) => {
                            const f = ev.target.files?.[0];
                            if (!f) return;
                            try {
                              const up = await uploadFileToServer(
                                f,
                                'Hero Video',
                                'Trang chủ'
                              );
                              setSettingsDraft((prev) => ({
                                ...prev,
                                heroVideoUrl: up.url,
                              }));
                              showNotice('ok', 'Đã tải video nền Hero.');
                            } catch (err) {
                              showNotice(
                                'err',
                                err instanceof Error ? err.message : 'Lỗi tải video.'
                              );
                            } finally {
                              ev.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* About + Contact Footer Info */}
                <div className="pt-4 border-t border-[#242429] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Tên công ty (Footer)
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.companyName}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Email liên hệ
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.email}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          email: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Số điện thoại Hotline
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.phone}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          phone: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#D4D4D8] mb-1.5">
                      Zalo / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.zalo}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          zalo: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#D4D4D8] mb-1.5">
                    Địa chỉ văn phòng &amp; kho thiết bị
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.address}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        address: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D4D4D8] mb-1.5">
                    Nội dung trang Về Chúng Tôi
                  </label>
                  <textarea
                    rows={3}
                    value={settingsDraft.aboutDescription}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        aboutDescription: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                  />
                </div>
              </form>

              {/* Case Studies / Projects Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-white">
                    Trường Hợp Dự Án (Case Studies)
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewProject(true);
                      setEditingProject({
                        id: '',
                        num: `0${cms.projects.length + 1} / LIVE EVENT`,
                        title: '',
                        detail: 'LED Matrix · Laser · Kinetic',
                        summary: '',
                        imageUrl: '/assets/squaresnake/hero-concert.jpg',
                        videoUrl: '',
                        slug: 'kinetic',
                      });
                    }}
                    className="px-4 py-2 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm dự án mới</span>
                  </button>
                </div>

                {editingProject && (
                  <form
                    onSubmit={handleSaveProject}
                    className="bg-[#141417] border border-[#E5C148]/60 p-6 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={editingProject.num}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            num: e.target.value,
                          })
                        }
                        placeholder="04 / MUSIC SHOW"
                        className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                      />
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                          })
                        }
                        placeholder="Tên sự kiện / dự án *"
                        className="md:col-span-2 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingProject.detail}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            detail: e.target.value,
                          })
                        }
                        placeholder="Thiết bị sử dụng"
                        className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                      />
                      <select
                        value={editingProject.slug}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            slug: e.target.value as CollectionSlug,
                          })
                        }
                        className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                      >
                        <option value="led-matrix">Liên kết: LED Matrix</option>
                        <option value="laser">Liên kết: Laser</option>
                        <option value="kinetic">Liên kết: Kinetic</option>
                      </select>
                    </div>

                    <textarea
                      rows={2}
                      value={editingProject.summary}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          summary: e.target.value,
                        })
                      }
                      placeholder="Mô tả triển khai thực tế..."
                      className="w-full p-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.imageUrl}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              imageUrl: e.target.value,
                            })
                          }
                          placeholder="URL ảnh dự án"
                          className="flex-1 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                        />
                        <label className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1 cursor-pointer shrink-0">
                          <ImageIcon className="w-3.5 h-3.5 text-[#E5C148]" />
                          <span>Tải ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (ev) => {
                              const f = ev.target.files?.[0];
                              if (!f) return;
                              try {
                                const up = await uploadFileToServer(
                                  f,
                                  editingProject.title || f.name,
                                  'Dự án'
                                );
                                setEditingProject((prev) =>
                                  prev ? { ...prev, imageUrl: up.url } : prev
                                );
                              } catch (err) {
                                showNotice(
                                  'err',
                                  err instanceof Error ? err.message : 'Lỗi tải ảnh.'
                                );
                              } finally {
                                ev.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.videoUrl || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              videoUrl: e.target.value,
                            })
                          }
                          placeholder="URL Video / YouTube (tùy chọn)"
                          className="flex-1 h-10 px-3 bg-[#0B0B0D] border border-[#242429] text-xs text-white"
                        />
                        <label className="h-10 px-3 bg-[#0B0B0D] border border-[#242429] hover:border-[#E5C148] text-xs text-white inline-flex items-center gap-1 cursor-pointer shrink-0">
                          <Film className="w-3.5 h-3.5 text-[#E5C148]" />
                          <span>Tải video</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={async (ev) => {
                              const f = ev.target.files?.[0];
                              if (!f) return;
                              try {
                                const up = await uploadFileToServer(
                                  f,
                                  `${editingProject.title} Video`,
                                  'Dự án'
                                );
                                setEditingProject((prev) =>
                                  prev ? { ...prev, videoUrl: up.url } : prev
                                );
                              } catch (err) {
                                showNotice(
                                  'err',
                                  err instanceof Error ? err.message : 'Lỗi tải video.'
                                );
                              } finally {
                                ev.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsNewProject(false);
                        }}
                        className="px-4 py-2 border border-[#242429] text-xs text-[#D4D4D8] cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={savingProject}
                        className="px-5 py-2 bg-[#E5C148] text-[#0B0B0D] text-xs font-semibold cursor-pointer"
                      >
                        {savingProject ? 'Đang lưu...' : 'Lưu dự án'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {cms.projects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#141417] border border-[#242429] flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-[#0B0B0D]">
                          <MediaStageView
                            imageUrl={p.imageUrl}
                            videoUrl={p.videoUrl}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] text-[#E5C148] uppercase">
                            {p.num}
                          </p>
                          <h3 className="font-display text-base font-semibold text-white mt-1">
                            {p.title}
                          </h3>
                          <p className="text-xs text-[#9E9EA7] mt-1 line-clamp-2">
                            {p.summary}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-3 border-t border-[#242429] flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewProject(false);
                            setEditingProject(p);
                          }}
                          className="px-3 py-1.5 border border-[#242429] hover:border-[#E5C148] text-xs text-white cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id)}
                          className="px-3 py-1.5 border border-[#242429] hover:border-[#FF4D6D] text-xs text-[#9E9EA7] hover:text-[#FF4D6D] cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
