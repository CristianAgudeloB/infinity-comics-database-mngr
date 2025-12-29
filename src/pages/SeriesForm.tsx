import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSeries, updateSeries, getSeriesById } from "../api/series.api";
import type { CreateSeriesData, UpdateSeriesData } from "../types/series";

export default function SeriesForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CreateSeriesData>({
    name: "",
    publisher: "",
    startYear: new Date().getFullYear(),
    endYear: undefined,
    coverUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const loadSeries = async () => {
        try {
          setLoadingData(true);
          const series = await getSeriesById(id);
          setFormData({
            name: series.name,
            publisher: series.publisher,
            startYear: series.startYear,
            endYear: series.endYear,
            coverUrl: series.coverUrl,
          });
        } catch (err) {
          setError("Error al cargar la serie");
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      loadSeries();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditing && id) {
        const updateData: UpdateSeriesData = {
          name: formData.name,
          publisher: formData.publisher,
          startYear: formData.startYear,
          endYear: formData.endYear,
          coverUrl: formData.coverUrl,
        };
        await updateSeries(id, updateData);
      } else {
        await createSeries(formData);
      }
      navigate("/series");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar la serie");
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
          {isEditing ? "Editar Serie" : "Nueva Serie"}
        </h1>
        <p className="text-zinc-400">
          {isEditing ? "Actualiza la información de la serie" : "Completa el formulario para crear una nueva serie"}
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            Nombre de la Serie *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            placeholder="Ej: The Amazing Spider-Man"
          />
        </div>

        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-zinc-300 mb-2">
            Editorial *
          </label>
          <input
            type="text"
            id="publisher"
            required
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            placeholder="Ej: Marvel, DC, Image, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startYear" className="block text-sm font-medium text-zinc-300 mb-2">
              Año de Inicio *
            </label>
            <input
              type="number"
              id="startYear"
              required
              min="1900"
              max={new Date().getFullYear() + 10}
              value={formData.startYear}
              onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="endYear" className="block text-sm font-medium text-zinc-300 mb-2">
              Año de Fin (opcional)
            </label>
            <input
              type="number"
              id="endYear"
              min="1900"
              max={new Date().getFullYear() + 10}
              value={formData.endYear || ""}
              onChange={(e) => setFormData({ ...formData, endYear: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            />
          </div>
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
            onClick={() => navigate("/series")}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

