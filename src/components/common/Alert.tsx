import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/solid';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const config = {
    success: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircleIcon,
      emoji: '✅',
    },
    error: {
      bg: 'from-red-50 to-pink-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: XCircleIcon,
      emoji: '⚠️',
    },
    warning: {
      bg: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: ExclamationCircleIcon,
      emoji: '⚡',
    },
    info: {
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: InformationCircleIcon,
      emoji: 'ℹ️',
    },
  };

  const { bg, border, text, emoji } = config[type];

  return (
    <div className={`bg-linear-to-r ${bg} border-2 ${border} ${text} px-5 py-4 rounded-2xl font-medium flex items-start space-x-3`}>
      <span className="text-2xl">{emoji}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
