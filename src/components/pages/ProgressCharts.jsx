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
const loadChartData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        habitTrends,
        challengeProgress,
        weeklyComparison,
        habits,
        weeklyStats
      ] = await Promise.all([
        habitService.getCompletionTrends(timeRange),
        challengeService.getProgressTrends(),
        dayProgressService.getWeeklyComparison(),
        habitService.getAll(),
        habitService.getWeeklyStats()
      ]);

      // Process category breakdown
      const categories = {};
      habits.forEach(habit => {
        if (!categories[habit.category]) {
          categories[habit.category] = {
            name: habit.category,
            completed: 0,
            total: 0,
            color: habit.color || '#6B46C1'
          };
        }
        categories[habit.category].total++;
        if (habit.isCompletedToday) {
          categories[habit.category].completed++;
        }
      });

      setChartData({
        habitTrends,
        challengeProgress,
        weeklyComparison,
        categoryBreakdown: Object.values(categories)
      });

      setSummaryStats(weeklyStats);

    } catch (err) {
      setError(err.message || 'Error al cargar los datos de progreso');
      toast.error('Error al cargar los gráficos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    toast.success(`Vista actualizada a ${range === '7days' ? '7 días' : range === '14days' ? '14 días' : '21 días'}`);
  };

  const getHabitTrendsOptions = () => ({
    chart: {
      id: 'habit-trends',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#6B46C1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
    stroke: {
      curve: 'smooth',
      width: 3
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
    tooltip: {
      y: {
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
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tendencias de Hábitos</h2>
          </div>
          {chartData.habitTrends ? (
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
        </Card>

        {/* Challenge Progress Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Target" className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Progreso del Reto</h2>
          </div>
          {chartData.challengeProgress ? (
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

        {/* Category Breakdown */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="PieChart" className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Distribución por Categorías</h2>
          </div>
          {chartData.categoryBreakdown ? (
            <Chart
              options={getCategoryBreakdownOptions()}
              series={chartData.categoryBreakdown.map(cat => Math.round((cat.completed / cat.total) * 100))}
              type="donut"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <Loading message="Cargando categorías..." />
            </div>
          )}
        </Card>

        {/* Weekly Comparison */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="BarChart3" className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Comparación Semanal</h2>
            {chartData.weeklyComparison?.improvement !== undefined && (
              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                chartData.weeklyComparison.improvement > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {chartData.weeklyComparison.improvement > 0 ? '+' : ''}{chartData.weeklyComparison.improvement}%
              </span>
            )}
          </div>
          {chartData.weeklyComparison ? (
            <Chart
              options={getWeeklyComparisonOptions()}
              series={[
                {
                  name: 'Esta Semana',
                  data: chartData.weeklyComparison.currentWeek
                },
                {
                  name: 'Semana Anterior',
                  data: chartData.weeklyComparison.previousWeek
                }
              ]}
              type="column"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <Loading message="Cargando comparación semanal..." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ProgressCharts;