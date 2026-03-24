import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskInput {
    output: string;
    description: string;
    agentId: bigint;
    state: string;
}
export type Time = bigint;
export interface Rating {
    user: Principal;
    agentId: bigint;
    comment?: string;
    stars: bigint;
    timestamp: Time;
}
export interface Task {
    completedAt?: Time;
    output?: string;
    startedAt?: Time;
    createdAt: Time;
    user: Principal;
    description: string;
    agentId: bigint;
    state: TaskState;
}
export interface Agent {
    owner: Principal;
    name: string;
    createdAt: Time;
    description: string;
    pricePerTask: bigint;
    available: boolean;
    category: string;
}
export interface MarketplaceStats {
    totalTasks: bigint;
    totalAgents: bigint;
    totalVolume: bigint;
    completedTasks: bigint;
}
export interface UserProfile {
    name: string;
}
export enum TaskState {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptTask(taskId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    autoCompleteTask(taskId: bigint, output: string): Promise<void>;
    cancelTask(taskId: bigint): Promise<void>;
    completeTask(taskId: bigint, output: string): Promise<void>;
    filterEntries(_input: TaskInput): Promise<Array<string>>;
    filterTasks(taskInput: TaskInput): Promise<Array<Task>>;
    filterTasksByEntry(taskInput: TaskInput): Promise<Array<TaskInput>>;
    filterTasksByOutput(taskInput: TaskInput): Promise<Array<TaskInput>>;
    getAgentAverageRating(agentId: bigint): Promise<[bigint, bigint]>;
    getAgentById(agentId: bigint): Promise<Agent>;
    getAgentRatingsByAgent(agentId: bigint): Promise<Array<Rating>>;
    getAgentRatingsCount(agentId: bigint): Promise<bigint>;
    getAllAgents(): Promise<Array<Agent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMarketplaceStats(): Promise<MarketplaceStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rateAgent(agentId: bigint, stars: bigint, comment: string | null): Promise<void>;
    registerAgent(agent: Agent): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTask(input: TaskInput): Promise<bigint>;
    toggleAgentAvailability(agentId: bigint): Promise<boolean>;
}
