"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, MessageCircle, AlertCircle } from "lucide-react";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newReview.userName.trim()) {
      setFormError("El nombre es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) {
        const errData = await res.json();
        setFormError(errData.error || "Acurrió un error al enviar tu reseña.");
      } else {
        // Success
        setNewReview({ userName: "", rating: 5, comment: "" });
        setIsFormOpen(false);
        fetchReviews(); // Recargar reseñas incluyendo la nueva
      }
    } catch {
      setFormError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4"
            style={{
              color: 'var(--accent-warning, #eab308)',
              fill: star <= rating ? 'var(--accent-warning, #eab308)' : 'transparent',
              opacity: star <= rating ? 1 : 0.35,
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) return null; // Wait for reviews to load before rendering the block.

  return (
    <div className="mt-12 border-t pt-8 pb-12" style={{ borderColor: 'var(--border, #e5e7eb)', color: 'var(--color-primary-text)' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> Reseñas de Clientes
          </h2>
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(averageRating)} />
            <span className="font-semibold text-lg">{averageRating} de 5</span>
            <span className="text-sm opacity-60">({reviews.length} opiniones)</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full md:w-auto"
          style={{ background: 'var(--color-primary-bg)', color: 'var(--color-tertiary-text)' }}
        >
          {isFormOpen ? "Cancelar" : "Escribir una Reseña"}
        </button>
      </div>

      {/* Review Form Area */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 rounded-xl border" style={{ borderColor: 'var(--border, #e5e7eb)', background: 'var(--bgweb)' }}>
          <h3 className="font-semibold mb-4 text-lg">Comparte tu opinión</h3>
          
          {formError && (
            <div className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2" style={{ background: 'var(--surface, #fef2f2)', color: 'var(--color-danger, #dc2626)' }}>
              <AlertCircle className="w-4 h-4" /> {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Tu Nombre</label>
              <input 
                type="text" 
                value={newReview.userName}
                onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                className="w-full px-3 py-2 border rounded-md outline-none bg-transparent focus:ring-2 focus:ring-[var(--color-primary-bg)]"
                style={{ borderColor: 'var(--border, #e5e7eb)' }}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Calificación (Estrellas)</label>
              <select 
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="w-full px-3 py-2 border rounded-md outline-none bg-transparent focus:ring-2 focus:ring-[var(--color-primary-bg)]"
                style={{ borderColor: 'var(--border, #e5e7eb)' }}
              >
                <option value={5}>5 - Excelente</option>
                <option value={4}>4 - Muy Bueno</option>
                <option value={3}>3 - Regular</option>
                <option value={2}>2 - Malo</option>
                <option value={1}>1 - Pésimo</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 opacity-80">Comentario (Opcional)</label>
            <textarea 
              rows={3}
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full px-3 py-2 border rounded-md outline-none bg-transparent focus:ring-2 focus:ring-[var(--color-primary-bg)] resize-none"
              style={{ borderColor: 'var(--border, #e5e7eb)' }}
              placeholder="¿Qué te pareció el producto?"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg font-medium transition-colors w-full md:w-auto"
            style={{ 
              background: 'var(--color-primary-bg)', 
              color: 'var(--color-tertiary-text)',
              opacity: isSubmitting ? 0.7 : 1 
            }}
          >
            {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center opacity-60 italic py-8">¡Sé el primero en opinar sobre este producto!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b outline-none last:border-0" style={{ borderColor: 'var(--border, #f3f4f6)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-md">{review.user_name}</h4>
                  <span className="text-xs opacity-60">
                    {new Date(review.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric'})}
                  </span>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm opacity-80 mt-2 leading-relaxed whitespace-pre-line">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
