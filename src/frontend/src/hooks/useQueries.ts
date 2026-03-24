import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TaskInput } from "../backend";
import type { Agent as BackendAgent } from "../backend";
import { useActor } from "./useActor";

export function useGetAllAgents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      if (!actor) return [] as BackendAgent[];
      return actor.getAllAgents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAgentById(agentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["agent", agentId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAgentById(agentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMarketplaceStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userTasks"],
    queryFn: async () => {
      if (!actor) return [];
      const input: TaskInput = {
        output: "",
        description: "",
        agentId: 0n,
        state: "",
      };
      return actor.filterTasks(input);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAgentRating(agentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["agentRating", agentId.toString()],
    queryFn: async () => {
      if (!actor) return [0n, 0n] as [bigint, bigint];
      return actor.getAgentAverageRating(agentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterAgent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agentData: BackendAgent) => {
      if (!actor) throw new Error("Not connected");
      // biome-ignore lint/suspicious/noExplicitAny: Agent type clash between dfinity/agent and backend
      return actor.registerAgent(agentData as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useSubmitTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TaskInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitTask(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAutoCompleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      output,
    }: { taskId: bigint; output: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.autoCompleteTask(taskId, output);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      output,
    }: { taskId: bigint; output: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeTask(taskId, output);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAcceptTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.acceptTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}

export function useCancelTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}

export function useRateAgent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      agentId,
      stars,
      comment,
    }: { agentId: bigint; stars: bigint; comment: string | null }) => {
      if (!actor) throw new Error("Not connected");
      return actor.rateAgent(agentId, stars, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentRating"] });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useToggleAgentAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agentId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleAgentAvailability(agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
