const heroLevels = [
  {
    title: "Gavião Arqueiro",
    short: "GA",
    required: 0,
    color: "#9CA3AF",
    description: "Precisão, técnica e disciplina humana no começo da jornada.",
  },
  {
    title: "Batman",
    short: "BT",
    required: 5000,
    color: "#60A5FA",
    description: "Condicionamento de elite, estratégia e consistência diária.",
  },
  {
    title: "Capitão América",
    short: "CA",
    required: 15000,
    color: "#34D399",
    description: "Força aprimorada, resistência e evolução acima da média.",
  },
  {
    title: "Homem-Aranha",
    short: "HA",
    required: 35000,
    color: "#FBBF24",
    description: "Potência super-humana, agilidade e progresso explosivo.",
  },
  {
    title: "Mulher-Maravilha",
    short: "MM",
    required: 75000,
    color: "#EF4444",
    description: "Força lendária, presença dominante e alto volume acumulado.",
  },
  {
    title: "Superman",
    short: "SM",
    required: 150000,
    color: "#00D9FF",
    description: "O topo da escala: força extrema, constância e domínio total.",
  },
];

const epicAchievements = [
  {
    volume: 1000,
    title: "Força de Motociclista",
    comparison: "Você levantou o equivalente a uma moto.",
  },
  {
    volume: 5000,
    title: "Carregador de Veículos",
    comparison: "Você levantou o equivalente a um carro popular.",
  },
  {
    volume: 10000,
    title: "Domador de Gigantes",
    comparison: "Você levantou o equivalente a um elefante africano.",
  },
  {
    volume: 20000,
    title: "Mestre da Massa",
    comparison: "Você levantou o equivalente a um ônibus completo.",
  },
  {
    volume: 50000,
    title: "Engenheiro Titânico",
    comparison: "Você moveu peso suficiente para erguer uma pequena ponte.",
  },
];

const state = {
  workouts: [],
  exercises: [],
  activeScreen: "dashboard",
  chart: null,
};

const quickExerciseLimit = 6;
const searchExerciseLimit = 8;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", init);

function init() {
  state.workouts = window.LiftHeroBackend.listWorkouts();
  state.exercises = window.LiftHeroBackend.listExercises();
  $("#date").value = new Date().toISOString().slice(0, 10);

  bindNavigation();
  bindForm();
  bindAutocomplete();
  bindFilters();
  loadExercises();
  render();
}

function bindNavigation() {
  $$("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => setScreen(button.dataset.screen));
  });
}

function setScreen(screen) {
  state.activeScreen = screen;

  $$(".screen").forEach((section) => {
    section.classList.toggle("is-active", section.id === `screen-${screen}`);
  });

  $$(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screen === screen);
  });

  if (screen === "evolution") {
    showChartLoading();
    window.setTimeout(renderEvolution, 250);
  }

  $("#app").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindForm() {
  $("#workout-form").addEventListener("submit", handleWorkoutSubmit);

  $$("[data-step-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = $(`#${button.dataset.stepTarget}`);
      const step = Number(button.dataset.step);
      updateNumberInput(input, step);
      updateGeneratedVolume();
    });
  });

  ["sets", "reps", "weight"].forEach((id) => {
    $(`#${id}`).addEventListener("input", updateGeneratedVolume);
  });
}

function updateNumberInput(input, step) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 999);
  const current = Number(input.value || 0);
  const next = Math.min(max, Math.max(min, current + step));
  input.value = Number.isInteger(next) ? next : next.toFixed(1).replace(".0", "");
}

function updateGeneratedVolume() {
  const volume = getFormVolume();
  $("#generated-volume").textContent = formatKg(volume);
}

function getFormVolume() {
  const sets = Number($("#sets").value || 0);
  const reps = Number($("#reps").value || 0);
  const weight = Number($("#weight").value || 0);
  return sets * reps * weight;
}

function handleWorkoutSubmit(event) {
  event.preventDefault();

  const exercise = $("#exercise").value.trim();
  const date = $("#date").value;
  const sets = Number($("#sets").value);
  const reps = Number($("#reps").value);
  const weight = Number($("#weight").value);
  const error = $("#exercise-error");

  if (!exercise) {
    error.textContent = "Escolha ou digite um exercício.";
    $("#exercise").focus();
    return;
  }

  if (!date || sets < 1 || reps < 1 || weight < 0) {
    error.textContent = "";
    showToast("Revise os campos antes de completar a missão.", false);
    return;
  }

  const workout = window.LiftHeroBackend.createWorkout({
    exerciseName: exercise,
    date,
    sets,
    reps,
    weight,
  });

  state.workouts = window.LiftHeroBackend.listWorkouts();
  state.exercises = window.LiftHeroBackend.listExercises();

  $("#workout-form").reset();
  $("#date").value = new Date().toISOString().slice(0, 10);
  $("#sets").value = 3;
  $("#reps").value = 10;
  $("#weight").value = 20;
  error.textContent = "";
  updateGeneratedVolume();

  showToast(workout.isPR ? "Missão concluída. Novo PR desbloqueado!" : "Missão concluída com sucesso.", workout.isPR);
  render();
}

