// src/components/pieChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ history }) => {
    const categoryTotals = history.reduce((acc, transaction) => {
        const { category, amount, type } = transaction;
        if (!acc[category]) {
            acc[category] = 0;
        }
        if (type === "subtract") {
            acc[category] += amount;
        } else if (type === "add") {
            acc[category] -= amount;
        }
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const total = data.reduce((acc, curr) => acc + curr, 0);

    const labelsWithPercentages = labels.map((label, index) => {
        const value = data[index];
        const percentage = ((value / total) * 100).toFixed(2);
        return `${label} (${percentage}%)`;
    });

    const chartData = {
        labels: labelsWithPercentages,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
