import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { NumericFormat, numericFormatter } from "react-number-format";

const LineChart = ({ chartTitle, lineChartData }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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

  return <Line options={options} data={lineChartData} />;
};

export default LineChart;
