import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { pieChartData } from "./FAKE_DATA";

const PieChart = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        text: "Drinks Pie Chart",
        display: true,
      },
    },
  };

  return <Pie options={options} data={pieChartData} />;
};

export default PieChart;
