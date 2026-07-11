import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, blogApi, enquiryApi, dashboardApi, setAdminToken, clearAdminToken, getAdminToken, getUploadUrl, productApi } from '../lib/api';
import type { Blog, Enquiry, DashboardSummary } from '../lib/api';
import { authorInitials, estimateReadingTime, renderBlogContent, slugify, splitList } from '../lib/blogContent';

// ─── Reusable Pagination Component ───────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [10, 20, 50];

function Pagination({
  total, page, pageSize, onPage, onPageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSize: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const btnBase: React.CSSProperties = {
    padding: '7px 13px', borderRadius: '8px', border: '1px solid #E4E7EC',
    background: '#FFFFFF', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 600, color: '#374151', transition: 'all 0.15s',
  };
  const btnActive: React.CSSProperties = {
    ...btnBase, background: '#111', color: '#FFF', borderColor: '#111',
  };
  const btnDisabled: React.CSSProperties = {
    ...btnBase, opacity: 0.4, cursor: 'not-allowed',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', gap: '10px',
    }}>
      <span style={{ fontSize: '13px', color: '#667085' }}>
        Showing <strong style={{ color: '#111' }}>{from}–{to}</strong> of <strong style={{ color: '#111' }}>{total}</strong>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Per-page selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#667085' }}>Per page:</span>
          {PAGE_SIZE_OPTIONS.map((s) => (
            <button key={s}
              onClick={() => { onPageSize(s); onPage(1); }}
              style={pageSize === s ? btnActive : btnBase}
            >{s}</button>
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', background: '#E4E7EC' }} />

        {/* Prev / page numbers / Next */}
        <button onClick={() => onPage(page - 1)} disabled={page <= 1}
          style={page <= 1 ? btnDisabled : btnBase}>‹ Prev</button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | '...')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === '...' ? (
              <span key={`ellipsis-${idx}`} style={{ fontSize: '13px', color: '#A0A0A0', padding: '0 4px' }}>…</span>
            ) : (
              <button key={item} onClick={() => onPage(item as number)}
                style={item === page ? btnActive : btnBase}>{item}</button>
            )
          )}

        <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}
          style={page >= totalPages ? btnDisabled : btnBase}>Next ›</button>
      </div>
    </div>
  );
}

// ─── Product Types ────────────────────────────────────────────────
type ProductCategory = 'Cocopeat' | 'Coir Fibre' | 'Geotextiles' | 'Chips mixed Cocopeat blocks' | 'Grow bags' | 'Custom';
type ProductStatus = 'Published' | 'Draft' | 'Archived';

interface Product {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  moq: string;
  status: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  updatedAt: string;
}

const PRODUCT_CATEGORIES: ProductCategory[] = ['Cocopeat', 'Coir Fibre', 'Geotextiles', 'Chips mixed Cocopeat blocks', 'Grow bags', 'Custom'];
const PRODUCT_STATUSES: ProductStatus[] = ['Published', 'Draft', 'Archived'];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Published: { bg: 'rgba(22,163,74,0.1)', color: '#16A34A' },
  Draft: { bg: 'rgba(100,116,139,0.1)', color: '#64748B' },
  Archived: { bg: 'rgba(220,38,38,0.08)', color: '#DC2626' },
};


