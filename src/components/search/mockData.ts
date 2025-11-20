export type DataResult = {
  task: string;
  description: string;
  score: number;
  mp4: string;
  hdf5: string;
  search_type: "semantic" | "keyword" | "hybrid";
};

export type GroupedDataResult = {
  task: string;
  description: string;
  avgScore: number;
  files: Array<{
    mp4: string;
    hdf5: string;
    score: number;
  }>;
};