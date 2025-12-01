import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/lib/db/models/order.model";
import { bkash } from "@/lib/bkash";
import axios from "axios";

/**
 * POST /api/bkash/create-payment
 * Create a payment request with bKash
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, customerPhone } = await request.json();

    if (!orderId || !amount || !customerPhone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate order exists
    await connectToDatabase();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Create payment with bKash
    const payment = await bkash.createPayment(orderId, amount, customerPhone);

    return NextResponse.json({
      success: true,
      paymentID: payment.paymentID,
      bkashURL: payment.bkashURL,
    });
  } catch (error: any) {
    console.error("bKash create payment error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}
