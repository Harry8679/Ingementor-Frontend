import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/solid';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-linear-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">IngéMentor</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              La plateforme qui transforme tes résultats scolaires.
            </p>
          </div>
          
          <div>
            <h4 className="font-black text-white mb-4">Matières populaires</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">🔢 Mathématiques</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">⚗️ Physique-Chimie</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">📚 Français</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">🌍 Anglais</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-white mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Devenir professeur</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Aide & Support</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tarifs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-white mb-4">Suivez-nous</h4>
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
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500 font-medium">
          <p>&copy; 2024 IngéMentor. Tous droits réservés. Fait avec ❤️ en France</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;