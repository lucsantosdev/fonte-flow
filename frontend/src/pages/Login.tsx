import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
  import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden transition-colors duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-primary-400/20 to-indigo-950' 
        : 'bg-gradient-to-br from-primary-100/40 via-white to-secondary-100/30'
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 z-50 p-3.5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 border ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-amber-400 hover:from-slate-700 hover:to-slate-800 focus:ring-amber-400/30'
            : 'bg-gradient-to-br from-white to-blue-50 border-blue-100 text-indigo-600 hover:from-blue-50 hover:to-white focus:ring-indigo-500/30'
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob ${
          isDarkMode ? 'bg-primary-300/40' : 'bg-primary-200/60'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 ${
          isDarkMode ? 'bg-secondary-200/40' : 'bg-secondary-100/60'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 ${
          isDarkMode ? 'bg-primary-200/40' : 'bg-primary-100/60'
        }`}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] ${
        isDarkMode ? 'opacity-40' : 'opacity-20'
      }`}></div>

      {/* Card Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className={`backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border-2 transition-all duration-700 ${
          isDarkMode 
            ? 'bg-slate-900/80 border-primary-300/20 shadow-primary-300/10' 
            : 'bg-white/80 border-primary-200/50 shadow-primary-200/20'
        }`}>
          {/* Header Section */}
          <div className={`relative px-8 py-12 text-center transition-all duration-700 ${
            isDarkMode
              ? 'bg-gradient-to-b from-primary-400/30 to-transparent'
              : 'bg-gradient-to-b from-primary-100/50 to-transparent'
          }`}>
            {/* Logo/Icon */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-br from-primary-300 via-secondary-100 to-primary-200 shadow-primary-300/50'
                : 'bg-gradient-to-br from-primary-300 via-secondary-200 to-primary-400 shadow-primary-300/50'
            }`}>
              <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h1 className={`text-4xl font-extrabold mb-3 transition-colors duration-700 ${
              isDarkMode
                ? 'bg-gradient-to-r from-primary-200 via-secondary-100 to-primary-300 bg-clip-text text-transparent drop-shadow-lg'
                : 'bg-gradient-to-r from-primary-300 via-secondary-200 to-primary-400 bg-clip-text text-transparent'
            }`}>
              Fonte Flow
            </h1>
            <p className={`text-sm font-semibold tracking-wider uppercase transition-colors duration-700 ${
              isDarkMode ? 'text-primary-200/80' : 'text-primary-400/80'
            }`}>
              Sistema de Gestão Empresarial
            </p>
            
            {/* Decorative line */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className={`h-px w-12 transition-colors duration-700 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-transparent via-primary-300 to-transparent' 
                  : 'bg-gradient-to-r from-transparent via-primary-300 to-transparent'
              }`}></div>
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${
                isDarkMode ? 'bg-secondary-200 shadow-lg shadow-secondary-200/50' : 'bg-secondary-200 shadow-lg shadow-secondary-100/50'
              }`}></div>
              <div className={`h-px w-12 transition-colors duration-700 ${
                isDarkMode 
                  ? 'bg-gradient-to-l from-transparent via-primary-300 to-transparent' 
                  : 'bg-gradient-to-l from-transparent via-primary-300 to-transparent'
              }`}></div>
            </div>
          </div>

          {/* Form Container */}
          <div className="px-8 pb-8">
            <div className="mb-8 text-center">
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-700 ${
                isDarkMode ? 'text-primary-100' : 'text-slate-800'
              }`}>Bem-vindo de volta</h2>
              <p className={`text-sm transition-colors duration-700 ${
                isDarkMode ? 'text-primary-200/70' : 'text-primary-400/70'
              }`}>Acesse sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-semibold mb-2.5 transition-colors duration-700 ${
                  isDarkMode ? 'text-primary-200' : 'text-slate-700'
                }`}>
                  Endereço de E-mail
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-primary-200/60 group-focus-within:text-secondary-100' 
                        : 'text-primary-300/60 group-focus-within:text-secondary-200'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? 'bg-slate-800/70 border-primary-300/30 text-white placeholder-primary-200/40 focus:border-secondary-200 focus:ring-secondary-200/30 hover:border-primary-300/50'
                        : 'bg-white border-primary-200 text-slate-900 placeholder-primary-300/60 focus:border-secondary-200 focus:ring-secondary-200/20 hover:border-primary-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2.5 transition-colors duration-700 ${
                  isDarkMode ? 'text-primary-200' : 'text-slate-700'
                }`}>
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-primary-200/60 group-focus-within:text-secondary-100' 
                        : 'text-primary-300/60 group-focus-within:text-secondary-200'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? 'bg-slate-800/70 border-primary-300/30 text-white placeholder-primary-200/40 focus:border-secondary-200 focus:ring-secondary-200/30 hover:border-primary-300/50'
                        : 'bg-white border-primary-200 text-slate-900 placeholder-primary-300/60 focus:border-secondary-200 focus:ring-secondary-200/20 hover:border-primary-300'
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className={`border-2 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
                  isDarkMode
                    ? 'bg-red-500/10 border-red-500/30 backdrop-blur-sm'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className={`w-4 h-4 rounded border-2 focus:ring-2 focus:ring-offset-0 transition-all cursor-pointer ${
                      isDarkMode
                        ? 'border-primary-300/50 text-secondary-200 focus:ring-secondary-200/30 bg-slate-800/50'
                        : 'border-primary-300 text-secondary-200 focus:ring-secondary-200/20'
                    }`}
                  />
                  <span className={`text-sm font-medium select-none transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-primary-200/80 group-hover:text-primary-100' 
                      : 'text-primary-400/80 group-hover:text-primary-400'
                  }`}>Manter conectado</span>
                </label>
                <a href="#" className={`text-sm font-semibold hover:underline decoration-2 underline-offset-2 transition-colors duration-300 ${
                  isDarkMode
                    ? 'text-secondary-100 hover:text-secondary-200'
                    : 'text-secondary-200 hover:text-secondary-200'
                }`}>
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-base focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100 disabled:transform-none group relative overflow-hidden ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-primary-300 via-secondary-200 to-primary-400 text-white hover:from-primary-400 hover:via-secondary-200 hover:to-primary-300 focus:ring-secondary-200/40 shadow-secondary-200/30 hover:shadow-secondary-200/50'
                    : 'bg-gradient-to-r from-primary-300 via-secondary-200 to-primary-400 text-white hover:from-primary-400 hover:via-secondary-200 hover:to-primary-300 focus:ring-secondary-200/30 shadow-secondary-200/40 hover:shadow-secondary-200/60'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                {loading ? (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Autenticando...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <span>Acessar Plataforma</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className={`px-8 py-6 border-t transition-all duration-700 ${
            isDarkMode
              ? 'bg-gradient-to-r from-slate-800/60 via-primary-400/30 to-slate-800/60 border-primary-300/20'
              : 'bg-gradient-to-r from-primary-100/50 via-secondary-100/30 to-primary-100/50 border-primary-200/50'
          }`}>
            <div className="flex items-center justify-center gap-2 text-xs">
              <svg className={`w-4 h-4 transition-colors duration-700 ${
                isDarkMode ? 'text-primary-200/80' : 'text-primary-300/80'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className={`font-semibold transition-colors duration-700 ${
                isDarkMode ? 'text-primary-200/80' : 'text-primary-400/80'
              }`}>
                Conexão segura e criptografada
              </span>
            </div>
            <p className={`text-center text-xs mt-3 transition-colors duration-700 ${
              isDarkMode ? 'text-primary-200/60' : 'text-primary-300/70'
            }`}>
              © 2026 Fonte Flow. Todos os direitos reservados.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className={`text-sm backdrop-blur-sm transition-colors duration-700 ${
            isDarkMode ? 'text-primary-100/90' : 'text-primary-400/80'
          }`}>
            Precisa de suporte? {' '}
            <a href="#" className={`font-bold underline decoration-2 decoration-dotted underline-offset-4 transition-colors duration-300 ${
              isDarkMode
                ? 'text-secondary-100 hover:text-secondary-200 decoration-secondary-100/50'
                : 'text-secondary-200 hover:text-secondary-200 decoration-secondary-200/50'
            }`}>
              Fale conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}