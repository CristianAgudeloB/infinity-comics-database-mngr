import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComics, deleteComic } from "../api/comics.api";
import { getSeries } from "../api/series.api";
import type { Comic } from "../types/comic";
import type { Series } from "../types/series";

export default function ComicsList() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [comicsData, seriesData] = await Promise.all([
        getComics(),
        getSeries()
      ]);
      setComics(comicsData);
      setSeries(seriesData);
    } catch (err) {
      setError("Error al cargar los cómics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cómic?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteComic(id);
      await loadData();
    } catch (err) {
      alert("Error al eliminar el cómic");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getSeriesName = (seriesId: string) => {
    const serie = series.find(s => s._id === seriesId);
    return serie?.name || "Serie desconocida";
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
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Comics</h1>
          <p className="text-zinc-400">Gestiona todos los cómics</p>
        </div>
        <Link
          to="/comics/new"
          className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Cómic
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {comics.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <p className="text-zinc-400 text-lg mb-4">No hay cómics disponibles</p>
          <Link
            to="/comics/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors"
          >
            Crear primer cómic
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {comics.map((item) => (
            <div
              key={item._id}
              className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300"
            >
              <div className="aspect-[17/26] w-full bg-zinc-800 overflow-hidden">
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23272a' width='100' height='100'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='monospace' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-zinc-100 mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 mb-2">{getSeriesName(item.seriesId)}</p>
                <div className="flex items-center gap-2 mb-4">
                  {item.onlineRead && (
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                      Lectura Online
                    </span>
                  )}
                  <span className="text-xs text-zinc-500">
                    {item.downloadUrls.length} URL{item.downloadUrls.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/comics/${item._id}/edit`}
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

