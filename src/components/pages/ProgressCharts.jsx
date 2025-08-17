import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import { habitService } from '@/services/api/habitService';
import { challengeService } from '@/services/api/challengeService';
import { dayProgressService } from '@/services/api/dayProgressService';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

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

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        habitTrends,
        challengeProgress,
        weeklyComparison,
        habits
      ] = await Promise.all([
        habitService.getCompletionTrends(timeRange),
        challengeService.getProgressTrends(),
        dayProgressService.getWeeklyComparison(),
        habitService.getAll()
      ]);

      // Process category breakdown
      const categories = {};
      habits.forEach(habit => {
        if (!categories[habit.category]) {
          categories[habit.category] = {
            name: habit.category,
            completed: 0,
            total: 0,
            color: habit.color
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

  // Chart configurations
  const getHabitTrendsOptions = () => ({
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: true },
      animations: { enabled: true }
    },
    colors: ['#6B46C1', '#10B981', '#EF4444', '#F59E0B'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: chartData.habitTrends?.dates || [],
      title: { text: 'Fecha' }
    },
    yaxis: {
      title: { text: 'Porcentaje de Completado (%)' },
      min: 0,
      max: 100
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
      borderColor: '#e0e6ed'
    }
  });

  const getChallengeProgressOptions = () => ({
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#6B46C1'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.challengeProgress?.days || [],
      title: { text: 'Día del Reto' }
    },
    yaxis: {
      title: { text: 'Progreso Acumulado (%)' },
      min: 0,
      max: 100
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    }
  });

  const getCategoryBreakdownOptions = () => ({
    chart: {
      type: 'donut',
      height: 300
    },
    colors: chartData.categoryBreakdown?.map(cat => cat.color) || [],
    labels: chartData.categoryBreakdown?.map(cat => cat.name) || [],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
                const total = chartData.categoryBreakdown?.reduce((sum, cat) => sum + cat.completed, 0) || 0;
                return `${total} hábitos`;
              }
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom'
    }
  });

  const getWeeklyComparisonOptions = () => ({
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#10B981', '#6B46C1'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      title: { text: 'Día de la Semana' }
    },
    yaxis: {
      title: { text: 'Hábitos Completados' }
    },
    legend: {
      position: 'top'
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

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="Activity" size={20} className="text-primary" />
          Resumen de Rendimiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {chartData.habitTrends?.averageCompletion || 78}%
            </div>
            <div className="text-sm text-gray-600">Promedio de Completado</div>
          </div>
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success mb-1">
              {chartData.challengeProgress?.bestDay || 12}
            </div>
            <div className="text-sm text-gray-600">Mejor Día</div>
          </div>
          <div className="text-center p-4 bg-warning/10 rounded-lg">
            <div className="text-2xl font-bold text-warning mb-1">
              {chartData.categoryBreakdown?.length || 5}
            </div>
            <div className="text-sm text-gray-600">Categorías Activas</div>
          </div>
          <div className="text-center p-4 bg-info/10 rounded-lg">
            <div className="text-2xl font-bold text-info mb-1">
              +{chartData.weeklyComparison?.improvement || 15}%
            </div>
            <div className="text-sm text-gray-600">Mejora Semanal</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProgressCharts;