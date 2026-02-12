import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
// 引入 Design Tokens 以保持風格一致
import styles from '../styles/chart-theme.module.scss';

// --- 定義介面 ---

// 單一資料項目的結構
export interface PieChartItem {
  name: string; // 類別名稱 (例如: "照明", "空調")
  value: number; // 數值
}

// 設定檔結構
export interface PieChartConfig {
  title?: string; // 圖表標題
  isDonut?: boolean; // 是否為甜甜圈圖 (預設 false)
  unit?: string; // 單位 (顯示在 Tooltip)
  colors?: string[]; // 自定義配色盤 (可選)
  showLegend?: boolean; // 是否顯示圖例 (預設 true)
}

// React Component Props
interface PieChartProps {
  data: PieChartItem[];
  config?: PieChartConfig;
}

export const PieChart: React.FC<PieChartProps> = ({ data = [], config = {} }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 0. 準備預設配色盤 (使用 Design Tokens 加上一些互補色)
  const defaultPalette = useMemo(
    () => [
      styles.actualDemand || '#66ccff', // 藍
      styles.contractCapacity || '#ffcc00', // 黃
      '#52c41a', // 綠 (Active)
      '#f5222d', // 紅 (Fault)
      '#9a60b4', // 紫
      '#fa8c16', // 橘
      '#13c2c2', // 青
    ],
    [],
  );

  // 1. 初始化圖表 & 監聽視窗大小 (標準流程)
  useEffect(() => {
    if (!chartRef.current) return;

    // 這裡設定 dark 或 light 主題
    chartInstance.current = echarts.init(chartRef.current);

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
    };
  }, []);

  // 2. 當資料或設定改變時，更新圖表
  useEffect(() => {
    if (!chartInstance.current || !data) return;

    // 處理預設設定值
    const {
      title = '',
      isDonut = false, // 預設實心圓
      unit = '',
      colors = defaultPalette,
      showLegend = true,
    } = config;

    const bgColor = styles.bg || '#ffffff';
    const textColor = styles.text || '#595959';

    // 設定 ECharts 選項
    const option: echarts.EChartsOption = {
      backgroundColor: bgColor,
      color: colors, // 套用配色盤

      title: {
        text: title,
        left: 'center',
        top: 20,
        textStyle: { color: textColor, fontSize: 16, fontWeight: 600 },
      },

      // Tooltip 設定 (顯示數值與百分比)
      tooltip: {
        trigger: 'item',
        backgroundColor: bgColor,
        borderColor: bgColor,
        padding: [12, 16],
        textStyle: { color: textColor },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;',
        // 自定義 Tooltip 內容
        formatter: (params: any) => {
          const { name, value, color, percent } = params;
          return `
            <div style="min-width: 100px;">
               <div style="display: flex; align-items: center; margin-bottom: 6px; font-size: 13px; color: ${styles.axis || '#8c8c8c'};">
                 <span style="display:inline-block;margin-right:8px;border-radius:50%;width:8px;height:8px;background-color:${color};"></span>
                 ${name}
               </div>
               <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; font-size: 16px; color: #262626;">
                    ${value} <span style="font-size: 12px; font-weight: normal;">${unit}</span>
                  </span>
                  <span style="font-weight: 600; color: ${color}; margin-left: 12px;">
                    ${percent}%
                  </span>
               </div>
            </div>
          `;
        },
      },

      // 圖例設定
      legend: {
        show: showLegend,
        orient: 'horizontal',
        bottom: '20',
        icon: 'circle', // 圖例圖標形狀
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: textColor },
      },

      series: [
        {
          name: title || '數據分佈',
          type: 'pie',
          // [關鍵] 決定是實心圓還是甜甜圈
          // 實心: ['0%', '70%'], 甜甜圈: ['40%', '70%']
          radius: isDonut ? ['45%', '70%'] : ['0%', '70%'],
          center: ['50%', '50%'], // 居中

          // 圓角與邊框 (讓區塊間有縫隙，看起來更現代)
          itemStyle: {
            borderRadius: 4,
            borderColor: bgColor,
            borderWidth: 2,
          },

          // 標籤設定
          label: {
            show: true,
            position: 'outside', // 標籤在外部連接線
            formatter: '{b}\n{d}%', // 顯示: 名稱 換行 百分比
            color: textColor,
            fontSize: 12,
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            lineStyle: { color: styles.axis || '#ccc' },
          },

          // 滑鼠懸停效果
          emphasis: {
            scale: true,
            scaleSize: 10, // 放大尺寸
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },

          data: data, // 傳入資料
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [data, config, defaultPalette]); // 加入依賴項

  // 設定最小高度確保圖表顯示
  return <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: '350px' }} />;
};
