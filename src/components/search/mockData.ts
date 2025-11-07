export type DataResult = {
  task: string;
  caption: string;
  score: number;
  mp4: string;
  hdf5: string;
};

export const mockData: DataResult[] = [
  {
    task: 'throw_and_catch_ball',
    caption: 'Throw the green ball upward from the right hand while sitting at a wooden table, then catch it with the same hand.',
    score: 0.5264818997957553,
    mp4: 's3://asimov-ego-data/datasets/egodex/test/throw_and_catch_ball/13.mp4',
    hdf5: 's3://asimov-ego-data/datasets/egodex/test/throw_and_catch_ball/13.hdf5',
  },
  {
    task: 'throw_and_catch_ball',
    caption: 'Throw the green ball upward from the right hand while sitting at a wooden table.',
    score: 0.5273137076310086,
    mp4: 's3://asimov-ego-data/datasets/egodex/test/throw_and_catch_ball/7.mp4',
    hdf5: 's3://asimov-ego-data/datasets/egodex/test/throw_and_catch_ball/7.hdf5',
  },
  {
    task: 'roll_ball',
    caption: 'Roll the red ball across the green tablecloth while sitting against a white background.',
    score: 0.5337770839003191,
    mp4: 's3://asimov-ego-data/datasets/egodex/test/roll_ball/8.mp4',
    hdf5: 's3://asimov-ego-data/datasets/egodex/test/roll_ball/8.hdf5',
  },
  {
    task: 'roll_ball',
    caption: 'Roll the red ball across the green tablecloth while sitting against a white background.',
    score: 0.5337770839003191,
    mp4: 's3://asimov-ego-data/datasets/egodex/test/roll_ball/5.mp4',
    hdf5: 's3://asimov-ego-data/datasets/egodex/test/roll_ball/5.hdf5',
  },
  {
    task: 'roll_ball',
    caption: 'Roll the red ball across the green tablecloth while sitting against a white background.',
    score: 0.5337770839003191,
    mp4: 's3://asimov-ego-data/datasets/egodex/test/roll_ball/4.mp4',
    hdf5: 's3://asimov-ego-data/datasets/egodex/test/roll_ball/4.hdf5',
  },
];
