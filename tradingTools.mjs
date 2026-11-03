/**
 * tradingTools.mjs
 * Khakhapkhun AI - Tools for Mode 2: Trading Gold and Coin (Blockchain)
 */

/**
 * 1. Tính toán Quản lý vốn và Khối lượng vào lệnh (Position Size Calculator)
 * Giúp trader tuân thủ quy tắc quản trị rủi ro nghiêm ngặt (chỉ chịu lỗ tối đa 1-2% tài khoản/lệnh).
 */
export async function calculatePositionSize({
  accountBalance = 1000,
  riskPercentage = 1,
  entryPrice,
  stopLossPrice,
  assetType = "CRYPTO" // "CRYPTO", "GOLD", "FOREX"
}) {
  const balance = Number(accountBalance);
  const riskPct = Number(riskPercentage);
  const entry = Number(entryPrice);
  const sl = Number(stopLossPrice);

  if (!entry || !sl || entry === sl) {
    return JSON.stringify({
      error: "Giá Entry và Stop-Loss phải là số hợp lệ và khác nhau."
    });
  }

  const riskAmount = (balance * riskPct) / 100;
  const priceDistance = Math.abs(entry - sl);
  const percentDistance = (priceDistance / entry) * 100;
  const isLong = entry > sl;

  let positionSize = 0;
  let contractNote = "";

  if (assetType.toUpperCase() === "GOLD") {
    // Với Vàng (XAU/USD): 1 Standard Lot = 100 Ounces. Mỗi giá $1 di chuyển trên 1 lot = $100.
    // Khoảng cách theo USD = priceDistance
    const riskPerLot = priceDistance * 100;
    const lots = riskPerLot > 0 ? (riskAmount / riskPerLot) : 0;
    positionSize = Number(lots.toFixed(2));
    contractNote = `${positionSize} Standard Lots (hoặc ${(positionSize * 10).toFixed(2)} Mini Lots / ${(positionSize * 100).toFixed(2)} Micro Lots)`;
  } else {
    // Với Crypto hoặc tài sản giao ngay: Vị thế = Tiền chấp nhận rủi ro / Khoảng cách giá
    positionSize = Number((riskAmount / priceDistance).toFixed(6));
    const positionValueUSD = Number((positionSize * entry).toFixed(2));
    const leverageRequired = balance > 0 ? Number((positionValueUSD / balance).toFixed(2)) : 1;
    contractNote = `${positionSize} đơn vị coin (Tổng giá trị vị thế: $${positionValueUSD.toLocaleString()}, đòn bẩy tương đương: ${leverageRequired}x)`;
  }

  return JSON.stringify({
    status: "SUCCESS",
    assetType,
    orderDirection: isLong ? "LONG (MUA)" : "SHORT (BÁN)",
    accountBalance: `$${balance.toLocaleString()}`,
    riskConfig: {
      riskPercent: `${riskPct}%`,
      maxLossAmount: `$${riskAmount.toFixed(2)} USD`
    },
    tradeLevels: {
      entryPrice: `$${entry}`,
      stopLossPrice: `$${sl}`,
      stopLossDistance: `$${priceDistance.toFixed(2)} (${percentDistance.toFixed(2)}%)`
    },
    recommendation: {
      calculatedPosition: contractNote,
      rule: "TUÂN THỦ KỶ LUẬT: Luôn đặt Stop-Loss trước khi vào lệnh. Tuyệt đối không dời Stop-Loss xa hơn khi giá đi ngược hướng!"
    }
  });
}

/**
 * 2. Phân tích Tỷ lệ Lời/Lỗ (Risk to Reward Ratio - R:R)
 */
export async function analyzeRiskReward({
  entryPrice,
  stopLossPrice,
  takeProfitPrice
}) {
  const entry = Number(entryPrice);
  const sl = Number(stopLossPrice);
  const tp = Number(takeProfitPrice);

  if (!entry || !sl || !tp) {
    return JSON.stringify({ error: "Cần cung cấp đủ 3 mức giá: Entry, Stop-Loss và Take-Profit." });
  }

  const isLong = entry > sl;
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp - entry);

  if (isLong && tp <= entry) {
    return JSON.stringify({ error: "Lệnh Long yêu cầu Take-Profit phải cao hơn giá Entry." });
  }
  if (!isLong && tp >= entry) {
    return JSON.stringify({ error: "Lệnh Short yêu cầu Take-Profit phải thấp hơn giá Entry." });
  }

  const rrRatio = Number((reward / risk).toFixed(2));
  let assessment = "";
  if (rrRatio < 1.5) {
    assessment = "⚠️ R:R < 1:1.5 - KÈM RỦI RO CAO: Tỷ lệ lời/lỗ không tối ưu theo nguyên tắc quản trị rủi ro chuyên nghiệp. Hãy cân nhắc điểm vào lệnh tốt hơn hoặc bỏ qua kèo.";
  } else if (rrRatio >= 1.5 && rrRatio < 2.5) {
    assessment = "✅ R:R TỐT (1:1.5 - 1:2.5): Tỷ lệ chuẩn cho Day-trading / Swing-trading. Phù hợp khi có xác nhận nến hoặc mô hình giá uy tín.";
  } else {
    assessment = "🌟 R:R RẤT CAO (>= 1:2.5+): Kèo tiềm năng cao. Có thể chia Take-Profit thành nhiều phần (TP1, TP2, TP3) và dời Stop-Loss về Breakeven (hòa vốn) sau khi đạt TP1.";
  }

  return JSON.stringify({
    status: "SUCCESS",
    direction: isLong ? "LONG" : "SHORT",
    entryPrice: entry,
    stopLossPrice: sl,
    takeProfitPrice: tp,
    riskDistance: Number(risk.toFixed(2)),
    rewardDistance: Number(reward.toFixed(2)),
    rrRatio: `1 : ${rrRatio}`,
    assessment
  });
}

