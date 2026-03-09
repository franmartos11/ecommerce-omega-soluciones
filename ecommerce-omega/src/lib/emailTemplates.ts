// Transactional email templates
// Using inline styles for maximum email client compatibility

export function orderConfirmationTemplate(order: {
  id: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
  shipping: { firstName: string; lastName: string; address: string; city: string; province: string; postalCode: string };
  paymentMethod: string;
  couponDiscount?: number;
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151;">${item.title}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; text-align: center; font-size: 14px; color: #374151;">${item.quantity}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const paymentLabels: Record<string, string> = {
    mercadopago: "Mercado Pago",
    local: "Pago en local",
    transfer: "Transferencia bancaria",
  };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">¡Gracias por tu compra! 🎉</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">Tu pedido ha sido confirmado</p>
    </div>

    <!-- Body -->
    <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      
      <!-- Order number -->
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #0369a1; text-transform: uppercase; letter-spacing: 1px;">Número de pedido</p>
        <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #0c4a6e;">#${order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <!-- Products table -->
      <h3 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Productos</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Producto</th>
            <th style="padding: 8px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Cant.</th>
            <th style="padding: 8px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      ${order.couponDiscount ? `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; color: #059669;">
        <span>Descuento</span>
        <span>-$${order.couponDiscount.toFixed(2)}</span>
      </div>
      ` : ""}

      <!-- Total -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 18px; font-weight: 700; color: #111827;">Total</span>
          <span style="font-size: 24px; font-weight: 700; color: #2563eb;">$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Shipping info -->
      <h3 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Datos de envío</h3>
      <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #111827;">${order.shipping.firstName} ${order.shipping.lastName}</p>
        <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">${order.shipping.address}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">${order.shipping.city}, ${order.shipping.province} - CP ${order.shipping.postalCode}</p>
      </div>

      <!-- Payment method -->
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">
        <strong>Método de pago:</strong> ${paymentLabels[order.paymentMethod] || order.paymentMethod}
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Podés seguir el estado de tu pedido desde tu cuenta</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; font-size: 12px; color: #9ca3af;">
      <p style="margin: 0;">Este es un email automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function orderStatusChangeTemplate(order: {
  id: string;
  status: string;
  customerName: string;
}) {
  const statusLabels: Record<string, { label: string; color: string; emoji: string }> = {
    pagado: { label: "Pagado", color: "#2563eb", emoji: "💳" },
    enviado: { label: "Enviado", color: "#7c3aed", emoji: "📦" },
    completado: { label: "Entregado", color: "#059669", emoji: "✅" },
    cancelado: { label: "Cancelado", color: "#dc2626", emoji: "❌" },
  };

  const statusInfo = statusLabels[order.status] || { label: order.status, color: "#6b7280", emoji: "📋" };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <p style="font-size: 48px; margin: 0 0 16px;">${statusInfo.emoji}</p>
      <h1 style="font-size: 22px; color: #111827; margin: 0 0 8px;">Actualización de tu pedido</h1>
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">Hola ${order.customerName}, tu pedido ha cambiado de estado</p>
      
      <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Pedido #${order.id.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 0; font-size: 20px; font-weight: 700; color: ${statusInfo.color};">${statusInfo.label}</p>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin: 0;">Podés ver más detalles en tu panel de compras.</p>
    </div>
    <div style="text-align: center; padding: 24px; font-size: 12px; color: #9ca3af;">
      <p style="margin: 0;">Este es un email automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>
  `;
}
