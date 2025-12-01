"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function BkashForm({
  orderId,
  totalPrice,
}: {
  orderId: string;
  totalPrice: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handlePayment = async () => {
    if (!customerPhone) {
      setError("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create payment request with bKash
      const response = await axios.post("/api/bkash/create-payment", {
        orderId,
        amount: totalPrice,
        customerPhone,
      });

      if (response.data.success && response.data.bkashURL) {
        // Redirect to bKash payment page
        // bKash will redirect back to the verify page after payment
        window.location.href = response.data.bkashURL;
      } else {
        setError(response.data.message || "Failed to create payment");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to initiate payment";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          bKash Phone Number (01XXXXXXXXX)
        </label>
        <input
          type="tel"
          placeholder="01712345678"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full border p-2 rounded"
          disabled={isLoading}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
        <p className="font-semibold mb-2">How to pay with bKash:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Enter your bKash registered phone number above</li>
          <li>Click &quot;Pay with bKash&quot; button</li>
          <li>You will be redirected to bKash payment page</li>
          <li>Complete the payment on bKash</li>
          <li>You will be redirected back to confirm payment</li>
        </ol>
      </div>

      <Button
        className="w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : `Pay ${totalPrice} BDT with bKash`}
      </Button>
    </div>
  );
}