/**
 * 3. Tính toán các mốc thoái lui Fibonacci (Fibonacci Retracement & Extension)
 */
export async function calculateFibonacciLevels({
  highPrice,
  lowPrice,
  trend = "UP" // "UP" hoặc "DOWN"
}) {
  const high = Number(highPrice);
  const low = Number(lowPrice);

  if (!high || !low || high <= low) {
    return JSON.stringify({ error: "highPrice phải lớn hơn lowPrice hợp lệ." });
  }

  const diff = high - low;
  const isUp = trend.toUpperCase() === "UP";

  // Các mốc Fibonacci Retracement tiêu chuẩn
  const fibDefs = [
    { ratio: 0.236, key: "Fib_23.6%" },
    { ratio: 0.382, key: "Fib_38.2%" },
    { ratio: 0.5, key: "Fib_50.0%" },
    { ratio: 0.618, key: "Fib_61.8%" },
    { ratio: 0.786, key: "Fib_78.6%" }
  ];
  const retracementLevels = {};

  for (const { ratio, key } of fibDefs) {
    const levelPrice = isUp
      ? high - diff * ratio
      : low + diff * ratio;
    retracementLevels[key] = Number(levelPrice.toFixed(2));
  }

  // Mốc mở rộng (Extension) cho mục tiêu lợi nhuận (Take-Profit)
  const extensionRatios = [1.272, 1.618, 2.0];
  const extensionLevels = {};
  for (const ext of extensionRatios) {
    const extPrice = isUp
      ? high + diff * (ext - 1)
      : low - diff * (ext - 1);
    extensionLevels[`Fib_Extension_${ext}`] = Number(extPrice.toFixed(2));
  }

  return JSON.stringify({
    status: "SUCCESS",
    trend: isUp ? "XU HƯỚNG TĂNG (Tìm điểm hồi để Buy/Long)" : "XU HƯỚNG GIẢM (Tìm điểm hồi để Sell/Short)",
    range: { highPrice: high, lowPrice: low, difference: Number(diff.toFixed(2)) },
    goldenPocket: {
      range: `${retracementLevels["Fib_61.8%"]} - ${retracementLevels["Fib_78.6%"]}`,
      note: "Vùng Golden Pocket (Fib 0.618 - 0.786) là vùng phản ứng giá có xác suất đảo chiều cao nhất."
    },
    retracementLevels,
    extensionTargets: extensionLevels
  });
}

/**
 * 4. Tra cứu tổng quan thị trường Crypto (BTC, ETH, SOL, BNB, etc.)
 * Sử dụng public API CoinGecko hoặc Binance ticker, kèm fallback an toàn.
 */
export async function getCryptoMarketOverview({ symbols = "BTC,ETH,SOL,BNB,XRP" } = {}) {
  const symbolList = symbols.toUpperCase().split(",").map(s => s.trim());
  const results = [];

  try {
    // Thử truy vấn Binance 24hr ticker public endpoint
    const res = await fetch("https://api.binance.com/api/v3/ticker/24hr", {
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      const tickerMap = new Map();
      for (const item of data) {
        tickerMap.set(item.symbol, item);
      }

      for (const sym of symbolList) {
        const usdtPair = `${sym}USDT`;
        const item = tickerMap.get(usdtPair);
        if (item) {
          results.push({
            symbol: sym,
            pair: usdtPair,
            lastPrice: `$${Number(item.lastPrice).toLocaleString()}`,
            priceChangePercent24h: `${Number(item.priceChangePercent) >= 0 ? "+" : ""}${item.priceChangePercent}%`,
            highPrice24h: `$${Number(item.highPrice).toLocaleString()}`,
            lowPrice24h: `$${Number(item.lowPrice).toLocaleString()}`,
            volumeQuoteUSD: `$${(Number(item.quoteVolume) / 1e6).toFixed(2)}M`
          });
        }
      }
    }
  } catch {
    // Fallback nếu không có internet ngoài sandbox
  }

  if (results.length === 0) {
    // Trả về dữ liệu tham khảo và giải thích cơ chế
    return JSON.stringify({
      status: "REFERENCE_MODE",
      note: "Dữ liệu thị trường thời gian thực có thể được cập nhật qua công cụ searchWeb hoặc API ngoài. Dưới đây là cấu trúc theo dõi trọng tâm:",
      trackedAssets: symbolList,
      keyMarketIndicators: [
        { indicator: "BTC Dominance (BTC.D)", role: "Đo lường thị phần của Bitcoin so với Altcoin để xác định mùa Altcoin." },
        { indicator: "Crypto Fear & Greed Index", role: "Chỉ số tâm lý Sợ hãi & Tham lam (0: Cực kỳ sợ hãi, 100: Cực kỳ tham lam)." },
        { indicator: "USDT / Stablecoin Supply", role: "Lượng thanh khoản sẵn sàng bơm vào thị trường." },
        { indicator: "XAU/USD (Gold) vs DXY", role: "Vàng thường có tương quan nghịch với chỉ số đồng USD (DXY) và lãi suất trái phiếu Mỹ." }
      ]
    });
  }

  return JSON.stringify({
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    tickers: results
  });
}
