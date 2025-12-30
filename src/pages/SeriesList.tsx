import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchSeries, deleteSeries } from "../api/series.api";
import type { Series } from "../types/series";

export default function SeriesList() {
  const [series, setSeries] = useState<Series[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSeries([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchSeries(query.trim());
      setSeries(data);
    } catch (err) {
      setError("Error al buscar las series");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta serie?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteSeries(id);
      await handleSearch(searchQuery);
    } catch (err) {
      alert("Error al eliminar la serie");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Series</h1>
          <p className="text-zinc-400">Busca y gestiona series de cómics</p>
        </div>
        <Link
          to="/series/new"
          className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Serie
        </Link>
      </div>

      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar series por nombre..."
          className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-3 pl-12 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-[#FF522D] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {!searchQuery.trim() ? (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-zinc-400 text-lg mb-2">Busca una serie para comenzar</p>
          <p className="text-zinc-500 text-sm">Escribe el nombre de la serie en el buscador</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400">Buscando...</p>
          </div>
        </div>
      ) : series.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <p className="text-zinc-400 text-lg mb-4">No se encontraron series con "{searchQuery}"</p>
          <Link
            to="/series/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors"
          >
            Crear nueva serie
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {series.map((item) => (
            <div
              key={item._id}
              className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300"
            >
              <div className="aspect-[17/26] w-full bg-zinc-800 overflow-hidden">
                <img
                  src={item.coverUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23272a' width='100' height='100'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='monospace' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-zinc-100 mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-zinc-400 mb-2">{item.publisher}</p>
                <p className="text-xs text-zinc-500 mb-4">
                  {item.startYear} {item.endYear ? `- ${item.endYear}` : ""}
                </p>
                <Link
                  to={`/series/${item._id}`}
                  className="block w-full px-3 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg text-sm font-medium transition-colors text-center"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