function showToast(message, isPR) {
  const toast = $("#save-toast");
  toast.className = "toast success";
  toast.innerHTML = `
    <strong>${message}</strong>
    ${isPR ? '<span class="pr-badge">Novo PR</span>' : "<span>Sua força acumulada foi atualizada.</span>"}
  `;
  window.setTimeout(() => toast.classList.add("is-hidden"), 3600);
}

function bindAutocomplete() {
  const input = $("#exercise");
  input.addEventListener("input", renderAutocomplete);
  input.addEventListener("pointerdown", renderAutocomplete);
  input.addEventListener("click", renderAutocomplete);
  input.addEventListener("focus", renderAutocomplete);
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".autocomplete-wrap")) {
      $("#exercise-list").classList.add("is-hidden");
      input.setAttribute("aria-expanded", "false");
    }
  });
}

function renderAutocomplete(event) {
  const input = $("#exercise");
  const query = input.value.trim();
  const list = $("#exercise-list");
  const isOpening = event && ["click", "focus", "pointerdown"].includes(event.type);
  const isFocused = document.activeElement === input || isOpening;

  if (!query && !isFocused) {
    list.classList.add("is-hidden");
    list.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    return;
  }

  const results = query
    ? state.exercises
      .filter((exercise) => normalize(exercise).includes(normalize(query)))
      .slice(0, searchExerciseLimit)
    : state.exercises.slice(0, quickExerciseLimit);

  if (!results.length) {
    list.classList.add("is-hidden");
    input.setAttribute("aria-expanded", "false");
    return;
  }

  list.innerHTML = results
    .map((exercise) => `<button type="button" role="option" data-exercise="${escapeHtml(exercise)}">${escapeHtml(exercise)}</button>`)
    .join("");

  list.classList.remove("is-hidden");
  input.setAttribute("aria-expanded", "true");

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      $("#exercise").value = button.dataset.exercise;
      $("#exercise-list").classList.add("is-hidden");
      $("#exercise-error").textContent = "";
      input.setAttribute("aria-expanded", "false");
    });
  });
}

function bindFilters() {
  $("#history-filter").addEventListener("change", renderHistory);
  $("#exercise-filter").addEventListener("change", renderEvolution);
}

async function loadExercises() {
  state.exercises = await window.LiftHeroBackend.loadExerciseCatalog("data/exercises.json");
  renderAutocomplete();
}

function render() {
  state.workouts = window.LiftHeroBackend.listWorkouts();
  state.exercises = window.LiftHeroBackend.listExercises();
  const stats = calculateStats();
  renderDashboard(stats);
  renderHistory();
  renderFilters();
  renderAchievements(stats.totalVolume);
  if (state.activeScreen === "evolution") renderEvolution();
}

function calculateStats() {
  const totalVolume = state.workouts.reduce((sum, item) => sum + item.volume, 0);
  const prEntries = state.workouts.filter((item) => item.isPR).sort(byDateAsc);
  const lastPR = prEntries.at(-1) || null;

  return {
    totalVolume,
    currentStreak: calculateStreak(),
    lastPR,
    plateauExercises: calculatePlateaus(),
    levelInfo: getHeroLevel(totalVolume),
  };
}

