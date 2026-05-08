import { api } from "./api";

export async function fetchTasks() {
  const { data } = await api.get("/tasks");
  return data.tasks || [];
}

export async function createTask(payload) {
  const { data } = await api.post("/tasks", payload);
  return data.task;
}

export async function updateTaskStatus(taskId, status) {
  const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
  return data.task;
}

