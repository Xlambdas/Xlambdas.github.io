import type { Exercise } from '../types/exercise'

export const SEED_EXERCISES: Exercise[] = [
  {
    "id": "push-up",
    "name": "Push-up",
    "category": "strength",
    "type": "reps",
    "difficulty": 2,
    "targetAreas": [
      "chest",
      "shoulders",
      "arms",
      "core"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 3,
    "defaultReps": 12,
    "instructions": [
      "Start in a high plank with hands shoulder-width apart, fingers pointing forward.",
      "Brace your core and squeeze your glutes — your body should form a straight line from head to heels.",
      "Lower your chest toward the floor by bending your elbows at roughly 45° from your torso.",
      "Stop when your chest is 2–3 cm from the floor.",
      "Press the floor away to return to the starting position. Fully lock out your elbows at the top."
    ],
    "cues": [
      "Hollow body",
      "Elbows 45°",
      "Full lockout",
      "Neck neutral"
    ],
    "tags": [
      "bodyweight",
      "push",
      "upper-body",
      "foundational"
    ],
    "progressions": [
      "pike-push-up"
    ],
    "regressions": [],
    "isCustom": false
  },
  {
    "id": "pull-up",
    "name": "Pull-up",
    "category": "strength",
    "type": "reps",
    "difficulty": 3,
    "targetAreas": [
      "back",
      "arms",
      "core"
    ],
    "equipment": [
      "pull-up-bar"
    ],
    "defaultSets": 3,
    "defaultReps": 5,
    "instructions": [
      "Hang from the bar with an overhand grip, hands slightly wider than shoulder-width.",
      "Start from a dead hang — shoulders fully elevated, arms completely extended.",
      "Initiate the pull by depressing your scapulae (pull your shoulder blades down and back).",
      "Pull your elbows toward your hips until your chin clears the bar.",
      "Lower yourself with control back to a full dead hang."
    ],
    "cues": [
      "Dead hang start",
      "Scapula first",
      "Chest to bar",
      "Controlled descent"
    ],
    "tags": [
      "bodyweight",
      "pull",
      "upper-body",
      "foundational"
    ],
    "progressions": [],
    "regressions": [],
    "isCustom": false
  },
  {
    "id": "wall-handstand-hold",
    "name": "Wall Handstand Hold",
    "category": "skill",
    "type": "timed",
    "difficulty": 3,
    "targetAreas": [
      "shoulders",
      "arms",
      "core",
      "wrists"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 5,
    "duration": 15,
    "instructions": [
      "Stand facing the wall, about 30 cm away. Place your hands on the floor, shoulder-width apart.",
      "Walk your feet up the wall until your body is vertical. Aim for hips directly over shoulders over wrists.",
      "Engage your core, squeeze your legs together, and point your toes.",
      "Push actively through your shoulders — do not let them collapse.",
      "Hold the position, breathing steadily. Step down with control."
    ],
    "cues": [
      "Active shoulders",
      "Hollow body",
      "Push the floor",
      "Legs together"
    ],
    "tags": [
      "bodyweight",
      "inversion",
      "skill",
      "wrist-load"
    ],
    "contraindications": [
      "wrist pain"
    ],
    "progressions": [],
    "regressions": [],
    "isCustom": false
  },
  {
    "id": "wrist-preparation",
    "name": "Wrist Preparation",
    "category": "warmup",
    "type": "duration",
    "difficulty": 1,
    "targetAreas": [
      "wrists",
      "arms"
    ],
    "equipment": [
      "none"
    ],
    "duration": 420,
    "instructions": [
      "Start on all fours, wrists under shoulders.",
      "Slowly circle your wrists 10 times in each direction.",
      "Place fingertips facing backward, gently shift weight onto them — hold 10 s.",
      "Turn hands outward, fingers pointing to the sides — shift weight, hold 10 s.",
      "Press the backs of your hands to the floor, hold 10 s.",
      "Make fists, extend fingers wide, repeat 10 times.",
      "Finish with gentle wrist shakes to release tension."
    ],
    "cues": [
      "No pain — discomfort only",
      "Slow and deliberate",
      "Breathe through each position"
    ],
    "tags": [
      "wrist",
      "warmup",
      "prehab",
      "joint-prep"
    ],
    "isCustom": false
  },
  {
    "id": "hip-90-90-stretch",
    "name": "Hip 90/90 Stretch",
    "category": "mobility",
    "type": "timed",
    "difficulty": 1,
    "targetAreas": [
      "hips",
      "lower-body"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 2,
    "duration": 60,
    "instructions": [
      "Sit on the floor and position both legs at 90° — one shin in front, one to the side.",
      "Sit tall on both sit bones. Avoid leaning to one side.",
      "For the front leg: hinge forward at the hip, keeping your spine long.",
      "For the back leg: lean toward it to feel the hip flexor stretch.",
      "Hold each position for 30–60 seconds, then switch sides."
    ],
    "cues": [
      "Tall spine",
      "Hip hinge — not spinal flexion",
      "Both sit bones down",
      "Breathe into the stretch"
    ],
    "tags": [
      "mobility",
      "hips",
      "flexibility",
      "foundational"
    ],
    "isCustom": false
  },
  {
    "id": "spinal-rolls",
    "name": "Spinal Rolls",
    "category": "mobility",
    "type": "timed",
    "difficulty": 1,
    "targetAreas": [
      "spine",
      "back",
      "hips"
    ],
    "equipment": [
      "none"
    ],
    "duration": 60,
    "instructions": [
      "Stand with feet hip-width apart, knees soft.",
      "Tuck your chin to your chest and slowly roll down through the spine, one vertebra at a time.",
      "Let your arms hang heavy. Pause at the bottom for 2–3 breaths.",
      "Slowly roll back up, building the spine from the base, head coming up last.",
      "Repeat continuously and slowly for the full duration."
    ],
    "cues": [
      "One vertebra at a time",
      "Heavy arms",
      "Head last",
      "Breathe into the movement"
    ],
    "tags": [
      "spine",
      "mobility",
      "warmup",
      "morning"
    ],
    "isCustom": false
  },
  {
    "id": "shoulder-rolls",
    "name": "Shoulder Rolls",
    "category": "warmup",
    "type": "timed",
    "difficulty": 1,
    "targetAreas": [
      "shoulders",
      "upper-body"
    ],
    "equipment": [
      "none"
    ],
    "duration": 45,
    "instructions": [
      "Stand or sit tall, arms relaxed at your sides.",
      "Slowly roll both shoulders forward in large circles — up, forward, down, back.",
      "Complete 5 forward circles, then reverse for 5 backward circles.",
      "Breathe steadily. Let the movement become fluid and relaxed."
    ],
    "cues": [
      "Full range",
      "Relaxed arms",
      "Tall spine",
      "Slow and deliberate"
    ],
    "tags": [
      "shoulders",
      "warmup",
      "morning",
      "mobility"
    ],
    "isCustom": false
  },
  {
    "id": "neck-circles",
    "name": "Neck Circles",
    "category": "warmup",
    "type": "timed",
    "difficulty": 1,
    "targetAreas": [
      "spine",
      "shoulders"
    ],
    "equipment": [
      "none"
    ],
    "duration": 45,
    "instructions": [
      "Sit or stand tall. Drop your right ear toward your right shoulder.",
      "Slowly roll your chin toward your chest, then to the left side.",
      "Do NOT roll the head backward — keep circles to the front half only.",
      "Complete 3–4 slow half-circles in each direction."
    ],
    "cues": [
      "Front half only — no full circles",
      "Slow",
      "No pain",
      "Breathe"
    ],
    "tags": [
      "neck",
      "warmup",
      "morning",
      "mobility"
    ],
    "contraindications": [
      "neck injury"
    ],
    "isCustom": false
  },
  {
    "id": "bodyweight-squat",
    "name": "Bodyweight Squat",
    "category": "strength",
    "type": "reps",
    "difficulty": 1,
    "targetAreas": [
      "legs",
      "lower-body",
      "core"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 3,
    "defaultReps": 15,
    "instructions": [
      "Stand with feet shoulder-width apart, toes turned slightly out.",
      "Brace your core and keep your chest tall throughout.",
      "Push your knees out in line with your toes as you descend.",
      "Lower until thighs are parallel to the floor, or as deep as comfortable.",
      "Drive through your heels to return to standing. Fully extend hips at the top."
    ],
    "cues": [
      "Chest up",
      "Knees track toes",
      "Weight in heels",
      "Full hip extension"
    ],
    "tags": [
      "bodyweight",
      "legs",
      "lower-body",
      "foundational"
    ],
    "isCustom": false
  },
  {
    "id": "glute-bridge",
    "name": "Glute Bridge",
    "category": "strength",
    "type": "reps",
    "difficulty": 1,
    "targetAreas": [
      "hips",
      "lower-body",
      "core"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 3,
    "defaultReps": 15,
    "instructions": [
      "Lie on your back with knees bent, feet flat on the floor hip-width apart.",
      "Place arms at your sides, palms facing down.",
      "Squeeze your glutes and drive your hips toward the ceiling.",
      "At the top your body forms a straight line from shoulders to knees.",
      "Hold 1-2 seconds at the top, then lower with control."
    ],
    "cues": [
      "Squeeze glutes at top",
      "No hyperextension",
      "Feet flat",
      "Slow descent"
    ],
    "tags": [
      "bodyweight",
      "glutes",
      "lower-body",
      "foundational"
    ],
    "isCustom": false
  },
  {
    "id": "cahbusyegbctfiuh-p-soicrnfpozijr-1788509786201",
    "name": "cahbusyegbctfiuh<p soicrnfpozijr",
    "category": "strength",
    "type": "reps",
    "difficulty": 3,
    "targetAreas": [
      "legs",
      "shoulders"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 3,
    "defaultReps": 10,
    "instructions": [],
    "cues": [],
    "tags": [
      "ze'sfzES"
    ],
    "contraindications": [
      "z'ef"
    ],
    "notes": "eqsrvgf",
    "isCustom": false
  },
  {
    "id": "testtest-custom-1788510076720",
    "name": "testtest - custom",
    "category": "strength",
    "type": "timed",
    "difficulty": 4,
    "targetAreas": [
      "back",
      "ankles"
    ],
    "equipment": [
      "none",
      "parallettes"
    ],
    "defaultSets": 3,
    "duration": 30,
    "instructions": [],
    "cues": [],
    "tags": [],
    "isCustom": false
  },
  {
    "id": "testtets-custom-1788510343837",
    "name": "testtets - custom",
    "category": "strength",
    "type": "reps",
    "difficulty": 3,
    "targetAreas": [
      "ankles"
    ],
    "equipment": [
      "none"
    ],
    "defaultSets": 3,
    "defaultReps": 10,
    "instructions": [],
    "cues": [],
    "tags": [],
    "isCustom": false
  }
]
