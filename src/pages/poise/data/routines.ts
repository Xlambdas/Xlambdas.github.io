import type { Routine } from '../types/routine'

export const SEED_ROUTINES: Routine[] = [
  {
    "id": "morning-routine",
    "name": "Morning Routine",
    "category": "morning",
    "description": "Wake up the body. Gentle activation from head to toe.",
    "variants": [
      {
        "id": "micro",
        "label": "Micro",
        "durationMinutes": 3,
        "exercises": [
          {
            "exerciseId": "neck-circles",
            "order": 0,
            "type": "timed",
            "durationSeconds": 45
          },
          {
            "exerciseId": "shoulder-rolls",
            "order": 1,
            "type": "timed",
            "durationSeconds": 45
          },
          {
            "exerciseId": "spinal-rolls",
            "order": 2,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "wrist-preparation",
            "order": 3,
            "type": "timed",
            "durationSeconds": 30
          }
        ]
      },
      {
        "id": "short",
        "label": "Short",
        "durationMinutes": 7,
        "exercises": [
          {
            "exerciseId": "neck-circles",
            "order": 0,
            "type": "timed",
            "durationSeconds": 45
          },
          {
            "exerciseId": "shoulder-rolls",
            "order": 1,
            "type": "timed",
            "durationSeconds": 45
          },
          {
            "exerciseId": "spinal-rolls",
            "order": 2,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "wrist-preparation",
            "order": 3,
            "type": "timed",
            "durationSeconds": 120
          },
          {
            "exerciseId": "hip-90-90-stretch",
            "order": 4,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "push-up",
            "order": 5,
            "type": "reps",
            "reps": 10,
            "restSeconds": 30
          }
        ]
      },
      {
        "id": "normal",
        "label": "Normal",
        "durationMinutes": 12,
        "exercises": [
          {
            "exerciseId": "neck-circles",
            "order": 0,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "shoulder-rolls",
            "order": 1,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "spinal-rolls",
            "order": 2,
            "type": "timed",
            "durationSeconds": 90
          },
          {
            "exerciseId": "wrist-preparation",
            "order": 3,
            "type": "timed",
            "durationSeconds": 180
          },
          {
            "exerciseId": "hip-90-90-stretch",
            "order": 4,
            "type": "timed",
            "durationSeconds": 90
          },
          {
            "exerciseId": "push-up",
            "order": 5,
            "type": "reps",
            "reps": 15,
            "restSeconds": 45
          },
          {
            "exerciseId": "pull-up",
            "order": 6,
            "type": "reps",
            "reps": 5,
            "restSeconds": 60
          },
          {
            "exerciseId": "wall-handstand-hold",
            "order": 7,
            "type": "timed",
            "durationSeconds": 30,
            "restSeconds": 30
          }
        ]
      }
    ],
    "tags": [
      "morning",
      "daily",
      "activation"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "evening-routine",
    "name": "Evening Routine",
    "category": "evening",
    "description": "Tell the body it's time to slow down. Gentle release before sleep.",
    "variants": [
      {
        "id": "short",
        "label": "Short",
        "durationMinutes": 8,
        "exercises": [
          {
            "exerciseId": "neck-circles",
            "order": 0,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "shoulder-rolls",
            "order": 1,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "spinal-rolls",
            "order": 2,
            "type": "timed",
            "durationSeconds": 90
          },
          {
            "exerciseId": "hip-90-90-stretch",
            "order": 3,
            "type": "timed",
            "durationSeconds": 90
          }
        ]
      },
      {
        "id": "normal",
        "label": "Normal",
        "durationMinutes": 15,
        "exercises": [
          {
            "exerciseId": "neck-circles",
            "order": 0,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "shoulder-rolls",
            "order": 1,
            "type": "timed",
            "durationSeconds": 60
          },
          {
            "exerciseId": "spinal-rolls",
            "order": 2,
            "type": "timed",
            "durationSeconds": 120
          },
          {
            "exerciseId": "hip-90-90-stretch",
            "order": 3,
            "type": "timed",
            "durationSeconds": 120
          },
          {
            "exerciseId": "wrist-preparation",
            "order": 4,
            "type": "timed",
            "durationSeconds": 120
          },
          {
            "exerciseId": "hip-90-90-stretch",
            "order": 5,
            "type": "timed",
            "durationSeconds": 90,
            "notes": "Second pass — deeper hold, focus on breathing"
          }
        ]
      }
    ],
    "tags": [
      "evening",
      "daily",
      "recovery",
      "sleep"
    ],
    "isCustom": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
