/* ============================================================
   FitForge — Complete Application Logic
   AI Coach, Workout, Nutrition, Water, Progress, Profile
   ============================================================ */

// ======================== STORAGE MANAGER ========================
const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem('fitforge_' + key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('fitforge_' + key, JSON.stringify(value)); } catch {}
  },
  remove(key) { localStorage.removeItem('fitforge_' + key); }
};

// ======================== APP STATE ========================
const State = {
  profile: Storage.get('profile', {
    name: '', age: 25, gender: 'male', height: 175, weight: 75,
    goal: 'build_muscle', activityLevel: 'moderate',
    tdee: 0, bmr: 0, targetCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 },
    waterGoal: 2500, startDate: today(),
    schedule: { 1: 'push', 2: 'pull', 3: 'cardio', 4: 'legs', 5: 'upper', 6: 'full', 0: 'rest' }
  }),
  workouts: Storage.get('workouts', []),
  todayWorkout: null,  // the workout being built for selected date
  meals: Storage.get('meals', {}),  // { dateStr: [meal, ...] }
  weights: Storage.get('weights', []),  // [{date, weight}]
  water: Storage.get('water', {}),  // { dateStr: {total, log:[{ml,time}]} }
  prs: Storage.get('prs', {}),  // { exerciseName: {weight, reps, date} }
  currentPage: 'dashboard',
  workoutDateStr: today(),
  selectedExCategory: 'All',
  waterPeriod: 14,
  weightPeriodDays: 14,
  currentMealFilter: 'all',
  templates: Storage.get('templates', null),
};

// Initialize templates from defaults if not present
if (!State.templates) {
  // WORKOUT_TEMPLATES is defined in exercises.js, which loads before app.js
  State.templates = JSON.parse(JSON.stringify(WORKOUT_TEMPLATES));
  Storage.set('templates', State.templates);
}

// Height unit state per context (persists across page renders)
const heightUnitCtx = { ob: 'cm', profile: 'cm' };

// ======================== UTILS ========================
function today() {
  const d = new Date();
  return dateStr(d);
}

function dateStr(d) {
  if (typeof d === 'string') return d;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDate(str) {
  const [y,m,d] = str.split('-').map(Number);
  return new Date(y, m-1, d);
}

function formatDisplayDate(str) {
  const d = parseDate(str);
  return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}

function formatShortDate(str) {
  const d = parseDate(str);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
}

function daysBetween(d1str, d2str) {
  const d1 = parseDate(d1str), d2 = parseDate(d2str);
  return Math.round((d2 - d1) / 86400000);
}

function addDays(str, n) {
  const d = parseDate(str);
  d.setDate(d.getDate() + n);
  return dateStr(d);
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

// ======================== EXERCISE VISUAL DATA ========================
const GROUP_COLORS = {
  'Chest':    '#f43f5e',
  'Back':     '#3b82f6',
  'Shoulders':'#f59e0b',
  'Arms':     '#a78bfa',
  'Legs':     '#10b981',
  'Core':     '#06b6d4',
  'Cardio':   '#f97316',
  'Full Body':'#7c3aed',
};

// Brief how-to tips for common exercises
const EXERCISE_TIPS = {
  'Barbell Bench Press':    'Lie on a flat bench. Lower bar to mid-chest with control, then press up. Keep shoulder blades retracted.',
  'Incline Barbell Press':  'Set bench to 30–45°. Press bar from upper chest. Keep elbows at 45° to body.',
  'Dumbbell Chest Press':   'Hold dumbbells above chest, arms wide. Lower with control, press up squeezing chest at top.',
  'Dumbbell Flyes':         'Lie flat, dumbbells above chest. Open arms in a wide arc like hugging a tree, then bring back.',
  'Cable Crossover':        'Stand between cables, pull handles across your body, crossing at the bottom. Squeeze chest hard.',
  'Push-ups':               'Hands shoulder-width. Body straight. Lower chest to floor, push back up. Core tight throughout.',
  'Conventional Deadlift':  'Hinge at hips, grip bar shoulder-width. Drive through heels, keep back flat. Lock out hips at top.',
  'Barbell Bent-Over Row':  'Hinge forward, pull bar to your lower chest/navel. Squeeze shoulder blades together. Keep back flat.',
  'Pull-ups':               'Hang from bar, pull chest to bar. Engage lats first. Control the descent.',
  'Lat Pulldown':           'Grip wide, lean back slightly. Pull bar to upper chest, leading with elbows. Full stretch at top.',
  'Seated Cable Row':       'Sit tall, pull handle to your navel. Squeeze back at end. Resist the weight on the return.',
  'Face Pulls':             'Set cable at eye level. Pull rope to your face, external rotate at end. Great for rear delts.',
  'Barbell Overhead Press': 'Press bar from shoulder height to overhead. Keep core braced. Bar travels in a vertical path.',
  'Lateral Raises':         'Raise dumbbells out to sides to shoulder height. Slight bend in elbows. Don\'t swing!',
  'Arnold Press':           'Start with palms facing you at ear level. Rotate outward as you press overhead.',
  'Barbell Curl':           'Keep elbows pinned to sides. Curl the bar up in a full arc. Squeeze at the top.',
  'Hammer Curl':            'Neutral grip (thumbs up). Curl up keeping palms facing each other. Targets brachialis.',
  'Skull Crushers':         'Lie on bench, lower bar to forehead by bending elbows. Keep upper arms vertical.',
  'Tricep Pushdown (Rope)': 'Push rope down, flare hands at the bottom. Keep elbows locked at sides.',
  'Barbell Back Squat':     'Bar on upper traps. Squat below parallel, knees tracking toes. Drive through heels to stand.',
  'Romanian Deadlift':      'Hinge at hips, push them back. Lower bar down legs until you feel hamstring stretch. Drive hips forward.',
  'Leg Press':              'Feet shoulder-width on platform. Lower until 90°. Don\'t lock out knees at the top.',
  'Leg Extension':          'Extend legs fully, squeeze quads at the top. Control the lowering phase.',
  'Leg Curl (Lying)':       'Curl heels toward your glutes. Focus on hamstring contraction. Control the eccentric.',
  'Hip Thrust':             'Upper back on bench, bar over hips. Drive hips up, squeeze glutes hard at the top.',
  'Plank':                  'Forearms on floor, body straight. Squeeze core, glutes, and quads. Breathe steadily.',
  'Hanging Leg Raise':      'Hang from bar. Raise straight legs to waist height or higher. Avoid swinging.',
  'Treadmill Run':          'Start at a comfortable pace. Keep good posture, slight forward lean, land mid-foot.',
  'HIIT Sprints':           'Sprint at 90%+ effort for 20–30 sec. Rest for 10–40 sec. Repeat 6–10 rounds.',
};

// Generate a body silhouette SVG with highlighted muscle group (large, for active card)
function getMuscleViz(group) {
  const color = GROUP_COLORS[group] || '#7c3aed';
  const emoji = MUSCLE_ICONS[group] || '⚡';
  const label = group;
  return `<div class="muscle-viz-badge" style="--mviz-color:${color};">
    <div class="muscle-viz-icon">${emoji}</div>
    <div class="muscle-viz-label">${label}</div>
  </div>`;
}

// Smaller version for exercise picker list
function getMuscleVizSmall(group) {
  const color = GROUP_COLORS[group] || '#7c3aed';
  const emoji = MUSCLE_ICONS[group] || '⚡';
  return `<div class="muscle-viz-sm" style="background:${color}22; border:1.5px solid ${color}55; color:${color};">${emoji}</div>`;
}

// ======================== MODAL MANAGER (single shared backdrop) ========================
const ModalManager = {
  activeModal: null,
  backdrop: null,

  init() {
    this.backdrop = document.getElementById('modal-backdrop');
    // Clicking backdrop closes the active modal
    this.backdrop.addEventListener('click', () => this.close());
    // Wire up all X buttons by their ID
    const closeMap = {
      'close-exercise-modal': () => this.close(),
      'close-meal-modal':     () => this.close(),
      'close-weight-modal':   () => this.close(),
      'close-water-modal':    () => this.close(),
      'close-template-modal': () => this.close(),
    };
    Object.entries(closeMap).forEach(([id, fn]) => {
      document.getElementById(id)?.addEventListener('click', fn);
    });
    // Clicking INSIDE a modal stops the click reaching the backdrop
    document.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', e => e.stopPropagation());
    });
    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(modalId) {
    // Close any already-open modal first
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
    }
    this.activeModal = document.getElementById(modalId);
    if (!this.activeModal) return;
    this.activeModal.classList.add('active');
    this.backdrop.classList.add('active');
    // Focus first input if present
    setTimeout(() => {
      const first = this.activeModal.querySelector('input, select, textarea');
      first?.focus();
    }, 250);
  },

  close() {
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
      this.activeModal = null;
    }
    this.backdrop.classList.remove('active');
  }
};

// ======================== HEIGHT UNIT HELPERS ========================
function setHeightUnit(unit, ctx) {
  heightUnitCtx[ctx] = unit;
  const prefix = ctx === 'ob' ? 'ob' : 'profile';
  const cmWrap = document.getElementById(prefix + '-cm-wrap');
  const ftinWrap = document.getElementById(prefix + '-ftin-wrap');
  const cmBtn = document.getElementById(prefix + '-unit-cm');
  const ftinBtn = document.getElementById(prefix + '-unit-ftin');
  if (!cmWrap) return;
  if (unit === 'cm') {
    cmWrap.classList.remove('hidden-field');
    ftinWrap.classList.add('hidden-field');
    cmBtn.classList.add('active');
    ftinBtn.classList.remove('active');
  } else {
    cmWrap.classList.add('hidden-field');
    ftinWrap.classList.remove('hidden-field');
    cmBtn.classList.remove('active');
    ftinBtn.classList.add('active');
  }
}

