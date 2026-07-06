type Props = {
  pending: number;
  accepted: number;
  preparing: number;
  delivered: number;
  revenue: number;

  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
};
export default function DashboardCards({
  pending,
  accepted,
  preparing,
  delivered,
  revenue,
  selectedStatus,
  setSelectedStatus,
}: Props) {
  const cards = [
    {
      title: "🔴 Pending",
      value: pending,
      color: "#ef4444",
      status: "Pending",
    },
    {
      title: "🟢 Accepted",
      value: accepted,
      color: "#16a34a",
      status: "Accepted",
    },
    {
      title: "🟡 Prepared",
      value: preparing,
      color: "#f59e0b",
      status: "Prepared",
    },
    {
      title: "🔵 Delivered",
      value: delivered,
      color: "#2563eb",
      status: "Delivered",
    },
    {
      title: "💰 Revenue",
      value: `₹${revenue}`,
      color: "#7c3aed",
      status: "All",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
        gap: 12,
        marginBottom: 30,
      }}
    >
      {cards.map((card) => (
  <div
    key={card.title}
    onClick={() => setSelectedStatus(card.status)}
          style={{
            background:
            selectedStatus ===
            card.title.replace(/^🔴|🟢|🟡|🔵|💰/g, "").trim()
              ? "#fff6db"
              : "#ffffff",
            borderRadius: 18,
            padding: "18px 12px",
            textAlign: "center",
            boxShadow:
            selectedStatus ===
            card.title.replace(/^🔴|🟢|🟡|🔵|💰/g, "").trim()
            ? "0 12px 28px rgba(0,0,0,.18)"
            : "0 8px 20px rgba(0,0,0,.08)",
            border:
            selectedStatus ===
            card.title.replace(/^🔴|🟢|🟡|🔵|💰/g, "").trim()
            ? `3px solid ${card.color}`
            : "1px solid #f1f5f9",
          }}
        >
          <h3
            style={{
              color: card.color,
              margin: 0,
              marginBottom: 12,
              fontSize: "clamp(15px, 3vw, 18px)",
              fontWeight: 700,
            }}
          >
            {card.title}
          </h3>

          <div
            style={{
              fontSize: "clamp(24px, 6vw, 34px)",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}