import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
//   UserGroupIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
//   ChatBubbleLeftRightIcon,
//   StarIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-7 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-lg">
                <FireIcon className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm">Plateforme N°1 en France</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Réussis tes études
                <br />
                avec les{' '}
                <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                  className="group relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center flex items-center justify-center shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Commencer maintenant
                    <ArrowRightIcon className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600 rounded-[3rem] transform rotate-6 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=1200&fit=crop&q=80"
                alt="Étudiants heureux"
                className="relative rounded-[3rem] shadow-2xl object-cover w-full h-full border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black text-gray-900">
              Pourquoi IngéMentor ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Profs vérifiés ✓',
                description: 'Diplômes validés, expérience prouvée',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: BoltIcon,
                title: 'Réponse ultra-rapide',
                description: 'Trouve un prof en moins de 5 minutes',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                icon: CurrencyEuroIcon,
                title: 'Prix imbattables',
                description: 'À partir de 15€/h',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
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
      `}</style>
    </div>
  );
};

export default HomePage;