function getHeightCm(ctx) {
  if (heightUnitCtx[ctx] === 'ftin') {
    const prefix = ctx === 'ob' ? 'ob' : 'profile';
    const ft = parseFloat(document.getElementById(prefix + '-height-ft')?.value) || 5;
    const inches = parseFloat(document.getElementById(prefix + '-height-in')?.value) || 9;
    return Math.round((ft * 12 + inches) * 2.54);
  }
  const inputId = ctx === 'ob' ? 'ob-height' : 'profile-height-cm';
  return parseFloat(document.getElementById(inputId)?.value) || 175;
}

function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.modal-overlay.active').forEach(o => o.classList.remove('active'));
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ======================== TOAST NOTIFICATIONS ========================
function toast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️', celebration:'🎉' };
  el.innerHTML = `<span>${icons[type]||'💬'}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// ======================== ROUTER ========================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
    l.setAttribute('aria-current', l.dataset.page === page ? 'page' : 'false');
  });
  document.querySelectorAll('.bnav-item').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  State.currentPage = page;
  window.scrollTo(0, 0);

  // Render the page
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'workout': renderWorkout(); break;
    case 'nutrition': renderNutrition(); break;
    case 'progress': renderProgress(); break;
    case 'water': renderWater(); break;
    case 'coach': renderCoach(); break;
    case 'profile': renderProfile(); break;
  }
}

// ======================== PROFILE & TDEE ========================
function calculateTDEE(profile) {
  const w = parseFloat(profile.weight) || 75;
  const h = parseFloat(profile.height) || 175;
  const a = parseInt(profile.age) || 25;
  const g = profile.gender || 'male';

  // Mifflin-St Jeor BMR
  let bmr;
  if (g === 'male') {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2, light: 1.375, moderate: 1.55,
    active: 1.725, very_active: 1.9
  };
  const multiplier = activityMultipliers[profile.activityLevel] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (profile.goal === 'lose_weight') targetCalories = Math.round(tdee - 400); // 400 kcal deficit for lean cut
  else if (profile.goal === 'build_muscle') targetCalories = Math.round(tdee + 250); // 250 kcal surplus for lean bulk
  else if (profile.goal === 'athletic') targetCalories = Math.round(tdee + 150); // 150 kcal surplus

  // Macros: protein = 2.2g/kg (capped at 35% of total calories), fat = 25% of target kcal, carbs = rest
  const maxProteinKcal = targetCalories * 0.35;
  const maxProteinGrams = maxProteinKcal / 4;
  let protein = Math.round(w * 2.2);
  if (protein > maxProteinGrams) {
    protein = Math.round(maxProteinGrams);
  }
  
  const fat = Math.round((targetCalories * 0.25) / 9);
  const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
  const waterGoal = profile.waterGoal || Math.round(w * 35);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    macros: { protein, carbs, fat },
    waterGoal
  };
}

function saveProfile() {
  const profile = State.profile;
  profile.name = document.getElementById('profile-name').value.trim();
  profile.age = parseInt(document.getElementById('profile-age').value) || 25;
  profile.gender = document.getElementById('profile-gender').value;
  profile.height = getHeightCm('profile');
  profile.weight = parseFloat(document.getElementById('profile-weight-form').value) || 75;
  profile.goal = document.getElementById('profile-goal').value;
  profile.activityLevel = document.getElementById('profile-activity').value;
  profile.waterGoal = parseInt(document.getElementById('profile-water-goal').value) || 2500;
  
  if (!profile.schedule) profile.schedule = {};
  for (let i = 0; i <= 6; i++) {
    const sEl = document.getElementById(`sched-${i}`);
    if (sEl) profile.schedule[i] = sEl.value;
  }

  const calc = calculateTDEE(profile);
  Object.assign(profile, calc);

  Storage.set('profile', profile);
  State.profile = profile;
  renderProfile();
  updateHeaderAvatar();
  toast('Profile saved! 🎉', 'success');
}

function renderProfile() {
  const p = State.profile;
  const el = (id, val) => { const e = document.getElementById(id); if (e) e.value = val || ''; };
  const txt = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val || ''; };

  el('profile-name', p.name);
  el('profile-age', p.age);
  el('profile-height-cm', p.height);
  el('profile-weight-form', p.weight);
  el('profile-water-goal', p.waterGoal);
  const goalEl = document.getElementById('profile-goal');
  if (goalEl) goalEl.value = p.goal || 'build_muscle';
  const actEl = document.getElementById('profile-activity');
  if (actEl) actEl.value = p.activityLevel || 'moderate';

  if (p.schedule) {
    for (let i = 0; i <= 6; i++) {
      el(`sched-${i}`, p.schedule[i] || (i === 0 ? 'rest' : 'full'));
    }
  }

  txt('profile-name-display', p.name || 'Your Name');
  const initEl = document.getElementById('profile-avatar-initials');
  if (initEl) initEl.textContent = getInitials(p.name);

  const goalLabels = { lose_weight:'🔥 Lose Weight', build_muscle:'💪 Build Muscle', maintain:'⚖️ Maintain', athletic:'🏆 Athletic' };
  txt('profile-goal-badge', goalLabels[p.goal] || 'Goal not set');

  // Recalculate
  const calc = calculateTDEE(p);
  txt('tdee-display', calc.tdee || '–');
  txt('tdee-target-display', calc.targetCalories || '–');
  txt('bmr-display', calc.bmr || '–');
  txt('profile-protein', calc.macros.protein + 'g');
  txt('profile-carbs', calc.macros.carbs + 'g');
  txt('profile-fat', calc.macros.fat + 'g');

  // Sync state
  Object.assign(State.profile, calc);
  Storage.set('profile', State.profile);
}

function updateHeaderAvatar() {
  const initials = getInitials(State.profile.name);
  document.querySelectorAll('#header-avatar-initials, #profile-avatar-initials').forEach(el => {
    if (el) el.textContent = initials;
  });
  document.getElementById('sidebar-streak-count').textContent = getWorkoutStreak();
}

// ======================== ONBOARDING ========================
let obSelectedGoal = '';
let obSelectedActivity = '';
let currentObStep = 1;

function nextObStep(step) {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ob-dot').forEach((d, i) => {
    d.classList.toggle('active', i < step);
  });
  document.getElementById('ob-step-' + step)?.classList.add('active');
  currentObStep = step;
}

function selectGoal(btn) {
  document.querySelectorAll('.goal-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  obSelectedGoal = btn.dataset.goal;
}

function selectActivity(btn) {
  document.querySelectorAll('.activity-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  obSelectedActivity = btn.dataset.activity;
}

function finishOnboarding() {
  const name = document.getElementById('ob-name').value.trim();
  const age = parseInt(document.getElementById('ob-age').value) || 25;
  const gender = document.getElementById('ob-gender').value;
  const height = getHeightCm('ob');
  const weight = parseFloat(document.getElementById('ob-weight').value) || 75;

  const profile = {
    name, age, gender, height, weight,
    goal: obSelectedGoal || 'build_muscle',
    activityLevel: obSelectedActivity || 'moderate',
    waterGoal: Math.round(weight * 35),
    startDate: today()
  };

  const calc = calculateTDEE(profile);
  Object.assign(profile, calc);
  State.profile = profile;
  Storage.set('profile', profile);
  Storage.set('onboarded', true);

  // Log starting weight
  logWeightEntry(weight, today());

  document.getElementById('onboarding-overlay').style.display = 'none';
  document.getElementById('app-shell').style.display = 'flex';
  document.getElementById('bottom-nav').style.display = '';
  updateHeaderAvatar();
  navigate('dashboard');
  toast(`Welcome to FitForge, ${name || 'Champion'}! 🚀`, 'celebration', 5000);
}

// ======================== DASHBOARD ========================
function renderDashboard() {
  const p = State.profile;
  const t = today();

  // Greeting
  document.getElementById('dashboard-greeting').textContent = `${getGreeting()}, ${p.name || 'Champion'}! 👋`;
  document.getElementById('dashboard-date').textContent = formatDisplayDate(t);

  // Calories stat
  const todayMeals = State.meals[t] || [];
  const totalCal = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
  const targetCal = p.targetCalories || 2000;
  document.getElementById('stat-calories').textContent = totalCal;
  document.getElementById('stat-calories-goal').textContent = `/ ${targetCal} kcal`;
  setRing('ring-calories', totalCal, targetCal);

  // Water stat
  const todayWater = getTodayWaterTotal(t);
  const waterGoal = p.waterGoal || 2500;
  document.getElementById('stat-water').textContent = todayWater >= 1000 ? `${(todayWater/1000).toFixed(1)}L` : `${todayWater}ml`;
  document.getElementById('stat-water-goal').textContent = `/ ${(waterGoal/1000).toFixed(1)}L`;
  setRing('ring-water', todayWater, waterGoal);

  // Workouts this week
  const weekCount = getWorkoutsThisWeek();
  document.getElementById('stat-workouts').textContent = weekCount;
  setRing('ring-workout', weekCount, 5);

  // Weight
  const weights = State.weights;
  if (weights.length > 0) {
    const latest = weights[weights.length - 1];
    document.getElementById('stat-weight').textContent = `${latest.weight} kg`;
    if (weights.length >= 2) {
      const prev = weights[weights.length - 2];
      const diff = (latest.weight - prev.weight).toFixed(1);
      const el = document.getElementById('stat-weight-change');
      el.textContent = diff > 0 ? `▲ ${diff} kg` : diff < 0 ? `▼ ${Math.abs(diff)} kg` : 'no change';
      el.style.color = diff > 0 ? 'var(--amber)' : diff < 0 ? 'var(--green)' : 'var(--text-faint)';
    }
    setRing('ring-weight', 100, 100);
  }

  // Coach tip
  const insights = generateInsights();
  if (insights.length > 0) {
    document.getElementById('coach-tip-text').textContent = insights[0].text;
  } else {
    document.getElementById('coach-tip-text').textContent = 'You\'re doing great! Keep up the consistency 💪';
  }

  // Context-aware check-in banner
  renderCheckinBanner(totalCal, targetCal, todayWater, waterGoal);

  // Today's Plan
  renderTodaysPlan(totalCal, targetCal, todayWater, waterGoal);

  // Recent workout
  const recentWorkouts = State.workouts.sort((a,b) => b.date.localeCompare(a.date));
  const lastWO = recentWorkouts[0];
  const el = document.getElementById('recent-workout-content');
  if (lastWO) {
    const exNames = lastWO.exercises.map(e => e.name).slice(0, 3).join(', ');
    el.innerHTML = `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-item-date">${formatDisplayDate(lastWO.date)}</span>
          <span class="history-item-meta">${lastWO.exercises.length} exercises</span>
        </div>
        <div class="history-item-exercises">${exNames}${lastWO.exercises.length > 3 ? ` +${lastWO.exercises.length-3} more` : ''}</div>
      </div>`;
  } else {
    el.innerHTML = '<div class="empty-state-inline">No workouts logged yet. Start your first session! 💪</div>';
  }
}

// ======================== CHECK-IN BANNER ========================
function renderCheckinBanner(totalCal, targetCal, todayWater, waterGoal) {
  const banner = document.getElementById('checkin-banner');
  const msgEl = document.getElementById('checkin-msg');
  const iconEl = document.getElementById('checkin-icon');
  const actionEl = document.getElementById('checkin-action');
  if (!banner) return;

  const h = new Date().getHours();
  const t = today();
  const todayMeals = State.meals[t] || [];
  const hasWorkoutToday = !!State.workouts.find(w => w.date === t);
  const calRemaining = targetCal - totalCal;
  const waterRemaining = waterGoal - todayWater;

  let msg = '', icon = '', action = '', handler = null;

  if (h >= 6 && h < 10 && todayMeals.filter(m => m.mealType === 'breakfast').length === 0) {
    icon = '🌅'; msg = 'Good morning! Start strong — log your breakfast to fuel your day.';
    action = 'Log Breakfast'; handler = () => { ModalManager.open('meal-modal'); document.getElementById('food-meal-type').value = 'breakfast'; };
  } else if (h >= 12 && h < 15 && todayMeals.filter(m => m.mealType === 'lunch').length === 0) {
    icon = '☀️'; msg = `Lunchtime! You need ${calRemaining > 0 ? calRemaining + ' kcal' : 'to keep it light'} more today.`;
    action = 'Log Lunch'; handler = () => { ModalManager.open('meal-modal'); document.getElementById('food-meal-type').value = 'lunch'; };
  } else if (h >= 17 && h < 20 && !hasWorkoutToday) {
    icon = '🏋️'; msg = "Haven't worked out yet today — even 30 minutes matters!";
    action = 'Start Workout'; handler = () => navigate('workout');
  } else if (h >= 20 && h < 23 && todayWater < waterGoal * 0.7) {
    icon = '💧'; msg = `Only ${todayWater}ml of water today. Drink ${waterRemaining}ml more before bed.`;
    action = 'Log Water'; handler = () => navigate('water');
  } else if (h >= 20 && h < 23 && todayMeals.filter(m => m.mealType === 'dinner').length === 0) {
    icon = '🌙'; msg = "Don't forget to log dinner to complete today's nutrition picture.";
    action = 'Log Dinner'; handler = () => { ModalManager.open('meal-modal'); document.getElementById('food-meal-type').value = 'dinner'; };
  }

  if (msg) {
    banner.style.display = 'flex';
    iconEl.textContent = icon;
    msgEl.textContent = msg;
    actionEl.textContent = action;
    actionEl.onclick = handler;
  } else {
    banner.style.display = 'none';
  }
}

// ======================== TODAY'S PLAN ========================
function renderTodaysPlan(totalCal, targetCal, todayWater, waterGoal) {
  const list = document.getElementById('todays-plan-list');
  if (!list) return;

  const t = today();
  const d = parseDate(t);
  const dayOfWeek = d.getDay();
  const splitNames = { push:'Push Day 💪', pull:'Pull Day 🏋️', cardio:'Cardio 🏃', legs:'Leg Day 🦵', upper:'Upper Body 🔝', lower:'Lower Body 👖', full:'Full Body ⚡', rest:'Rest Day 😴' };
  const schedule = State.profile.schedule || { 1: 'push', 2: 'pull', 3: 'cardio', 4: 'legs', 5: 'upper', 6: 'full', 0: 'rest' };
  const todaySplit = schedule[dayOfWeek] || 'rest';
  
  const hasWorkoutToday = !!State.workouts.find(w => w.date === t);
  const todayMeals = State.meals[t] || [];
  const hasBreakfast = todayMeals.some(m => m.mealType === 'breakfast');
  const hasLunch = todayMeals.some(m => m.mealType === 'lunch');
  const hasDinner = todayMeals.some(m => m.mealType === 'dinner');
  const waterPct = waterGoal > 0 ? Math.round(todayWater / waterGoal * 100) : 0;
  const calPct = targetCal > 0 ? Math.round(totalCal / targetCal * 100) : 0;
  const hasWeight = State.weights.some(w => w.date === t);

  const items = [
    {
      done: hasWorkoutToday || todaySplit === 'rest',
      text: todaySplit === 'rest' ? 'Rest Day — recovery is training too' : `${splitNames[todaySplit]} workout`,
      meta: hasWorkoutToday ? 'Completed ✓' : (todaySplit === 'rest' ? 'Enjoy your rest' : 'Tap to start'),
      action: () => navigate('workout')
    },
    {
      done: hasBreakfast,
      text: 'Log Breakfast 🌅',
      meta: hasBreakfast ? 'Logged' : 'Not logged yet',
      action: () => { ModalManager.open('meal-modal'); setMealMode('search'); }
    },
    {
      done: hasLunch,
      text: 'Log Lunch ☀️',
      meta: hasLunch ? 'Logged' : 'Not logged yet',
      action: () => { ModalManager.open('meal-modal'); setMealMode('search'); }
    },
    {
      done: hasDinner,
      text: 'Log Dinner 🌙',
      meta: hasDinner ? 'Logged' : 'Not logged yet',
      action: () => { ModalManager.open('meal-modal'); setMealMode('search'); }
    },
    {
      done: waterPct >= 80,
      text: `Hydration 💧 — ${waterPct}% of goal`,
      meta: `${todayWater}ml / ${(waterGoal/1000).toFixed(1)}L`,
      action: () => navigate('water')
    },
    {
      done: hasWeight,
      text: 'Log Today\'s Weight ⚖️',
      meta: hasWeight ? 'Logged' : 'Track your progress',
      action: () => openWeightModal()
    },
  ];

  // Store actions globally so onclick can call by index (avoids HTML injection issues)
  window._planActions = items.map(item => item.action);

  list.innerHTML = items.map((item, i) => `
    <div class="plan-item ${item.done ? 'done' : ''}" onclick="window._planActions[${i}] && window._planActions[${i}]()">
      <div class="plan-check">${item.done ? '✓' : ''}</div>
      <div class="plan-text">${item.text}</div>
      <div class="plan-meta">${item.meta}</div>
    </div>
  `).join('');
}

function setRing(id, value, max) {
  const pct = max > 0 ? clamp(value / max, 0, 1) : 0;
  const circumference = 100;
  const filled = pct * circumference;
  const el = document.getElementById(id);
  if (el) {
    el.setAttribute('stroke-dasharray', `${filled} ${circumference - filled}`);
  }
}

function getWorkoutsThisWeek() {
  const now = parseDate(today());
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const mondayStr = dateStr(monday);
  return State.workouts.filter(w => w.date >= mondayStr && w.date <= today()).length;
}

function getWorkoutStreak() {
  const sortedDates = [...new Set(State.workouts.map(w => w.date))].sort();
  if (sortedDates.length === 0) return 0;
  let streak = 0;
  let checkDate = today();
  // Check if today or yesterday has a workout
  const latestWO = sortedDates[sortedDates.length - 1];
  const daysSinceLatest = daysBetween(latestWO, today());
  if (daysSinceLatest > 1) return 0;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const expected = addDays(today(), -streak);
    if (sortedDates[i] === expected || (streak === 0 && sortedDates[i] === addDays(today(), -1))) {
      if (streak === 0 && sortedDates[i] === addDays(today(), -1)) {}
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ======================== WORKOUT MODULE ========================
function renderWorkout() {
  const dateStr = State.workoutDateStr;
  document.getElementById('workout-date-label').textContent = formatDisplayDate(dateStr);

  // Load today's workout (or create new)
  let w = State.workouts.find(w => w.date === dateStr);
  if (!w) {
    w = { id: uid(), date: dateStr, exercises: [], saved: false };
    State.todayWorkout = w;
    autoLoadDailyWorkout(dateStr);
  } else {
    State.todayWorkout = w;
  }

  renderExerciseCards();
  renderWorkoutHistory();

  // Date navigation
  document.getElementById('workout-prev-btn').onclick = () => {
    State.workoutDateStr = addDays(State.workoutDateStr, -1);
    renderWorkout();
  };
  document.getElementById('workout-next-btn').onclick = () => {
    if (State.workoutDateStr < today()) {
      State.workoutDateStr = addDays(State.workoutDateStr, 1);
      renderWorkout();
    }
  };
}

function renderExerciseCards() {
  const container = document.getElementById('workout-exercises-container');
  const empty = document.getElementById('workout-empty');
  const exercises = State.todayWorkout?.exercises || [];

  if (exercises.length === 0) {
    const d = parseDate(State.workoutDateStr);
    const dayOfWeek = d.getDay();
    const schedule = State.profile.schedule || { 1: 'push', 2: 'pull', 3: 'cardio', 4: 'legs', 5: 'upper', 6: 'full', 0: 'rest' };
    const todaySplit = schedule[dayOfWeek] || 'rest';
    const splitNames = { push:'Push Day 💪', pull:'Pull Day 🏋️', cardio:'Cardio 🏃', legs:'Leg Day 🦵', upper:'Upper Body 🔝', lower:'Lower Body 👖', full:'Full Body ⚡', rest:'Rest Day 😴' };
    
    let msg = `It's your <strong>${splitNames[todaySplit]}</strong>.<br>Add some exercises to get started!`;
    if (todaySplit === 'rest') {
      msg = `It's a <strong>Rest Day</strong>! 😴<br>Take a break, or add a light session if you feel like it.`;
    }
    
    container.innerHTML = `
      <div class="empty-state" id="workout-empty" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 30px; text-align: center; border: 1px dashed var(--border);">
        <div class="empty-icon" style="font-size: 3rem; margin-bottom: 10px;">${todaySplit === 'rest' ? '🛋️' : '🏋️'}</div>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.5;">${msg}</p>
      </div>`;
    return;
  }

  container.innerHTML = exercises.map((ex, exIdx) => {
    const fullEx = findExercise(ex.name) || ex;
    const isCardio = (ex.group || fullEx.group) === 'Cardio';
    
    const setsHeader = isCardio
      ? `<span>Set</span><span>Time (min)</span><span>Dist/Level</span><span>✓</span>`
      : `<span>Set</span><span>Weight (kg)</span><span>Reps</span><span>✓</span>`;

    return `
    <div class="exercise-card" id="ex-card-${exIdx}">
      <div class="exercise-card-header">
        <div class="exercise-card-title">
          <span class="exercise-name" style="font-size: 1.1rem;">${ex.name}</span>
        </div>
        <button class="delete-exercise-btn" onclick="deleteExercise(${exIdx})" aria-label="Delete exercise">🗑</button>
      </div>
      <div class="sets-header">
        ${setsHeader}
      </div>
      <div id="sets-container-${exIdx}">
        ${ex.sets.map((s, sIdx) => renderSetRow(exIdx, sIdx, s, isCardio)).join('')}
      </div>
      <button class="add-set-btn" onclick="addSet(${exIdx})">+ Add Set</button>
    </div>
  `}).join('');
}