// ─── Delete Confirm Modal ─────────────────────────────────────────
function DeleteConfirmModal({ productName, onConfirm, onCancel }: { productName: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
        style={{ background: '#FFFFFF', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '22px' }}>🗑️</div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em', marginBottom: '8px' }}>Delete Product?</h3>
        <p style={{ fontSize: '14px', color: '#667085', lineHeight: 1.6, marginBottom: '28px' }}>
          Are you sure you want to delete <strong style={{ color: '#111' }}>{productName}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '11px 22px', background: 'transparent', border: '1px solid #E4E7EC', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, color: '#667085' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '11px 22px', background: '#DC2626', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Delete Product</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Product Form Drawer ──────────────────────────────────────────
function ProductFormDrawer({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = product !== null;
  const [name, setName] = useState(product?.name ?? '');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [category, setCategory] = useState<string>(product?.category ?? 'Cocopeat');
  const [moq, setMoq] = useState(product?.moq ?? '');
  const [status, setStatus] = useState<string>(product?.status ?? 'Draft');
  const [description, setDescription] = useState(product?.description ?? '');

  // Image URL inputs — one per line
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images && product.images.length > 0 ? product.images : ['']
  );
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(product?.specs ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('sku', sku.trim());
    fd.append('category', category.trim());
    fd.append('moq', moq.trim());
    fd.append('status', status);
    fd.append('description', description.trim());

    const filteredSpecs = specs.filter((s) => s.label.trim() && s.value.trim());
    fd.append('specs', JSON.stringify(filteredSpecs));

    // Send all non-empty image URLs as a JSON array
    const validUrls = imageUrls.filter((u) => u.trim());
    fd.append('imageUrls', JSON.stringify(validUrls));

    // For edit mode, no existing images to "keep" — all are managed via imageUrls
    if (isEdit) {
      fd.append('existingImages', JSON.stringify([]));
    }

    try {
      if (isEdit && product) {
        await productApi.update(Number(product.id), fd);
      } else {
        await productApi.create(fd);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #E4E7EC', borderRadius: '10px',
    padding: '12px 14px', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', background: '#FFFFFF',
    color: '#111111', transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '0.5px', color: '#667085', display: 'block', marginBottom: '6px',
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      />
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 210,
          width: '100%', maxWidth: '580px', background: '#FFFFFF',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '4px' }}>Product Catalog</p>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
              {isEdit ? `Edit: ${name}` : 'Add New Product'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: '#F9FAFB', border: '1px solid #E4E7EC', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', color: '#667085', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Coco Peat Block 5kg" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
          </div>

          {/* SKU + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>SKU / Product Code *</label>
              <input required value={sku} onChange={(e) => setSku(e.target.value)} placeholder="MC-COCO-01" style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='%23667085' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19 9l-7 7-7-7' stroke-linecap='round' stroke-linejoin='round'></path></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px 16px', paddingRight: '36px', cursor: 'pointer' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')}>
                {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* MOQ */}
          <div>
            <label style={labelStyle}>Minimum Order Quantity (MOQ) *</label>
            <input required value={moq} onChange={(e) => setMoq(e.target.value)} placeholder="1 × 40ft FCL or 5 MT" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
          </div>

          {/* Status switcher */}
          <div>
            <label style={labelStyle}>Status *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
              {PRODUCT_STATUSES.map((s) => {
                const isActive = status === s;
                const st = STATUS_STYLE[s];
                return (
                  <button key={s} type="button" onClick={() => setStatus(s)}
                    style={{ padding: '8px 18px', borderRadius: '999px', border: `1.5px solid ${isActive ? st.color : '#E4E7EC'}`, background: isActive ? st.bg : 'transparent', color: isActive ? st.color : '#667085', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Product Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Describe key specs, certifications, use cases…"
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
          </div>

          {/* Specs Editor */}
          <div>
            <label style={labelStyle}>Product Specifications</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {specs.map((spec, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    value={spec.label}
                    onChange={(e) => {
                      const next = [...specs];
                      next[index].label = e.target.value;
                      setSpecs(next);
                    }}
                    placeholder="Label (e.g., pH)"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => {
                      const next = [...specs];
                      next[index].value = e.target.value;
                      setSpecs(next);
                    }}
                    placeholder="Value (e.g., 5.8 – 6.5)"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== index))}
                    style={{
                      background: 'rgba(220,38,38,0.06)',
                      border: '1px solid rgba(220,38,38,0.15)',
                      color: '#DC2626',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSpecs((prev) => [...prev, { label: '', value: '' }])}
              style={{
                background: 'rgba(201,155,103,0.08)',
                border: '1px solid rgba(201,155,103,0.25)',
                color: '#7A5C3A',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              + Add Spec Row
            </button>
          </div>

          {/* Image URL Inputs */}
          <div>
            <label style={labelStyle}>Product Image URLs</label>
            <p style={{ fontSize: '12px', color: '#A0A0A0', marginBottom: '10px' }}>
              Paste direct image URLs (e.g. from Cloudinary, ImgBB, or any CDN). Add one per row.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {imageUrls.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const next = [...imageUrls];
                        next[idx] = e.target.value;
                        setImageUrls(next);
                      }}
                      placeholder="https://example.com/product-image.jpg"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')}
                    />
                    {url && url.startsWith('http') && (
                      <img src={url} alt="preview"
                        style={{ marginTop: '6px', height: '64px', width: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E4E7EC' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <button type="button"
                    onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={imageUrls.length === 1}
                    style={{
                      background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)',
                      color: '#DC2626', borderRadius: '8px', width: '36px', height: '36px',
                      cursor: imageUrls.length === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      opacity: imageUrls.length === 1 ? 0.4 : 1,
                    }}>✕</button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setImageUrls((prev) => [...prev, ''])}
              style={{
                marginTop: '10px', background: 'rgba(201,155,103,0.08)',
                border: '1px solid rgba(201,155,103,0.25)', color: '#7A5C3A',
                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 700,
              }}
            >
              + Add Another Image URL
            </button>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px', marginTop: 'auto' }}>
            <button type="button" onClick={onClose} disabled={loading}
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #E4E7EC', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, color: '#667085' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '12px 28px', background: '#111111', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Product')}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string | 'All'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAllAdmin();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [searchQuery, filterCategory, filterStatus, pageSize]);

  // Derive unique categories from loaded products
  const dynamicCategories = Array.from(new Set(products.map((p) => p.category))).sort();

  const filtered = products.filter((p) => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => { setSelectedProduct(null); setIsFormOpen(true); };
  const openEdit = (p: Product) => { setSelectedProduct(p); setIsFormOpen(true); };

  const handleSaved = () => {
    fetchProducts();
    setIsFormOpen(false);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await productApi.delete(Number(id));
      fetchProducts();
    } catch (err: any) {
      alert(err.message ?? 'Failed to delete product');
    }
    setDeleteTarget(null);
  };

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E4E7EC', borderRadius: '10px', padding: '9px 14px', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit', background: '#FFFFFF', color: '#111',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap' as const, gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Product Catalog</h2>
          <p style={{ fontSize: '14px', color: '#667085', marginTop: '6px' }}>Manage, update, and monitor international and domestic product listings.</p>
        </div>
        <button
          onClick={openCreate}
          style={{ padding: '11px 22px', background: '#111111', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' as const, display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#222')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#111111')}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add New Product
        </button>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#A0A0A0', pointerEvents: 'none' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or SKU…"
            style={{ ...inputStyle, width: '100%', paddingLeft: '38px', boxSizing: 'border-box' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
        </div>
        {/* Category filter */}
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          style={{ ...inputStyle, paddingRight: '32px', cursor: 'pointer' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')}>
          <option value="All">All Categories</option>
          {dynamicCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Status filter */}
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          style={{ ...inputStyle, paddingRight: '32px', cursor: 'pointer' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')}>
          <option value="All">All Statuses</option>
          {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: '#667085' }}>Loading products…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>No products found.</p>
          <p style={{ color: '#667085', marginTop: '8px', fontSize: '14px' }}>Try adjusting your filters or add a new product.</p>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Product Info', 'Category', 'MOQ', 'Status', 'Updated', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#667085', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, i) => {
                const st = STATUS_STYLE[p.status] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B' };
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04, ease: 'easeOut' }}
                    style={{ borderTop: '1px solid #F3F4F6' }}
                    className="hover:bg-black/2 transition-colors duration-200"
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #F5F1EB, #EAE3D6)', border: '1px solid rgba(201,155,103,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, overflow: 'hidden' }}>
                          {p.images[0] ? <img src={getUploadUrl(p.images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>{p.name}</p>
                          <p style={{ fontSize: '12px', color: '#A0A0A0', fontFamily: 'monospace', marginTop: '2px' }}>{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{p.category}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{p.moq}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#A0A0A0', whiteSpace: 'nowrap' }}>
                      {new Date(p.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => openEdit(p)}
                          title="Edit product"
                          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(201,155,103,0.25)', background: 'rgba(201,155,103,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', color: '#7A5C3A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,155,103,0.18)'; e.currentTarget.style.borderColor = '#C99B67'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,155,103,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,155,103,0.25)'; }}
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          title="Delete product"
                          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.15)', background: 'rgba(220,38,38,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', color: '#DC2626' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.14)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.15)'; }}
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            total={filtered.length}
            page={page}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={setPageSize}
          />
        </div>
      )}

      {/* Product Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <ProductFormDrawer
            product={selectedProduct}
            onClose={() => setIsFormOpen(false)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            productName={deleteTarget.name}
            onConfirm={() => handleDelete(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Utility ──────────────────────────────────────────────────────
function formatDate(d: string) {

  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────
function Stat({ label, value, gold }: { label: string; value: number; gold?: boolean }) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '16px', padding: '24px 28px',
      border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#A0A0A0', marginBottom: '10px' }}>{label}</p>
      <p style={{ fontSize: '40px', fontWeight: 800, color: gold ? '#C99B67' : '#111111', letterSpacing: '-0.03em' }}>{value}</p>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setAdminToken(res.token);
      onSuccess();
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', padding: '16px' }}>
      <div
        className="p-6 sm:p-10"
        style={{
          background: '#FFFFFF', borderRadius: '24px',
          width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '4px', color: '#C99B67', textTransform: 'uppercase' }}>Admin Portal</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111111', marginTop: '8px', letterSpacing: '-0.025em' }}>Mariah Coirs</h1>
          <p style={{ fontSize: '14px', color: '#667085', marginTop: '6px' }}>Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
              {error}
            </div>
          )}
          {(['email', 'password'] as const).map((field) => (
            <div key={field}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#667085', display: 'block', marginBottom: '6px' }}>
                {field === 'email' ? 'Email Address' : 'Password'}
              </label>
              <input
                type={field}
                value={field === 'email' ? email : password}
                onChange={(e) => field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                placeholder={field === 'email' ? 'admin@mariahcoirsexport.com' : '••••••••••'}
                required
                style={{
                  width: '100%', border: '1px solid #E4E7EC', borderRadius: '12px',
                  padding: '14px 16px', fontSize: '15px', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px', padding: '15px', background: loading ? '#D4A96A' : '#C99B67',
              color: '#111111', fontWeight: 700, fontSize: '16px', borderRadius: '14px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Blog Form Modal ──────────────────────────────────────────────
function BlogFormModal({
  blog,
  onClose,
  onSaved,
}: {
  blog: Blog | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(blog?.title ?? '');
  const [slug, setSlug] = useState(blog?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(blog?.slug));
  const [metaTitle, setMetaTitle] = useState(blog?.metaTitle ?? '');
  const [metaDesc, setMetaDesc] = useState(blog?.metaDescription ?? '');
  const [focusKeywords, setFocusKeywords] = useState(blog?.focusKeywords ?? '');
  const [shortDesc, setShortDesc] = useState(blog?.shortDescription ?? '');
  const [content, setContent] = useState(blog?.content ?? '');
  const [category, setCategory] = useState(blog?.category ?? '');
  const [tags, setTags] = useState(blog?.tags ?? '');
  const [authorName, setAuthorName] = useState(blog?.authorName ?? '');
  const [authorRole, setAuthorRole] = useState(blog?.authorRole ?? '');
  const [authorBio, setAuthorBio] = useState(blog?.authorBio ?? '');
  const [authorAvatar, setAuthorAvatar] = useState(blog?.authorAvatar ?? '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(blog?.featuredImageAlt ?? '');
  const [canonicalUrl, setCanonicalUrl] = useState(blog?.canonicalUrl ?? '');
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [imageUrl, setImageUrl] = useState(
    blog?.featuredImage
      ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : getUploadUrl(blog.featuredImage))
      : ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    blog?.featuredImage
      ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : getUploadUrl(blog.featuredImage))
      : ''
  );
  const [imageTouched, setImageTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const applyImageFile = (file: File) => {
    setImageTouched(true);
    setImageFile(file);
    setImageUrl('');
    setImagePreviewUrl((current) => {
      if (current.startsWith('blob:')) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  const applyImageUrl = (value: string) => {
    setImageTouched(true);
    setImageFile(null);
    setImageUrl(value);
    setImagePreviewUrl((current) => {
      if (current.startsWith('blob:')) URL.revokeObjectURL(current);
      return value;
    });
  };

  const clearImage = () => {
    setImageTouched(true);
    setImageFile(null);
    setImageUrl('');
    setImagePreviewUrl((current) => {
      if (current.startsWith('blob:')) URL.revokeObjectURL(current);
      return '';
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('slug', slug.trim() || title.trim());
    fd.append('metaTitle', metaTitle.trim());
    fd.append('metaDescription', metaDesc.trim());
    fd.append('focusKeywords', focusKeywords.trim());
    fd.append('shortDescription', shortDesc.trim());
    fd.append('content', content.trim());
    fd.append('isPublished', String(isPublished));
    fd.append('category', category.trim());
    fd.append('tags', tags.trim());
    fd.append('authorName', authorName.trim());
    fd.append('authorRole', authorRole.trim());
    fd.append('authorBio', authorBio.trim());
    fd.append('authorAvatar', authorAvatar.trim());
    fd.append('featuredImageAlt', featuredImageAlt.trim());
    fd.append('canonicalUrl', canonicalUrl.trim());

    if (imageFile) {
      fd.append('featuredImage', imageFile);
    } else if (imageTouched) {
      fd.append('featuredImageUrl', imageUrl.trim());
    }

    try {
      if (blog) {
        await blogApi.update(blog.id, fd);
      } else {
        await blogApi.create(fd);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #E4E7EC',
    borderRadius: '14px',
    padding: '12px 14px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    color: '#111111',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#667085',
    display: 'block',
    marginBottom: '6px',
  };

  const activeImagePreview = imagePreviewUrl || '';
  const previewHtml = renderBlogContent(content || '<p>Your article preview will appear here.</p>');
  const metaTitleCount = metaTitle.trim().length;
  const metaDescCount = metaDesc.trim().length;
  const canonicalPreview = canonicalUrl.trim() || (slug.trim() ? `https://www.mariahcoirsexport.com/blog/${slugify(slug)}` : 'https://www.mariahcoirsexport.com/blog/your-post');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(6, 15, 11, 0.68)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '18px',
        overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#FFFCF7',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '1200px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.28)',
          border: '1px solid rgba(255,255,255,0.7)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(16,24,40,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8F5D22' }}>Blog Studio</div>
            <h2 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', color: '#102A1D' }}>
              {blog ? 'Edit Blog Post' : 'Create Blog Post'}
            </h2>
          </div>
          <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid rgba(16,24,40,0.08)', background: '#fff', cursor: 'pointer', fontSize: '18px', color: '#667085' }}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{ margin: '20px 24px 0', padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ padding: '18px 24px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(['content', 'seo'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  border: `1px solid ${isActive ? 'rgba(143,93,34,0.3)' : 'rgba(16,24,40,0.08)'}`,
                  background: isActive ? 'rgba(143,93,34,0.08)' : '#fff',
                  color: isActive ? '#8F5D22' : '#334155',
                  borderRadius: '999px',
                  padding: '10px 16px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {tab === 'content' ? 'Content' : 'SEO / Metadata'}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '18px 24px 24px' }}>
          {activeTab === 'content' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)', gap: '18px', alignItems: 'start' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <section style={{ padding: '18px', borderRadius: '22px', background: '#FFFFFF', border: '1px solid rgba(16,24,40,0.08)' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Title *</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Coconut Coir and the Next Wave of Sustainable Greenhouses" style={inputStyle} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '14px' }}>
                    <div>
                      <label style={labelStyle}>Custom URL Slug</label>
                      <input
                        value={slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          setSlug(slugify(e.target.value));
                        }}
                        placeholder="coconut-coir-sustainable-greenhouses"
                        style={inputStyle}
                      />
                      <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#667085' }}>Auto-generated from the title until you edit it manually.</p>
                    </div>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Cocopeat Insights" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Short Description / Excerpt *</label>
                    <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={3} required placeholder="A concise summary that appears on the blog cards and in search results." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Author Name</label>
                      <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Mariah Coirs Editorial Team" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Author Role</label>
                      <input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder="Operations & Agronomy" style={inputStyle} />
                    </div>
                  </div>
                </section>

                <section style={{ padding: '18px', borderRadius: '22px', background: '#FFFFFF', border: '1px solid rgba(16,24,40,0.08)' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Article Content *</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={18}
                      required
                      placeholder={'# Heading\n\nWrite in Markdown or rich text HTML.\n\n## Section Heading\n\n- Bullet one\n- Bullet two'}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '420px', lineHeight: 1.7, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '13px' }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Tags</label>
                      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="coir, cocopeat, greenhouse, export" style={inputStyle} />
                      <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#667085' }}>Use commas to separate multiple tags.</p>
                    </div>
                    <div>
                      <label style={labelStyle}>Author Avatar URL</label>
                      <input value={authorAvatar} onChange={(e) => setAuthorAvatar(e.target.value)} placeholder="https://..." style={inputStyle} />
                    </div>
                  </div>
                </section>
              </div>

              <div style={{ display: 'grid', gap: '16px', position: 'sticky', top: '24px' }}>
                <section style={{ padding: '18px', borderRadius: '22px', background: '#FFFFFF', border: '1px solid rgba(16,24,40,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={labelStyle}>Featured Image</label>
                    <button type="button" onClick={clearImage} style={{ border: 'none', background: 'transparent', color: '#8F5D22', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>
                      Clear
                    </button>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#8F5D22';
                      e.currentTarget.style.background = 'rgba(143,93,34,0.06)';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(16,24,40,0.12)';
                      e.currentTarget.style.background = '#FAFAF7';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'rgba(16,24,40,0.12)';
                      e.currentTarget.style.background = '#FAFAF7';
                      const file = e.dataTransfer.files?.[0];
                      if (file) applyImageFile(file);
                    }}
                    style={{
                      border: '1.5px dashed rgba(16,24,40,0.12)',
                      borderRadius: '20px',
                      padding: '18px',
                      background: '#FAFAF7',
                      cursor: 'pointer',
                    }}
                  >
                    {activeImagePreview ? (
                      <img src={activeImagePreview} alt={featuredImageAlt || title || 'Featured preview'} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }} />
                    ) : (
                      <div style={{ minHeight: '220px', display: 'grid', placeItems: 'center', textAlign: 'center', color: '#667085' }}>
                        <div>
                          <div style={{ fontSize: '34px' }}>⬆︎</div>
                          <div style={{ marginTop: '8px', fontWeight: 700 }}>Drop an image here or click to upload</div>
                          <div style={{ marginTop: '4px', fontSize: '13px' }}>PNG, JPG, WEBP, or GIF up to 5MB</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) applyImageFile(file);
                  }} />

                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Or Featured Image URL</label>
                    <input value={imageUrl} onChange={(e) => applyImageUrl(e.target.value)} placeholder="https://example.com/blog-cover.jpg" style={inputStyle} />
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Alt Text for Image</label>
                    <input value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} placeholder="Workers processing coco husk fibers at the Mariah Coirs plant" style={inputStyle} />
                  </div>
                </section>

                <section style={{ padding: '18px', borderRadius: '22px', background: '#102A1D', color: '#F7F1E7', boxShadow: '0 20px 40px rgba(16,42,29,0.14)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#E6B46B' }}>Live Preview</div>
                  <div style={{ marginTop: '14px', borderRadius: '18px', overflow: 'hidden', background: '#fffaf4', color: '#102A1D' }}>
                    {activeImagePreview && <img src={activeImagePreview} alt={featuredImageAlt || title || 'Featured preview'} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
                    <div style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {category && <span style={{ padding: '6px 10px', borderRadius: '999px', background: '#F5EAD8', color: '#8F5D22', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{category}</span>}
                        <span style={{ padding: '6px 10px', borderRadius: '999px', background: 'rgba(16,42,29,0.06)', color: '#334155', fontSize: '11px', fontWeight: 800 }}> {estimateReadingTime(content)} min read</span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', lineHeight: 1.15, letterSpacing: '-0.04em' }}>{title || 'Your article title will appear here'}</h3>
                      <p style={{ margin: '10px 0 0', color: '#5B6472', lineHeight: 1.7 }}>{shortDesc || 'Your excerpt and snippet preview will appear here.'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #EBD8B7 0%, #D99C3C 100%)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                          <span style={{ fontWeight: 800, color: '#102A1D' }}>{authorInitials(authorName || 'Mariah Coirs')}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{authorName || 'Mariah Coirs Editorial Team'}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>{authorRole || 'Editorial insights'}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(16,24,40,0.08)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8F5D22', marginBottom: '10px' }}>
                          Article Preview
                        </div>
                        <div className="blog-rich-text" style={{ fontSize: '0.92rem' }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 360px)', gap: '18px', alignItems: 'start' }}>
              <section style={{ padding: '18px', borderRadius: '22px', background: '#FFFFFF', border: '1px solid rgba(16,24,40,0.08)', display: 'grid', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Meta Title</label>
                  <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Search-friendly SEO title" maxLength={60} style={inputStyle} />
                  <div style={{ marginTop: '6px', fontSize: '12px', color: metaTitleCount > 60 ? '#DC2626' : '#667085', textAlign: 'right' }}>{metaTitleCount}/60</div>
                </div>

                <div>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={4} maxLength={160} placeholder="A concise 160-character summary for search engines." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                  <div style={{ marginTop: '6px', fontSize: '12px', color: metaDescCount > 160 ? '#DC2626' : '#667085', textAlign: 'right' }}>{metaDescCount}/160</div>
                </div>

                <div>
                  <label style={labelStyle}>Focus Keywords</label>
                  <input value={focusKeywords} onChange={(e) => setFocusKeywords(e.target.value)} placeholder="coco peat, coir fiber, greenhouse substrates" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Canonical URL</label>
                  <input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://www.mariahcoirsexport.com/blog/canonical-slug" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Author Bio</label>
                  <textarea value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} rows={5} placeholder="A short author bio that can also be reused on the article page." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
              </section>

              <section style={{ padding: '18px', borderRadius: '22px', background: '#102A1D', color: '#F7F1E7', boxShadow: '0 20px 40px rgba(16,42,29,0.14)', position: 'sticky', top: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#E6B46B' }}>Search Preview</div>
                <div style={{ marginTop: '14px', borderRadius: '18px', background: '#fffaf4', color: '#102A1D', padding: '16px' }}>
                  <div style={{ color: '#1D4ED8', fontSize: '14px', fontWeight: 700, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{metaTitle.trim() || title || 'Blog post title'}</div>
                  <div style={{ color: '#16A34A', fontSize: '13px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{canonicalPreview}</div>
                  <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: 1.6 }}>{metaDesc.trim() || shortDesc || 'Search engine snippet preview text will appear here.'}</p>
                </div>
                <div style={{ marginTop: '14px', padding: '14px', borderRadius: '18px', background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>SEO checks</div>
                  <ul style={{ margin: '10px 0 0', paddingLeft: '18px', display: 'grid', gap: '8px', color: 'rgba(247,241,231,0.9)', lineHeight: 1.6 }}>
                    <li>{metaTitleCount <= 60 ? 'Meta title length is within the recommended range.' : 'Meta title is longer than 60 characters.'}</li>
                    <li>{metaDescCount <= 160 ? 'Meta description length is within the recommended range.' : 'Meta description is longer than 160 characters.'}</li>
                    <li>{splitList(focusKeywords).length > 0 ? 'Focus keywords are set.' : 'Add focus keywords for search targeting.'}</li>
                  </ul>
                </div>
              </section>
            </div>
          )}

          <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid rgba(16,24,40,0.08)', display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div
                onClick={() => setIsPublished((prev) => !prev)}
                style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '999px',
                  background: isPublished ? '#8F5D22' : '#E5E7EB',
                  transition: 'background 0.2s',
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: isPublished ? '24px' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>{isPublished ? 'Published' : 'Draft'}</span>
            </label>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} style={{ padding: '12px 22px', background: 'transparent', border: '1px solid rgba(16,24,40,0.12)', borderRadius: '14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: '#475569' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ padding: '12px 24px', background: loading ? '#B98940' : '#8F5D22', border: 'none', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 800, color: '#fff', boxShadow: '0 8px 20px rgba(143,93,34,0.25)', opacity: loading ? 0.8 : 1 }}>
                {loading ? 'Saving…' : blog ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────
function DashboardTab() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getSummary()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#667085' }}>Loading…</div>;
  if (!data) return <div style={{ padding: '40px', color: '#DC2626' }}>Failed to load dashboard data.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <Stat label="Total Blogs" value={data.totalBlogs} />
        <Stat label="Published" value={data.totalPublishedBlogs} gold />
        <Stat label="Total Enquiries" value={data.totalEnquiries} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Recent Enquiries</h3>
          {data.recentEnquiries.length === 0 && <p style={{ color: '#A0A0A0', fontSize: '14px' }}>No enquiries yet.</p>}
          {data.recentEnquiries.map((e) => (
            <div key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{e.name} {e.companyName ? `— ${e.companyName}` : ''}</p>
              <p style={{ fontSize: '12px', color: '#667085' }}>{e.email} · {formatDate(e.createdAt)}</p>
            </div>
          ))}
        </div>
        {/* Recent Blogs */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Recent Blog Posts</h3>
          {data.recentBlogs.length === 0 && <p style={{ color: '#A0A0A0', fontSize: '14px' }}>No blogs yet.</p>}
          {data.recentBlogs.map((b) => (
            <div key={b.id} style={{ padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{b.title}</p>
              <p style={{ fontSize: '12px', color: b.isPublished ? '#16A34A' : '#A0A0A0' }}>
                {b.isPublished ? '✅ Published' : '📝 Draft'} · {formatDate(b.publishedAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Blogs Management Tab ─────────────────────────────────────────
function BlogsTab() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalBlog, setModalBlog] = useState<Blog | null | 'new'>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchBlogs = useCallback(() => {
    setLoading(true);
    blogApi.getAll(false)
      .then((res) => setBlogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  // Reset to page 1 when page size changes
  useEffect(() => { setPage(1); }, [pageSize]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await blogApi.delete(id);
      fetchBlogs();
    } catch (err: any) {
      alert(err.message ?? 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const paginated = blogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111', letterSpacing: '-0.015em' }}>Blog Posts</h2>
        <button
          onClick={() => setModalBlog('new')}
          style={{ padding: '11px 22px', background: '#C99B67', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: '#111', boxShadow: '0 4px 14px rgba(201,155,103,0.35)' }}
        >
          + New Blog Post
        </button>
      </div>

      {loading && <p style={{ color: '#667085' }}>Loading blogs…</p>}

      {!loading && blogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>No blog posts yet.</p>
          <p style={{ color: '#667085', marginTop: '8px' }}>Click "New Blog Post" to get started.</p>
        </div>
      )}

      {!loading && blogs.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Title', 'Slug', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#667085' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((blog) => (
                <tr key={blog.id} style={{ borderTop: '1px solid #F3F4F6', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#FAFAFA')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</p>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#667085', fontFamily: 'monospace' }}>/blog/{blog.slug}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                      background: blog.isPublished ? 'rgba(22,163,74,0.1)' : 'rgba(0,0,0,0.05)',
                      color: blog.isPublished ? '#16A34A' : '#667085',
                    }}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{formatDate(blog.createdAt)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setModalBlog(blog)}
                        style={{ padding: '7px 14px', background: 'rgba(201,155,103,0.1)', border: '1px solid rgba(201,155,103,0.2)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: '#7A5C3A' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(blog.id)} disabled={deleting === blog.id}
                        style={{ padding: '7px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '8px', cursor: deleting === blog.id ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>
                        {deleting === blog.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            total={blogs.length}
            page={page}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={setPageSize}
          />
        </div>
      )}

      {/* Blog Form Modal */}
      {modalBlog !== null && (
        <BlogFormModal
          blog={modalBlog === 'new' ? null : modalBlog}
          onClose={() => setModalBlog(null)}
          onSaved={() => { setModalBlog(null); fetchBlogs(); }}
        />
      )}
    </div>
  );
}

// ─── Enquiries Management Tab ─────────────────────────────────────
function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchEnquiries = useCallback(() => {
    setLoading(true);
    enquiryApi.getAll({ search: search || undefined, startDate: startDate || undefined, endDate: endDate || undefined })
      .then((res) => setEnquiries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, startDate, endDate]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await enquiryApi.delete(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      alert(err.message ?? 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E4E7EC', borderRadius: '10px', padding: '9px 14px', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit', background: '#FFFFFF',
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '20px' }}>Enquiries</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, country…" className="w-full sm:w-auto min-w-65 flex-1" style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full sm:w-auto" style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full sm:w-auto" style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#C99B67')} onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E7EC')} />
        {(search || startDate || endDate) && (
          <button onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); }}
            style={{ padding: '9px 14px', background: 'transparent', border: '1px solid #E4E7EC', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#667085' }}>
            Clear
          </button>
        )}
      </div>

      {loading && <p style={{ color: '#667085' }}>Loading enquiries…</p>}

      {!loading && enquiries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>No enquiries found.</p>
        </div>
      )}

      {!loading && enquiries.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Name / Company', 'Email', 'Country', 'Product', 'Source', 'Date', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#667085' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq.id} style={{ borderTop: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#FAFAFA')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{enq.name}</p>
                    {enq.companyName && <p style={{ fontSize: '12px', color: '#667085' }}>{enq.companyName}</p>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{enq.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{enq.country ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.productInterested ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#A0A0A0' }}>{enq.sourcePage ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#A0A0A0' }}>{formatDate(enq.createdAt)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setSelected(enq)}
                        style={{ padding: '6px 12px', background: 'rgba(201,155,103,0.1)', border: '1px solid rgba(201,155,103,0.2)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, color: '#7A5C3A' }}>
                        View
                      </button>
                      <button onClick={() => handleDelete(enq.id)} disabled={deleting === enq.id}
                        style={{ padding: '6px 12px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '8px', cursor: deleting === enq.id ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>
                        {deleting === enq.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div
            className="p-5 sm:p-9"
            style={{
              background: '#FFFFFF', borderRadius: '20px',
              width: '100%', maxWidth: '560px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#111' }}>Enquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#667085' }}>✕</button>
            </div>
            {[
              ['Name', selected.name],
              ['Company', selected.companyName],
              ['Email', selected.email],
              ['Phone', selected.phone],
              ['Country', selected.country],
              ['Product Interested', selected.productInterested],
              ['Quantity', selected.quantity],
              ['Source', selected.sourcePage],
              ['Date', formatDate(selected.createdAt)],
            ].map(([k, v]) => v ? (
              <div key={k} style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#A0A0A0' }}>{k}</span>
                <p style={{ fontSize: '15px', color: '#111', fontWeight: 600, marginTop: '2px' }}>{v}</p>
              </div>
            ) : null)}
            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#A0A0A0' }}>Message</span>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.7, marginTop: '4px', background: '#F9FAFB', padding: '14px', borderRadius: '10px' }}>{selected.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────
type Tab = 'dashboard' | 'blogs' | 'enquiries' | 'products';

export default function AdminPortal() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const checkAuth = useCallback(async () => {
    const token = getAdminToken();
    if (!token) { setAuthenticated(false); return; }
    try {
      await authApi.verify();
      setAuthenticated(true);
    } catch {
      clearAdminToken();
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin | Mariah Coirs';
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    clearAdminToken();
    setAuthenticated(false);
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(201,155,103,0.2)', borderTopColor: '#C99B67', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'blogs', label: 'Blog Posts', icon: '📝' },
    { id: 'enquiries', label: 'Enquiries', icon: '📬' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Bar ── */}
      <header
        className="px-4 sm:px-8"
        style={{
          background: '#0A0A0A', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="text-lg sm:text-xl" style={{ fontWeight: 800, letterSpacing: '-0.025em' }}>Mariah Coirs</span>
          <span className="hidden sm:inline" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#C99B67', textTransform: 'uppercase', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '12px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
            View Site ↗
          </a>
          <button onClick={handleLogout}
            className="px-3 sm:px-4 py-2"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
            Log Out
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row" style={{ flex: 1 }}>
        {/* ── Sidebar ── */}
        <aside
          className="w-full md:w-55 flex flex-row md:flex-col overflow-x-auto p-4 md:p-6 md:py-8 border-b md:border-b-0 md:border-r shrink-0 gap-1"
          style={{
            background: '#FFFFFF',
            borderColor: 'rgba(0,0,0,0.06)',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-auto md:w-full shrink-0 mb-0 md:mb-1"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, textAlign: 'left',
                background: activeTab === tab.id ? 'rgba(201,155,103,0.12)' : 'transparent',
                color: activeTab === tab.id ? '#7A5C3A' : '#374151',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="p-4 sm:p-10" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'blogs' && <BlogsTab />}
          {activeTab === 'enquiries' && <EnquiriesTab />}
        </main>
      </div>
    </div>
  );
}
