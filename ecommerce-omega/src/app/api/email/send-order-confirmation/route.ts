import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { orderConfirmationTemplate } from "@/lib/emailTemplates";

export const dynamic = "force-dynamic";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

interface ShippingData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, order } = body as {
      to: string;
      order: {
        id: string;
        items: OrderItem[];
        total: number;
        shipping: ShippingData;
        paymentMethod: string;
        couponDiscount?: number;
      };
    };

    if (!to || !order) {
      return NextResponse.json(
        { error: "Missing required fields: to, order" },
        { status: 400 }
      );
    }

    // Don't try to send if SMTP is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP not configured, skipping email send");
      return NextResponse.json({ 
        success: true, 
        message: "Email skipped (SMTP not configured)" 
      });
    }

    const html = orderConfirmationTemplate(order);

    await transporter.sendMail({
      from: `"Tienda Online" <${process.env.SMTP_USER}>`,
      to,
      subject: `Confirmación de pedido #${order.id.slice(0, 8).toUpperCase()}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
