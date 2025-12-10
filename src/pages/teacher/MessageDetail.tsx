import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { teacherAPI } from "../../api/teacher.api";

import type { Message } from "../../types/common.types";

const MessageDetail: React.FC = () => {
  const { id } = useParams(); // <-- Récupération de l’ID du message
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (messageId: number) => {
    try {
      const response = await teacherAPI.getMessageById(messageId); 
      // ApiResponse<Message>

      setMessage(response.data.data); // <-- données réelles
    } catch (error) {
      console.error("Erreur chargement message :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Message introuvable ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-black text-gray-900">
                  Conversation 🚀
                </h1>
                <p className="text-xl text-gray-600 mt-2 font-medium">
                  Détail du message
                </p>
              </div>
              <Button onClick={() => navigate("/teacher/messages")}>
                Retour
              </Button>
            </div>

            <Card>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {message.subject}
              </h2>

              <p className="text-gray-800 whitespace-pre-line">
                {message.content}
              </p>

              <div className="text-xs text-gray-500 mt-6">
                Envoyé le :{" "}
                {new Date(message.createdAt).toLocaleString("fr-FR")}
              </div>

              {message.sender && (
                <div className="text-sm text-gray-700 mt-3">
                  De : {message.sender.firstName} {message.sender.lastName}
                </div>
              )}

              {message.recipient && (
                <div className="text-sm text-gray-700">
                  À : {message.recipient.firstName} {message.recipient.lastName}
                </div>
              )}
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
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default MessageDetail;