export type WeightEntry = {
  date: string;
  weightKg: number;
};

export type WeightBackup = {
  exportedAt: string;
  entries: WeightEntry[];
};

export type WeightStats = {
  average: number | null;
  min: number | null;
  max: number | null;
  count: number;
};

export type BackupStatus = {
  configured: boolean;
  lastExportAt?: string;
};
