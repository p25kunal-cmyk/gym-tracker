// FitForge Exercise Database — 120+ exercises across 8 categories
const EXERCISES = {
  'Chest': [
    { name: 'Barbell Bench Press', equipment: 'Barbell', type: 'Compound' },
    { name: 'Incline Barbell Press', equipment: 'Barbell', type: 'Compound' },
    { name: 'Decline Barbell Press', equipment: 'Barbell', type: 'Compound' },
    { name: 'Dumbbell Chest Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Incline Dumbbell Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Decline Dumbbell Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Dumbbell Flyes', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Incline Dumbbell Flyes', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Cable Crossover', equipment: 'Cable', type: 'Isolation' },
    { name: 'Low to High Cable Fly', equipment: 'Cable', type: 'Isolation' },
    { name: 'Chest Dips', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Push-ups', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Wide Push-ups', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Pec Deck', equipment: 'Machine', type: 'Isolation' },
    { name: 'Chest Press Machine', equipment: 'Machine', type: 'Compound' },
    { name: 'Svend Press', equipment: 'Plate', type: 'Isolation' },
  ],
  'Back': [
    { name: 'Conventional Deadlift', equipment: 'Barbell', type: 'Compound' },
    { name: 'Barbell Bent-Over Row', equipment: 'Barbell', type: 'Compound' },
    { name: 'T-Bar Row', equipment: 'Barbell', type: 'Compound' },
    { name: 'Pull-ups', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Chin-ups', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Lat Pulldown', equipment: 'Cable', type: 'Compound' },
    { name: 'Seated Cable Row', equipment: 'Cable', type: 'Compound' },
    { name: 'Single Arm Dumbbell Row', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Chest Supported Row', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Face Pulls', equipment: 'Cable', type: 'Isolation' },
    { name: 'Straight Arm Pulldown', equipment: 'Cable', type: 'Isolation' },
    { name: 'Back Extension / Hyperextension', equipment: 'Bodyweight', type: 'Isolation' },
    { name: 'Machine Row', equipment: 'Machine', type: 'Compound' },
    { name: 'Rack Pull', equipment: 'Barbell', type: 'Compound' },
    { name: 'Good Morning', equipment: 'Barbell', type: 'Compound' },
    { name: 'Cable Pullover', equipment: 'Cable', type: 'Isolation' },
  ],
  'Shoulders': [
    { name: 'Barbell Overhead Press', equipment: 'Barbell', type: 'Compound' },
    { name: 'Seated Dumbbell Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Standing Dumbbell Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Arnold Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Lateral Raises', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Front Raises', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Rear Delt Flyes', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Upright Row', equipment: 'Barbell', type: 'Compound' },
    { name: 'Cable Lateral Raise', equipment: 'Cable', type: 'Isolation' },
    { name: 'Machine Shoulder Press', equipment: 'Machine', type: 'Compound' },
    { name: 'Reverse Pec Deck', equipment: 'Machine', type: 'Isolation' },
    { name: 'Band Pull-Apart', equipment: 'Band', type: 'Isolation' },
  ],
  'Arms': [
    { name: 'Barbell Curl', equipment: 'Barbell', type: 'Isolation' },
    { name: 'EZ-Bar Curl', equipment: 'Barbell', type: 'Isolation' },
    { name: 'Dumbbell Curl', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Hammer Curl', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Incline Dumbbell Curl', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Concentration Curl', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Cable Curl', equipment: 'Cable', type: 'Isolation' },
    { name: 'Preacher Curl', equipment: 'Barbell', type: 'Isolation' },
    { name: 'Close Grip Bench Press', equipment: 'Barbell', type: 'Compound' },
    { name: 'Tricep Dips', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Skull Crushers', equipment: 'Barbell', type: 'Isolation' },
    { name: 'Tricep Pushdown (Bar)', equipment: 'Cable', type: 'Isolation' },
    { name: 'Tricep Pushdown (Rope)', equipment: 'Cable', type: 'Isolation' },
    { name: 'Overhead Tricep Extension', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Tricep Kickback', equipment: 'Dumbbell', type: 'Isolation' },
    { name: 'Diamond Push-ups', equipment: 'Bodyweight', type: 'Compound' },
  ],
  'Legs': [
    { name: 'Barbell Back Squat', equipment: 'Barbell', type: 'Compound' },
    { name: 'Barbell Front Squat', equipment: 'Barbell', type: 'Compound' },
    { name: 'Romanian Deadlift', equipment: 'Barbell', type: 'Compound' },
    { name: 'Sumo Deadlift', equipment: 'Barbell', type: 'Compound' },
    { name: 'Leg Press', equipment: 'Machine', type: 'Compound' },
    { name: 'Hack Squat', equipment: 'Machine', type: 'Compound' },
    { name: 'Leg Extension', equipment: 'Machine', type: 'Isolation' },
    { name: 'Leg Curl (Lying)', equipment: 'Machine', type: 'Isolation' },
    { name: 'Leg Curl (Seated)', equipment: 'Machine', type: 'Isolation' },
    { name: 'Lunges', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Dumbbell Lunges', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Bulgarian Split Squat', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Goblet Squat', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Step-ups', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Standing Calf Raise', equipment: 'Machine', type: 'Isolation' },
    { name: 'Seated Calf Raise', equipment: 'Machine', type: 'Isolation' },
    { name: 'Hip Thrust', equipment: 'Barbell', type: 'Compound' },
  ],
  'Core': [
    { name: 'Plank', equipment: 'Bodyweight', type: 'Isometric' },
    { name: 'Side Plank', equipment: 'Bodyweight', type: 'Isometric' },
    { name: 'Crunches', equipment: 'Bodyweight', type: 'Isolation' },
    { name: 'Bicycle Crunches', equipment: 'Bodyweight', type: 'Isolation' },
    { name: 'Hanging Leg Raise', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Lying Leg Raise', equipment: 'Bodyweight', type: 'Isolation' },
    { name: 'Russian Twists', equipment: 'Bodyweight', type: 'Isolation' },
    { name: 'Ab Wheel Rollout', equipment: 'Equipment', type: 'Compound' },
    { name: 'Cable Crunch', equipment: 'Cable', type: 'Isolation' },
    { name: 'Mountain Climbers', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Dead Bug', equipment: 'Bodyweight', type: 'Isolation' },
    { name: 'V-Ups', equipment: 'Bodyweight', type: 'Isolation' },
  ],
  'Cardio': [
    { name: 'Treadmill Run', equipment: 'Machine', type: 'Cardio' },
    { name: 'Treadmill Walk (Incline)', equipment: 'Machine', type: 'Cardio' },
    { name: 'Cycling (Stationary)', equipment: 'Machine', type: 'Cardio' },
    { name: 'Jump Rope', equipment: 'Equipment', type: 'Cardio' },
    { name: 'Rowing Machine', equipment: 'Machine', type: 'Cardio' },
    { name: 'Stairmaster / StepMill', equipment: 'Machine', type: 'Cardio' },
    { name: 'Elliptical Trainer', equipment: 'Machine', type: 'Cardio' },
    { name: 'HIIT Sprints', equipment: 'Bodyweight', type: 'Cardio' },
    { name: 'Box Jumps', equipment: 'Bodyweight', type: 'Cardio' },
    { name: 'Battle Ropes', equipment: 'Equipment', type: 'Cardio' },
    { name: 'Swimming', equipment: 'None', type: 'Cardio' },
    { name: 'Outdoor Run', equipment: 'None', type: 'Cardio' },
  ],
  'Full Body': [
    { name: 'Burpees', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Clean and Press', equipment: 'Barbell', type: 'Compound' },
    { name: 'Kettlebell Swing', equipment: 'Kettlebell', type: 'Compound' },
    { name: 'Thruster', equipment: 'Barbell', type: 'Compound' },
    { name: 'Turkish Get-up', equipment: 'Kettlebell', type: 'Compound' },
    { name: 'Devil Press', equipment: 'Dumbbell', type: 'Compound' },
    { name: 'Wall Balls', equipment: 'Medicine Ball', type: 'Compound' },
    { name: 'Bear Crawl', equipment: 'Bodyweight', type: 'Compound' },
    { name: 'Man Maker', equipment: 'Dumbbell', type: 'Compound' },
  ],
};

// Muscle group → icon mapping for UI
const MUSCLE_ICONS = {
  'Chest': '🫁', 'Back': '🔙', 'Shoulders': '💆', 'Arms': '💪',
  'Legs': '🦵', 'Core': '🎯', 'Cardio': '❤️', 'Full Body': '⚡'
};

// Templates for quick start workouts
const WORKOUT_TEMPLATES = {
  push: {
    name: 'Push Day 💪',
    exercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Barbell Overhead Press', 'Lateral Raises', 'Tricep Pushdown (Rope)', 'Skull Crushers'],
  },
  pull: {
    name: 'Pull Day 🏋️',
    exercises: ['Conventional Deadlift', 'Barbell Bent-Over Row', 'Pull-ups', 'Seated Cable Row', 'Face Pulls', 'Barbell Curl', 'Hammer Curl'],
  },
  legs: {
    name: 'Leg Day 🦵',
    exercises: ['Barbell Back Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Extension', 'Leg Curl (Lying)', 'Hip Thrust', 'Standing Calf Raise'],
  },
  upper: {
    name: 'Upper Body 🔝',
    exercises: ['Barbell Bench Press', 'Barbell Bent-Over Row', 'Seated Dumbbell Press', 'Lat Pulldown', 'Lateral Raises', 'Barbell Curl', 'Tricep Pushdown (Bar)'],
  },
  full: {
    name: 'Full Body ⚡',
    exercises: ['Barbell Back Squat', 'Barbell Bench Press', 'Barbell Bent-Over Row', 'Barbell Overhead Press', 'Romanian Deadlift', 'Pull-ups'],
  },
  cardio: {
    name: 'Cardio 🏃',
    exercises: ['Treadmill Run', 'Jump Rope', 'HIIT Sprints', 'Battle Ropes', 'Box Jumps'],
  },
};

// Find exercise by name across all groups
function findExercise(name) {
  for (const [group, list] of Object.entries(EXERCISES)) {
    const found = list.find(e => e.name === name);
    if (found) return { ...found, group };
  }
  return null;
}
