import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FaSearch, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getMonthlyUsers } from '../API/Api';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Graph = ({ projectId }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [graphData, setGraphData] = useState([]);

    
    
    const fetchUserGrowthData = async () => {

       
        const data = await getMonthlyUsers(projectId, Number(year));
       
        
        if (data) {
            setGraphData(data);
        }
        // setLoading(false);
    };

    useEffect(() => {
        fetchUserGrowthData();
    }, [year]);


    const chartData = {
        labels: graphData.map(item => item.month),
        datasets: [
            {
                label: 'Users Signed Up',
                data: graphData.map(item => item.count),
                borderColor: '#3b82f6', // blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#7c3aed', // purple-500
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e5e7eb', // gray-200
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1f2937', // gray-800
                titleColor: '#f3f4f6', // gray-100
                bodyColor: '#d1d5db', // gray-300
                borderColor: '#4b5563', // gray-600
                borderWidth: 1,
                padding: 12,
                usePointStyle: true,
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(55, 65, 81, 0.5)', // gray-700 with opacity
                    borderColor: '#4b5563' // gray-600
                },
                ticks: {
                    color: '#9ca3af' // gray-400
                }
            },
            y: {
                grid: {
                    color: 'rgba(55, 65, 81, 0.5)', // gray-700 with opacity
                    borderColor: '#4b5563' // gray-600
                },
                ticks: {
                    color: '#9ca3af' // gray-400
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-xl border border-gray-700 shadow-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <FaChartLine className="text-2xl text-blue-400" />
                    <h2 className="text-xl md:text-2xl font-bold">
                        User Growth in <span className="text-blue-400">{year}</span>
                    </h2>
                </div>

                {/* Year Input */}
                <div className="relative max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-500" />
                    </div>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min="2023"
                        max={new Date().getFullYear()}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="Enter year"
                    />
                </div>
            </div>

            {/* Graph Container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-80 md:h-96 bg-gray-800/50 rounded-xl border border-gray-700 p-4"
            >
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        </div>
                    </div>
                ) : (
                    <Line data={chartData} options={chartOptions} />
                )}
            </motion.div>

            {/* Summary Stats */}
            {!loading && graphData.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm">Total Users</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {graphData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm">Peak Month</div>
                        <div className="text-2xl font-bold text-purple-400">
                            {graphData.reduce((prev, current) => (prev.count > current.count) ? prev : current).month}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm">Peak Users</div>
                        <div className="text-2xl font-bold text-green-400">
                            {Math.max(...graphData.map(item => item.count)).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm">Avg. Monthly</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {Math.round(graphData.reduce((sum, item) => sum + item.count, 0) / graphData.length).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Graph;