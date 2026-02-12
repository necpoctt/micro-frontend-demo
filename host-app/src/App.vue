<template>
  <div class="dashboard">
    <header class="header">
      <h1>資源管理儀表板</h1>
    </header>

    <main class="main-content">
      <section class="card">
        <div class="card-header">
          <h2>用電分析</h2>
        </div>
        <div class="chart-container">
          <remote-electricity-chart style="width: 100%; display: block;" :chart-data="JSON.stringify(mockChartData)"
            :config="JSON.stringify(chartConfig)"></remote-electricity-chart>
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <h2>車輛管理列表</h2>
        </div>
        <div class="table-container">
          <remote-vue-table style="width: 100%; display: block;" :table-data="JSON.stringify(mockTableData)"
            :status-config="JSON.stringify(statusConfig)" @row-action="handleRowAction"></remote-vue-table>
        </div>
      </section>

      <remote-pie-chart :chart-data="JSON.stringify(pieChartdata)"
        :config="JSON.stringify(pieChartConfig)"></remote-pie-chart>
    </main>
  </div>
</template>

<script setup lang="ts">
// --- 1. Design Tokens ---
const statusConfig = {
  disabled: { text: '停用', color: '#8c8c8c' },
  maintenance: { text: '保養中', color: '#1890ff' },
  fault: { text: '故障', color: '#f5222d' },
  active: { text: '可借用', color: '#52c41a' },
  reserved: { text: '已預約', color: '#1890ff' },
  rented: { text: '出借中', color: '#1890ff' }
};

const chartConfig = { contractCapacity: 400 };

// --- 2. Mock Data (14筆) ---
const baseData = [
  { key: '1', carNumber: 'RDC-0986', spec: 'Benz - GLA - 6人座', type: '管制車輛', status: 'disabled', mileage: '2,197', lastCheckMileage: '2,199', lastCheckTime: '2026/01/01 16:24', lastRefuel: '2025/12/31', lastReturn: '2025/12/31 17:38', lastForm: '2026/01/01 10:16', lastUser: '林益凡', nextMaint: '2026/03/15', lastMaint: '2025/12/15', manager: '游國維', quota: '30,000', insurance: '統一東京' },
  { key: '2', carNumber: 'BUA-0298', spec: 'Benz - GLA - 6人座', type: '管制車輛', status: 'maintenance', mileage: '2,197', lastCheckMileage: '2,199', lastCheckTime: '2026/01/01 16:24', lastRefuel: '2025/12/31', lastReturn: '2025/12/31 18:02', lastForm: '2026/01/01 10:16', lastUser: '羅艾拉', nextMaint: '2026/03/15', lastMaint: '2025/12/15', manager: '游國維', quota: '30,000', insurance: '統一東京' },
  { key: '3', carNumber: 'RDK-0835', spec: 'Benz - GLA - 6人座', type: '管制車輛', status: 'fault', mileage: '2,197', lastCheckMileage: '2,199', lastCheckTime: '2025/12/29 14:12', lastRefuel: '2025/12/28', lastReturn: '2025/12/28 16:24', lastForm: '2025/12/29 09:58', lastUser: '林艾米', nextMaint: '2025/12/15', lastMaint: '2025/09/15', manager: '游國維', quota: '30,000', insurance: '和運' },
  { key: '4', carNumber: 'RDC-6822', spec: 'Nissan - Kicks - 4人...', type: '通用車輛', status: 'active', mileage: '2,197', lastCheckMileage: '2,199', lastCheckTime: '2025/12/29 14:12', lastRefuel: '2025/12/28', lastReturn: '2025/12/28 16:24', lastForm: '2025/12/29 09:58', lastUser: '林益凡', nextMaint: '2025/12/15', lastMaint: '2025/09/15', manager: '游國維', quota: '30,000', insurance: '華南保險' },
  { key: '5', carNumber: 'RDT-7269', spec: 'Nissan - Sentra - ...', type: '通用車輛', status: 'reserved', mileage: '2,197', lastCheckMileage: '2,199', lastCheckTime: '2025/12/29 14:12', lastRefuel: '2025/12/28', lastReturn: '2025/12/28 16:24', lastForm: '2025/12/29 09:58', lastUser: '羅艾拉', nextMaint: '2025/12/15', lastMaint: '2025/09/15', manager: '游國維', quota: '30,000', insurance: '統一東京' },
  { key: '6', carNumber: 'RFC-3521', spec: 'TOYOTA - RAV4 - 6...', type: '通用車輛', status: 'rented', mileage: '2,197', lastCheckMileage: '2,199', lastCheckTime: '2025/12/29 14:12', lastRefuel: '2025/12/28', lastReturn: '2025/12/28 16:24', lastForm: '2025/12/29 09:58', lastUser: '羅艾拉', nextMaint: '2025/12/15', lastMaint: '2025/09/15', manager: '游國維', quota: '30,000', insurance: '和運' }
];