function renderSetRow(exIdx, sIdx, set, isCardio = false) {
  const isCompleted = set.completed || false;
  // Find last logged data for this exercise to show as placeholder hints
  const ex = State.todayWorkout?.exercises[exIdx];
  let lastWeight = '', lastReps = '';
  if (ex) {
    const pastWO = [...State.workouts]
      .sort((a,b) => b.date.localeCompare(a.date))
      .find(w => w.date !== State.workoutDateStr && w.exercises.some(e => e.name === ex.name));
    if (pastWO) {
      const pastEx = pastWO.exercises.find(e => e.name === ex.name);
      const pastSet = pastEx?.sets[sIdx] || pastEx?.sets[0];
      if (pastSet) { lastWeight = pastSet.weight || ''; lastReps = pastSet.reps || ''; }
    }
  }
  
  const wPlaceholder = lastWeight ? `Last: ${lastWeight}` : '0';
  const rPlaceholder = lastReps ? `Last: ${lastReps}` : '0';
  
  // For cardio, we repurpose 'weight' as Time and 'reps' as Distance/Level
  return `
    <div class="set-row" id="set-${exIdx}-${sIdx}">
      <span class="set-num">${sIdx + 1}</span>
      <input class="set-input" type="number" placeholder="${wPlaceholder}" min="0" step="${isCardio ? '1' : '0.5'}"
        value="${set.weight || ''}"
        onchange="updateSet(${exIdx}, ${sIdx}, 'weight', this.value)">
      <input class="set-input" type="number" placeholder="${rPlaceholder}" min="0" step="${isCardio ? '0.1' : '1'}"
        value="${set.reps || ''}"
        onchange="updateSet(${exIdx}, ${sIdx}, 'reps', this.value)">
      <button class="set-complete-btn ${isCompleted ? 'completed' : ''}"
        onclick="toggleSetComplete(${exIdx}, ${sIdx})" aria-label="Mark complete">
        ${isCompleted ? '✓' : '○'}
      </button>
    </div>`;
}

