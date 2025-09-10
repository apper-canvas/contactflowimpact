import { useState, useEffect } from "react";
import dashboardService from "@/services/api/dashboardService";
import MetricCard from "@/components/molecules/MetricCard";
import PipelineChart from "@/components/molecules/PipelineChart";
import ActivitySummary from "@/components/molecules/ActivitySummary";
import RevenueTrends from "@/components/molecules/RevenueTrends";
import TopPerformers from "@/components/molecules/TopPerformers";
import Loading from "@/components/ui/Loading";
import { toast } from "react-toastify";

const ReportsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('thisMonth');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMetrics(timeRange);
        setMetrics(data);
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [timeRange]);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Sales Dashboard</h1>
            <p className="text-neutral-600 mt-1">
              Monitor your sales performance and pipeline health
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Pipeline Value"
            value={metrics?.totalPipelineValue || 0}
            growth={metrics?.growth?.pipeline}
            icon="DollarSign"
            iconColor="text-success-600"
            formatValue={formatCurrency}
          />
          <MetricCard
            title="Deals Closed"
            value={metrics?.closedDealsCount || 0}
            growth={metrics?.growth?.deals}
            icon="Target"
            iconColor="text-primary-600"
          />
          <MetricCard
            title="Average Deal Size"
            value={metrics?.averageDealSize || 0}
            growth={metrics?.growth?.revenue}
            icon="TrendingUp"
            iconColor="text-accent-600"
            formatValue={formatCurrency}
          />
          <MetricCard
            title="Conversion Rate"
            value={metrics?.conversionRate || 0}
            growth={metrics?.growth?.conversion}
            icon="Percent"
            iconColor="text-warning-600"
            formatValue={formatPercentage}
          />
        </div>

        {/* Charts and Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PipelineChart />
          <RevenueTrends />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivitySummary />
          <TopPerformers />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;