// pages/admin/AdminProducts.jsx

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch } from 'react-icons/fi';
import { Spinner, Badge, EmptyState } from '../../components/common';
import API from '../../utils/api';

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '',
  brand: '', stock: '', category: '', featured: false, isBestSeller: false, isFlashSale: false,
};

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [search,     setSearch]     = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([API.get('/products?limit=50'), API.get('/categories')]);
      setProducts(pRes.data.products);
      setCategories(cRes.data.categories);
    } catch { toast.error('Failed to load products'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };
  const openEdit   = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
      brand: p.brand || '', stock: p.stock, category: p.category?._id || '',
      featured: p.featured, isBestSeller: p.isBestSeller, isFlashSale: p.isFlashSale,
    });
    setForm((prev) => ({ ...prev, images: p.images || [] }));
    setEditId(p._id);
    // reset selected new files
    setFiles([]);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      // If files selected, use multipart/form-data
      if (files.length > 0) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        fd.append('price', form.price);
        fd.append('originalPrice', form.originalPrice || '');
        fd.append('brand', form.brand || '');
        fd.append('stock', form.stock);
        fd.append('category', form.category || '');
        fd.append('featured', form.featured);
        fd.append('isBestSeller', form.isBestSeller);
        fd.append('isFlashSale', form.isFlashSale);
        files.forEach((f) => fd.append('images', f));

        if (editId) {
          const res = await API.put(`/products/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          setProducts((prev) => prev.map((p) => p._id === editId ? res.data.product : p));
          toast.success('Product updated!');
        } else {
          const res = await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          setProducts((prev) => [res.data.product, ...prev]);
          toast.success('Product created!');
        }
      } else {
        // No files -> send JSON body
        if (editId) {
          const res = await API.put(`/products/${editId}`, form);
          setProducts((prev) => prev.map((p) => p._id === editId ? res.data.product : p));
          toast.success('Product updated!');
        } else {
          const res = await API.post('/products', { ...form, images: [{ public_id: 'placeholder', url: `https://picsum.photos/seed/${Date.now()}/400/400` }] });
          setProducts((prev) => [res.data.product, ...prev]);
          toast.success('Product created!');
        }
      }
      setModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    // limit to 5 files
    const next = [...files, ...selected].slice(0, 5);
    setFiles(next);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted.');
    } catch { toast.error('Failed to delete'); }
    setDeleting(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="section-title">Products</h1>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-48"
            />
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <FiPlus size={18} /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📦" title="No products" message="Create your first product." action={<button onClick={openCreate} className="btn-primary">Add Product</button>} />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Product','Category','Price','Stock','Status','Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name}
                          className="w-12 h-12 rounded-xl object-contain bg-gray-100 dark:bg-gray-700 p-1" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{p.category?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">₨{p.price?.toLocaleString()}</p>
                      {p.originalPrice > p.price && (
                        <p className="text-xs text-gray-400 line-through">₨{p.originalPrice?.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${p.stock <= 5 ? 'text-red-500' : p.stock <= 20 ? 'text-yellow-500' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {p.featured    && <Badge variant="info">Featured</Badge>}
                        {p.isBestSeller&& <Badge variant="success">Best Seller</Badge>}
                        {p.isFlashSale && <Badge variant="warning">Flash Sale</Badge>}
                        {!p.featured && !p.isBestSeller && !p.isFlashSale && <Badge variant="gray">Standard</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                          {deleting === p._id ? <Spinner size="sm" color="gray" /> : <FiTrash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {editId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Description *</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Price (₨) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required min="0" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Original Price</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" required min="0" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Brand</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Images</label>
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline">Upload Images</button>
                  <span className="text-xs text-gray-400">(Up to 5 images)</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.images?.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-md overflow-hidden bg-gray-50">
                      <img src={img.url} alt={img.public_id} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {files.map((f, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-50">
                      <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeFile(i)} className="absolute top-0 right-0 bg-black/40 text-white p-1 text-xs">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                {[{ key: 'featured', label: '⭐ Featured' }, { key: 'isBestSeller', label: '🏆 Best Seller' }, { key: 'isFlashSale', label: '⚡ Flash Sale' }].map((f) => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                      className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{f.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {saving ? <Spinner size="sm" color="gray" /> : <FiSave size={16} />}
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