function addSet(exIdx) {
  if (!State.todayWorkout) return;
  State.todayWorkout.exercises[exIdx].sets.push({ weight: '', reps: '', completed: false });
  renderExerciseCards();
}

function updateSet(exIdx, sIdx, field, value) {
  if (!State.todayWorkout) return;
  State.todayWorkout.exercises[exIdx].sets[sIdx][field] = parseFloat(value) || 0;
  checkAndUpdatePR(exIdx, sIdx);
}

function toggleSetComplete(exIdx, sIdx) {
  if (!State.todayWorkout) return;
  const set = State.todayWorkout.exercises[exIdx].sets[sIdx];
  set.completed = !set.completed;
  checkAndUpdatePR(exIdx, sIdx);
  renderExerciseCards();
}

function checkAndUpdatePR(exIdx, sIdx) {
  if (!State.todayWorkout) return;
  const ex = State.todayWorkout.exercises[exIdx];
  const set = ex.sets[sIdx];
  if (!set.weight || !set.reps) return;

  const prKey = ex.name;
  const currentPR = State.prs[prKey];

  // Estimate 1RM using Epley formula: weight * (1 + reps/30)
  const estimated1RM = set.weight * (1 + set.reps / 30);
  const current1RM = currentPR ? currentPR.weight * (1 + currentPR.reps / 30) : 0;

  if (!currentPR || estimated1RM > current1RM) {
    const isActualPR = !!currentPR; // only toast if there was a previous record
    State.prs[prKey] = { weight: set.weight, reps: set.reps, date: State.workoutDateStr };
    Storage.set('prs', State.prs);
    if (isActualPR) {
      toast(`🏆 NEW PR! ${ex.name}: ${set.weight}kg × ${set.reps} reps`, 'celebration', 5000);
    }
  }
}

function deleteExercise(exIdx) {
  if (!State.todayWorkout) return;
  State.todayWorkout.exercises.splice(exIdx, 1);
  renderExerciseCards();
}

function saveWorkout() {
  if (!State.todayWorkout) return;
  if (State.todayWorkout.exercises.length === 0) {
    toast('Add at least one exercise first!', 'warning');
    return;
  }

  const existingIdx = State.workouts.findIndex(w => w.date === State.todayWorkout.date);
  if (existingIdx >= 0) {
    State.workouts[existingIdx] = State.todayWorkout;
  } else {
    State.workouts.push(State.todayWorkout);
  }

  Storage.set('workouts', State.workouts);
  toast('Workout saved! 💪', 'success');
  updateHeaderAvatar(); // update streak
  renderWorkoutHistory();
}

function renderWorkoutHistory() {
  const el = document.getElementById('workout-history-list');
  const sorted = [...State.workouts].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 7);
  if (sorted.length === 0) {
    el.innerHTML = '<div class="empty-state-inline">No workout history yet.</div>';
    return;
  }
  el.innerHTML = sorted.map(w => {
    const exNames = w.exercises.map(e => e.name).slice(0, 3).join(', ');
    const totalSets = w.exercises.reduce((s, e) => s + e.sets.length, 0);
    return `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-item-date">${formatDisplayDate(w.date)}</span>
          <span class="history-item-meta">${w.exercises.length} exercises · ${totalSets} sets</span>
        </div>
        <div class="history-item-exercises">${exNames}${w.exercises.length > 3 ? ` +${w.exercises.length-3} more` : ''}</div>
      </div>`;
  }).join('');
}

// Load workout template
function loadTemplate(key) {
  const template = State.templates[key];
  if (!template) return;
  if (!State.todayWorkout) State.todayWorkout = { id: uid(), date: State.workoutDateStr, exercises: [] };
  template.exercises.forEach(name => {
    const ex = findExercise(name);
    if (ex && !State.todayWorkout.exercises.find(e => e.name === name)) {
      State.todayWorkout.exercises.push({
        name: ex.name, group: ex.group, equipment: ex.equipment,
        sets: [{ weight: '', reps: '', completed: false },
               { weight: '', reps: '', completed: false },
               { weight: '', reps: '', completed: false }]
      });
    }
  });
  renderExerciseCards();
  toast(`${template.name} loaded!`, 'info');
}

function autoLoadDailyWorkout(dateStr) {
  // Auto load based on user's schedule
  const d = parseDate(dateStr);
  const day = d.getDay();
  const schedule = State.profile.schedule || { 1: 'push', 2: 'pull', 3: 'cardio', 4: 'legs', 5: 'upper', 6: 'full', 0: 'rest' };
  const tplKey = schedule[day];
  
  if (tplKey && tplKey !== 'rest') {
    // silently load without toast
    const template = State.templates[tplKey];
    if (!template) return;
    template.exercises.forEach(name => {
      const ex = findExercise(name);
      if (ex && !State.todayWorkout.exercises.find(e => e.name === name)) {
        State.todayWorkout.exercises.push({
          name: ex.name, group: ex.group, equipment: ex.equipment,
          sets: [{ weight: '', reps: '', completed: false },
                 { weight: '', reps: '', completed: false },
                 { weight: '', reps: '', completed: false }]
        });
      }
    });
  }
}

// Template saving
function promptSaveTemplate() {
  if (!State.todayWorkout || State.todayWorkout.exercises.length === 0) {
    toast('Add some exercises to your workout first!', 'warning');
    return;
  }
  ModalManager.open('template-modal');
}

function saveAsTemplate() {
  const tplKey = document.getElementById('template-select').value;
  if (!tplKey || !State.templates[tplKey]) return;
  
  // Save current exercises list (names only) to template
  const exNames = State.todayWorkout.exercises.map(e => e.name);
  State.templates[tplKey].exercises = exNames;
  Storage.set('templates', State.templates);
  
  ModalManager.close();
  toast(`${State.templates[tplKey].name} template updated! 🎉`, 'success');
}

