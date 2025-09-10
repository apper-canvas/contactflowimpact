import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import dashboardService from "@/services/api/dashboardService";

const RevenueTrends = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRevenueTrends = async () => {
      try {
        const data = await dashboardService.getRevenueTrends();
        setChartData(data);
      } catch (error) {
        console.error('Error loading revenue trends:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRevenueTrends();
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    colors: ['#10b981'],
    xaxis: {
      categories: chartData?.months || [],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${(val / 1000).toFixed(0)}K`
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`
      }
    }
  };

  const series = [{
    name: 'Revenue',
    data: chartData?.revenue || []
  }];

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Trends</h3>
        <Loading />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Trends</h3>
      <Chart 
        options={chartOptions} 
        series={series} 
        type="area" 
        height={300} 
      />
    </Card>
  );
};

export default RevenueTrends;