import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-2xl">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
            <span className="text-3xl font-black bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IngéMentor
            </span>
          </Link>
          <h2 className="text-4xl font-black text-gray-900">Mot de passe oublié ? 🔐</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Email envoyé !</h3>
              <p className="text-gray-600">Vérifie ta boîte mail.</p>
              <Link to="/connexion" className="inline-block mt-6 text-blue-600 font-bold">← Retour connexion</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    placeholder="ton@email.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-black">
                Réinitialiser
              </button>

              <Link to="/connexion" className="block text-center text-gray-600 hover:text-blue-600 font-medium">
                ← Retour connexion
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;