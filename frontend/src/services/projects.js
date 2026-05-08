import { api } from "./api";

export async function fetchProjects() {
  const { data } = await api.get("/projects");
  return data.projects || [];
}

export async function createProject(payload) {
  const { data } = await api.post("/projects", payload);
  return data.project;
}

