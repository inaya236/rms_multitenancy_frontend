import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const KpiCard = ({ title, value, change, color, icon }) => {
  return (
    <div
      className="bg-white shadow-sm position-relative text-center d-flex flex-column align-items-center justify-content-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      style={{
        borderTop: `4px solid ${color}`,
        borderRadius: "16px",
        padding: "16px 16px 14px",
        height: "150px",
        overflow: "hidden",
      }}
    >

      {change && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#e6f4ea",
            color: "#1e7e34",
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "20px",
            fontWeight: 600,
          }}
        >
          {change}
        </span>
      )}

      {/* ICON */}

      <div
        style={{
          backgroundColor: `${color}20`,
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          fontSize: "22px",
          marginBottom: "8px",
        }}
      >
        {icon}
      </div>

      {/* TITLE */}

      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#6c757d",
          fontWeight: 500,
        }}
      >
        {title}
      </p>

      {/* VALUE */}

      <h4
        style={{
          margin: "4px 0 0",
          fontWeight: 700,
        }}
      >
        {value}
      </h4>

    </div>
  );
};

export default KpiCard;
