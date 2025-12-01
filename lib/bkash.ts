// bKash API integration for Bangladesh mobile payments
// Sandbox: https://checkout.sandbox.bkash.com
// Live: https://checkout.bkash.com

const BASE_URL = process.env.BKASH_API_URL || "https://sandbox.bkashapi.com";
const BKASH_APP_KEY = process.env.BKASH_APP_KEY || "";
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET || "";
const BKASH_USERNAME = process.env.BKASH_USERNAME || "";
const BKASH_PASSWORD = process.env.BKASH_PASSWORD || "";
const BKASH_CALLBACK_URL =
  process.env.BKASH_CALLBACK_URL || "http://localhost:4007/api/bkash/callback";

let tokenCache = {
  token: "",
  refreshToken: "",
  expiresAt: 0,
};

async function getToken() {
  // Return cached token if still valid
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const response = await fetch(`${BASE_URL}/v1.2.0/tokenized/checkout/token/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`bKash token error: ${data.statusMessage || "Unknown error"}`);
  }

  // Cache token for 55 minutes (expires in 1 hour)
  tokenCache = {
    token: data.id_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + 55 * 60 * 1000,
  };

  return data.id_token;
}

export const bkash = {
  /**
   * Create a payment request with bKash
   */
  createPayment: async function (orderId: string, amount: number, customerPhone: string) {
    const token = await getToken();

    const response = await fetch(
      `${BASE_URL}/v1.2.0/tokenized/checkout/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "X-APP-Key": BKASH_APP_KEY,
        },
        body: JSON.stringify({
          mode: "0011", // 0011 = tokenized checkout
          paymentType: "Checkout",
          amount: Math.round(amount * 100) / 100, // Ensure 2 decimal places
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: orderId,
          desc: `Order #${orderId}`,
          customerMsisdn: customerPhone.replace(/\D/g, ""), // Remove non-digits
          callbackURL: BKASH_CALLBACK_URL,
        }),
      }
    );

    const data = await response.json();
    if (data.statusCode !== "0000") {
      throw new Error(`bKash create payment error: ${data.statusMessage || "Unknown error"}`);
    }

    return {
      paymentID: data.paymentID,
      bkashURL: data.bkashURL,
    };
  },

  /**
   * Execute payment after user approves on bKash
   */
  executePayment: async function (paymentID: string) {
    const token = await getToken();

    const response = await fetch(
      `${BASE_URL}/v1.2.0/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "X-APP-Key": BKASH_APP_KEY,
        },
        body: JSON.stringify({
          paymentID: paymentID,
        }),
      }
    );

    const data = await response.json();
    if (data.statusCode !== "0000") {
      throw new Error(`bKash execute payment error: ${data.statusMessage || "Unknown error"}`);
    }

    return {
      paymentID: data.paymentID,
      trxID: data.trxID, // Transaction ID from bKash
      amount: data.amount,
      status: data.transactionStatus, // "Completed" for successful payments
      customerNumber: data.customerMsisdn,
      completedTime: data.completedTime,
    };
  },

  /**
   * Query payment status
   */
  queryPayment: async function (paymentID: string) {
    const token = await getToken();

    const response = await fetch(
      `${BASE_URL}/v1.2.0/tokenized/checkout/payment/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "X-APP-Key": BKASH_APP_KEY,
        },
        body: JSON.stringify({
          paymentID: paymentID,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`bKash query error: ${data.statusMessage || "Unknown error"}`);
    }

    return data;
  },

  /**
   * Refund a payment
   */
  refundPayment: async function (trxID: string, amount: number, reason: string) {
    const token = await getToken();

    const response = await fetch(
      `${BASE_URL}/v1.2.0/tokenized/checkout/payment/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "X-APP-Key": BKASH_APP_KEY,
        },
        body: JSON.stringify({
          trxID: trxID,
          amount: Math.round(amount * 100) / 100,
          reason: reason,
        }),
      }
    );

    const data = await response.json();
    if (data.statusCode !== "0000") {
      throw new Error(`bKash refund error: ${data.statusMessage || "Unknown error"}`);
    }

    return data;
  },
};