// ======================== EXERCISE PICKER MODAL ========================
let exPickerFilter = '';

function openExercisePicker() {
  ModalManager.open('exercise-modal');
  document.getElementById('exercise-search').value = '';
  State.selectedExCategory = 'All';
  buildCategoryTabs();
  renderExerciseList('All', '');
}
function closeExerciseModal() { ModalManager.close(); }
function closeAllModals() { ModalManager.close(); }

function buildCategoryTabs() {
  const cats = ['All', ...Object.keys(EXERCISES)];
  const tabsEl = document.getElementById('exercise-cat-tabs');
  tabsEl.innerHTML = cats.map(c => `
    <button class="exercise-cat-btn ${c === State.selectedExCategory ? 'active' : ''}"
      onclick="selectExCategory('${c}')">${MUSCLE_ICONS[c] || '⚡'} ${c}</button>
  `).join('');
}

function selectExCategory(cat) {
  State.selectedExCategory = cat;
  buildCategoryTabs();
  renderExerciseList(cat, exPickerFilter);
}

function filterExercises(query) {
  exPickerFilter = query.toLowerCase();
  renderExerciseList(State.selectedExCategory, exPickerFilter);
}

function renderExerciseList(category, query) {
  let exercises = [];
  if (category === 'All') {
    Object.entries(EXERCISES).forEach(([group, list]) => {
      list.forEach(ex => exercises.push({ ...ex, group }));
    });
  } else {
    exercises = (EXERCISES[category] || []).map(ex => ({ ...ex, group: category }));
  }

  if (query) {
    exercises = exercises.filter(ex =>
      ex.name.toLowerCase().includes(query) ||
      ex.group.toLowerCase().includes(query) ||
      ex.equipment.toLowerCase().includes(query)
    );
  }

  const listEl = document.getElementById('exercise-list');
  if (exercises.length === 0) {
    listEl.innerHTML = '<div class="empty-state-inline">No exercises found.</div>';
    return;
  }

  listEl.innerHTML = exercises.map(ex => {
    const muscleViz = getMuscleVizSmall(ex.group);
    const chipClass = ex.type === 'Compound' ? 'chip-compound' : 'chip-isolation';
    const safeName = ex.name.replace(/'/g, "\\'");
    const safeGroup = ex.group.replace(/'/g, "\\'");
    const safeEquipment = ex.equipment.replace(/'/g, "\\'");
    return `
    <div class="exercise-item" onclick="pickExercise('${safeName}', '${safeGroup}', '${safeEquipment}')">
      ${muscleViz}
      <div class="exercise-item-body">
        <div class="exercise-item-name">${ex.name}</div>
        <div class="exercise-item-meta">${MUSCLE_ICONS[ex.group] || ''} ${ex.group} · ${ex.equipment}</div>
      </div>
      <div class="exercise-item-right">
        <span class="exercise-item-type-chip ${chipClass}">${ex.type}</span>
        <span class="exercise-item-arrow">+</span>
      </div>
    </div>
  `}).join('');
}

function pickExercise(name, group, equipment) {
  if (!State.todayWorkout) State.todayWorkout = { id: uid(), date: State.workoutDateStr, exercises: [] };
  if (State.todayWorkout.exercises.find(e => e.name === name)) {
    toast(`${name} already added!`, 'warning');
    closeExerciseModal();
    return;
  }
  State.todayWorkout.exercises.push({
    name, group, equipment,
    sets: [{ weight: '', reps: '', completed: false }]
  });
  closeExerciseModal();
  renderExerciseCards();
  toast(`${name} added! 💪`, 'success');
}

// ======================== NUTRITION MODULE ========================
function renderNutrition() {
  const t = today();
  document.getElementById('nutrition-date').textContent = formatDisplayDate(t);
  renderMacroRings();
  renderMealList();
}

function renderMacroRings() {
  const t = today();
  const meals = State.meals[t] || [];
  const p = State.profile;
  const totals = meals.reduce((acc, m) => {
    acc.calories += m.calories || 0;
    acc.protein += m.protein || 0;
    acc.carbs += m.carbs || 0;
    acc.fat += m.fat || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const calc = calculateTDEE(p);
  const targets = { calories: calc.targetCalories, ...calc.macros };
  const circ = 314; // 2π × 50

  const rings = [
    ['cal', totals.calories, targets.calories, ''],
    ['prot', totals.protein, targets.protein, 'g'],
    ['carbs', totals.carbs, targets.carbs, 'g'],
    ['fat', totals.fat, targets.fat, 'g']
  ];

  const keys = ['calories', 'protein', 'carbs', 'fat'];
  rings.forEach(([prefix, val, max], i) => {
    const pct = max > 0 ? clamp(val / max, 0, 1.2) : 0;
    const fill = Math.min(pct, 1) * circ;
    const ring = document.getElementById(prefix + '-ring');
    if (ring) ring.setAttribute('stroke-dasharray', `${fill.toFixed(1)} ${(circ - fill).toFixed(1)}`);

    const unit = i === 0 ? '' : 'g';
    const valueEl = document.getElementById(prefix + '-value');
    const targetEl = document.getElementById(prefix + '-target');
    if (valueEl) valueEl.textContent = Math.round(val) + unit;
    if (targetEl) targetEl.textContent = `/ ${Math.round(max)} ${i === 0 ? 'kcal' : 'g'}`;
  });
}

function renderMealList() {
  const t = today();
  const meals = State.meals[t] || [];
  const listEl = document.getElementById('meal-list');
  const filter = State.currentMealFilter;

  const filtered = filter === 'all' ? meals : meals.filter(m => m.mealType === filter);

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state" id="nutrition-empty"><div class="empty-icon">🥗</div><p>No ${filter === 'all' ? '' : filter} meals logged. Start eating! 😄</p></div>`;
    return;
  }

  const mealIcons = { breakfast:'🌅', lunch:'☀️', dinner:'🌙', snack:'🍎' };
  listEl.innerHTML = filtered.map((m, i) => `
    <div class="meal-card">
      <span class="meal-card-icon">${mealIcons[m.mealType] || '🍽️'}</span>
      <div class="meal-card-info">
        <div class="meal-card-name">${m.name}</div>
        <div class="meal-card-macros">
          <span>P: ${m.protein || 0}g</span>
          <span>C: ${m.carbs || 0}g</span>
          <span>F: ${m.fat || 0}g</span>
        </div>
      </div>
      <div class="meal-card-cal">${m.calories || 0}</div>
      <button class="meal-delete-btn" onclick="deleteMeal('${t}', ${meals.indexOf(m)})" aria-label="Delete meal">✕</button>
    </div>
  `).join('');
}

function filterMeals(type, btn) {
  State.currentMealFilter = type;
  document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderMealList();
}

function deleteMeal(dateStr, idx) {
  if (!State.meals[dateStr]) return;
  State.meals[dateStr].splice(idx, 1);
  Storage.set('meals', State.meals);
  renderNutrition();
  toast('Meal removed', 'info');
}

// ======================== FOOD SEARCH MODULE ========================
let _selectedFood = null;
let _selectedPortion = 1.0;
let _foodCatFilter = 'All';

function openMealModal() {
  ModalManager.open('meal-modal');
  setMealMode('search');
  _selectedFood = null;
  _selectedPortion = 1.0;
  clearFoodSelection();
  buildFoodCatTabs();
  renderFoodResults('', 'All');
}
function closeMealModal() { ModalManager.close(); }

function setMealMode(mode) {
  const isSearch = mode === 'search';
  document.getElementById('meal-search-mode').style.display = isSearch ? '' : 'none';
  document.getElementById('meal-manual-mode').style.display = isSearch ? 'none' : '';
  document.getElementById('mode-search-btn').classList.toggle('active', isSearch);
  document.getElementById('mode-manual-btn').classList.toggle('active', !isSearch);
}

function buildFoodCatTabs() {
  const tabs = document.getElementById('food-cat-tabs');
  if (!tabs) return;
  tabs.innerHTML = FOOD_CATEGORIES.map(cat => `
    <button class="food-cat-chip ${cat === _foodCatFilter ? 'active' : ''}" onclick="selectFoodCat('${cat}')">${cat}</button>
  `).join('');
}

function selectFoodCat(cat) {
  _foodCatFilter = cat;
  buildFoodCatTabs();
  renderFoodResults(document.getElementById('food-search-input')?.value || '', cat);
}

function onFoodSearch(query) {
  renderFoodResults(query, _foodCatFilter);
}

function renderFoodResults(query, catFilter) {
  const listEl = document.getElementById('food-results-list');
  const panelEl = document.getElementById('food-portion-panel');
  if (!listEl) return;
  // Hide portion panel, show results
  panelEl.style.display = 'none';
  listEl.style.display = '';

  let results;
  if (query && query.trim().length > 0) {
    results = searchFoods(query);
    if (catFilter !== 'All') results = results.filter(f => f.cat === catFilter);
  } else {
    // No query: show full category or popular foods
    results = catFilter === 'All'
      ? FOOD_DB.slice(0, 30)
      : FOOD_DB.filter(f => f.cat === catFilter);
  }

  if (results.length === 0) {
    listEl.innerHTML = `<div class="food-empty-state">😕 No foods found for "${query}".<br>Try the Manual Entry tab to add it.</div>`;
    return;
  }

  // Group by category when showing all
  if (catFilter === 'All' && !query) {
    const grouped = {};
    results.forEach(f => {
      if (!grouped[f.cat]) grouped[f.cat] = [];
      grouped[f.cat].push(f);
    });
    listEl.innerHTML = Object.entries(grouped).map(([cat, foods]) => `
      <div class="food-cat-header">${cat}</div>
      ${foods.map(f => foodResultHTML(f)).join('')}
    `).join('');
  } else {
    listEl.innerHTML = results.map(f => foodResultHTML(f)).join('');
  }
}

function foodResultHTML(f) {
  return `<div class="food-result-item" onclick="selectFood('${f.id}')">
    <div class="food-result-emoji">${f.emoji}</div>
    <div class="food-result-info">
      <div class="food-result-name">${f.name}</div>
      <div class="food-result-portion">${f.portion}</div>
    </div>
    <div class="food-result-cal">${f.cal} kcal</div>
  </div>`;
}

function selectFood(foodId) {
  const food = FOOD_DB.find(f => f.id === foodId);
  if (!food) return;
  _selectedFood = food;
  _selectedPortion = 1.0;
  showPortionPanel(food, 1.0);
}

function showPortionPanel(food, mult) {
  const panel = document.getElementById('food-portion-panel');
  const resultsList = document.getElementById('food-results-list');
  const catTabs = document.getElementById('food-cat-tabs');
  const searchBar = document.querySelector('#meal-search-mode .modal-search-bar');
  if (!panel) return;

  // Hide search, show panel
  resultsList.style.display = 'none';
  if (catTabs) catTabs.style.display = 'none';
  if (searchBar) searchBar.style.display = 'none';
  panel.style.display = '';

  document.getElementById('portion-food-name').textContent = `${food.emoji} ${food.name}`;
  document.getElementById('portion-food-base').textContent = `Base portion: ${food.portion}`;
  updatePortionMacros(food, mult);

  // Sync portion buttons
  document.querySelectorAll('.portion-scale-btn').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.mult) === mult);
  });

  // Auto-select meal type by time
  const h = new Date().getHours();
  const mealType = h < 11 ? 'breakfast' : h < 15 ? 'lunch' : h < 19 ? 'dinner' : 'snack';
  const sel = document.getElementById('food-meal-type');
  if (sel) sel.value = mealType;
}

