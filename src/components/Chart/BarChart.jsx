import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const BarChart = ({ chartTitle, barChartData }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        text: chartTitle,
        display: true,
      },
    },
    locale: "vi-VN",
    scales: {
      y: {
        ticks: {
          callback: (value, index, ticks) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumSignificantDigits: 3,
            }).format(value);
          },
        },
      },
    },
  };

  return <Bar options={options} data={barChartData} />;
};

export default BarChart;
