import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import { habitService } from "@/services/api/habitService";
import { dayProgressService } from "@/services/api/dayProgressService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { challengeService } from "@/services/api/challengeService";

function ProgressCharts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 14days, 21days
  const [chartData, setChartData] = useState({
    habitTrends: null,
    challengeProgress: null,
    weeklyComparison: null,
    categoryBreakdown: null
  });
  const [summaryStats, setSummaryStats] = useState(null);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load all chart data in parallel with proper error handling
      const [habitTrends, challengeProgressData, weeklyComparison] = await Promise.allSettled([
        habitService.getCompletionTrends(timeRange),
        challengeService.getProgressHistory(),
        dayProgressService.getWeeklyComparison()
      ]);

      // Safe data extraction with fallbacks
      const safeHabitTrends = habitTrends.status === 'fulfilled' && habitTrends.value ? habitTrends.value : { dates: [], series: [] };
      const safeChallengeProgress = challengeProgressData.status === 'fulfilled' && challengeProgressData.value ? challengeProgressData.value : [];
      const safeWeeklyComparison = weeklyComparison.status === 'fulfilled' && weeklyComparison.value ? weeklyComparison.value : { currentWeek: [], previousWeek: [] };

      // Transform habit trends data for ApexCharts with validation
      const transformedHabitTrends = {
        dates: Array.isArray(safeHabitTrends.dates) ? safeHabitTrends.dates : [],
        series: Array.isArray(safeHabitTrends.series) ? safeHabitTrends.series.map(s => ({
          name: s?.name || 'Sin nombre',
          data: Array.isArray(s?.data) ? s.data : []
        })) : []
      };

      // Transform challenge progress data with validation
      const transformedChallengeProgress = {
        data: Array.isArray(safeChallengeProgress) ? safeChallengeProgress.map((progress, index) => ({
          x: `Día ${index + 1}`,
          y: progress?.completion || 0
        })) : []
      };

      // Transform weekly comparison data with validation
      const transformedWeeklyComparison = {
        series: [
          {
            name: 'Semana Actual',
            data: Array.isArray(safeWeeklyComparison.currentWeek) ? safeWeeklyComparison.currentWeek : []
          },
          {
            name: 'Semana Anterior',
            data: Array.isArray(safeWeeklyComparison.previousWeek) ? safeWeeklyComparison.previousWeek : []
          }
        ],
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      };

      // Create category breakdown data with validation
      const categories = habitService.getCategories() || [];
      const categoryBreakdown = {
        series: Array.isArray(categories) ? categories.map(() => Math.floor(Math.random() * 50) + 10) : [],
        labels: Array.isArray(categories) ? categories.map(c => c?.name || 'Sin categoría') : []
      };

      // Ensure all data structures are valid before setting state
      const validatedChartData = {
        habitTrends: transformedHabitTrends.series.length > 0 ? transformedHabitTrends : null,
        challengeProgress: transformedChallengeProgress.data.length > 0 ? transformedChallengeProgress : null,
        categoryBreakdown: categoryBreakdown.series.length > 0 ? categoryBreakdown : null,
        weeklyComparison: transformedWeeklyComparison.series.some(s => s.data.length > 0) ? transformedWeeklyComparison : null
      };

      setChartData(validatedChartData);

    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Error al cargar los datos de los gráficos');
      toast.error('Error al cargar los gráficos');
      
      // Set empty but valid chart data structure to prevent ApexCharts errors
      setChartData({
        habitTrends: null,
        challengeProgress: null,
        categoryBreakdown: null,
        weeklyComparison: null
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const getHabitTrendsOptions = () => ({
    chart: {
      id: 'habit-trends',
      toolbar: { show: false }
    },
    colors: ['#6B46C1', '#10B981', '#F59E0B', '#EF4444'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.habitTrends?.dates || [],
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' },
        formatter: (val) => `${val}%`
      }
    },
    legend: {
      position: 'top'
    },
    grid: {
      borderColor: '#F3F4F6'
    }
  });

  const getChallengeProgressOptions = () => ({
    chart: {
      id: 'challenge-progress',
      toolbar: { show: false }
    },
    colors: ['#10B981'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#059669'],
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.55
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.challengeProgress?.days || [],
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' },
        formatter: (val) => `${val}%`
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    },
    grid: {
      borderColor: '#F3F4F6'
    }
  });

  const getCategoryBreakdownOptions = () => ({
    chart: {
      id: 'category-breakdown'
    },
    colors: chartData.categoryBreakdown?.map(cat => cat.color) || ['#6B46C1', '#10B981', '#F59E0B', '#EF4444'],
    labels: chartData.categoryBreakdown?.map(cat => cat.name) || [],
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} hábitos completados`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    }
  });

  const getWeeklyComparisonOptions = () => ({
    chart: {
      id: 'weekly-comparison',
      toolbar: { show: false }
    },
    colors: ['#6B46C1', '#9CA3AF'],
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' },
        formatter: (val) => `${val}`
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} hábitos completados`
      }
    },
    legend: {
      position: 'top'
    },
    grid: {
      borderColor: '#F3F4F6'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%'
      }
    }
});

  if (loading) return <Loading message="Cargando gráficos de progreso..." />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Gráficos de Progreso
          </h1>
          <p className="text-gray-600 mt-1">
            Visualiza tu progreso con gráficos detallados y análisis de tendencias
          </p>
        </div>
        
        {/* Time Range Controls */}
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          {[
            { value: '7days', label: '7 días' },
            { value: '14days', label: '14 días' },
            { value: '21days', label: '21 días' }
          ].map(range => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleTimeRangeChange(range.value)}
              className="px-4 py-2 text-sm"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Weekly Summary Stats */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <ApperIcon name="Calendar" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Días Completados</p>
                <p className="text-2xl font-bold text-green-800">{summaryStats.completedDays}/7</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Promedio Semanal</p>
                <p className="text-2xl font-bold text-blue-800">{summaryStats.averageCompletion}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ApperIcon name="Trophy" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Mejor Hábito</p>
                <p className="text-lg font-bold text-purple-800">{summaryStats.bestHabit}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <ApperIcon name="Target" className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700 font-medium">Consistencia</p>
                <p className="text-lg font-bold text-amber-800">{summaryStats.consistencyLevel}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Habit Trends Chart */}
{/* Habit Trends Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
            Tendencias por Categoría
          </h3>
          {chartData.habitTrends?.series && Array.isArray(chartData.habitTrends.series) && chartData.habitTrends.series.length > 0 ? (
            <Chart
              options={getHabitTrendsOptions()}
              series={chartData.habitTrends.series}
              type="line"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <Loading message="Cargando tendencias..." />
            </div>
          )}

{/* Challenge Progress Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ApperIcon name="Target" className="w-5 h-5 text-secondary" />
            Progreso del Reto 21 Días
          </h3>
          {chartData.challengeProgress?.data && Array.isArray(chartData.challengeProgress.data) && chartData.challengeProgress.data.length > 0 ? (
            <Chart
              options={getChallengeProgressOptions()}
              series={[{
                name: 'Progreso del Reto',
                data: chartData.challengeProgress.data
              }]}
              type="area"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <Loading message="Cargando progreso del reto..." />
            </div>
          )}
        </Card>

        {/* Category Breakdown Chart */}
{/* Category Breakdown Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ApperIcon name="PieChart" className="w-5 h-5 text-accent" />
            Distribución por Categoría
          </h3>
          {chartData.categoryBreakdown?.series && Array.isArray(chartData.categoryBreakdown.series) && chartData.categoryBreakdown.series.length > 0 ? (
            <Chart
              options={getCategoryBreakdownOptions()}
              series={chartData.categoryBreakdown.series}
              type="donut"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <Loading message="Cargando distribución..." />
            </div>
          )}
        </Card>

        {/* Weekly Comparison Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ApperIcon name="BarChart3" className="w-5 h-5 text-success" />
            Comparación Semanal
          </h3>
          {chartData.weeklyComparison?.series && Array.isArray(chartData.weeklyComparison.series) && chartData.weeklyComparison.series.length > 0 ? (
            <Chart
              options={getWeeklyComparisonOptions()}
              series={chartData.weeklyComparison.series}
              type="bar"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <Loading message="Cargando comparación..." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ProgressCharts;