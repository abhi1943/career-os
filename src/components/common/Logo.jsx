function Logo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
        C
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Career<span className="text-blue-600">OS</span>
        </h1>

        <p className="text-xs text-slate-500">
          Build Your Career Journey
        </p>
      </div>
    </div>
  );
}

export default Logo;