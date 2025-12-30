import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">
          Infinity Comics Database Manager
        </h1>
        <p className="text-zinc-400 text-lg mb-8">
          Gestiona tus series y cómics de forma sencilla
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Link
          to="/series"
          className="block bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-8 shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300 hover:border-[#FF522D]/50 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-zinc-800/60 to-zinc-800/40 border border-zinc-700/50 rounded-lg">
              <svg className="w-8 h-8 text-[#FF522D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-[#FF522D] transition-colors">
                Gestionar Series y Cómics
              </h2>
              <p className="text-sm text-zinc-400">Busca series y gestiona sus cómics</p>
            </div>
          </div>
          <p className="text-zinc-300">
            Busca series por nombre, accede a sus detalles y gestiona todos sus cómics. Crea nuevas series, edita información, y añade cómics directamente desde la vista de cada serie.
          </p>
        </Link>
      </div>
    </div>
  );
}

