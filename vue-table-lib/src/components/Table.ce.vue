<template>
  <div class="table-wrapper">
    <a-table :columns="columns" :data-source="parsedTableData" :pagination="paginationConfig" class="custom-ant-table"
      row-key="key" :scroll="{ x: 1200 }" :row-selection="{ type: 'checkbox' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <div class="status-cell" :class="record.status">
            <span class="status-dot"></span>
            <span class="status-text">
              {{ getStatus(record.status).text }}
            </span>
          </div>
        </template>

        <template v-else-if="['lastCheckMileage', 'nextMaint', 'lastMaint'].includes(column.key)">
          <div class="link-cell">
            <link-outlined class="link-icon" />
            <span>{{ record[column.key] }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="action-buttons">
            <eye-outlined class="action-icon" @click="handleAction(record, 'view')" />
            <edit-outlined class="action-icon" @click="handleAction(record, 'edit')" />
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Table as ATable } from 'ant-design-vue';
import { EyeOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { CarStatus } from '../enum'; // [修正] 從外部檔案引入
const props = defineProps<{
  tableData: string | any[];
  statusConfig: string | object;
}>();
const emit = defineEmits(['row-action']);


type StatusConfig = Record<CarStatus, { text: string; }> & {
  [key: string]: { text: string } | undefined;
};


// 使用 Enum 作為 Key
const statusConfig: StatusConfig = {
  [CarStatus.Disabled]: { text: '停用', },
  [CarStatus.Maintenance]: { text: '保養中' },
  [CarStatus.Fault]: { text: '故障' },
  [CarStatus.Active]: { text: '可借用', },
  [CarStatus.Reserved]: { text: '已預約' },
  [CarStatus.Rented]: { text: '出借中' }
};

// 這樣如果狀態不存在 (例如後端傳了新狀態)，可以給一個預設值，避免畫面壞掉
const getStatus = (statusKey: string) => {
  const config = statusConfig[statusKey];
  // 回傳 Config 或 預設值 (黑色/無背景)
  return config || { text: statusKey };
};


const parsedTableData = computed(() => {
  return typeof props.tableData === 'string' ? JSON.parse(props.tableData) : props.tableData;
});

// 分頁設定：保留中文文案，位置設為 bottomRight
const paginationConfig = computed(() => ({
  showTotal: (total: number) => `共 ${total} 筆資料`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40'],
  showQuickJumper: true,
  defaultPageSize: 10,
  position: ['bottomRight' as const], // 標準右下角
  size: 'small' as const,
  locale: {
    items_per_page: ' 條/頁',
    jump_to: '跳頁',
    page: '',
  }
}));


const handleAction = (row: any, action: string) => {
  emit('row-action', { row, action });
};

const columns = [
  { title: '車號', dataIndex: 'carNumber', key: 'carNumber', width: 100, fixed: 'left' as const },
  { title: '規格', dataIndex: 'spec', key: 'spec', width: 150 },
  { title: '車輛種類', dataIndex: 'type', key: 'type', width: 100 },
  { title: '狀態', dataIndex: 'status', key: 'status', width: 100 },
  { title: '現行里程數', dataIndex: 'mileage', key: 'mileage', width: 100 },
  { title: '最近檢查里程', dataIndex: 'lastCheckMileage', key: 'lastCheckMileage', width: 130 },
  { title: '最近檢查時間', dataIndex: 'lastCheckTime', key: 'lastCheckTime', width: 150 },
  { title: '上次加油日期', dataIndex: 'lastRefuel', key: 'lastRefuel', width: 120 },
  { title: '最近歸還時間', dataIndex: 'lastReturn', key: 'lastReturn', width: 150 },
  { title: '最近填單時間', dataIndex: 'lastForm', key: 'lastForm', width: 150 },
  { title: '最近使用人員', dataIndex: 'lastUser', key: 'lastUser', width: 120 },
  { title: '下次保養日期', dataIndex: 'nextMaint', key: 'nextMaint', width: 130 },
  { title: '上次保養日期', dataIndex: 'lastMaint', key: 'lastMaint', width: 130 },
  { title: '車輛管理人', dataIndex: 'manager', key: 'manager', width: 100 },
  { title: '年約定量程數', dataIndex: 'quota', key: 'quota', width: 120 },
  { title: '保險公司', dataIndex: 'insurance', key: 'insurance', width: 120 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const, align: 'center' as const }
];
</script>

<style lang="scss">
@import 'ant-design-vue/dist/antd.css';

.table-wrapper {
  background: #fff;
  width: 100%;
}

.custom-ant-table {

  /* 表頭與內容樣式 */
  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa !important;
    font-weight: 600;
    color: #595959;
    font-size: 13px;
    padding: 10px 16px;
    white-space: nowrap;
  }

  :deep(.ant-table-tbody > tr > td) {
    font-size: 13px;
    padding: 8px 16px;
    color: #262626;
  }

  /* ========================================================= */
  /* [標準版] 分頁樣式：右下角對齊，移除所有強制定位 */
  /* ========================================================= */
  :deep(.ant-table-pagination.ant-pagination) {
    margin: 16px 0 !important;
    /* 這裡不需要特別寫 display: flex，AntD 預設就會處理得很好 */
    /* 如果需要微調間距，可以在這裡加 */

    .ant-pagination-total-text {
      margin-right: 12px !important;
      /* 總筆數與頁碼的間距 */
    }

    .ant-pagination-options {
      margin-left: 16px !important;
      /* 頁碼與設定選項的間距 */
    }
  }

  /* ========================================================= */

  .disabled {
    background-color: $status-disabled-bg;

    .status-dot {
      background-color: $status-disabled-text;
    }

    .status-text {
      color: $status-disabled-text;
    }
  }

  .maintenance {
    background-color: $status-maintenance-bg;

    .status-dot {
      background-color: $status-maintenance-text;
    }

    .status-text {
      color: $status-maintenance-text;
    }
  }

  .fault {
    background-color: $status-fault-bg;

    .status-dot {
      background-color: $status-fault-text;
    }

    .status-text {
      color: $status-fault-text;
    }
  }

  .active {
    background-color: $status-active-bg;

    .status-dot {
      background-color: $status-active-text;
    }

    .status-text {
      color: $status-active-text;
    }
  }

  .reserved {
    background-color: $status-reserved-bg;

    .status-dot {
      background-color: $status-reserved-text;
    }

    .status-text {
      color: $status-reserved-text;
    }
  }

  .rented {
    background-color: $status-reserved-bg;

    .status-dot {
      background-color: $status-reserved-text;
    }

    .status-text {
      color: $status-reserved-text;
    }
  }

  /* 狀態與圖示 */
  .status-cell {
    display: flex;
    align-items: center;
    gap: 6px;

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-text {
      font-weight: 500;
    }



  }

  .link-cell {
    display: flex;
    align-items: center;
    gap: 4px;

    .link-icon {
      color: #1890ff;
      font-size: 12px;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;

    .action-icon {
      font-size: 16px;
      color: #bfbfbf;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>