function updatePortionMacros(food, mult) {
  const cal = Math.round(food.cal * mult);
  const p = Math.round(food.p * mult);
  const c = Math.round(food.c * mult);
  const f = Math.round(food.f * mult);
  document.getElementById('portion-scaled-macros').innerHTML = `
    <div class="macro-pill"><div class="macro-pill-val" style="color:var(--amber)">${cal}</div><div class="macro-pill-lbl">kcal</div></div>
    <div class="macro-pill"><div class="macro-pill-val" style="color:var(--cyan)">${p}g</div><div class="macro-pill-lbl">protein</div></div>
    <div class="macro-pill"><div class="macro-pill-val" style="color:var(--green)">${c}g</div><div class="macro-pill-lbl">carbs</div></div>
    <div class="macro-pill"><div class="macro-pill-val" style="color:var(--purple-light)">${f}g</div><div class="macro-pill-lbl">fat</div></div>
  `;
}

function selectPortion(mult) {
  if (!_selectedFood) return;
  _selectedPortion = mult;
  updatePortionMacros(_selectedFood, mult);
  document.querySelectorAll('.portion-scale-btn').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.mult) === mult);
  });
}

function clearFoodSelection() {
  _selectedFood = null;
  _selectedPortion = 1.0;
  const panel = document.getElementById('food-portion-panel');
  const resultsList = document.getElementById('food-results-list');
  const catTabs = document.getElementById('food-cat-tabs');
  const searchBar = document.querySelector('#meal-search-mode .modal-search-bar');
  if (panel) panel.style.display = 'none';
  if (resultsList) resultsList.style.display = '';
  if (catTabs) catTabs.style.display = '';
  if (searchBar) searchBar.style.display = '';
  const inp = document.getElementById('food-search-input');
  if (inp) inp.value = '';
  renderFoodResults('', _foodCatFilter);
}

function logSelectedFood() {
  if (!_selectedFood) return;
  const mult = _selectedPortion;
  const meal = {
    id: uid(),
    name: _selectedFood.name,
    mealType: document.getElementById('food-meal-type')?.value || 'snack',
    calories: Math.round(_selectedFood.cal * mult),
    protein: Math.round(_selectedFood.p * mult * 10) / 10,
    carbs: Math.round(_selectedFood.c * mult * 10) / 10,
    fat: Math.round(_selectedFood.f * mult * 10) / 10,
    timestamp: new Date().toISOString()
  };
  const t = today();
  if (!State.meals[t]) State.meals[t] = [];
  State.meals[t].push(meal);
  Storage.set('meals', State.meals);
  ModalManager.close();
  if (State.currentPage === 'nutrition') renderNutrition();
  if (State.currentPage === 'dashboard') renderDashboard();
  toast(`${_selectedFood.emoji} ${_selectedFood.name} logged! 🥗`, 'success');
  _selectedFood = null;
}

function clearMealForm() {
  ['meal-name','meal-calories','meal-protein','meal-carbs','meal-fat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function quickFillMeal(name, cal, protein, carbs, fat, type) {
  document.getElementById('meal-name').value = name;
  document.getElementById('meal-calories').value = cal;
  document.getElementById('meal-protein').value = protein;
  document.getElementById('meal-carbs').value = carbs;
  document.getElementById('meal-fat').value = fat;
  document.getElementById('meal-type-select').value = type;
}

function saveMeal() {
  const name = document.getElementById('meal-name').value.trim();
  if (!name) { toast('Please enter a meal name!', 'warning'); return; }

  const meal = {
    id: uid(),
    name,
    mealType: document.getElementById('meal-type-select').value,
    calories: parseFloat(document.getElementById('meal-calories').value) || 0,
    protein: parseFloat(document.getElementById('meal-protein').value) || 0,
    carbs: parseFloat(document.getElementById('meal-carbs').value) || 0,
    fat: parseFloat(document.getElementById('meal-fat').value) || 0,
    timestamp: new Date().toISOString()
  };

  const t = today();
  if (!State.meals[t]) State.meals[t] = [];
  State.meals[t].push(meal);
  Storage.set('meals', State.meals);
  closeMealModal();
  renderNutrition();
  toast(`${name} logged! 🥗`, 'success');
}

// ======================== WATER MODULE ========================
function getTodayWaterTotal(dateStr) {
  const data = State.water[dateStr];
  return data ? data.total : 0;
}

function addWater(ml) {
  const t = today();
  if (!State.water[t]) State.water[t] = { total: 0, log: [] };
  State.water[t].total += ml;
  State.water[t].log.push({ ml, time: new Date().toISOString() });
  Storage.set('water', State.water);
  renderWater();
  if (State.currentPage === 'dashboard') renderDashboard();
  toast(`+${ml}ml added! 💧`, 'info', 2000);
}

function quickAddWater500() {
  addWater(500);
}

function openCustomWater() {
  ModalManager.open('water-custom-modal');
}
function closeCustomWaterModal() { ModalManager.close(); }

function addCustomWater() {
  const ml = parseInt(document.getElementById('water-custom-input').value) || 0;
  if (ml <= 0) { toast('Enter a valid amount!', 'warning'); return; }
  closeCustomWaterModal();
  addWater(ml);
}

function resetWaterToday() {
  const t = today();
  State.water[t] = { total: 0, log: [] };
  Storage.set('water', State.water);
  renderWater();
  toast('Water log reset', 'info');
}

function renderWater() {
  const t = today();
  document.getElementById('water-date').textContent = formatDisplayDate(t);
  const total = getTodayWaterTotal(t);
  const goal = State.profile.waterGoal || 2500;
  const pct = clamp(total / goal, 0, 1);

  // Update amount display
  document.getElementById('water-amount-display').textContent = total;
  document.getElementById('water-pct').textContent = Math.round(pct * 100) + '%';
  document.getElementById('water-goal-text').textContent = `of ${(goal/1000).toFixed(1)}L daily goal`;

  const remaining = Math.max(0, goal - total);
  document.getElementById('water-remaining').textContent = remaining > 0
    ? `${remaining}ml to go` : '🎉 Daily goal reached!';

  // Animate water fill
  const fillContainer = document.getElementById('water-fill-container');
  if (fillContainer) fillContainer.style.height = `${pct * 100}%`;

  // Today's log
  const data = State.water[t];
  const logEl = document.getElementById('water-log-list');
  if (!data || data.log.length === 0) {
    logEl.innerHTML = '<div class="empty-state-inline" id="water-log-empty">No water logged yet today.</div>';
  } else {
    logEl.innerHTML = [...data.log].reverse().map(entry => `
      <div class="water-log-item">
        <span class="water-log-time">${formatTime(entry.time)}</span>
        <span class="water-log-amount">+${entry.ml}ml</span>
      </div>
    `).join('');
  }

  // Weekly chart
  renderWaterWeekChart();
}

function renderWaterWeekChart() {
  const el = document.getElementById('water-week-chart');
  const goal = State.profile.waterGoal || 2500;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today(), -i);
    days.push({ date: d, total: getTodayWaterTotal(d), isToday: d === today() });
  }

  const maxVal = Math.max(...days.map(d => d.total), goal);
  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  el.innerHTML = `
    <div class="water-week-bars">
      ${days.map((d, i) => {
        const h = maxVal > 0 ? (d.total / maxVal * 80) : 2;
        const dayOfWeek = parseDate(d.date).getDay();
        const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayOfWeek];
        return `
          <div class="water-week-bar-col ${d.isToday ? 'water-week-today' : ''}">
            <div class="water-week-bar-wrap">
              <div class="water-week-bar" style="height:${h}px" title="${d.total}ml"></div>
            </div>
            <span class="water-week-day">${d.isToday ? 'Today' : dayName}</span>
          </div>`;
      }).join('')}
    </div>
    <div style="text-align:center;font-size:0.7rem;color:var(--text-faint);margin-top:4px">Goal: ${goal}ml/day</div>
  `;
}

