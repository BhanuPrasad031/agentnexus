import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Agent {
    public func compare(agent1 : Agent, agent2 : Agent) : Order.Order {
      Text.compare(agent1.name, agent2.name);
    };
  };

  module Rating {
    public func compare(rating1 : Rating, rating2 : Rating) : Order.Order {
      Int.compare(rating1.timestamp, rating2.timestamp);
    };
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Int.compare(task1.createdAt, task2.createdAt);
    };
  };

  module Transaction {
    public func compare(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Int.compare(transaction1.timestamp, transaction2.timestamp);
    };
  };

  module MarketplaceStats {
    public func compareByAgents(s1 : MarketplaceStats, s2 : MarketplaceStats) : Order.Order {
      Nat.compare(s1.totalAgents, s2.totalAgents);
    };
  };

  module TaskInput {
    public func compareByOutput(input1 : TaskInput, input2 : TaskInput) : Order.Order {
      Text.compare(input1.output, input2.output);
    };
  };

  public type Agent = {
    name : Text;
    description : Text;
    category : Text;
    pricePerTask : Nat;
    owner : Principal;
    available : Bool;
    createdAt : Time.Time;
  };

  public type TaskInput = {
    agentId : Nat;
    description : Text;
    output : Text;
    state : Text;
  };

  public type Task = {
    agentId : Nat;
    user : Principal;
    description : Text;
    state : TaskState;
    output : ?Text;
    createdAt : Time.Time;
    startedAt : ?Time.Time;
    completedAt : ?Time.Time;
  };

  public type TaskState = {
    #pending;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type TaskDTO = {
    agentId : Nat;
    description : Text;
    output : Text;
    state : Text;
  };

  public type Rating = {
    user : Principal;
    agentId : Nat;
    stars : Nat;
    comment : ?Text;
    timestamp : Time.Time;
  };

  public type Transaction = {
    transactionType : TransactionType;
    taskId : Nat;
    from : Principal;
    to : Principal;
    amount : Nat;
    timestamp : Time.Time;
    agentId : Nat;
  };

  public type TransactionType = {
    #payment;
    #release;
    #refund;
  };

  public type MarketplaceStats = {
    totalAgents : Nat;
    totalTasks : Nat;
    completedTasks : Nat;
    totalVolume : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let agents = Map.empty<Nat, Agent>();
  let tasks = Map.empty<Nat, Task>();
  let ratings = Map.empty<Nat, List.List<Rating>>();
  let transactions = Map.empty<Nat, Transaction>();
  let agentTasks = Map.empty<Nat, List.List<Nat>>();
  let agentIdCounter = Map.empty<Text, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextAgentId = 1;
  var nextTaskId = 1;
  var nextTransactionId = 1;

  func getAgent(agentId : Nat) : Agent {
    switch (agents.get(agentId)) {
      case (null) { Runtime.trap("Agent not found") };
      case (?agent) { agent };
    };
  };

  func generateAgentId(category : Text) : Nat {
    let current = switch (agentIdCounter.get(category)) {
      case (null) { 0 };
      case (?id) { id };
    };
    let newId = current + 1;
    agentIdCounter.add(category, newId);
    newId;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller }) func registerAgent(agent : Agent) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let agentId = generateAgentId(agent.category);
    let newAgent : Agent = {
      name = agent.name;
      description = agent.description;
      category = agent.category;
      pricePerTask = agent.pricePerTask;
      owner = caller;
      available = true;
      createdAt = Time.now();
    };
    agents.add(agentId, newAgent);
    agentTasks.add(agentId, List.empty<Nat>());
    agentId;
  };

  public query func getAllAgents() : async [Agent] {
    agents.values().toArray().sort();
  };

  public query func getAgentById(agentId : Nat) : async Agent {
    getAgent(agentId);
  };

  public shared ({ caller }) func toggleAgentAvailability(agentId : Nat) : async Bool {
    let agent = getAgent(agentId);
    if (agent.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only owner or admin can toggle availability");
    };
    let updatedAgent : Agent = { agent with available = not agent.available };
    agents.add(agentId, updatedAgent);
    updatedAgent.available;
  };

  public shared ({ caller }) func submitTask(input : TaskInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let agent = getAgent(input.agentId);
    if (not agent.available) {
      Runtime.trap("Agent is not available");
    };

    let taskId = nextTaskId;
    nextTaskId += 1;

    let newTask : Task = {
      agentId = input.agentId;
      user = caller;
      description = input.description;
      state = #pending;
      output = null;
      createdAt = Time.now();
      startedAt = null;
      completedAt = null;
    };

    tasks.add(taskId, newTask);

    switch (agentTasks.get(input.agentId)) {
      case (null) { Runtime.trap("Agent tasks not found") };
      case (?taskList) {
        taskList.add(taskId);
      };
    };

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let newTransaction : Transaction = {
      transactionType = #payment;
      taskId;
      from = caller;
      to = agent.owner;
      amount = agent.pricePerTask;
      timestamp = Time.now();
      agentId = input.agentId;
    };

    transactions.add(transactionId, newTransaction);
    taskId;
  };

  // Auto-complete: allows the task submitter to complete their own task with AI-generated output
  public shared ({ caller }) func autoCompleteTask(taskId : Nat, output : Text) : async () {
    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?t) { t };
    };

    if (task.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only task submitter can auto-complete");
    };

    if (task.state != #pending) {
      Runtime.trap("Task must be in pending state to auto-complete");
    };

    let agent = getAgent(task.agentId);
    let now = Time.now();

    let updatedTask : Task = {
      task with
      state = #completed;
      output = ?output;
      startedAt = ?now;
      completedAt = ?now;
    };

    tasks.add(taskId, updatedTask);

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let releaseTransaction : Transaction = {
      transactionType = #release;
      taskId;
      from = task.user;
      to = agent.owner;
      amount = agent.pricePerTask;
      timestamp = now;
      agentId = task.agentId;
    };

    transactions.add(transactionId, releaseTransaction);
  };

  public shared ({ caller }) func acceptTask(taskId : Nat) : async () {
    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?t) { t };
    };

    let agent = getAgent(task.agentId);
    if (agent.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only agent owner or admin can accept task");
    };

    if (task.state != #pending) {
      Runtime.trap("Task must be in pending state to accept");
    };

    let updatedTask : Task = {
      task with state = #inProgress; startedAt = ?Time.now()
    };

    tasks.add(taskId, updatedTask);
  };

  public shared ({ caller }) func completeTask(taskId : Nat, output : Text) : async () {
    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?t) { t };
    };

    let agent = getAgent(task.agentId);
    if (agent.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only agent owner or admin can complete task");
    };

    if (task.state != #inProgress) {
      Runtime.trap("Task must be in progress to complete");
    };

    let updatedTask : Task = {
      task with state = #completed; output = ?output; completedAt = ?Time.now()
    };

    tasks.add(taskId, updatedTask);

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let releaseTransaction : Transaction = {
      transactionType = #release;
      taskId;
      from = task.user;
      to = agent.owner;
      amount = agent.pricePerTask;
      timestamp = Time.now();
      agentId = task.agentId;
    };

    transactions.add(transactionId, releaseTransaction);
  };

  public shared ({ caller }) func cancelTask(taskId : Nat) : async () {
    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?t) { t };
    };

    if (task.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only task owner or admin can cancel");
    };

    if (task.state != #pending) {
      Runtime.trap("Can only cancel pending tasks");
    };

    let updatedTask : Task = {
      task with state = #cancelled
    };

    tasks.add(taskId, updatedTask);

    let agent = getAgent(task.agentId);

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let refundTransaction : Transaction = {
      transactionType = #refund;
      taskId;
      from = agent.owner;
      to = task.user;
      amount = agent.pricePerTask;
      timestamp = Time.now();
      agentId = task.agentId;
    };

    transactions.add(transactionId, refundTransaction);
  };

  public shared ({ caller }) func rateAgent(agentId : Nat, stars : Nat, comment : ?Text) : async () {
    if (stars < 1 or stars > 5) {
      Runtime.trap("Rating must be between 1 and 5 stars");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let agent = getAgent(agentId);

    let userTasks = tasks.filter(
      func(_, t) {
        t.user == caller and t.agentId == agentId and t.state == #completed
      }
    );

    if (userTasks.isEmpty() and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Must complete a task with this agent before rating");
    };

    let newRating : Rating = {
      user = caller;
      agentId;
      stars;
      comment;
      timestamp = Time.now();
    };

    let agentRatings = switch (ratings.get(agentId)) {
      case (null) { List.empty<Rating>() };
      case (?r) { r };
    };
    agentRatings.add(newRating);
    ratings.add(agentId, agentRatings);
  };

  public query func getAgentRatingsByAgent(agentId : Nat) : async [Rating] {
    switch (ratings.get(agentId)) {
      case (null) { [] };
      case (?agentRatings) { agentRatings.toArray().sort() };
    };
  };

  public query func getAgentAverageRating(agentId : Nat) : async (Nat, Nat) {
    switch (ratings.get(agentId)) {
      case (null) { (0, 0) };
      case (?agentRatings) {
        let ratingsArray = agentRatings.toArray();
        if (ratingsArray.size() == 0) { return (0, 0) };
        let total = ratingsArray.foldLeft(0, func(acc, r) { acc + r.stars });
        (total / ratingsArray.size(), ratingsArray.size());
      };
    };
  };

  public query func getAgentRatingsCount(agentId : Nat) : async Nat {
    switch (ratings.get(agentId)) {
      case (null) { 0 };
      case (?agentRatings) { agentRatings.toArray().size() };
    };
  };

  public query ({ caller }) func filterTasks(taskInput : TaskInput) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    let filteredTasks = tasks.filter(
      func(_, task) {
        if (isAdmin) {
          true
        } else {
          let agent = switch (agents.get(task.agentId)) {
            case (null) { return false };
            case (?a) { a };
          };
          task.user == caller or agent.owner == caller
        }
      }
    );

    filteredTasks.values().toArray().sort();
  };

  public query ({ caller }) func filterTasksByOutput(taskInput : TaskInput) : async [TaskInput] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    let filteredTasks = tasks.filter(
      func(_, task) {
        if (isAdmin) {
          true
        } else {
          let agent = switch (agents.get(task.agentId)) {
            case (null) { return false };
            case (?a) { a };
          };
          task.user == caller or agent.owner == caller
        }
      }
    );

    let taskInputs = filteredTasks.values().toArray().map(
      func(task) {
        {
          agentId = task.agentId;
          description = switch (task.output) {
            case (null) { "" };
            case (?output) { output };
          };
          output = switch (task.output) {
            case (null) { "" };
            case (?output) { output };
          };
          state = switch (task.state) {
            case (#pending) { "PENDING" };
            case (#inProgress) { "IN_PROGRESS" };
            case (#completed) { "COMPLETED" };
            case (#cancelled) { "CANCELLED" };
          };
        };
      }
    );
    taskInputs.sort(TaskInput.compareByOutput);
  };

  public query ({ caller }) func filterEntries(_input : TaskInput) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    let filteredTasks = tasks.filter(
      func(_, task) {
        if (isAdmin) {
          true
        } else {
          let agent = switch (agents.get(task.agentId)) {
            case (null) { return false };
            case (?a) { a };
          };
          task.user == caller or agent.owner == caller
        }
      }
    );

    filteredTasks.values().toArray().map(
      func(task) {
        switch (task.output) {
          case (null) { "" };
          case (?output) { output };
        };
      }
    );
  };

  public query ({ caller }) func filterTasksByEntry(taskInput : TaskInput) : async [TaskInput] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User required");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    let filteredTasks = tasks.filter(
      func(_, task) {
        if (isAdmin) {
          true
        } else {
          let agent = switch (agents.get(task.agentId)) {
            case (null) { return false };
            case (?a) { a };
          };
          task.user == caller or agent.owner == caller
        }
      }
    );

    let taskInputs = filteredTasks.values().toArray().map(
      func(task) {
        {
          agentId = task.agentId;
          description = switch (task.output) {
            case (null) { "" };
            case (?output) { output };
          };
          output = switch (task.output) {
            case (null) { "" };
            case (?output) { output };
          };
          state = switch (task.state) {
            case (#pending) { "PENDING" };
            case (#inProgress) { "IN_PROGRESS" };
            case (#completed) { "COMPLETED" };
            case (#cancelled) { "CANCELLED" };
          };
        };
      }
    );
    taskInputs.sort(TaskInput.compareByOutput);
  };

  public query func getMarketplaceStats() : async MarketplaceStats {
    let totalAgents = agents.size();
    let totalTasks = tasks.size();
    
    let completedTasks = tasks.filter(
      func(_, task) {
        task.state == #completed
      }
    ).size();

    let totalVolume = transactions.filter(
      func(_, tx) {
        tx.transactionType == #release
      }
    ).values().toArray().foldLeft(
      0,
      func(acc, tx) { acc + tx.amount }
    );

    {
      totalAgents;
      totalTasks;
      completedTasks;
      totalVolume;
    };
  };
};
