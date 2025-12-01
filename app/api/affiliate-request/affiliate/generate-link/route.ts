import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/lib/db/models/product.model";

export async function POST(req: NextRequest) {
  try {
    const { productId, userId } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Generate affiliate link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4007";
    const affiliateLink = `${baseUrl}/product/${product.slug}?affiliate=${userId}`;

    return NextResponse.json({ link: affiliateLink });
  } catch (error) {
    console.error("Error generating affiliate link:", error);
    return NextResponse.json(
      { error: "Failed to generate affiliate link" },
      { status: 500 }
    );
  }
}