const mockTableData = [
  ...baseData,
  ...baseData.map((item, index) => ({ ...item, key: `${index + 7}`, carNumber: `${item.carNumber}-CPY` })).slice(0, 8)
];

// --- 3. Mock Chart Data (15分鐘間隔) ---
const mockChartData = [
  { time: '00:00', power: 130, temperature: 20 }, { time: '00:15', power: 135, temperature: 20 },
  { time: '00:30', power: 125, temperature: 20 }, { time: '00:45', power: 115, temperature: 19 },
  { time: '01:00', power: 110, temperature: 19 }, { time: '01:15', power: 130, temperature: 19 },
  { time: '01:30', power: 160, temperature: 20 }, { time: '01:45', power: 190, temperature: 21 },
  { time: '02:00', power: 200, temperature: 22 }, { time: '02:15', power: 240, temperature: 23 },
  { time: '02:30', power: 275, temperature: 24 }, { time: '02:45', power: 285, temperature: 25 },
  { time: '03:00', power: 260, temperature: 25 }, { time: '03:15', power: 200, temperature: 24 },
  { time: '03:30', power: 170, temperature: 23 }, { time: '03:45', power: 150, temperature: 22 },
  { time: '04:00', power: 135, temperature: 21 }, { time: '04:15', power: 140, temperature: 21 },
  { time: '04:30', power: 160, temperature: 22 }, { time: '04:45', power: 180, temperature: 23 },
  { time: '05:00', power: 190, temperature: 24 }, { time: '05:15', power: 205, temperature: 28 },
  { time: '05:30', power: 224, temperature: 31 }, { time: '05:45', power: 280, temperature: 32 },
  { time: '06:00', power: 340, temperature: 33 }
];

const handleRowAction = (event: Event) => {
  const { row, action } = (event as CustomEvent).detail;
  console.log(action, row);
};

const pieChartdata = [
  { name: '空調主機', value: 4500 },
  { name: '照明設備', value: 1200 },
  { name: '動力設備', value: 2800 },
  { name: '插座用電', value: 1500 },
];

const pieChartConfig = {
  title: '今日能耗分佈',
  unit: 'kWh',
};
</script>

<style lang="scss">
body {
  margin: 0;
  background-color: #f0f2f5;
  font-family: sans-serif;
}

.dashboard {
  /* [RWD 設定] 強制寬度 100% 且使用 border-box */
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;

  .header {
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .card {
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    /* [RWD 設定] 防止內部元件撐爆卡片 */
    width: 100%;
    overflow: hidden;

    .card-header {
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;

      h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .chart-container {
      padding: 24px;
      height: 400px;
      width: 100%;
      /* 確保容器寬度填滿 */
      box-sizing: border-box;
    }

    .table-container {
      padding: 0;
      width: 100%;
      /* [RWD 設定] 關鍵！讓表格內容過寬時可以捲動 */
      overflow-x: auto;
    }
  }
}

/* 手機版微調 */
@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }

  .card .chart-container {
    padding: 12px;
    height: 300px;
  }
}
</style>