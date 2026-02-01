"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/Globals/Modal";
import { SupportTicketSchema } from "@/schemas/ticket";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { useSession } from "next-auth/react";
import { useSendTicketMessage } from "@/services/tickets/sendTicketMessage";

dayjs.extend(relativeTime);
dayjs.locale("fr");

interface TicketMessagesModalProps {
  ticket: SupportTicketSchema;
  onReplySent: () => void;
}

export default function TicketMessagesModal({
  ticket,
  onReplySent,
}: TicketMessagesModalProps) {  
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate: sendMessage, isPending } = useSendTicketMessage();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!replyContent.trim()) {
      setError("Le message ne peut pas être vide");
      return;
    }

    if (!session?.user?.id) {
      setError("Vous devez être connecté pour envoyer un message");
      return;
    }

    sendMessage(
      {
        ticket_id: ticket.id,
        author_id: session.user.id,
        content: replyContent,
      },
      {
        onSuccess: () => {
          setReplyContent("");
          onReplySent();
          // Scroll vers le nouveau message après un court délai
          setTimeout(scrollToBottom, 100);
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Une erreur est survenue");
        },
      }
    );
  };

  const sortedMessages = [...ticket.messages].sort(
    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
  );

  return (
    <>
    <button
      onClick={openModal}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors cursor-pointer"
      title="Voir les messages"
    >
      {ticket.messages?.length || 0}
    </button>
    <Modal 
      isOpen={isOpen} 
      onClose={closeModal} 
      title={ticket.subject}
      size="large"
    >
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Ticket de {ticket.user.first_name} {ticket.user.last_name} ({ticket.user.email})
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg -mx-2">
        {sortedMessages.length === 0 ? (
          <p className="text-center text-gray-500">Aucun message pour ce ticket</p>
        ) : (
          sortedMessages.map((message) => {
            const isUserMessage = message.author_id === ticket.user_id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isUserMessage ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-md rounded-lg p-4 shadow-sm ${
                    isUserMessage
                      ? "bg-white border-2 border-gray-200"
                      : "bg-surfie-green-600 text-white"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className={`text-xs font-semibold ${isUserMessage ? "text-gray-900" : "text-surfie-green-100"}`}>
                      {isUserMessage ? `${ticket.user.first_name} ${ticket.user.last_name}` : "Administrateur"}
                    </span>
                    <span className={`text-xs ${isUserMessage ? "text-gray-500" : "text-surfie-green-200"}`}>
                      {dayjs(message.sent_at).format("D MMM YYYY à HH:mm")}
                    </span>
                  </div>
                  <p className={`text-sm whitespace-pre-wrap ${isUserMessage ? "text-gray-700" : "text-white"}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label htmlFor="reply" className="block text-sm font-semibold text-surfie-green-800 mb-2">
            Répondre
          </label>
          <textarea
            id="reply"
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={isPending}
            className="block w-full rounded-lg border-2 border-gray-200 p-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="Tapez votre réponse ici..."
          />
          <div className="mt-1 flex items-center justify-end">
            {error && (
              <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending || !replyContent.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-surfie-green-700 to-surfie-green-600 text-white font-semibold rounded-lg hover:from-surfie-green-800 hover:to-surfie-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Envoi...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                Envoyer
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
    </>
  );
}
