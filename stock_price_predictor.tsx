import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, Calendar, DollarSign } from 'lucide-react';

const StockPricePredictor = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [predictionDays, setPredictionDays] = useState(30);
  const [selectedModel, setSelectedModel] = useState('sma');
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [metrics, setMetrics] = useState({});

  // Generate realistic stock data
  const generateStockData = (symbol, days = 365) => {
    const data = [];
    const startPrice = symbol === 'AAPL' ? 150 : symbol === 'GOOGL' ? 2500 : symbol === 'TSLA' ? 800 : 100;
    let price = startPrice;
    const volatility = symbol === 'TSLA' ? 0.03 : 0.02;
    const trend = symbol === 'AAPL' ? 0.0002 : symbol === 'GOOGL' ? 0.0001 : 0.0003;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Add trend and random walk
      const randomChange = (Math.random() - 0.5) * volatility * price;
      const trendChange = trend * price;
      price += randomChange + trendChange;
      
      // Add some market patterns
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 1) price *= 0.999; // Monday effect
      if (dayOfWeek === 5) price *= 1.001; // Friday effect
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(price, startPrice * 0.5), // Prevent negative prices
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    return data;
  };

  // Simple Moving Average
  const calculateSMA = (data, window = 20) => {
    const sma = [];
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((acc, curr) => acc + curr.price, 0);
      sma.push(sum / window);
    }
    return sma;
  };

  // Exponential Moving Average
  const calculateEMA = (data, period = 20) => {
    const multiplier = 2 / (period + 1);
    const ema = [data[0].price];
    
    for (let i = 1; i < data.length; i++) {
      ema.push((data[i].price * multiplier) + (ema[i - 1] * (1 - multiplier)));
    }
    return ema;
  };

  // Linear Regression
  const calculateLinearRegression = (data) => {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.price);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  };

  // ARIMA-like prediction (simplified)
  const calculateARIMA = (data, p = 2, d = 1, q = 2) => {
    // Simplified ARIMA implementation
    const prices = data.map(d => d.price);
    const diffs = [];
    
    // Differencing
    for (let i = 1; i < prices.length; i++) {
      diffs.push(prices[i] - prices[i - 1]);
    }
    
    // Simple autoregressive component
    const predictions = [];
    const recent = diffs.slice(-p);
    let prediction = recent.reduce((a, b) => a + b, 0) / recent.length;
    
    return prediction;
  };

  // Generate predictions based on selected model
  const generatePredictions = (data, model, days) => {
    const predictions = [];
    const lastPrice = data[data.length - 1].price;
    const lastDate = new Date(data[data.length - 1].date);
    
    for (let i = 1; i <= days; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      
      let predictedPrice;
      
      switch (model) {
        case 'sma':
          const sma = calculateSMA(data.slice(-20));
          predictedPrice = sma[sma.length - 1] * (1 + (Math.random() - 0.5) * 0.02);
          break;
          
        case 'ema':
          const ema = calculateEMA(data.slice(-20));
          predictedPrice = ema[ema.length - 1] * (1 + (Math.random() - 0.5) * 0.02);
          break;
          
        case 'linear':
          const { slope, intercept } = calculateLinearRegression(data.slice(-60));
          predictedPrice = slope * (data.length + i) + intercept;
          break;
          
        case 'arima':
          const arimaDiff = calculateARIMA(data.slice(-30));
          predictedPrice = lastPrice + arimaDiff * i * (1 + (Math.random() - 0.5) * 0.01);
          break;
          
        default:
          predictedPrice = lastPrice * (1 + (Math.random() - 0.5) * 0.02);
      }
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        price: Math.max(predictedPrice, lastPrice * 0.8),
        isPrediction: true
      });
    }
    
    return predictions;
  };

  // Calculate model metrics
  const calculateMetrics = (actual, predicted) => {
    const n = Math.min(actual.length, predicted.length);
    const actualSlice = actual.slice(-n).map(d => d.price);
    const predictedSlice = predicted.slice(0, n);
    
    // Mean Absolute Error
    const mae = actualSlice.reduce((acc, actual, i) => 
      acc + Math.abs(actual - predictedSlice[i]), 0) / n;
    
    // Root Mean Square Error
    const rmse = Math.sqrt(actualSlice.reduce((acc, actual, i) => 
      acc + Math.pow(actual - predictedSlice[i], 2), 0) / n);
    
    // Mean Absolute Percentage Error
    const mape = actualSlice.reduce((acc, actual, i) => 
      acc + Math.abs((actual - predictedSlice[i]) / actual), 0) / n * 100;
    
    return { mae: mae.toFixed(2), rmse: rmse.toFixed(2), mape: mape.toFixed(2) };
  };

  // Load data and generate predictions
  useEffect(() => {
    const data = generateStockData(selectedStock, 365);
    setHistoricalData(data);
    
    const pred = generatePredictions(data, selectedModel, predictionDays);
    setPredictions(pred);
    
    // Calculate metrics using last 30 days as test set
    const testData = data.slice(-30);
    const testPredictions = generatePredictions(data.slice(0, -30), selectedModel, 30);
    setMetrics(calculateMetrics(testData, testPredictions));
  }, [selectedStock, selectedModel, predictionDays]);

  // Combine historical and prediction data for chart
  const chartData = useMemo(() => {
    const combined = [...historicalData.slice(-90), ...predictions];
    return combined.map(item => ({
      ...item,
      date: item.date,
      actualPrice: item.isPrediction ? null : item.price,
      predictedPrice: item.isPrediction ? item.price : null
    }));
  }, [historicalData, predictions]);

  const currentPrice = historicalData[historicalData.length - 1]?.price || 0;
  const predictedPrice = predictions[predictions.length - 1]?.price || 0;
  const priceChange = predictedPrice - currentPrice;
  const priceChangePercent = (priceChange / currentPrice) * 100;

  const modelDescriptions = {
    sma: 'Simple Moving Average - Uses average of recent prices',
    ema: 'Exponential Moving Average - Gives more weight to recent prices',
    linear: 'Linear Regression - Fits a straight line through price data',
    arima: 'ARIMA Model - Autoregressive integrated moving average'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <TrendingUp className="text-green-400" />
            Stock Price Predictor
          </h1>
          <p className="text-slate-300 text-lg">AI-Powered Time Series Forecasting</p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Stock Symbol</label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="AAPL">Apple (AAPL)</option>
                <option value="GOOGL">Google (GOOGL)</option>
                <option value="TSLA">Tesla (TSLA)</option>
                <option value="MSFT">Microsoft (MSFT)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Prediction Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="sma">Simple Moving Average</option>
                <option value="ema">Exponential Moving Average</option>
                <option value="linear">Linear Regression</option>
                <option value="arima">ARIMA Model</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Prediction Days</label>
              <select
                value={predictionDays}
                onChange={(e) => setPredictionDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="w-full text-center">
                <div className="text-sm text-slate-300 mb-1">Current Price</div>
                <div className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-slate-300">{modelDescriptions[selectedModel]}</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-400" size={24} />
              <div>
                <p className="text-sm text-slate-300">Predicted Price</p>
                <p className="text-xl font-bold text-white">${predictedPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r ${priceChange >= 0 ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' : 'from-red-500/20 to-rose-500/20 border-red-500/30'} backdrop-blur-md rounded-xl p-4 border`}>
            <div className="flex items-center gap-3">
              {priceChange >= 0 ? <TrendingUp className="text-green-400" size={24} /> : <TrendingDown className="text-red-400" size={24} />}
              <div>
                <p className="text-sm text-slate-300">Price Change</p>
                <p className={`text-xl font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-400" size={24} />
              <div>
                <p className="text-sm text-slate-300">MAPE</p>
                <p className="text-xl font-bold text-white">{metrics.mape}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-purple-400" size={24} />
              <div>
                <p className="text-sm text-slate-300">RMSE</p>
                <p className="text-xl font-bold text-white">${metrics.rmse}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold text-white">Price Chart & Predictions</h2>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value, name) => [
                    `$${value?.toFixed(2)}`,
                    name === 'actualPrice' ? 'Actual Price' : 'Predicted Price'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actualPrice"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                  name="Historical Price"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predictedPrice"
                  stroke="#34d399"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Predicted Price"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Information */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Model Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-300">Mean Absolute Error</p>
              <p className="text-2xl font-bold text-white">${metrics.mae}</p>
              <p className="text-xs text-slate-400">Lower is better</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-300">Root Mean Square Error</p>
              <p className="text-2xl font-bold text-white">${metrics.rmse}</p>
              <p className="text-xs text-slate-400">Lower is better</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-300">Mean Absolute Percentage Error</p>
              <p className="text-2xl font-bold text-white">{metrics.mape}%</p>
              <p className="text-xs text-slate-400">Lower is better</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
          <p className="text-sm text-yellow-200 text-center">
            ⚠️ This is a demonstration tool using simulated data. Real stock predictions require extensive market data, advanced algorithms, and should not be used for actual trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockPricePredictor;