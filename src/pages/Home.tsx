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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/series"
          className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-8 shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300 hover:border-[#FF522D]/50 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-zinc-800/60 to-zinc-800/40 border border-zinc-700/50 rounded-lg">
              <svg className="w-8 h-8 text-[#FF522D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-[#FF522D] transition-colors">
                Gestionar Series
              </h2>
              <p className="text-sm text-zinc-400">Crea, edita y elimina series</p>
            </div>
          </div>
          <p className="text-zinc-300">
            Administra todas las series de cómics en tu base de datos. Agrega nuevas series, edita información existente o elimina las que ya no necesites.
          </p>
        </Link>

        <Link
          to="/comics"
          className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-8 shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300 hover:border-[#FF522D]/50 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-zinc-800/60 to-zinc-800/40 border border-zinc-700/50 rounded-lg">
              <svg className="w-8 h-8 text-[#FF522D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-[#FF522D] transition-colors">
                Gestionar Comics
              </h2>
              <p className="text-sm text-zinc-400">Crea, edita y elimina cómics</p>
            </div>
          </div>
          <p className="text-zinc-300">
            Administra todos los cómics individuales. Sube nuevos cómics, actualiza información, gestiona URLs de descarga y páginas para lectura online.
          </p>
        </Link>
      </div>
    </div>
  );
}

