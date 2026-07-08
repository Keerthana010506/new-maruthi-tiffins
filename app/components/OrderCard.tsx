type CartItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  firestoreId: string;
  customerName: string;
  phone: string;
  address: string;
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  orderDate?: string;
  orderTime?: string;
  deliveredTime?: string;
};

type Props = {
  order: Order;
  index: number;
  updateStatus: (
  firestoreId: string,
  status: string
) => void;
  statusColor: (status: string) => string;
};

export default function OrderCard({
  order,
  index,
  updateStatus,
  statusColor,
}: Props) {
  const buttons = [
    {
      label: "✅ Accept",
      value: "Accepted",
      color: "#16a34a",
    },
    {
      label: "🍽 Prepared",
      value: "Prepared",
      color: "#f59e0b",
    },
    {
      label: "🚚 Delivered",
      value: "Delivered",
      color: "#2563eb",
    },
  ];

  return (
  <div
    style={{
      background: "#fff",
      padding: "clamp(14px,4vw,20px)",
      borderRadius: 18,
      marginBottom: 22,
      boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      border: "1px solid #eee",
    }}
  >
    <h2
      style={{
        color: "#c40000",
        marginTop: 0,
        marginBottom: 18,
        fontSize: "clamp(24px,5vw,32px)",
        fontWeight: "800",
      }}
    >
      Order #{order.id}
    </h2>

    {/* Customer Details */}
    <div
      style={{
        marginBottom: 20,
        lineHeight: 1.9,
        fontSize: "clamp(14px,3vw,16px)",
        color: "#222"
      }}
    >
      <div><strong>👤 {order.customerName}</strong></div>
      <div>📞 {order.phone}</div>
      <div>📍 {order.address}</div>
      <div>📅 {order.orderDate}</div>
      <div>🕒 {order.orderTime}</div>

      {order.deliveredTime && (
        <div
          style={{
            marginTop: 6,
            color: "#2563eb",
            fontWeight: "bold",
          }}
        >
          ✅ Delivered: {order.deliveredTime}
        </div>
      )}
    </div>

    <hr
      style={{
        border: 0,
        borderTop: "1px dashed #ddd",
        margin: "18px 0",
      }}
    />

    {/* Ordered Items */}
    <h3
  style={{
    marginTop: 0,
    marginBottom: 14,
    color: "#b91c1c",
    fontSize: "22px",
    fontWeight: "800",
  }}
>
      🍽 Ordered Items
    </h3>

    {order.cart.map((item, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: "1px dashed #eee",
          fontSize: "clamp(14px,3vw,16px)",
          color: "#222",
        }}
      >
        <span
  style={{
    fontSize: "clamp(17px,4vw,20px)",
    fontWeight: "700",
    color: "#111",
  }}
>
  {item.name} × {item.quantity}
</span>

        <strong
  style={{
    fontSize: "18px",
    color: "#b91c1c",
  }}
>
  ₹{item.price * item.quantity}
</strong>

      </div>
    ))}

    <div
      style={{
        marginTop: 12,
        lineHeight: 1.5,
         fontSize: "clamp(14px,2.8vw,16px)",
    color: "#222",
      }}
    >
      <div>Subtotal : ₹{order.subtotal}</div>

      <div>Delivery : ₹{order.deliveryFee}</div>

      <h2
        style={{
          color: "#c40000",
          margin: "10px 0",
          fontSize: "clamp(22px,5vw,30px)",
        }}
      >
        Total : ₹{order.total}
      </h2>

      <div style={{ marginTop: 12 }}>
  <span
    style={{
      background: statusColor(order.status),
      color: "#fff",
      padding: "6px 14px",
      borderRadius: 999,
      fontWeight: "700",
      fontSize: 14,
      display: "inline-block",
    }}
  >
    {order.status === "Pending"
      ? "Order Received"
      : order.status}
  </span>
</div>
</div>
    {/* Buttons */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(140px,1fr))",
        gap: 8,
        marginTop: 22,
      }}
    >
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => {
            if (btn.value === "Delivered") {
              const ok = window.confirm(
                "Mark this order as Delivered?"
              );

              if (!ok) return;
            }

            updateStatus(order.firestoreId, btn.value);
          }}
          disabled={
            (order.status === "Pending" &&
              btn.value !== "Accepted") ||

            (order.status === "Accepted" &&
              btn.value !== "Prepared") ||

            (order.status === "Prepared" &&
              btn.value !== "Delivered") ||

            order.status === "Delivered"
          }
          style={{
            background:
              order.status === btn.value
                ? btn.color
                : "#fff",

            color:
              order.status === btn.value
                ? "#fff"
                : btn.color,

            border: `2px solid ${btn.color}`,

            borderRadius: 10,

            padding: "8px 6px",
            minHeight: 38,

            fontWeight: "600",

            fontSize: 12,
      

            cursor:
              (order.status === "Pending" &&
                btn.value !== "Accepted") ||

              (order.status === "Accepted" &&
                btn.value !== "Prepared") ||

              (order.status === "Prepared" &&
                btn.value !== "Delivered") ||

              order.status === "Delivered"
                ? "not-allowed"
                : "pointer",

            boxShadow: "0 3px 8px rgba(0,0,0,.08)",

            transition: ".2s",
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  </div>
);
}