// ======================== WEIGHT MODULE ========================
function openWeightModal() {
  ModalManager.open('weight-modal');
  document.getElementById('weight-date-input').value = today();
  document.getElementById('weight-input').value = '';
}
function closeWeightModal() { ModalManager.close(); }

function saveWeight() {
  const w = parseFloat(document.getElementById('weight-input').value);
  const d = document.getElementById('weight-date-input').value || today();
  if (!w || w < 20 || w > 500) { toast('Enter a valid weight!', 'warning'); return; }
  logWeightEntry(w, d);
  closeWeightModal();
  if (State.currentPage === 'progress') renderProgress();
  if (State.currentPage === 'dashboard') renderDashboard();
  toast(`Weight logged: ${w} kg ⚖️`, 'success');
}

function logWeightEntry(weight, dateStr) {
  const existing = State.weights.findIndex(e => e.date === dateStr);
  if (existing >= 0) {
    State.weights[existing].weight = weight;
  } else {
    State.weights.push({ date: dateStr, weight });
  }
  State.weights.sort((a, b) => a.date.localeCompare(b.date));
  Storage.set('weights', State.weights);
  // Update profile weight
  State.profile.weight = weight;
  Storage.set('profile', State.profile);
}

// ======================== PROGRESS MODULE ========================
let weightPeriodDays = 14;

function setWeightPeriod(days, btn) {
  weightPeriodDays = days;
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  drawWeightChart();
}

function renderProgress() {
  document.getElementById('workout-streak').textContent = getWorkoutStreak();
  document.getElementById('total-workouts').textContent = State.workouts.length;
  document.getElementById('total-prs').textContent = Object.keys(State.prs).length;

  drawWeightChart();
  renderPRList();
  renderFrequencyChart();
}

