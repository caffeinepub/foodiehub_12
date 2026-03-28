import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FoodItem, Order } from "../backend.d";
import { useActor } from "./useActor";

export function useAllFoodItems() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodItem[]>({
    queryKey: ["foodItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFoodItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilteredFoodItems(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FoodItem[]>({
    queryKey: ["foodItems", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllFoodItems();
      return actor.filterFoodItemsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error("No actor");
      return actor.createOrder(order);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useCreateFoodItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: FoodItem) => {
      if (!actor) throw new Error("No actor");
      return actor.createFoodItem(item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["foodItems"] }),
  });
}

export function useUpdateFoodItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: FoodItem) => {
      if (!actor) throw new Error("No actor");
      return actor.updateFoodItem(item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["foodItems"] }),
  });
}

export function useDeleteFoodItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteFoodItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["foodItems"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
