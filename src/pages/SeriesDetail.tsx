import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSeriesById, updateSeries, deleteSeries } from "../api/series.api";
import { getComicsBySeries, deleteComic } from "../api/comics.api";
import { createComic, updateComic } from "../api/comics.api";
import type { Series } from "../types/series";
import type { Comic, CreateComicData, UpdateComicData } from "../types/comic";

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComicForm, setShowComicForm] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showEditSeries, setShowEditSeries] = useState(false);

  const [comicFormData, setComicFormData] = useState<CreateComicData>({
    title: "",
    coverUrl: "",
    downloadUrls: [""],
    pages: [],
    seriesId: id || "",
  });

  const [seriesFormData, setSeriesFormData] = useState({
    name: "",
    publisher: "",
    startYear: new Date().getFullYear(),
    endYear: undefined as number | undefined,
    coverUrl: "",
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [seriesData, comicsData] = await Promise.all([
        getSeriesById(id),
        getComicsBySeries(id)
      ]);
      setSeries(seriesData);
      setComics(comicsData);
      
      // Pre-llenar formulario de serie
      setSeriesFormData({
        name: seriesData.name,
        publisher: seriesData.publisher,
        startYear: seriesData.startYear,
        endYear: seriesData.endYear,
        coverUrl: seriesData.coverUrl,
      });
    } catch (err) {
      setError("Error al cargar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeries = async () => {
    if (!id) return;
    if (!confirm("¿Estás seguro de que quieres eliminar esta serie? Esto también eliminará todos sus cómics.")) {
      return;
    }

    try {
      await deleteSeries(id);
      navigate("/series");
    } catch (err) {
      alert("Error al eliminar la serie");
      console.error(err);
    }
  };

  const handleUpdateSeries = async () => {
    if (!id) return;
    try {
      await updateSeries(id, seriesFormData);
      await loadData();
      setShowEditSeries(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al actualizar la serie");
      console.error(err);
    }
  };

  const handleDeleteComic = async (comicId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cómic?")) {
      return;
    }

    try {
      setDeleteLoading(comicId);
      await deleteComic(comicId);
      await loadData();
    } catch (err) {
      alert("Error al eliminar el cómic");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleComicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const validUrls = comicFormData.downloadUrls.filter(url => url.trim());
    if (validUrls.length === 0) {
      alert("Debes agregar al menos una URL de descarga");
      return;
    }

    try {
      if (editingComic) {
        const updateData: UpdateComicData = {
          title: comicFormData.title,
          coverUrl: comicFormData.coverUrl,
          downloadUrls: validUrls,
          pages: comicFormData.pages,
          onlineRead: comicFormData.pages.length > 0,
        };
        await updateComic(editingComic._id, updateData);
      } else {
        await createComic({
          ...comicFormData,
          seriesId: id,
          downloadUrls: validUrls,
        });
      }
      
      setComicFormData({
        title: "",
        coverUrl: "",
        downloadUrls: [""],
        pages: [],
        seriesId: id,
      });
      setEditingComic(null);
      setShowComicForm(false);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al guardar el cómic");
      console.error(err);
    }
  };

  const startEditComic = (comic: Comic) => {
    setEditingComic(comic);
    setComicFormData({
      title: comic.title,
      coverUrl: comic.coverUrl,
      downloadUrls: comic.downloadUrls.length > 0 ? comic.downloadUrls : [""],
      pages: comic.pages || [],
      seriesId: comic.seriesId,
    });
    setShowComicForm(true);
  };

  const cancelComicForm = () => {
    setShowComicForm(false);
    setEditingComic(null);
    setComicFormData({
      title: "",
      coverUrl: "",
      downloadUrls: [""],
      pages: [],
      seriesId: id || "",
    });
  };

  const handleDownloadUrlChange = (index: number, value: string) => {
    const newUrls = [...comicFormData.downloadUrls];
    newUrls[index] = value;
    setComicFormData({ ...comicFormData, downloadUrls: newUrls });
  };

  const addDownloadUrl = () => {
    setComicFormData({ ...comicFormData, downloadUrls: [...comicFormData.downloadUrls, ""] });
  };

  const removeDownloadUrl = (index: number) => {
    if (comicFormData.downloadUrls.length > 1) {
      const newUrls = comicFormData.downloadUrls.filter((_, i) => i !== index);
      setComicFormData({ ...comicFormData, downloadUrls: newUrls });
    }
  };

  const handlePagesChange = (value: string) => {
    const pages = value.split("\n").filter(p => p.trim());
    setComicFormData({ ...comicFormData, pages });
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

  if (error || !series) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || "Serie no encontrada"}</p>
        <Link
          to="/series"
          className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors inline-block"
        >
          Volver a Series
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de la Serie */}
      <div className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="aspect-[17/26] w-32 md:w-40 bg-zinc-800 rounded overflow-hidden">
              <img
                src={series.coverUrl}
                alt={series.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23272a' width='100' height='100'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='monospace' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            {!showEditSeries ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-100 mb-2">{series.name}</h1>
                    <p className="text-zinc-400 mb-1">{series.publisher}</p>
                    <p className="text-sm text-zinc-500">
                      {series.startYear} {series.endYear ? `- ${series.endYear}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowEditSeries(true)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    Editar Serie
                  </button>
                  <button
                    onClick={handleDeleteSeries}
                    className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    Eliminar Serie
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-zinc-100">Editar Serie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={seriesFormData.name}
                      onChange={(e) => setSeriesFormData({ ...seriesFormData, name: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Editorial *</label>
                    <input
                      type="text"
                      value={seriesFormData.publisher}
                      onChange={(e) => setSeriesFormData({ ...seriesFormData, publisher: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Año Inicio *</label>
                    <input
                      type="number"
                      value={seriesFormData.startYear}
                      onChange={(e) => setSeriesFormData({ ...seriesFormData, startYear: parseInt(e.target.value) })}
                      className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Año Fin</label>
                    <input
                      type="number"
                      value={seriesFormData.endYear || ""}
                      onChange={(e) => setSeriesFormData({ ...seriesFormData, endYear: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">URL Portada *</label>
                    <input
                      type="url"
                      value={seriesFormData.coverUrl}
                      onChange={(e) => setSeriesFormData({ ...seriesFormData, coverUrl: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateSeries}
                    className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setShowEditSeries(false);
                      setSeriesFormData({
                        name: series.name,
                        publisher: series.publisher,
                        startYear: series.startYear,
                        endYear: series.endYear,
                        coverUrl: series.coverUrl,
                      });
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Cómics */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100">Cómics ({comics.length})</h2>
        {!showComicForm && (
          <button
            onClick={() => {
              setShowComicForm(true);
              setEditingComic(null);
              setComicFormData({
                title: "",
                coverUrl: "",
                downloadUrls: [""],
                pages: [],
                seriesId: id || "",
              });
            }}
            className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cómic
          </button>
        )}
      </div>

      {/* Formulario de Cómic */}
      {showComicForm && (
        <div className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-zinc-100">
            {editingComic ? "Editar Cómic" : "Nuevo Cómic"}
          </h3>
          
          <form onSubmit={handleComicSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Título *</label>
              <input
                type="text"
                required
                value={comicFormData.title}
                onChange={(e) => setComicFormData({ ...comicFormData, title: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">URL Portada *</label>
              <input
                type="url"
                required
                value={comicFormData.coverUrl}
                onChange={(e) => setComicFormData({ ...comicFormData, coverUrl: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">URLs de Descarga *</label>
              {comicFormData.downloadUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleDownloadUrlChange(index, e.target.value)}
                    className="flex-1 bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50"
                    placeholder="https://ejemplo.com/descarga.pdf"
                  />
                  {comicFormData.downloadUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDownloadUrl(index)}
                      className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDownloadUrl}
                className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
              >
                + Agregar otra URL
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                URLs de Páginas para Lectura Online (una por línea, opcional)
              </label>
              <textarea
                value={comicFormData.pages.join("\n")}
                onChange={(e) => handlePagesChange(e.target.value)}
                rows={4}
                className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 font-mono text-sm"
                placeholder="https://ejemplo.com/pagina1.jpg&#10;https://ejemplo.com/pagina2.jpg"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors"
              >
                {editingComic ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={cancelComicForm}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Cómics */}
      {comics.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <p className="text-zinc-400 text-lg mb-4">No hay cómics en esta serie</p>
          {!showComicForm && (
            <button
              onClick={() => setShowComicForm(true)}
              className="px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              Agregar primer cómic
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {comics.map((comic) => (
            <div
              key={comic._id}
              className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300"
            >
              <div className="aspect-[17/26] w-full bg-zinc-800 overflow-hidden">
                <img
                  src={comic.coverUrl}
                  alt={comic.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23272a' width='100' height='100'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='monospace' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-zinc-100 mb-1 line-clamp-2">{comic.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {comic.onlineRead && (
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                      Lectura Online
                    </span>
                  )}
                  <span className="text-xs text-zinc-500">
                    {comic.downloadUrls.length} URL{comic.downloadUrls.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditComic(comic)}
                    className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteComic(comic._id)}
                    disabled={deleteLoading === comic._id}
                    className="flex-1 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === comic._id ? "Eliminando..." : "Eliminar"}
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

