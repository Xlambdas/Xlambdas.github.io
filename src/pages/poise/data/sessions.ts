import type { Session } from '../types/session'

export const SEED_SESSIONS: Session[] = [
  {
    "id": "calisthenics-upper-a",
    "name": "Calisthenics Upper A",
    "category": "calisthenics",
    "estimatedDuration": 45,
    "difficulty": 3,
    "exercises": [
      {
        "exerciseId": "wrist-preparation",
        "order": 0,
        "block": "warm-up",
        "duration": 420
      },
      {
        "exerciseId": "wall-handstand-hold",
        "order": 1,
        "block": "skill",
        "sets": 5,
        "duration": 15,
        "rest": 60
      },
      {
        "exerciseId": "pull-up",
        "order": 2,
        "block": "pull",
        "sets": 3,
        "reps": 5,
        "rest": 120
      },
      {
        "exerciseId": "push-up",
        "order": 3,
        "block": "push",
        "sets": 3,
        "reps": 12,
        "rest": 90
      },
      {
        "exerciseId": "hip-90-90-stretch",
        "order": 4,
        "block": "cooldown",
        "sets": 2,
        "duration": 60,
        "rest": 30
      }
    ],
    "tags": [
      "bodyweight",
      "upper-body",
      "calisthenics"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "calisthenics-upper-b",
    "name": "Calisthenics Upper B",
    "category": "calisthenics",
    "estimatedDuration": 40,
    "difficulty": 3,
    "exercises": [
      {
        "exerciseId": "wrist-preparation",
        "order": 0,
        "block": "warm-up",
        "duration": 300
      },
      {
        "exerciseId": "wall-handstand-hold",
        "order": 1,
        "block": "skill",
        "sets": 4,
        "duration": 20,
        "rest": 60
      },
      {
        "exerciseId": "push-up",
        "order": 2,
        "block": "push",
        "sets": 4,
        "reps": 10,
        "rest": 90
      },
      {
        "exerciseId": "pull-up",
        "order": 3,
        "block": "pull",
        "sets": 3,
        "reps": 6,
        "rest": 120
      },
      {
        "exerciseId": "hip-90-90-stretch",
        "order": 4,
        "block": "cooldown",
        "sets": 1,
        "duration": 90
      }
    ],
    "tags": [
      "bodyweight",
      "upper-body",
      "calisthenics"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "calisthenics-lower",
    "name": "Calisthenics Lower",
    "category": "calisthenics",
    "estimatedDuration": 35,
    "difficulty": 2,
    "exercises": [
      {
        "exerciseId": "hip-90-90-stretch",
        "order": 0,
        "block": "warm-up",
        "sets": 1,
        "duration": 60
      },
      {
        "exerciseId": "bodyweight-squat",
        "order": 1,
        "block": "legs",
        "sets": 4,
        "reps": 15,
        "rest": 90
      },
      {
        "exerciseId": "glute-bridge",
        "order": 2,
        "block": "legs",
        "sets": 3,
        "reps": 15,
        "rest": 60
      },
      {
        "exerciseId": "spinal-rolls",
        "order": 3,
        "block": "cooldown",
        "duration": 60
      },
      {
        "exerciseId": "hip-90-90-stretch",
        "order": 4,
        "block": "cooldown",
        "sets": 2,
        "duration": 60
      }
    ],
    "tags": [
      "bodyweight",
      "lower-body",
      "calisthenics",
      "legs"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "calisthenics-full-body",
    "name": "Calisthenics Full Body",
    "category": "calisthenics",
    "estimatedDuration": 50,
    "difficulty": 3,
    "exercises": [
      {
        "exerciseId": "wrist-preparation",
        "order": 0,
        "block": "warm-up",
        "duration": 300
      },
      {
        "exerciseId": "wall-handstand-hold",
        "order": 1,
        "block": "skill",
        "sets": 3,
        "duration": 20,
        "rest": 60
      },
      {
        "exerciseId": "pull-up",
        "order": 2,
        "block": "pull",
        "sets": 3,
        "reps": 5,
        "rest": 120
      },
      {
        "exerciseId": "push-up",
        "order": 3,
        "block": "push",
        "sets": 3,
        "reps": 12,
        "rest": 90
      },
      {
        "exerciseId": "bodyweight-squat",
        "order": 4,
        "block": "legs",
        "sets": 3,
        "reps": 15,
        "rest": 90
      },
      {
        "exerciseId": "glute-bridge",
        "order": 5,
        "block": "legs",
        "sets": 2,
        "reps": 15,
        "rest": 60
      },
      {
        "exerciseId": "hip-90-90-stretch",
        "order": 6,
        "block": "cooldown",
        "sets": 2,
        "duration": 60
      }
    ],
    "tags": [
      "bodyweight",
      "full-body",
      "calisthenics"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "recovery-mobility",
    "name": "Recovery & Mobility",
    "category": "recovery",
    "estimatedDuration": 25,
    "difficulty": 1,
    "exercises": [
      {
        "exerciseId": "neck-circles",
        "order": 0,
        "block": "warm-up",
        "duration": 60
      },
      {
        "exerciseId": "shoulder-rolls",
        "order": 1,
        "block": "free",
        "duration": 60
      },
      {
        "exerciseId": "spinal-rolls",
        "order": 2,
        "block": "free",
        "duration": 90
      },
      {
        "exerciseId": "hip-90-90-stretch",
        "order": 3,
        "block": "cooldown",
        "sets": 2,
        "duration": 90
      },
      {
        "exerciseId": "wrist-preparation",
        "order": 4,
        "block": "cooldown",
        "duration": 120
      }
    ],
    "tags": [
      "mobility",
      "recovery",
      "full-body"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
