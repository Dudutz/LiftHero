(function () {
  const WORKOUTS_KEY = "lifthero-workouts";
  const EXERCISES_KEY = "lifthero-exercises";

  const fallbackExercises = [
    "Supino Reto",
    "Supino Inclinado",
    "Supino Declinado",
    "Agachamento Livre",
    "Agachamento no Smith",
    "Leg Press 45",
    "Levantamento Terra",
    "Levantamento Terra Romeno",
    "Desenvolvimento Militar",
    "Desenvolvimento com Halteres",
    "Remada Curvada",
    "Remada Cavalinho",
    "Puxada Alta",
    "Barra Fixa",
    "Rosca Direta",
    "Rosca Alternada",
    "Tríceps Testa",
    "Tríceps Pulley",
    "Elevação Lateral",
    "Crucifixo",
  ];

  function readJson(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function listWorkouts() {
    const workouts = readJson(WORKOUTS_KEY, []);
    return Array.isArray(workouts) ? workouts : [];
  }

  function saveWorkouts(workouts) {
    writeJson(WORKOUTS_KEY, workouts);
  }

  function listExercises() {
    const exercises = readJson(EXERCISES_KEY, fallbackExercises);
    return Array.isArray(exercises) ? exercises : fallbackExercises;
  }

  function saveExercises(exercises) {
    const unique = Array.from(new Set(exercises.map((item) => String(item).trim()).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b, "pt-BR"));
    writeJson(EXERCISES_KEY, unique);
  }

  async function loadExerciseCatalog(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Catalogo indisponivel");
      const data = await response.json();
      if (Array.isArray(data.exercises)) {
        saveExercises(data.exercises);
        return listExercises();
      }
    } catch {
      saveExercises(listExercises());
    }

    return listExercises();
  }

  function ensureExercise(exerciseName) {
    const exercises = listExercises();
    const exists = exercises.some((item) => normalize(item) === normalize(exerciseName));

    if (!exists) {
      saveExercises([...exercises, exerciseName]);
    }
  }

  function getExerciseEntries(exerciseName) {
    return listWorkouts().filter((item) => normalize(item.exerciseName) === normalize(exerciseName));
  }

  function createWorkout(data) {
    const workouts = listWorkouts();
    const exerciseName = data.exerciseName.trim();
    const previousMax = workouts
      .filter((item) => normalize(item.exerciseName) === normalize(exerciseName))
      .reduce((max, item) => Math.max(max, Number(item.weight)), 0);

    const workout = {
      id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      exerciseName,
      date: data.date,
      sets: Number(data.sets),
      reps: Number(data.reps),
      weight: Number(data.weight),
      volume: Number(data.sets) * Number(data.reps) * Number(data.weight),
      isPR: Number(data.weight) > previousMax,
    };

    workouts.push(workout);
    saveWorkouts(workouts);
    ensureExercise(exerciseName);

    return workout;
  }

  function deleteWorkout(id) {
    const filtered = listWorkouts().filter((item) => item.id !== id);
    saveWorkouts(filtered);
    return filtered;
  }

  function groupByExercise() {
    return listWorkouts().reduce((groups, item) => {
      groups[item.exerciseName] = groups[item.exerciseName] || [];
      groups[item.exerciseName].push(item);
      return groups;
    }, {});
  }

  function resetAll() {
    localStorage.removeItem(WORKOUTS_KEY);
    localStorage.removeItem(EXERCISES_KEY);
  }

  window.LiftHeroBackend = {
    createWorkout,
    deleteWorkout,
    getExerciseEntries,
    groupByExercise,
    listExercises,
    listWorkouts,
    loadExerciseCatalog,
    resetAll,
  };
}());
