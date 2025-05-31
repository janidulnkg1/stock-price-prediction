# 📈 Stock Price Predictor

> **AI-Powered Time Series Forecasting Dashboard**

A comprehensive React-based application that demonstrates various time series forecasting techniques for stock price prediction. Built with modern web technologies and featuring an intuitive, interactive dashboard.

![Stock Price Predictor Dashboard](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🤖 Multiple Forecasting Models
- **Simple Moving Average (SMA)** - Average-based trend analysis
- **Exponential Moving Average (EMA)** - Weighted recent price emphasis
- **Linear Regression** - Statistical trend line fitting
- **ARIMA Model** - Autoregressive integrated moving average (simplified)

### 📊 Interactive Dashboard
- Real-time price visualization with Recharts
- Historical vs. predicted price comparison
- Interactive model selection and parameter tuning
- Responsive design for desktop and mobile

### 📈 Advanced Analytics
- **Performance Metrics**: MAE, RMSE, MAPE calculations
- **Trend Indicators**: Price change visualization with directional arrows
- **Backtesting**: Model validation using historical data splits
- **Multi-timeframe Analysis**: 7, 14, 30, and 60-day predictions

### 🎨 Modern UI/UX
- Glassmorphism design with backdrop blur effects
- Dark theme with gradient backgrounds
- Smooth animations and hover effects
- Professional financial dashboard aesthetics

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/janidulnkg1/stock-price-prediction.git

# Navigate to project directory
cd stock-price-prediction

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Serve production build locally (optional)
npm install -g serve
serve -s build
```

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | 18.0+ |
| **Recharts** | Data visualization | Latest |
| **Tailwind CSS** | Styling framework | Latest |
| **Lucide React** | Icon library | Latest |
| **JavaScript ES6+** | Core programming language | Latest |

## 📋 Usage Guide

### 1. Select Stock Symbol
Choose from available stock symbols (AAPL, GOOGL, TSLA, MSFT) to analyze different market behaviors.

### 2. Choose Prediction Model
Select from four different forecasting algorithms:
- **SMA**: Best for stable, trending markets
- **EMA**: Responsive to recent price changes
- **Linear**: Good for identifying long-term trends
- **ARIMA**: Advanced statistical modeling

### 3. Set Prediction Timeframe
Choose prediction horizon:
- 7 days: Short-term trading signals
- 14-30 days: Medium-term trend analysis
- 60 days: Long-term investment planning

### 4. Analyze Results
Review performance metrics and visualizations:
- **Price Chart**: Historical data + predictions
- **Metrics Panel**: Model accuracy indicators
- **Trend Analysis**: Price change predictions

## 🧮 Forecasting Models Explained

### Simple Moving Average (SMA)
```javascript
SMA = (P1 + P2 + ... + Pn) / n
```
Calculates the average price over a specified period. Smooth but slow to react to changes.

### Exponential Moving Average (EMA)
```javascript
EMA = (Price × Multiplier) + (Previous EMA × (1 - Multiplier))
Multiplier = 2 / (Period + 1)
```
Gives more weight to recent prices, making it more responsive to new information.

### Linear Regression
```javascript
y = mx + b
m = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)
```
Fits a straight line through price data to identify trends and project future values.

### ARIMA Model
Autoregressive Integrated Moving Average model that combines:
- **AR**: Autoregression (past values predict future)
- **I**: Integration (differencing to achieve stationarity)
- **MA**: Moving average (past forecast errors)

## 📊 Performance Metrics

### Mean Absolute Error (MAE)
```
MAE = Σ|Actual - Predicted| / n
```
Average absolute difference between predicted and actual values.

### Root Mean Square Error (RMSE)
```
RMSE = √(Σ(Actual - Predicted)² / n)
```
Penalizes larger errors more heavily than MAE.

### Mean Absolute Percentage Error (MAPE)
```
MAPE = (100/n) × Σ|((Actual - Predicted) / Actual)|
```
Percentage-based error metric for relative accuracy assessment.

## 🔧 Configuration

### Customizing Stock Data
Modify the `generateStockData` function to adjust:
- Initial stock prices
- Volatility parameters
- Market trend factors
- Seasonal patterns

### Adding New Models
Extend the forecasting capabilities:

```javascript
// Example: Add Bollinger Bands
const calculateBollingerBands = (data, period = 20, standardDeviations = 2) => {
  const sma = calculateSMA(data, period);
  const stdDev = calculateStandardDeviation(data, period);
  
  return {
    upper: sma + (stdDev * standardDeviations),
    middle: sma,
    lower: sma - (stdDev * standardDeviations)
  };
};
```

### Styling Customization
The project uses Tailwind CSS for styling. Modify themes in:
- Background gradients: `bg-gradient-to-br from-slate-900...`
- Card styles: `bg-white/10 backdrop-blur-md...`
- Color schemes: Adjust color classes for different themes

## 🚨 Important Disclaimers

⚠️ **Educational Purpose**: This application is designed for learning and demonstration purposes only.

⚠️ **Simulated Data**: Uses algorithmically generated stock data, not real market data.

⚠️ **Not Financial Advice**: Predictions should never be used for actual trading or investment decisions.

⚠️ **Model Limitations**: Simplified implementations may not capture all market complexities.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices and hooks patterns
- Use functional components with TypeScript where possible
- Maintain consistent code formatting with Prettier
- Add JSDoc comments for complex functions
- Include unit tests for new forecasting models

## 📝 Roadmap

### Phase 1: Core Features ✅
- [x] Multiple forecasting models
- [x] Interactive dashboard
- [x] Performance metrics
- [x] Responsive design

### Phase 2: Enhanced Analytics 🚧
- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Monte Carlo simulations
- [ ] Volatility modeling
- [ ] Risk assessment metrics

### Phase 3: Advanced Features 📋
- [ ] Real-time data integration (Alpha Vantage, Yahoo Finance)
- [ ] Machine learning models (LSTM, Prophet)
- [ ] Portfolio optimization
- [ ] Backtesting framework
- [ ] Export functionality (PDF reports, CSV data)

### Phase 4: Professional Tools 🔮
- [ ] Multi-asset correlation analysis
- [ ] Options pricing models
- [ ] Sentiment analysis integration
- [ ] API for model deployment

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/janidulnkg1/stock-price-prediction/issues)
- **Discussions**: [GitHub Discussions](https://github.com/janidulnkg1/stock-price-prediction/discussions)
- **Email**: janidulnkg1@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts** team for excellent React charting library
- **Tailwind CSS** for utility-first CSS framework
- **Lucide** for beautiful React icons
- **Financial modeling** community for algorithmic inspiration

## 📚 Additional Resources

### Learn More About Time Series Forecasting
- [Time Series Analysis with Python](https://www.python.org)
- [Introduction to Statistical Learning](https://www.statlearning.com)
- [Quantitative Finance with R](https://cran.r-project.org)

### Financial Data Sources
- [Alpha Vantage API](https://www.alphavantage.co)
- [Yahoo Finance API](https://finance.yahoo.com)
- [Quandl Financial Data](https://www.quandl.com)

---

<div align="center">

**Built with ❤️ by developers, for developers**

[⭐ Star this repo](https://github.com/janidulnkg1/stock-price-prediction
) • [🐛 Report Bug](https://github.com/janidulnkg1/stock-price-prediction/issues) • [💡 Request Feature](https://github.com/janidulnkg1/stock-price-prediction/issues)

</div>
