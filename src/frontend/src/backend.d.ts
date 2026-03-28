import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FoodItem {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    category: string;
    price: number;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    createdAt: bigint;
    totalAmount: number;
    address: string;
    phone: string;
    items: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFoodItem(foodItem: FoodItem): Promise<bigint>;
    createOrder(order: Order): Promise<bigint>;
    deleteFoodItem(foodItemId: bigint): Promise<FoodItem>;
    filterFoodItemsByCategory(category: string): Promise<Array<FoodItem>>;
    getAllFoodItems(): Promise<Array<FoodItem>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFoodItem(foodItemId: bigint): Promise<FoodItem>;
    getOrder(id: bigint): Promise<Order>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFoodItem(foodItem: FoodItem): Promise<void>;
    updateOrderStatus(id: bigint, status: string): Promise<Order>;
}
