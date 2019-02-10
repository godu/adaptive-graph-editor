export type Slide = {
  universalRef: string;
  _id: string;
  discipline: string;
  module: string;
  chapter: string;
  question: any;
  klf: string;
  tips: string;
  lessons: any[];
};

export type ExitNode = {
  ref: string;
  type: 'success' | 'failure';
  title?: string;
  description?: string
}

export type NodeType = '' | 'slide' | 'exitNode';

export type Instruction = {
  value: number,
  type: 'set' | 'add',
  field: 'correctAnswers' | 'newStars'
};

export type Action = {
  scope: 'chapter',
  instructions: Instruction[]
};

export type Condition = {
  target: {
    scope: 'slides',
    ref: string,
    field: 'answers'
  },
  operator: 'EQUALS' | 'NOT_EQUALS',
  values: string[][]
} | {
  target: {
    scope: 'chapter',
    field: 'correctAnswers'
  },
  operator: 'EQUALS' | 'NOT_EQUALS',
  values: number[]
};

export type Rule = {
  ref: string;
  conditions: Condition[];
  actions: Action[];
  priority: number;
  source: {
    'type': NodeType;
    ref: string;
  };
  destination: {
    'type': NodeType;
    ref: string;
  };
};

export type ChapterRule = {
  ref: string,
  chapterRef: string,
  rules: Rule[]
}