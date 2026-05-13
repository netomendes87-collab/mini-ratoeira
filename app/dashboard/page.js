"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*");

    if (!error) {
      setCampaigns(data);
    }
  }

  return (
    <div
      style={{
        background: "#07122b",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "30px",
        }}
      >
        🚀 Mini Ratoeira
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            style={{
              background: "#13203d",
              borderRadius: "16px",
              padding: "25px",
              border: "1px solid #22345e",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "15px",
              }}
            >
              {campaign.name}
            </h2>

            <p
              style={{
                color: "#9fb3d9",
                marginBottom: "20px",
              }}
            >
              Oferta cadastrada no Supabase
            </p>

            <a
              href={campaign.offer}
              target="_blank"
              style={{
                background: "#4ade80",
                color: "#07122b",
                padding: "12px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              🔥 Abrir Oferta
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}