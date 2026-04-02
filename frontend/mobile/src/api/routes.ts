import { api } from "./index";
import { UserExercice } from "../types/UserExercices";
import { User } from "../types/User";
import { Game } from "../types/Games";
import { Content } from "../types/Content";
import { LoginResponse } from "../../src/types/Auth";

// ----------------------
// AUTH
// ----------------------

export const loginUser = (identifier: string, password: string) =>
  api.post<LoginResponse>("/login", { login: identifier, password });

export const logoutUser = () => api.post("/users/logout");

// ----------------------
// CONTENT
// ----------------------

export const getContents = () =>
  api.get<Content[]>("/content/public/active");

export const getOneContent = (id: number) =>
  api.get<Content>(`/content/${id}`);

// ----------------------
// EXERCICES
// ----------------------

export const getAllGames = () =>
  api.get<Game[]>("/games/active-games");

export const getOneGame = (id: number) =>
  api.get<Game>(`/games/${id}`);

// ----------------------
// USER
// ----------------------

export const getCurrentUser = () =>
  api.get<{ user: User }>("/users/me");

export const createUser = (payload: any) =>
  api.post<{ user: User; token: string }>("/users", payload);

export const updateProfil = (payload: Partial<User>) =>
  api.put<User>(`/users/me`, payload);

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`);

// ----------------------
// USER EXERCICE RESULTS
// ----------------------

export const getMyResult = () =>
  api.get<UserExercice[]>("/user-exo/me");

export const getOneResult = (id: number) =>
  api.get<UserExercice>(`/user-exo/${id}`);

export const resultGuest = (guest: string) =>
  api.get<UserExercice[]>(`/user-exo/guest/${guest}`);

export const saveOneResult = (payload: Partial<UserExercice>) =>
  api.post("/user-exo", payload);

export const saveMyResult = (payload: any) =>
  api.post("/user-exo/link-guest", payload);

export const deleteResults = (payload: any) =>
  api.post("/user-exo/delete-guest", payload);

export const deleteOneResult = (id: number) =>
  api.delete(`/user-exo/${id}`);
