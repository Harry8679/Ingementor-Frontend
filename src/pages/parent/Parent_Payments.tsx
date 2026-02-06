import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CurrencyEuroIcon, CheckCircleIcon, ClockIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface Payment {
  id: number;
  date: string;
  amount: number;
  description: string;
  childName: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  invoiceUrl?: string;
}

const Payments: React.FC = () => {
  const [payments] = useState<Payment[]>([
    { id: 1, date: '2026-02-01', amount: 150, description: 'Cours de Mathématiques (4 séances)', childName: 'Emma', status: 'PAID', invoiceUrl: '#' },
    { id: 2, date: '2026-02-01', amount: 180, description: 'Cours de Physique (4 séances)', childName: 'Lucas', status: 'PAID', invoiceUrl: '#' },
    { id: 3, date: '2026-02-05', amount: 150, description: 'Cours de Français (4 séances)', childName: 'Emma', status: 'PENDING' },
    { id: 4, date: '2026-01-28', amount: 90, description: 'Cours d\'Histoire (2 séances)', childName: 'Lucas', status: 'FAILED' }
  ]);

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'PENDING': return <ClockIcon className="h-5 w-5 text-orange-600" />;
      case 'FAILED': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'PAID': return 'Payé';
      case 'PENDING': return 'En attente';
      case 'FAILED': return 'Échoué';
      default: return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PENDING': return 'orange';
      case 'FAILED': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Paiements 💰</h1>
              <p className="text-xl text-gray-600 mt-2 font-medium">Historique et factures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Total payé</p>
                    <p className="text-3xl font-black text-gray-900">{totalPaid}€</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
                    <ClockIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">En attente</p>
                    <p className="text-3xl font-black text-gray-900">{totalPending}€</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl">
                    <CurrencyEuroIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Ce mois</p>
                    <p className="text-3xl font-black text-gray-900">{totalPaid + totalPending}€</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Historique des paiements</h2>
              <div className="space-y-4">
                {payments.map((payment) => {
                  const color = getStatusColor(payment.status);
                  return (
                    <div key={payment.id} className={`flex items-center justify-between p-4 bg-gradient-to-r from-${color}-50 to-white rounded-2xl border-2 border-${color}-100`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 bg-${color}-100 rounded-xl`}>
                          {getStatusIcon(payment.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-gray-900">{payment.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="font-medium">Enfant: {payment.childName}</span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(payment.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <p className="text-3xl font-black text-gray-900">{payment.amount}€</p>
                        <p className={`text-sm font-bold text-${color}-600 mt-1`}>
                          {getStatusLabel(payment.status)}
                        </p>
                      </div>

                      {payment.status === 'PAID' && payment.invoiceUrl && (
                        <Button variant="secondary" className="ml-4 text-sm">
                          Télécharger facture
                        </Button>
                      )}
                      {payment.status === 'PENDING' && (
                        <Button className="ml-4 text-sm">Payer</Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Moyens de paiement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                  <p className="text-sm font-bold text-gray-700 mb-2">Carte bancaire</p>
                  <p className="text-2xl font-black text-gray-900">•••• 4242</p>
                  <p className="text-xs text-gray-500 mt-1">Expire 12/2027</p>
                </div>
                <Button variant="secondary" className="h-full">
                  Ajouter un moyen de paiement
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Payments;