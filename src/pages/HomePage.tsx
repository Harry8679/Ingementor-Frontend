import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                IngéMentor
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-all px-5 py-2.5 rounded-xl hover:bg-blue-50"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-7 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-lg">
                <FireIcon className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm">Plateforme N°1 en France</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Réussis tes études
                <br />
                avec les{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  meilleurs profs
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Des milliers de professeurs experts pour t'accompagner du CP à la Terminale. 
                <span className="text-blue-600 font-bold"> Trouve ton match parfait !</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center flex items-center justify-center shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Commencer maintenant
                    <ArrowRightIcon className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/register"
                  className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg border-3 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 text-center shadow-lg"
                >
                  Découvrir les profs
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border-2 border-green-200">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">Gratuit</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-200">
                  <BoltIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-blue-700 text-sm">Réponse en 5 min</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full border-2 border-purple-200">
                  <TrophyIcon className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-purple-700 text-sm">Note 4.9/5</span>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[650px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[3rem] transform rotate-6 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=1200&fit=crop&q=80"
                alt="Étudiants heureux"
                className="relative rounded-[3rem] shadow-2xl object-cover w-full h-full border-4 border-white"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-2xl border-4 border-blue-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl">
                    <StarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="font-black text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4.9/5</div>
                    <div className="text-sm text-gray-600 font-bold">12,000+ avis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Professeurs experts', icon: UserGroupIcon, color: 'from-blue-500 to-indigo-500' },
              { number: '10k+', label: 'Élèves accompagnés', icon: AcademicCapIcon, color: 'from-indigo-500 to-purple-500' },
              { number: '4.9/5', label: 'Note moyenne', icon: StarIcon, color: 'from-purple-500 to-pink-500' },
              { number: '50k+', label: 'Cours réalisés', icon: CheckCircleIcon, color: 'from-pink-500 to-rose-500' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
              ⚡ Avantages exclusifs
            </div>
            <h2 className="text-5xl font-black text-gray-900">
              Pourquoi IngéMentor ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              La plateforme qui transforme vraiment tes résultats
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Profs vérifiés ✓',
                description: 'Diplômes validés, expérience prouvée, avis réels',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: BoltIcon,
                title: 'Réponse ultra-rapide',
                description: 'Trouve un prof en moins de 5 minutes chrono',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                icon: CurrencyEuroIcon,
                title: 'Prix imbattables',
                description: 'À partir de 15€/h, premier cours gratuit',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Chat instantané',
                description: 'Discute avec ton prof avant de réserver',
                color: 'from-pink-500 to-rose-500',
              },
              {
                icon: TrophyIcon,
                title: 'Résultats garantis',
                description: '95% de progression moyenne en 3 mois',
                color: 'from-cyan-500 to-teal-500',
              },
              {
                icon: CheckCircleIcon,
                title: '100% Satisfait',
                description: 'Pas content ? On te rembourse, point barre',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-transparent hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-sm mb-8">
            🚀 Rejoins 10,000+ élèves
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Prêt à cartonner ?
          </h2>
          <p className="text-2xl text-blue-100 mb-12 font-medium">
            Inscris-toi gratuitement et trouve ton prof en 5 minutes
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-blue-600 px-12 py-6 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-105 hover:shadow-white/20"
          >
            <span>Je me lance maintenant</span>
            <ArrowRightIcon className="h-6 w-6 ml-3" />
          </Link>
          <div className="flex justify-center items-center space-x-8 text-white text-sm mt-10 font-bold">
            <span className="flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2" />Inscription en 30 sec</span>
            <span className="flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2" />Sans carte bancaire</span>
            <span className="flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2" />Premier cours offert</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white">IngéMentor</span>
              </div>
              <p className="text-sm text-gray-400 font-medium">
                La plateforme qui transforme tes résultats scolaires.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-white mb-6">Matières populaires</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-blue-400 transition-colors">🔢 Mathématiques</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">⚗️ Physique-Chimie</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">📚 Français</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">🌍 Anglais</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-white mb-6">Liens rapides</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Devenir professeur</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Aide & Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Tarifs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-white mb-6">Suivez-nous</h4>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span className="text-lg">📱</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500 font-medium">
            <p>&copy; 2024 IngéMentor. Tous droits réservés. Fait avec ❤️ en France</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;