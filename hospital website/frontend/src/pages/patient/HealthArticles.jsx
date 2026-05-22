import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { articleAPI } from '../../api';
import { BookOpen, Search, Clock } from 'lucide-react';

const categoryEmojis = { Cardiology: '❤️', Dermatology: '🌿', Neurology: '🧠', Pediatrics: '👶', 'Mental Health': '💭', 'Preventive Care': '🛡️', Endocrinology: '🔬', General: '📋' };

export default function HealthArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    articleAPI.getAll({ search, limit: 12 }).then(r => { setArticles(r.data.articles); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  if (selected) return (
    <DashboardLayout title="Health Articles">
      <div className="card">
        <div className="card-header">
          <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>← Back to Articles</button>
        </div>
        <div className="card-body" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {categoryEmojis[selected.category] || '📋'} {selected.category}
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16, lineHeight: 1.3 }}>{selected.title}</h1>
          <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--gray-500)', marginBottom: 28, flexWrap: 'wrap' }}>
            {selected.author && <span>✍️ {selected.author.name}</span>}
            <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{new Date(selected.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>👁 {selected.views} views</span>
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{selected.content}</div>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Health Articles">
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div className="search-bar" style={{ maxWidth: 400 }}>
            <Search className="search-bar-icon" />
            <input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="loading-spinner loading-spinner-lg"></div></div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><BookOpen size={36} /></div>
          <h3>No articles found</h3>
          <p>Check back later for health articles from our doctors.</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {articles.map((article, i) => (
            <div key={article._id} className="article-card" onClick={() => setSelected(article)} style={{ cursor: 'pointer' }}>
              <div className="article-thumb" style={{ background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 55%), hsl(${i * 60 + 30}, 80%, 45%))` }}>
                <span>{categoryEmojis[article.category] || '📋'}</span>
              </div>
              <div className="article-body">
                <div className="article-category">{article.category}</div>
                <div className="article-title">{article.title}</div>
                <div className="article-excerpt">{article.excerpt || article.content.slice(0, 100)}...</div>
                <div className="article-footer">
                  <span>{article.author?.name || 'MediCare Team'}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()} • {article.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
