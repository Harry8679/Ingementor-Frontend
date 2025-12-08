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
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IngéMentor
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
                <SparklesIcon className="h-5 w-5" />
                <span className="font-semibold text-sm">Plateforme #1 de soutien scolaire</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Réussissez vos études avec les{' '}
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  meilleurs professeurs
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Accédez à des milliers de professeurs qualifiés et vérifiés. 
                Trouvez le prof parfait pour réussir, du CP à la Terminale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="group bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 text-center flex items-center justify-center"
                >
                  Commencer gratuitement
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/register"
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 text-center"
                >
                  Voir les professeurs
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>1er cours offert</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>Satisfait ou remboursé</span>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] hidden lg:block">
              <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-600 rounded-3xl transform rotate-3 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=1000&fit=crop"
                alt="Étudiants heureux"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <StarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Professeurs vérifiés', icon: UserGroupIcon },
              { number: '10k+', label: 'Élèves satisfaits', icon: AcademicCapIcon },
              { number: '4.9/5', label: 'Note moyenne', icon: StarIcon },
              { number: '50k+', label: 'Cours donnés', icon: CheckCircleIcon },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Pourquoi choisir IngéMentor ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plateforme la plus complète pour trouver votre professeur idéal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Professeurs vérifiés',
                description: 'Tous nos professeurs sont vérifiés et évalués par la communauté',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: ClockIcon,
                title: 'Réservation instantanée',
                description: 'Réservez votre cours en quelques clics, disponible 7j/7',
                color: 'from-indigo-500 to-indigo-600',
              },
              {
                icon: CurrencyEuroIcon,
                title: 'Prix transparents',
                description: 'Tarifs adaptés à tous les budgets, sans frais cachés',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Chat en direct',
                description: 'Échangez directement avec vos professeurs avant de réserver',
                color: 'from-pink-500 to-pink-600',
              },
              {
                icon: AcademicCapIcon,
                title: 'Toutes les matières',
                description: 'Maths, physique, français, anglais... Plus de 20 matières disponibles',
                color: 'from-cyan-500 to-cyan-600',
              },
              {
                icon: CheckCircleIcon,
                title: 'Satisfait ou remboursé',
                description: 'Premier cours non satisfaisant ? On vous rembourse',
                color: 'from-green-500 to-green-600',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-linear-to-br ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              3 étapes simples pour commencer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Créez votre compte',
                description: 'Inscription gratuite en moins de 2 minutes',
                icon: UserGroupIcon,
              },
              {
                step: '2',
                title: 'Trouvez votre professeur',
                description: 'Parcourez les profils et choisissez selon vos besoins',
                icon: AcademicCapIcon,
              },
              {
                step: '3',
                title: 'Réservez votre cours',
                description: 'Planifiez et commencez à progresser immédiatement',
                icon: SparklesIcon,
              },
            ].map((step, idx) => (
              <div key={idx} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                  <span className="text-3xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
                {idx < 2 && (
                  <ArrowRightIcon className="hidden md:block absolute top-10 -right-4 h-8 w-8 text-blue-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à transformer vos résultats scolaires ?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Rejoignez des milliers d'élèves qui ont déjà trouvé leur professeur idéal
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
          >
            Créer mon compte gratuitement
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
          <p className="text-blue-100 text-sm mt-6">
            ✓ Sans engagement • ✓ 1er cours offert • ✓ Inscription en 2 min
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">IngéMentor</span>
              </div>
              <p className="text-sm text-gray-400">
                La plateforme qui vous accompagne vers la réussite scolaire.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Matières</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mathématiques</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Physique-Chimie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Français</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Anglais</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Devenir professeur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 IngéMentor. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;