function calculateStreak() {
  const uniqueDates = [...new Set(state.workouts.map((item) => item.date))].sort().reverse();
  if (!uniqueDates.length) return 0;

  let streak = 0;
  const cursor = new Date(`${uniqueDates[0]}T00:00:00`);
  cursor.setHours(0, 0, 0, 0);

  const dateSet = new Set(uniqueDates);
  for (let i = 0; i < 365; i += 1) {
    const key = cursor.toISOString().slice(0, 10);
    if (dateSet.has(key)) {
      streak += 1;
    } else if (streak > 0) {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function calculatePlateaus() {
  const today = new Date();
  const groups = window.LiftHeroBackend.groupByExercise();

  return Object.entries(groups)
    .filter(([, entries]) => entries.length >= 2)
    .filter(([, entries]) => {
      const sorted = entries.slice().sort(byDateAsc);
      const max = Math.max(...sorted.map((item) => item.weight));
      const lastPR = sorted.filter((item) => item.weight >= max).at(-1);
      if (!lastPR) return false;
      const daysSincePR = (today - new Date(`${lastPR.date}T00:00:00`)) / 86400000;
      return daysSincePR >= 21;
    })
    .map(([exercise]) => exercise);
}

function getHeroLevel(totalVolume) {
  let current = heroLevels[0];
  let next = heroLevels[1] || null;

  for (let i = heroLevels.length - 1; i >= 0; i -= 1) {
    if (totalVolume >= heroLevels[i].required) {
      current = heroLevels[i];
      next = heroLevels[i + 1] || null;
      break;
    }
  }

  const currentProgress = totalVolume - current.required;
  const needed = next ? next.required - current.required : 0;
  const percentage = next ? Math.min(100, (currentProgress / needed) * 100) : 100;

  return { current, next, currentProgress, needed, percentage };
}

function renderDashboard(stats) {
  const { current, next, percentage } = stats.levelInfo;
  $("#hero-emblem").textContent = current.short;
  $("#hero-emblem").style.borderColor = current.color;
  $("#hero-emblem").style.boxShadow = `0 0 30px ${current.color}55`;
  $("#hero-status-title").textContent = current.title;
  $("#hero-level-pill").textContent = `Nv. ${heroLevels.indexOf(current) + 1}`;
  $("#hero-level-description").textContent = current.description;
  $("#level-progress-value").textContent = `${Math.round(percentage)}%`;
  $("#level-progress-bar").style.width = `${percentage}%`;
  $("#next-level-label").textContent = next ? `Próximo nível: ${next.title}` : "Nível máximo alcançado";
  $("#level-progress-hint").textContent = next
    ? `Faltam ${formatKg(next.required - stats.totalVolume)} de força acumulada.`
    : "Você alcançou o topo da escala heroica.";

  $("#metric-streak").textContent = `${stats.currentStreak} ${stats.currentStreak === 1 ? "dia" : "dias"}`;
  $("#metric-volume").textContent = formatKg(stats.totalVolume);
  $("#metric-comparison").textContent = getCurrentComparison(stats.totalVolume);
  $("#metric-pr").textContent = stats.lastPR ? `${formatNumber(stats.lastPR.weight)} kg` : "Nenhum";
  $("#metric-pr-subtitle").textContent = stats.lastPR
    ? `${stats.lastPR.exerciseName} · ${formatDate(stats.lastPR.date)}`
    : "Bata seu primeiro recorde.";

  const plateau = $("#plateau-alert");
  if (stats.plateauExercises.length) {
    $("#plateau-message").textContent = `3 semanas sem novo PR: ${stats.plateauExercises.join(", ")}.`;
    plateau.classList.remove("is-hidden");
  } else {
    plateau.classList.add("is-hidden");
  }
}

function renderHistory() {
  const filter = $("#history-filter").value || "all";
  const entries = filter === "all"
    ? state.workouts
    : state.workouts.filter((item) => item.exerciseName === filter);

  $("#history-count").textContent = `${entries.length} ${entries.length === 1 ? "missão registrada" : "missões registradas"}.`;

  const list = $("#history-list");
  if (!entries.length) {
    list.innerHTML = '<div class="empty-state">Seu progresso começa no primeiro registro.</div>';
    return;
  }

  list.innerHTML = entries
    .slice()
    .sort(byDateDesc)
    .map((item) => `
      <article class="history-item">
        <div class="history-item-header">
          <div>
            <h3>${escapeHtml(item.exerciseName)}</h3>
            <p>${formatDate(item.date)}</p>
          </div>
          ${item.isPR ? '<span class="pr-badge">Novo PR</span>' : ""}
        </div>
        <div class="history-meta">
          <div><span>Séries x reps</span><strong>${item.sets} x ${item.reps}</strong></div>
          <div><span>Carga</span><strong>${formatNumber(item.weight)} kg</strong></div>
          <div><span>Força</span><strong>${formatKg(item.volume)}</strong></div>
        </div>
      </article>
    `)
    .join("");
}

function renderFilters() {
  const exercises = Object.keys(window.LiftHeroBackend.groupByExercise()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const historyFilter = $("#history-filter");
  const currentHistory = historyFilter.value || "all";
  historyFilter.innerHTML = '<option value="all">Todos os exercícios</option>'
    + exercises.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  historyFilter.value = exercises.includes(currentHistory) ? currentHistory : "all";

  const exerciseFilter = $("#exercise-filter");
  const currentExercise = exerciseFilter.value;
  exerciseFilter.innerHTML = exercises.length
    ? exercises.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")
    : '<option value="">Sem dados</option>';
  exerciseFilter.value = exercises.includes(currentExercise) ? currentExercise : (exercises[0] || "");
}

function renderEvolution() {
  const selected = $("#exercise-filter").value;
  const entries = selected ? window.LiftHeroBackend.getExerciseEntries(selected).sort(byDateAsc) : [];
  const chartEmpty = $("#chart-empty");

  $("#chart-spinner").classList.add("is-hidden");

  if (!entries.length) {
    $("#exercise-max").textContent = "0 kg";
    $("#exercise-last").textContent = "0 kg";
    $("#exercise-trend").textContent = "Sem dados";
    chartEmpty.classList.remove("is-hidden");
    destroyChart();
    return;
  }

  chartEmpty.classList.add("is-hidden");
  const max = Math.max(...entries.map((item) => item.weight));
  const last = entries.at(-1);
  $("#exercise-max").textContent = `${formatNumber(max)} kg`;
  $("#exercise-last").textContent = `${formatNumber(last.weight)} kg`;
  $("#exercise-trend").textContent = getTrend(entries);

  renderChart(entries);
}

function showChartLoading() {
  $("#chart-spinner").classList.remove("is-hidden");
}

function renderChart(entries) {
  destroyChart();
  const ctx = $("#evolution-chart");

  if (!window.Chart) {
    drawFallbackChart(ctx, entries);
    return;
  }

  state.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: entries.map((item) => formatDateShort(item.date)),
      datasets: [{
        label: "Carga (kg)",
        data: entries.map((item) => item.weight),
        borderColor: "#00D9FF",
        backgroundColor: "rgba(0, 217, 255, 0.12)",
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#00D9FF",
        tension: 0.32,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#F5F5F7" } },
      },
      scales: {
        x: { ticks: { color: "#A8ADBB" }, grid: { color: "rgba(255,255,255,0.08)" } },
        y: { ticks: { color: "#A8ADBB" }, grid: { color: "rgba(255,255,255,0.08)" } },
      },
    },
  });
}

function drawFallbackChart(canvas, entries) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = 280 * dpr;
  context.scale(dpr, dpr);
  context.clearRect(0, 0, rect.width, 280);
  context.fillStyle = "#A8ADBB";
  context.font = "14px system-ui";
  context.fillText("Chart.js indisponível. Dados de carga:", 16, 26);
  entries.slice(-6).forEach((item, index) => {
    context.fillText(`${formatDateShort(item.date)} · ${formatNumber(item.weight)} kg`, 16, 56 + index * 24);
  });
}

function destroyChart() {
  if (state.chart) {
    state.chart.destroy();
    state.chart = null;
  }
}

function renderAchievements(totalVolume) {
  $("#levels-grid").innerHTML = heroLevels.map((level, index) => {
    const isUnlocked = totalVolume >= level.required;
    const levelInfo = getHeroLevel(totalVolume);
    const isCurrent = levelInfo.current.title === level.title;
    return `
      <article class="level-card ${isCurrent ? "is-current" : ""} ${isUnlocked ? "" : "is-locked"}">
        <div class="level-symbol" style="border: 1px solid ${level.color}; color: ${level.color}">${level.short}</div>
        <div>
          <h3>${level.title}</h3>
          <p>${level.description}</p>
        </div>
        <span class="status-pill">${isUnlocked ? "Desbloqueado" : formatKg(level.required)}</span>
      </article>
    `;
  }).join("");

  $("#achievements-grid").innerHTML = epicAchievements.map((achievement) => {
    const progress = Math.min(100, (totalVolume / achievement.volume) * 100);
    const isUnlocked = totalVolume >= achievement.volume;
    return `
      <article class="achievement-card ${isUnlocked ? "is-unlocked" : ""}">
        <div class="achievement-card-header">
          <div>
            <h3>${achievement.title}</h3>
            <p>${achievement.comparison}</p>
          </div>
          <span class="status-pill">${isUnlocked ? "Desbloqueado" : `${Math.round(progress)}%`}</span>
        </div>
        <div class="achievement-progress">
          <div class="progress-label">
            <span>${formatKg(totalVolume)}</span>
            <strong>${formatKg(achievement.volume)}</strong>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function getTrend(entries) {
  if (entries.length < 3) return "Estável";
  const recent = entries.slice(-3);
  const first = recent[0].weight;
  const last = recent.at(-1).weight;
  if (last > first) return "Evoluindo";
  if (last < first) return "Atenção";
  return "Platô";
}

function getCurrentComparison(totalVolume) {
  const current = epicAchievements.slice().reverse().find((item) => totalVolume >= item.volume);
  return current ? current.comparison : "Registre sua primeira missão.";
}

function byDateAsc(a, b) {
  return new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`);
}

function byDateDesc(a, b) {
  return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`);
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatKg(value) {
  return `${formatNumber(value)} kg`;
}

function formatNumber(value) {
  return Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
