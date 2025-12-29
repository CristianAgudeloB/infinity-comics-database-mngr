import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComic, updateComic, getComicById } from "../api/comics.api";
import { getSeries } from "../api/series.api";
import type { CreateComicData, UpdateComicData } from "../types/comic";
import type { Series } from "../types/series";

export default function ComicsForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [series, setSeries] = useState<Series[]>([]);
  const [formData, setFormData] = useState<CreateComicData>({
    title: "",
    coverUrl: "",
    downloadUrls: [""],
    pages: [],
    seriesId: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const data = await getSeries();
        setSeries(data);
        if (!isEditing && data.length > 0) {
          setFormData(prev => ({ ...prev, seriesId: data[0]._id }));
        }
      } catch (err) {
        console.error("Error loading series:", err);
      }
    };
    loadSeries();
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && id) {
      const loadComic = async () => {
        try {
          setLoadingData(true);
          const comic = await getComicById(id);
          setFormData({
            title: comic.title,
            coverUrl: comic.coverUrl,
            downloadUrls: comic.downloadUrls.length > 0 ? comic.downloadUrls : [""],
            pages: comic.pages || [],
            seriesId: comic.seriesId,
          });
        } catch (err) {
          setError("Error al cargar el cómic");
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      loadComic();
    }
  }, [id, isEditing]);

  const handleDownloadUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.downloadUrls];
    newUrls[index] = value;
    setFormData({ ...formData, downloadUrls: newUrls });
  };

  const addDownloadUrl = () => {
    setFormData({ ...formData, downloadUrls: [...formData.downloadUrls, ""] });
  };

  const removeDownloadUrl = (index: number) => {
    if (formData.downloadUrls.length > 1) {
      const newUrls = formData.downloadUrls.filter((_, i) => i !== index);
      setFormData({ ...formData, downloadUrls: newUrls });
    }
  };

  const handlePagesChange = (value: string) => {
    const pages = value.split("\n").filter(p => p.trim());
    setFormData({ ...formData, pages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que haya al menos una URL de descarga
    const validUrls = formData.downloadUrls.filter(url => url.trim());
    if (validUrls.length === 0) {
      setError("Debes agregar al menos una URL de descarga");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && id) {
        const updateData: UpdateComicData = {
          title: formData.title,
          coverUrl: formData.coverUrl,
          downloadUrls: validUrls,
          pages: formData.pages,
          seriesId: formData.seriesId,
          onlineRead: formData.pages.length > 0,
        };
        await updateComic(id, updateData);
      } else {
        await createComic({
          ...formData,
          downloadUrls: validUrls,
        });
      }
      navigate("/comics");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar el cómic");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">
          {isEditing ? "Editar Cómic" : "Nuevo Cómic"}
        </h1>
        <p className="text-zinc-400">
          {isEditing ? "Actualiza la información del cómic" : "Completa el formulario para crear un nuevo cómic"}
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
            Título del Cómic *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            placeholder="Ej: The Amazing Spider-Man #1"
          />
        </div>

        <div>
          <label htmlFor="seriesId" className="block text-sm font-medium text-zinc-300 mb-2">
            Serie *
          </label>
          <select
            id="seriesId"
            required
            value={formData.seriesId}
            onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
          >
            <option value="">Selecciona una serie</option>
            {series.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.publisher})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="coverUrl" className="block text-sm font-medium text-zinc-300 mb-2">
            URL de la Portada *
          </label>
          <input
            type="url"
            id="coverUrl"
            required
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            placeholder="https://ejemplo.com/portada.jpg"
          />
          {formData.coverUrl && (
            <div className="mt-3 aspect-[17/26] w-32 bg-zinc-800 rounded overflow-hidden">
              <img
                src={formData.coverUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            URLs de Descarga * (al menos una)
          </label>
          {formData.downloadUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleDownloadUrlChange(index, e.target.value)}
                className="flex-1 bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
                placeholder="https://ejemplo.com/descarga.pdf"
              />
              {formData.downloadUrls.length > 1 && (
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
          <label htmlFor="pages" className="block text-sm font-medium text-zinc-300 mb-2">
            URLs de Páginas para Lectura Online (una por línea, opcional)
          </label>
          <textarea
            id="pages"
            value={formData.pages.join("\n")}
            onChange={(e) => handlePagesChange(e.target.value)}
            rows={6}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all font-mono text-sm"
            placeholder="https://ejemplo.com/pagina1.jpg&#10;https://ejemplo.com/pagina2.jpg&#10;https://ejemplo.com/pagina3.jpg"
          />
          <p className="mt-2 text-xs text-zinc-500">
            Si agregas páginas, el cómic estará disponible para lectura online
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#FF522D] hover:bg-[#ff6b4d] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/comics")}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

