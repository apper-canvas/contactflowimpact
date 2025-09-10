import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import dashboardService from "@/services/api/dashboardService";

const TopPerformers = () => {
  const [performers, setPerformers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue');

  useEffect(() => {
    const loadPerformers = async () => {
      try {
        const data = await dashboardService.getTopPerformers();
        setPerformers(data);
      } catch (error) {
        console.error('Error loading top performers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPerformers();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Performers</h3>
        <Loading />
      </Card>
    );
  }

  const tabs = [
    { id: 'revenue', label: 'Top Contacts' },
    { id: 'activity', label: 'Most Active' }
  ];

  const currentData = activeTab === 'revenue' 
    ? performers?.topContacts || [] 
    : performers?.activeProspects || [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Top Performers</h3>
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {currentData.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                {index + 1}
              </Badge>
              <div>
                <p className="font-medium text-neutral-900">{item.name}</p>
                <p className="text-sm text-neutral-600">{item.company}</p>
              </div>
            </div>
            <div className="text-right">
              {activeTab === 'revenue' ? (
                <>
                  <p className="font-semibold text-neutral-900">
                    ${item.totalValue?.toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {item.dealCount} deal{item.dealCount !== 1 ? 's' : ''}
                  </p>
                </>
              ) : (
                <p className="font-semibold text-neutral-900">
                  {item.taskCount} activities
                </p>
              )}
            </div>
          </div>
        ))}
        {currentData.length === 0 && (
          <p className="text-center text-neutral-500 py-4">
            No data available
          </p>
        )}
      </div>
    </Card>
  );
};

export default TopPerformers;