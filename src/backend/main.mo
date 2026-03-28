import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "order";
import FoodItem "food-item";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type FoodItem = FoodItem.FoodItem;
  public type Order = Order.Order;

  public type UserProfile = {
    name : Text;
  };

  let foodItems = Map.empty<Nat, FoodItem>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var foodItemIdCounter = 0;
  var orderIdCounter = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Food Item Management
  public shared ({ caller }) func createFoodItem(foodItem : FoodItem) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create food items");
    };
    foodItemIdCounter += 1;
    let id = foodItemIdCounter;
    let newFoodItem : FoodItem = {
      id;
      name = foodItem.name;
      category = foodItem.category;
      price = foodItem.price;
      description = foodItem.description;
      imageUrl = foodItem.imageUrl;
      isAvailable = foodItem.isAvailable;
    };
    foodItems.add(id, newFoodItem);
    id;
  };

  public shared ({ caller }) func updateFoodItem(foodItem : FoodItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update food items");
    };
    if (not foodItems.containsKey(foodItem.id)) {
      Runtime.trap("Food item not found: " # foodItem.id.toText());
    };
    foodItems.add(foodItem.id, foodItem);
  };

  public shared ({ caller }) func deleteFoodItem(foodItemId : Nat) : async FoodItem {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete food items");
    };
    switch (foodItems.get(foodItemId)) {
      case (null) { Runtime.trap("Food item not found: " # foodItemId.toText()) };
      case (?foodItem) {
        foodItems.remove(foodItemId);
        foodItem;
      };
    };
  };

  public query ({ caller }) func getFoodItem(foodItemId : Nat) : async FoodItem {
    switch (foodItems.get(foodItemId)) {
      case (null) { Runtime.trap("Food item not found: " # foodItemId.toText()) };
      case (?foodItem) { foodItem };
    };
  };

  public query ({ caller }) func getAllFoodItems() : async [FoodItem] {
    foodItems.values().toArray();
  };

  public query ({ caller }) func filterFoodItemsByCategory(category : Text) : async [FoodItem] {
    foodItems.values().filter(
      func(item) {
        item.category.toLower().contains(#text(category.toLower()));
      }
    ).toArray();
  };

  // Order Management
  public shared ({ caller }) func createOrder(order : Order) : async Nat {
    orderIdCounter += 1;
    let id = orderIdCounter;
    let newOrder : Order = {
      id;
      customerName = order.customerName;
      address = order.address;
      phone = order.phone;
      items = order.items;
      totalAmount = order.totalAmount;
      status = "pending";
      createdAt = order.createdAt;
    };
    orders.add(id, newOrder);
    id;
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found: " # id.toText()) };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : Text) : async Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found: " # id.toText()) };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          customerName = order.customerName;
          address = order.address;
          phone = order.phone;
          items = order.items;
          totalAmount = order.totalAmount;
          status;
          createdAt = order.createdAt;
        };
        orders.add(id, updatedOrder);
        updatedOrder;
      };
    };
  };
};
