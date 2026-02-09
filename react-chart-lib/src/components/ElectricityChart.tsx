import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from '../styles/chart-theme.module.scss';

// 定義傳入資料的型別
interface ChartData {
  time: string;
  power: number;
  temperature: number;
}

interface ChartConfig {
  contractCapacity: number;
}

interface ChartProps {
  data: ChartData[];
  config: ChartConfig;
}

export const ElectricityChart: React.FC<ChartProps> = ({ data, config }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 1. 初始化 ECharts 與 響應式監聽 (ResizeObserver)
  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化實例
    chartInstance.current = echarts.init(chartRef.current);

    // [關鍵修正] 使用 ResizeObserver 監聽容器大小變化
    // 這確保了當父層卡片變寬或變窄時，圖表會自動重繪
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    // 開始監聽 DOM 元素
    resizeObserver.observe(chartRef.current);

    // 清除函式
    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
    };
  }, []);

  // 2. 數據更新與圖表配置
  useEffect(() => {
    if (!chartInstance.current || !data) return;

    // 建立契約容量的數據陣列 (用於繪製黃色虛線)
    const capacityData = data.map(() => config.contractCapacity);

    const option: echarts.EChartsOption = {
      backgroundColor: '#fff',

      // [Tooltip] 懸浮卡片：白底、陰影、圓角
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#fff', // 無邊框顏色
        padding: [12, 16], // 內距加大
        textStyle: { color: '#595959', fontSize: 13 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;',

        // 十字準星設定
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#262626', // [截圖還原] 軸標籤背景色 (黑色)
            color: '#fff',
            padding: [4, 6],
            borderRadius: 2,
          },
          lineStyle: {
            color: '#bfbfbf',
            type: 'dashed',
          },
          crossStyle: {
            color: '#bfbfbf',
          },
        },
        // 自定義 HTML 內容
        formatter: (params: any) => {
          const date = params[0].axisValue;
          const powerParam = params.find((p: any) => p.seriesName === '實際需量');
          const capacityParam = params.find((p: any) => p.seriesName === '契約容量');

          const powerVal = powerParam ? powerParam.value : 0;
          const capacityVal = capacityParam ? capacityParam.value : config.contractCapacity;

          return `
            <div style="min-width: 150px; text-align: left;">
              <div style="margin-bottom: 8px; color: #8c8c8c; font-size: 12px;">${date}</div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="display: flex; align-items: center; font-size: 13px; color: #595959;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${styles.actualDemand}; margin-right: 8px;"></span>
                  實際需量
                </span>
                <span style="font-weight: 600; color: #262626;">${powerVal} kW</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; font-size: 13px; color: #595959;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${styles.contractCapacity}; margin-right: 8px;"></span>
                  契約容量
                </span>
                <span style="font-weight: 600; color: #262626;">${capacityVal} kW</span>
              </div>
            </div>
          `;
        },
      },

      // 圖例設定
      legend: {
        data: ['契約容量'], // 只顯示契約容量，或依需求加入 '實際需量'
        top: 0,
        icon: 'rect',
        itemWidth: 12,
        itemHeight: 3, // 扁平線條
        textStyle: { color: '#595959' },
      },

      // 版面配置
      grid: {
        top: 60,
        left: 20,
        right: 20,
        bottom: 20,
        containLabel: true,
      },

      // X 軸設定
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((d) => d.time),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#8c8c8c',
          interval: 'auto',
        },
        axisPointer: {
          label: { show: true }, // 顯示黑色時間標籤
        },
      },

      // Y 軸設定 (雙軸)
      yAxis: [
        {
          type: 'value',
          name: 'kW',
          position: 'left',
          nameTextStyle: { color: '#8c8c8c', align: 'left', padding: [0, 0, 0, -20] },
          axisLabel: { color: '#8c8c8c' },
          splitLine: {
            lineStyle: { type: 'dashed', color: '#f0f0f0' }, // 虛線格線
          },
          axisPointer: { label: { show: true } },
        },
        {
          type: 'value',
          name: '°C',
          position: 'right',
          nameTextStyle: { color: '#8c8c8c', align: 'right', padding: [0, -20, 0, 0] },
          axisLabel: { color: '#8c8c8c' },
          splitLine: { show: false },
        },
      ],

      // 數據序列
      series: [
        // 1. 契約容量 (黃色虛線)
        {
          name: '契約容量',
          type: 'line',
          symbol: 'none',
          data: capacityData,
          itemStyle: { color: '#ffcc00' },
          lineStyle: {
            width: 2,
            type: 'dashed', // 虛線
          },
          z: 10,
        },
        // 2. 實際需量 (藍色漸層)
        {
          name: '實際需量',
          type: 'line',
          yAxisIndex: 0,
          data: data.map((d) => d.power),
          symbol: 'none',
          smooth: true,
          itemStyle: { color: '#66ccff' },
          lineStyle: { width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(102, 204, 255, 0.4)' },
              { offset: 1, color: 'rgba(102, 204, 255, 0.05)' },
            ]),
          },
        },
        // 3. 溫度 (隱藏線條但保留右軸對應)
        {
          name: '溫度',
          type: 'line',
          yAxisIndex: 1,
          data: data.map((d) => d.temperature),
          symbol: 'none',
          smooth: true,
          itemStyle: { color: 'transparent' },
          lineStyle: { width: 0 },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [data, config]);

  // [響應式關鍵] 寬度必須設為 100%
  return <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: '350px' }} />;
};
