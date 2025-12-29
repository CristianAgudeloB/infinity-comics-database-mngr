import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSeries, deleteSeries } from "../api/series.api";
import type { Series } from "../types/series";

export default function SeriesList() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSeries();
      setSeries(data);
    } catch (err) {
      setError("Error al cargar las series");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta serie?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteSeries(id);
      await loadSeries();
    } catch (err) {
      alert("Error al eliminar la serie");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Series</h1>
          <p className="text-zinc-400">Gestiona todas las series de cómics</p>
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

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {series.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <p className="text-zinc-400 text-lg mb-4">No hay series disponibles</p>
          <Link
            to="/series/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors"
          >
            Crear primera serie
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
                <div className="flex gap-2">
                  <Link
                    to={`/series/${item._id}/edit`}
                    className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleteLoading === item._id}
                    className="flex-1 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === item._id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

