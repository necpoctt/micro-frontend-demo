// 改用 const 物件 + as const
export const CarStatus = {
  Disabled: 'disabled', // 停用
  Maintenance: 'maintenance', // 保養中
  Fault: 'fault', // 故障
  Active: 'active', // 可借用
  Reserved: 'reserved', // 已預約
  Rented: 'rented', // 出借中
} as const;

// 匯出型別，這樣你在其他地方也可以用 type CarStatus
export type CarStatus = (typeof CarStatus)[keyof typeof CarStatus];