function drawWeightChart() {
  const container = document.getElementById('weight-chart-container');
  const cutoff = addDays(today(), -weightPeriodDays);
  const data = State.weights.filter(w => w.date >= cutoff);

  if (data.length < 2) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📈</div><p>Log your weight daily to see your trend</p></div>`;
    return;
  }

  const W = 600, H = 160, pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const weights = data.map(d => d.weight);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;

  const xScale = (i) => pad.left + (i / (data.length - 1)) * innerW;
  const yScale = (w) => pad.top + (1 - (w - minW) / (maxW - minW)) * innerH;

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.weight) }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L${points[points.length-1].x},${pad.top + innerH} L${points[0].x},${pad.top + innerH} Z`;

  // X-axis labels (every few points)
  const step = Math.max(1, Math.floor(data.length / 5));
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1).map((d, _, arr) => {
    const origIdx = data.indexOf(d);
    return `<text class="chart-label" x="${xScale(origIdx)}" y="${H - 4}" text-anchor="middle">${formatShortDate(d.date)}</text>`;
  });

  // Y-axis labels
  const yStep = (maxW - minW) / 4;
  const yLabels = [0,1,2,3,4].map(i => {
    const val = minW + i * yStep;
    const y = yScale(val);
    return `
      <line class="chart-grid-line" x1="${pad.left}" y1="${y}" x2="${pad.left + innerW}" y2="${y}"/>
      <text class="chart-label" x="${pad.left - 4}" y="${y + 3}" text-anchor="end">${val.toFixed(1)}</text>`;
  });

  container.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${W} ${H}" aria-label="Weight chart">
      <defs>
        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${yLabels.join('')}
      ${xLabels.join('')}
      <path class="chart-area" d="${areaD}" fill="url(#weightGrad)"/>
      <path class="chart-line" d="${pathD}" stroke="#a78bfa"/>
      ${points.map((p, i) => `
        <circle class="chart-dot" cx="${p.x}" cy="${p.y}" r="4" fill="#7c3aed"
          title="${data[i].date}: ${data[i].weight}kg"/>
      `).join('')}
    </svg>`;
}

function renderPRList() {
  const el = document.getElementById('pr-list');
  const prs = Object.entries(State.prs);
  if (prs.length === 0) {
    el.innerHTML = '<div class="empty-state-inline">Start logging workouts to track your PRs!</div>';
    document.getElementById('total-prs').textContent = '0';
    return;
  }
  document.getElementById('total-prs').textContent = prs.length;
  el.innerHTML = prs.map(([name, pr]) => `
    <div class="pr-item">
      <div>
        <div class="pr-name">🏋️ ${name}</div>
        <div class="pr-date">${formatDisplayDate(pr.date)}</div>
      </div>
      <div class="pr-value">${pr.weight}kg × ${pr.reps}</div>
    </div>
  `).join('');
}

function renderFrequencyChart() {
  const el = document.getElementById('frequency-chart');
  const weeks = [];
  for (let w = 3; w >= 0; w--) {
    const start = addDays(today(), -(w * 7 + 6));
    const end = addDays(today(), -w * 7);
    const count = State.workouts.filter(wo => wo.date >= start && wo.date <= end).length;
    weeks.push({ label: w === 0 ? 'This Week' : `${w}W ago`, count });
  }

  const maxCount = Math.max(...weeks.map(w => w.count), 1);
  const barH = 80;
  el.innerHTML = `
    <div style="display:flex;gap:12px;align-items:flex-end;height:${barH + 24}px;padding-top:4px">
      ${weeks.map(w => {
        const h = Math.max((w.count / maxCount) * barH, 2);
        return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <span style="font-size:0.75rem;color:var(--purple-light);font-weight:700">${w.count}</span>
            <div style="height:${h}px;width:100%;border-radius:6px 6px 0 0;background:linear-gradient(180deg,var(--purple),rgba(124,58,237,0.3));transition:height 0.8s ease"></div>
            <span style="font-size:0.7rem;color:var(--text-faint)">${w.label}</span>
          </div>`;
      }).join('')}
    </div>`;
}

// ======================== AI COACH ENGINE ========================
function generateInsights() {
  const insights = [];
  const p = State.profile;
  const t = today();
  const workouts = State.workouts;
  const meals = State.meals[t] || [];
  const totalCal = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalWater = getTodayWaterTotal(t);
  const waterGoal = p.waterGoal || 2500;
  const calc = calculateTDEE(p);
  const targetCal = calc.targetCalories || 2000;
  const targetProtein = calc.macros.protein || 150;

  // Sort workouts by date
  const sortedWO = [...workouts].sort((a,b) => b.date.localeCompare(a.date));
  const lastWO = sortedWO[0];
  const daysSinceWO = lastWO ? daysBetween(lastWO.date, t) : 999;

  // === Motivation ===
  if (daysSinceWO === 0) {
    insights.push({
      type: 'celebration',
      icon: '🔥',
      title: 'Workout Complete!',
      text: `Great job training today! Recovery and nutrition are key — hit your protein goal.`,
    });
  } else if (daysSinceWO >= 3) {
    insights.push({
      type: 'motivation',
      icon: '💪',
      title: 'Time to Train!',
      text: `You haven't trained in ${daysSinceWO} days. Your body is rested — get back in the gym!`,
    });
  } else if (daysSinceWO === 1) {
    insights.push({
      type: 'motivation',
      icon: '⚡',
      title: 'Rest Day Yesterday',
      text: `You trained yesterday. Today is perfect for working different muscle groups!`,
    });
  }

  // === What to train today ===
  const muscleFreq = getMuscleFrequency(7);
  const allMuscles = ['Chest','Back','Shoulders','Arms','Legs','Core'];
  const leastTrained = allMuscles
    .map(m => ({ m, count: muscleFreq[m] || 0 }))
    .sort((a,b) => a.count - b.count)
    .slice(0, 2)
    .map(e => e.m);

  if (leastTrained.length > 0) {
    insights.push({
      type: 'recovery',
      icon: '🎯',
      title: 'Recommended Training',
      text: `Based on your recent workouts, focus on ${leastTrained.join(' & ')} today for balanced development.`,
    });
  }

  // === Nutrition ===
  if (totalCal > 0 && totalCal < targetCal * 0.7) {
    insights.push({
      type: 'nutrition',
      icon: '🍽️',
      title: 'Calorie Deficit Alert',
      text: `You've only eaten ${totalCal} kcal today vs your target of ${targetCal} kcal. Don't under-fuel your body!`,
    });
  } else if (totalCal > targetCal * 1.2) {
    insights.push({
      type: 'nutrition',
      icon: '⚠️',
      title: 'Over Calorie Target',
      text: `You're ${totalCal - targetCal} kcal above your daily target. Consider lighter meals for the rest of the day.`,
    });
  }

  if (totalProtein > 0 && totalProtein < targetProtein * 0.7) {
    insights.push({
      type: 'nutrition',
      icon: '🥩',
      title: 'Protein Intake Low',
      text: `You've had ${Math.round(totalProtein)}g protein but need ${targetProtein}g. Add chicken, eggs, or a shake!`,
    });
  }

  // === Hydration ===
  const hour = new Date().getHours();
  if (hour >= 14 && totalWater < waterGoal * 0.5) {
    insights.push({
      type: 'hydration',
      icon: '💧',
      title: 'Hydration Reminder',
      text: `It's ${hour}:00 and you've only had ${totalWater}ml of your ${waterGoal}ml goal. Drink up!`,
    });
  } else if (totalWater >= waterGoal) {
    insights.push({
      type: 'celebration',
      icon: '🎉',
      title: 'Hydration Goal Reached!',
      text: `Excellent! You've hit your daily water goal of ${waterGoal}ml. Great for recovery and performance!`,
    });
  }

  // === Weight trend ===
  if (State.weights.length >= 7) {
    const recent = State.weights.slice(-7);
    const weekDiff = recent[recent.length-1].weight - recent[0].weight;
    if (weekDiff < -1.5) {
      insights.push({
        type: 'recovery',
        icon: '📉',
        title: 'Rapid Weight Loss',
        text: `You've lost ${Math.abs(weekDiff.toFixed(1))}kg this week. Consider increasing calories slightly to preserve muscle.`,
      });
    } else if (weekDiff > 1.5 && p.goal === 'lose_weight') {
      insights.push({
        type: 'nutrition',
        icon: '📈',
        title: 'Weight Trending Up',
        text: `You've gained ${weekDiff.toFixed(1)}kg this week. Review your calorie intake to stay on track with your goal.`,
      });
    }
  }

  // === PRs ===
  const recentPRs = Object.entries(State.prs).filter(([, pr]) => pr.date === t);
  if (recentPRs.length > 0) {
    insights.push({
      type: 'celebration',
      icon: '🏆',
      title: 'New Personal Record!',
      text: `You set ${recentPRs.length} new PR${recentPRs.length > 1 ? 's' : ''} today! Keep pushing your limits!`,
    });
  }

  // === Streak ===
  const streak = getWorkoutStreak();
  if (streak >= 7) {
    insights.push({
      type: 'celebration',
      icon: '🔥',
      title: `${streak}-Day Streak!`,
      text: `Incredible consistency! You've trained ${streak} days in a row. You're building a powerful habit!`,
    });
  }

  // Default
  if (insights.length === 0) {
    insights.push({
      type: 'motivation',
      icon: '⚡',
      title: 'Stay Consistent!',
      text: 'Log your workouts, meals, and water daily to get personalised insights from your AI coach.',
    });
  }

  return insights;
}

function getMuscleFrequency(days) {
  const cutoff = addDays(today(), -days);
  const freq = {};
  State.workouts
    .filter(w => w.date >= cutoff)
    .forEach(w => {
      w.exercises.forEach(ex => {
        freq[ex.group] = (freq[ex.group] || 0) + 1;
      });
    });
  return freq;
}

function renderCoach() {
  // Health Score
  renderHealthScore();

  // Insights
  const insights = generateInsights();
  const el = document.getElementById('insights-list');
  el.innerHTML = insights.map(insight => `
    <div class="insight-card type-${insight.type}">
      <span class="insight-icon">${insight.icon}</span>
      <div class="insight-body">
        <div class="insight-title">${insight.title}</div>
        <div class="insight-text">${insight.text}</div>
      </div>
    </div>
  `).join('');

  // Today's suggestion
  renderWorkoutSuggestion();

  // Muscle recovery
  renderMuscleRecovery();
}

function renderHealthScore() {
  const p = State.profile;
  const t = today();

  // Consistency score (workouts last 7 days / 4)
  const cutoff7 = addDays(today(), -7);
  const weekWOs = State.workouts.filter(w => w.date >= cutoff7).length;
  const consistencyScore = Math.min(weekWOs / 4, 1);

  // Nutrition score (today's calories within 20% of target)
  const meals = State.meals[t] || [];
  const totalCal = meals.reduce((s, m) => s + m.calories, 0);
  const calc = calculateTDEE(p);
  const targetCal = calc.targetCalories || 2000;
  const calRatio = totalCal > 0 ? Math.min(totalCal / targetCal, 2) : 0;
  const nutritionScore = calRatio > 0 ? Math.max(0, 1 - Math.abs(calRatio - 1)) : 0.1;

  // Hydration score
  const totalWater = getTodayWaterTotal(t);
  const hydrationScore = Math.min(totalWater / (p.waterGoal || 2500), 1);

  // Weight logging score (entries in last 7 days)
  const weightDays = State.weights.filter(w => w.date >= cutoff7).length;
  const weightScore = Math.min(weightDays / 5, 1);

  const overall = Math.round((consistencyScore * 0.35 + nutritionScore * 0.3 + hydrationScore * 0.2 + weightScore * 0.15) * 100);
  const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : 'D';
  const color = overall >= 80 ? 'var(--green)' : overall >= 60 ? 'var(--amber)' : 'var(--red)';

  // Ring
  const circ = 314;
  const fill = (overall / 100) * circ;
  const ring = document.getElementById('score-ring');
  if (ring) {
    ring.setAttribute('stroke-dasharray', `${fill.toFixed(1)} ${(circ - fill).toFixed(1)}`);
    ring.setAttribute('stroke', color);
  }
  const scoreEl = document.getElementById('score-value');
  if (scoreEl) { scoreEl.textContent = overall; scoreEl.style.color = color; }
  const gradeEl = document.getElementById('score-grade');
  if (gradeEl) gradeEl.textContent = grade;

  // Bars
  const setBar = (id, valId, pct) => {
    const el = document.getElementById(id);
    const vEl = document.getElementById(valId);
    if (el) el.style.width = Math.round(pct * 100) + '%';
    if (vEl) vEl.textContent = Math.round(pct * 100) + '%';
  };

  setBar('score-consistency', 'score-consistency-val', consistencyScore);
  setBar('score-nutrition', 'score-nutrition-val', nutritionScore);
  setBar('score-hydration', 'score-hydration-val', hydrationScore);
  setBar('score-weight', 'score-weight-val', weightScore);
}

function renderWorkoutSuggestion() {
  const el = document.getElementById('suggestion-content');
  const muscleFreq = getMuscleFrequency(7);
  const allMuscles = ['Chest','Back','Shoulders','Arms','Legs','Core'];
  const sorted = allMuscles
    .map(m => ({ m, count: muscleFreq[m] || 0 }))
    .sort((a,b) => a.count - b.count);

  const topSuggestion = sorted[0];
  const workoutsThisWeek = getWorkoutsThisWeek();
  let suggestionText = '';

  if (workoutsThisWeek === 0) {
    suggestionText = `<p style="color:var(--text-muted);font-size:0.9rem">You haven't trained this week! Start with a <strong>Full Body</strong> session or pick a template above.</p>`;
  } else if (topSuggestion.count === 0) {
    suggestionText = `
      <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:12px">
        You haven't trained <strong>${topSuggestion.m}</strong> this week. Time to hit it!
      </p>
      <button class="btn btn-primary" onclick="navigate('workout');loadTemplate('${getTemplateForMuscle(topSuggestion.m)}')">
        Start ${topSuggestion.m} Workout →
      </button>`;
  } else {
    suggestionText = `
      <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:12px">
        Least trained this week: <strong>${topSuggestion.m}</strong> (${topSuggestion.count} sessions). 
        Balance your training for optimal growth.
      </p>
      <button class="btn btn-outline" onclick="navigate('workout')">Go to Workout →</button>`;
  }

  el.innerHTML = suggestionText;
}

function getTemplateForMuscle(muscle) {
  const map = { Chest:'push', Back:'pull', Shoulders:'push', Arms:'push', Legs:'legs', Core:'full', Cardio:'cardio' };
  return map[muscle] || 'full';
}

function renderMuscleRecovery() {
  const el = document.getElementById('muscle-recovery');
  const muscles = [
    { name: 'Chest', icon: '🫁' },
    { name: 'Back', icon: '🔙' },
    { name: 'Shoulders', icon: '💆' },
    { name: 'Arms', icon: '💪' },
    { name: 'Legs', icon: '🦵' },
    { name: 'Core', icon: '🎯' },
    { name: 'Cardio', icon: '❤️' },
    { name: 'Full Body', icon: '⚡' },
  ];

  const cutoff2 = addDays(today(), -2);
  const cutoff1 = addDays(today(), -1);

  el.innerHTML = muscles.map(m => {
    // Check last 2 days for this muscle
    const recentExercises = State.workouts
      .filter(w => w.date >= cutoff2)
      .flatMap(w => w.exercises)
      .filter(e => e.group === m.name);

    let status, statusText;
    if (recentExercises.length === 0) {
      status = 'fresh';
      statusText = 'Ready';
    } else if (recentExercises.length <= 2) {
      status = 'sore';
      statusText = 'Recovering';
    } else {
      status = 'recovering';
      statusText = 'Rest';
    }

    return `
      <div class="muscle-chip ${status}">
        <span class="muscle-chip-icon">${m.icon}</span>
        <span class="muscle-chip-name">${m.name}</span>
        <span class="muscle-chip-status">${statusText}</span>
      </div>`;
  }).join('');
}

// ======================== DATA EXPORT / CLEAR ========================
function exportData() {
  const data = {
    profile: State.profile,
    workouts: State.workouts,
    meals: State.meals,
    weights: State.weights,
    water: State.water,
    prs: State.prs,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitforge-data-${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Data exported! 📤', 'success');
}

function confirmClearData() {
  if (confirm('⚠️ This will permanently delete ALL your FitForge data. Are you sure?')) {
    ['profile','workouts','meals','weights','water','prs','onboarded'].forEach(k => Storage.remove(k));
    toast('All data cleared. Reloading...', 'warning');
    setTimeout(() => location.reload(), 1500);
  }
}

// ======================== INIT ========================
function init() {
  const isOnboarded = Storage.get('onboarded', false);
  const hasProfile = !!(State.profile && State.profile.name);

  if (!isOnboarded && !hasProfile) {
    document.getElementById('onboarding-overlay').style.display = 'flex';
    document.getElementById('app-shell').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
  } else {
    document.getElementById('onboarding-overlay').style.display = 'none';
    document.getElementById('app-shell').style.display = 'flex';
    document.getElementById('bottom-nav').style.display = '';
    Storage.set('onboarded', true);
    updateHeaderAvatar();
    navigate('dashboard');
  }

  // Initialize the single modal manager (handles all open/close/backdrop/X/Escape)
  ModalManager.init();

  // Nav click handlers
  document.querySelectorAll('.nav-link, .bnav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.page);
    });
  });

  // Coach badge (show if unread insights)
  setTimeout(() => {
    const insights = generateInsights();
    const badge = document.getElementById('coach-badge');
    if (badge && insights.length > 0) {
      badge.style.display = '';
      badge.textContent = insights.length;
    }
  }, 500);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
