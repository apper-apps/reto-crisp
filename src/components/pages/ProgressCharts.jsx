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



if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadChartData} />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display text-gray-900">
            Progreso Visual
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de tu evolución en el reto
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[
            { value: '7days', label: '7 días' },
            { value: '14days', label: '14 días' },
            { value: '21days', label: '21 días' }
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={timeRange === value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

{/* Charts Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Completion Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">
                Tendencias de Hábitos
              </h3>
            </div>
          </div>
          {chartData.habitTrends ? (
            <Chart
              options={getHabitTrendsOptions()}
              series={chartData.habitTrends.series}
              type="line"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Datos de tendencias no disponibles</p>
              </div>
            </div>
          )}
        </Card>

        {/* Challenge Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="Target" size={20} className="text-success" />
              <h3 className="text-lg font-semibold text-gray-900">
                Progreso del Reto
              </h3>
            </div>
          </div>
          {chartData.challengeProgress ? (
            <Chart
              options={getChallengeProgressOptions()}
              series={[{
                name: 'Progreso',
                data: chartData.challengeProgress.data
              }]}
              type="area"
              height={300}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="Target" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Datos de progreso no disponibles</p>
              </div>
            </div>
          )}
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="PieChart" size={20} className="text-warning" />
              <h3 className="text-lg font-semibold text-gray-900">
                Hábitos por Categoría
              </h3>
            </div>
          </div>
          {chartData.categoryBreakdown && chartData.categoryBreakdown.length > 0 ? (
            <Chart
              options={getCategoryBreakdownOptions()}
              series={chartData.categoryBreakdown.map(cat => cat.completed)}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Sin datos de categorías</p>
              </div>
            </div>
          )}
        </Card>

        {/* Weekly Comparison */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} className="text-info" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comparación Semanal
              </h3>
            </div>
          </div>
          {chartData.weeklyComparison ? (
            <Chart
              options={getWeeklyComparisonOptions()}
              series={[
                {
                  name: 'Semana Actual',
                  data: chartData.weeklyComparison.currentWeek
                },
                {
                  name: 'Semana Anterior',
                  data: chartData.weeklyComparison.previousWeek
                }
              ]}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Datos de comparación no disponibles</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Summary Statistics */}
      {summaryStats && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="BarChart2" size={24} className="text-primary" />
            Resumen Semanal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {summaryStats.completedDays}
                </div>
                <div className="text-sm text-gray-600">Días Completados</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {summaryStats.averageCompletion}%
                </div>
                <div className="text-sm text-gray-600">Promedio de Cumplimiento</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">
                  {summaryStats.bestHabit}
                </div>
                <div className="text-sm text-gray-600">Mejor Hábito</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-info mb-1">
                  {summaryStats.consistencyLevel}
                </div>
                <div className="text-sm text-gray-600">Nivel de Consistencia</div>
              </div>
            </Card>
          </div>

          {chartData.weeklyComparison && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="TrendingUp" size={20} className="text-primary" />
                <h3 className="font-semibold text-gray-900">Mejora Semanal</h3>
              </div>
              <p className="text-gray-700">
                {chartData.weeklyComparison.improvement > 0 ? (
                  <span className="text-success font-medium">
                    ¡Excelente! Mejoraste un {chartData.weeklyComparison.improvement}% respecto a la semana anterior
                  </span>
                ) : chartData.weeklyComparison.improvement < 0 ? (
                  <span className="text-warning font-medium">
                    Bajaste un {Math.abs(chartData.weeklyComparison.improvement)}% respecto a la semana anterior. ¡Puedes mejorar!
                  </span>
                ) : (
                  <span className="text-info font-medium">
                    Te mantuviste igual que la semana anterior. ¡Sigue así!
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

</div>
  );
}

export default ProgressCharts;