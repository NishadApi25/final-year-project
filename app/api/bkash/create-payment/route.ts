import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/lib/db/models/order.model";
import { bkash } from "@/lib/bkash";

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
  } catch (error: unknown) {
    console.error("bKash create payment error:", error);
    const errorMsg = error instanceof Error ? error.message : "Failed to create payment";
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
