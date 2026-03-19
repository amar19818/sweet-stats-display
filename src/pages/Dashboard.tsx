import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2, Plus, Trash2, BarChart3, ExternalLink, Copy, Check, LogOut, Link2, Globe,
} from "lucide-react";
import { format } from "date-fns";

interface UrlItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function Dashboard() {
  const { user, apiBase, logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${apiBase}/api/user/urls/${user.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch URLs");
      const json = await res.json();
      setUrls(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, apiBase]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const createUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/api/url/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ longUrl: longUrl.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create URL");
      setLongUrl("");
      await fetchUrls();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const deleteUrl = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`${apiBase}/api/url/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setUrls((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Snip</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={user?.profileImage}
                alt={user?.username}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Create URL */}
        <div className="glass-card p-6 fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Shorten a Link
          </h2>
          <form onSubmit={createUrl} className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                placeholder="https://example.com/very-long-url-here"
                className="w-full rounded-lg bg-secondary border border-border pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Shorten
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* URLs list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Your Links <span className="text-muted-foreground font-normal text-sm">({urls.length})</span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : urls.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Link2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No links yet. Create your first short URL above!</p>
            </div>
          ) : (
            urls.map((url, i) => (
              <div
                key={url.id}
                className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium text-sm font-mono hover:underline truncate"
                    >
                      {url.shortUrl}
                    </a>
                    <button
                      onClick={() => copyToClipboard(url.shortUrl, url.id)}
                      className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground shrink-0"
                    >
                      {copiedId === url.id ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{url.originalUrl}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{url.clicks} clicks</span>
                    <span>•</span>
                    <span>{format(new Date(url.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/analytics/${url.id}`}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Analytics
                  </Link>
                  <button
                    onClick={() => deleteUrl(url.id)}
                    disabled={deleting === url.id}
                    className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {deleting === url.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
