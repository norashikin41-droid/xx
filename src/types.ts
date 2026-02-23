
export enum Level {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  COMPLETED = 4
}

export interface Question {
  id: number;
  text: string;
  image?: string;
  answer: number;
  unit: string;
  hint?: string;
}

export interface UserData {
  name: string;
  matricNo: string;
}

export interface GameState {
  currentLevel: Level;
  currentQuestionIndex: number;
  score: number;
  points: number;
  baseHealth: number;
  upgrades: {
    walls: number;
    turrets: number;
  };
  history: {
    level: number;
    correct: number;
    total: number;
  }[];
}
