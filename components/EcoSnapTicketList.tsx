import React from "react";
import { EcoSnapTicket } from "../types";

type Props = {
  tickets: EcoSnapTicket[];
};

const severityColorMap: Record<string, string> = {
  Low: "#15803d",
  Medium: "#ca8a04",
  High: "#ea580c",
  Critical: "#dc2626",
};

const EcoSnapTicketList: React.FC<Props> = ({ tickets }) => {
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>Eco-Snap Tickets</h2>
        <div
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          Total: {tickets.length}
        </div>
      </div>

      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        tickets.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#f8fafc",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "14px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={t.image_url}
              alt={t.issue_type}
              style={{
                width: "110px",
                height: "110px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{t.issue_type}</h3>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    background: severityColorMap[t.severity] || "#6b7280",
                    color: "#fff",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {t.severity}
                </span>

                {t.alert_triggered && (
                  <span
                    style={{
                      background: "#fee2e2",
                      color: "#991b1b",
                      borderRadius: "999px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Slack Alert Sent
                  </span>
                )}
              </div>

              <p style={{ margin: "6px 0" }}>
                <strong>Location:</strong> {t.location || "Not provided"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Note:</strong> {t.note || "No note"}
              </p>
              <p style={{ margin: "6px 0", color: "#475569" }}>
                <strong>Time:</strong> {new Date(t.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EcoSnapTicketList;
