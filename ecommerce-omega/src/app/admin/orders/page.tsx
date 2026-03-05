"use client";

import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, Search, ExternalLink, ChevronDown, ChevronUp, Filter, Calendar } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todas");
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching orders", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        // Update local state without fetching all again
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Error al actualizar la orden.");
      }
    } catch (e) {
      console.error("Update error", e);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pagado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "enviado": return "bg-purple-100 text-purple-800 border-purple-200";
      case "completado": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = orders.filter(o => {
    // 1. Filtro por Término de Búsqueda
    const term = searchTerm.toLowerCase();
    const idMatch = o.id.toLowerCase().includes(term);
    const firstNameMatch = (o.shipping?.firstName || '').toLowerCase().includes(term);
    const lastNameMatch = (o.shipping?.lastName || '').toLowerCase().includes(term);
    const nameMatch = `${o.shipping?.firstName || ''} ${o.shipping?.lastName || ''}`.toLowerCase().includes(term);
    const dniMatch = (o.shipping?.dni || '').toLowerCase().includes(term);
    const cityMatch = (o.shipping?.city || '').toLowerCase().includes(term);
    
    const matchesSearch = idMatch || firstNameMatch || lastNameMatch || nameMatch || dniMatch || cityMatch;

    // 2. Filtro por Estado (Status)
    const matchesStatus = statusFilter === "todos" || o.status === statusFilter;

    // 3. Filtro por Fecha (Date)
    let matchesDate = true;
    if (dateFilter !== "todas" && o.createdAt) {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === "hoy") matchesDate = diffDays <= 1;
      else if (dateFilter === "7dias") matchesDate = diffDays <= 7;
      else if (dateFilter === "30dias") matchesDate = diffDays <= 30;
      else if (dateFilter === "este_mes") {
        matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventas y Órdenes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los pedidos de tus clientes de forma interactiva.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 w-full sm:w-40 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium text-gray-700"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="enviado">Enviado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-8 py-2 w-full sm:w-44 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium text-gray-700"
            >
              <option value="todas">Todas las Fechas</option>
              <option value="hoy">Hoy</option>
              <option value="7dias">Últimos 7 días</option>
              <option value="30dias">Últimos 30 días</option>
              <option value="este_mes">Este Mes</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar ID, Cliente, DNI..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No hay órdenes</h3>
            <p className="text-gray-500 mb-6">Aún no has recibido ventas o tu búsqueda no produjo resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">ID Orden</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-center">Medio de Pago</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-600 font-medium">#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {order.shipping?.firstName || "N/A"} {order.shipping?.lastName || ""}
                          </div>
                          <div className="text-xs text-gray-500">{order.shipping?.city || "Sin ciudad"}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Desconocida"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md uppercase">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status || "pendiente"}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none text-center ${getStatusColor(order.status || "pendiente")}`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Enviado</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                          >
                            Detalles
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Fila expandible con detalles */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50/50 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                              {/* Productos */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Package className="w-4 h-4 text-gray-400" />
                                  Productos Comprados
                                </h4>
                                <ul className="space-y-2">
                                  {order.items?.map((item: any, idx: number) => (
                                    <li key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-gray-600">
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-900 px-2 py-0.5 bg-gray-200 rounded text-xs">{item.quantity}x</span>
                                        <span className="truncate max-w-[200px]">{item.title}</span>
                                      </div>
                                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Envío */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-gray-400" />
                                  Detalles de Envío
                                </h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-600 space-y-1">
                                  <p><span className="font-medium text-gray-900">Nombre:</span> {order.shipping?.firstName} {order.shipping?.lastName}</p>
                                  <p><span className="font-medium text-gray-900">DNI/CUIL:</span> {order.shipping?.dni || "N/A"}</p>
                                  <p><span className="font-medium text-gray-900">Teléfono:</span> {order.shipping?.phone}</p>
                                  <div className="w-full h-px bg-gray-100 my-2" />
                                  <p><span className="font-medium text-gray-900">Dirección:</span> {order.shipping?.address} {order.shipping?.floorApt ? `(Depto: ${order.shipping.floorApt})` : ""}</p>
                                  <p><span className="font-medium text-gray-900">Locación:</span> {order.shipping?.city}, {order.shipping?.province} ({order.shipping?.postalCode})</p>
                                  
                                  {order.reference && (
                                    <>
                                      <div className="w-full h-px bg-gray-100 my-2" />
                                      <p className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md inline-block">
                                        <span className="font-bold border-b border-blue-200">Referencia Transferencia:</span> <br />{order.reference}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
