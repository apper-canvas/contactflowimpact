import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import dashboardService from "@/services/api/dashboardService";

const PipelineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPipelineData = async () => {
      try {
        const pipelineData = await dashboardService.getPipelineData();
        setData(pipelineData);
      } catch (error) {
        console.error('Error loading pipeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPipelineData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: { position: 'center' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${(val / 1000).toFixed(0)}K`
    },
    xaxis: {
      categories: data.map(item => item.stage),
      labels: {
        formatter: (val) => `$${(val / 1000).toFixed(0)}K`
      }
    },
    colors: ['#3b82f6'],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3
    }
  };

  const series = [{
    name: 'Pipeline Value',
    data: data.map(item => item.value)
  }];

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pipeline Overview</h3>
        <Loading />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pipeline Overview</h3>
      <Chart 
        options={chartOptions} 
        series={series} 
        type="bar" 
        height={350} 
      />
    </Card>
  );
};

export default PipelineChart;