"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { MessageCircle, Star, Trash2, Check, X, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  products: {
    id: string;
    title: string;
    image_url: string;
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching reviews", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (reviewId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });

      if (res.ok) {
        setReviews(prev =>
          prev.map(r => (r.id === reviewId ? { ...r, status: status as Review["status"] } : r))
        );
      } else {
        alert("Error al actualizar estado.");
      }
    } catch (e) {
      console.error("Update error", e);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reseña permanentemente?")) return;
    
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      } else {
        alert("Error al eliminar la reseña.");
      }
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Cargando reseñas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            Moderación de Reseñas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Supervisa, aprueba o elimina las opiniones dejadas por los clientes en tus productos.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No hay reseñas</h3>
            <p className="text-gray-500">Tus clientes aún no han dejado comentarios en los productos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Calificación</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {review.products ? (
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                            <NextImage src={review.products.image_url} alt={review.products.title} fill className="object-cover" unoptimized />
                          </div>
                          <Link href={`/ProductoDetailPage/${review.products.id}`} target="_blank" className="font-medium text-blue-600 hover:underline max-w-[200px] truncate block flex items-center gap-1">
                            {review.products.title}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Producto eliminado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {review.user_name}
                      {review.comment && (
                        <div className="text-xs font-normal text-gray-500 max-w-[250px] truncate mt-1">
                          &ldquo;{review.comment}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md uppercase border ${
                        review.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {review.status === 'approved' ? 'Público' : review.status === 'pending' ? 'Oculto' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'approved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Aprobar (Hacer Público)"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {review.status === 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'pending')}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                            title="Ocultar (Pendiente)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors ml-2"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
