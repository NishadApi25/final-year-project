"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import ProductCard from "@/components/shared/product/product-card";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  listPrice?: number;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  countInStock?: number;
  avgRating?: number;
  numReviews?: number;
  tags?: string[];
  category?: string;
}

interface Account {
  name: string;
  email: string;
  role: string;
  affiliateRequest: boolean;
  totalEarnings?: number;
  clicks?: number;
  conversions?: number;
}

interface ClickData {
  productName: string;
  weeklyClicks: number[];
  monthlyClicks: number[];
}

export default function OverviewReport() {
  const t = useTranslations("Affiliater");
  const [account, setAccount] = useState<Account | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Account info
        const accountRes = await axios.get("/account");
        setAccount(accountRes.data);

        // All products
        const productsRes = await axios.get("/api/products"); // make sure this endpoint returns all products
        setProducts(productsRes.data.products);

        // Click analytics
        const clicksRes = await axios.get("/api/products/clicks");
        setClickData(clicksRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="p-6">{t("Loading")}...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("Affiliate Dashboard")}</h1>

      {/* Account Info */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow p-4 rounded col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">{t("Account Info")}</h2>
            <p>{t("Name")}: {account.name}</p>
            <p>{t("Email")}: {account.email}</p>
            <p>{t("Role")}: {account.role}</p>
            <p>{t("Affiliate Approved")}: {account.affiliateRequest ? t("Yes") : t("Pending")}</p>
          </div>
          <div className="bg-white shadow p-4 rounded text-center">
            <h2 className="text-lg font-semibold">{t("Total Earnings")}</h2>
            <p className="text-2xl font-bold">${account.totalEarnings || 0}</p>
          </div>
          <div className="bg-white shadow p-4 rounded text-center">
            <h2 className="text-lg font-semibold">{t("Clicks")}</h2>
            <p className="text-2xl font-bold">{account.clicks || 0}</p>
          </div>
          <div className="bg-white shadow p-4 rounded text-center">
            <h2 className="text-lg font-semibold">{t("Conversions")}</h2>
            <p className="text-2xl font-bold">{account.conversions || 0}</p>
          </div>
        </div>
      )}

      {/* Click Analytics */}
      <section className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">{t("Clicks Analytics")}</h2>
        {clickData.map((product) => {
          const weeklyData = product.weeklyClicks.map((clicks, index) => ({
            day: `Day ${index + 1}`,
            clicks,
          }));
          const monthlyData = product.monthlyClicks.map((clicks, index) => ({
            week: `Week ${index + 1}`,
            clicks,
          }));

          return (
            <div key={product.productName} className="mb-8">
              <h3 className="font-semibold mb-2">{product.productName}</h3>

              <h4 className="text-sm mb-1">Weekly Clicks</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>

              <h4 className="text-sm mt-4 mb-1">Monthly Clicks</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </section>

      {/* All Products */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </div>
  );
}
