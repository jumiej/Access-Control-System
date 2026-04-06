// ============================================================
//  Access Control System — OOP Implementation (JavaScript)
// ============================================================

// ─────────────────────────────────────────────
//  CLASS: User
// ─────────────────────────────────────────────

class User {
  // static properties shared across all instances
  static userCount = 0;

  constructor(name, role, userId) {
    this.name = name;
    this.role = role;
    this.userId = userId;
    this.active = true; // default to active when created

    User.userCount++;
  }

  // static method
  static getUserCount() {
    return User.userCount;
  }

  //  simulates a user requestion acess to a door
  requestAccess(door) {
    const granted = door.unlock(this.userId, this.role);
    const status = granted ? "GRANTED" : "DENIED";
    console.log(
      `Access ${status} for ${this.name} (${this.role}) to ${door.name}`,
    );
    return granted;
  }

  // update user's role
  updateRole(newRole) {
    const oldRole = this.role;
    this.role = newRole;
    console.log(`User ${this.name} role updated from ${oldRole} to ${newRole}`);
  }

  // return a summary of the user's profile
  getProfile() {
    return `User Profile: ${this.name} (ID: ${this.userId}) - Role: ${this.role} - Status: ${this.active ? "Active" : "Inactive"}`;
  }

  // Return weather the user is active or not
  isActive() {
    return this.active;
  }
}

// ─────────────────────────────────────────────
//  CLASS: Door
// ─────────────────────────────────────────────

class Door {
  // static property, total number of doors in the system
  static totalDoors = 0;

  // Roles allowed to unlock any door by default
  static defaultAllowedRoles = ["admin", "manager", "security"];

  constructor(doorId, location, restricted = false) {
    this.doorId = doorId;
    this.location = location;
    this.isLocked = true; // doors locked by default
    this.restricted = restricted;

    Door.totalDoors++;
  }

  // static method to get total number of doors registered in the system
  static getTotalDoors() {
    return Door.totalDoors;
  }

  // Method to attempt unlocking the door based on user role and door restrictions
  unlock(userId, userRole) {
    if (this.restricted && !Door.defaultAllowedRoles.includes(userRole)) {
      return false; // Access denied - restricted area
    }
    this.isLocked = false; // Door unlocked
    return true; // Access granted
  }

  // Method to lock the door
  lock() {
    this.isLocked = true;
    console.log(`Door ${this.doorId} at ${this.location} is now locked.`);
  }

  // Return a readable status of the door
  getStatus() {
    const lock = this.isLocked ? "Locked" : "Unlocked";
    const restricted = this.restricted ? "Restricted" : "Public";
    return `Door ${this.doorId} at ${this.location} is ${lock} and ${restricted}.`;
  }

  // Return weather the door is restricted or not
  isRestricted() {
    return this.restricted;
  }
}

// ─────────────────────────────────────────────
//  CLASS: AccessLog
// ─────────────────────────────────────────────

class AccessLog {
  static logCount = 0;

  constructor() {
    this.entries = [];
  }

  //  Log an access attempt
  logAttempt(user, door, granted) {
    AccessLog.logCount++;

    const entry = {
      logId: `Log-${AccessLog.logCount}.padStart(3, '0')`,
      timestamp: new Date(),
      userId: user.userId,
      doorId: door.doorId,
      userName: user.name,
      doorLocation: door.location,
      result: granted ? "GRANTED" : "DENIED",
    };

    this.entries.push(entry);
  }

  // Retrieve all log entries to the console
  getLogs() {
    console.log("Access Log Entries:");
    if (this.entries.length === 0) {
      console.log("No entries recorded.");
    } else {
      this.entries.forEach((entry) => {
        console.log(
          `- ${entry.timestamp}: ${entry.userName} (${entry.userId}) - ${entry.doorLocation} (${entry.doorId}): ${entry.result}`,
        );
      });
    }
    console.log(`Total log entries: ${this.entries.length}`);
  }

  // Static method to get total number of log entries
  static getTotalLogs() {
    return AccessLog.logCount;
  }
}

// ─────────────────────────────────────────────
//  USAGE - create instance and call methods
// ─────────────────────────────────────────────

console.log("=== Access Control System Simulation ===");

// create users
const alice = new User("Alice", "admin", "U001");
const bob = new User("Bob", "employee", "U002");
const charlie = new User("Charlie", "manager", "U003");

console.log("===== Registered Users =====");
console.log(alice.getProfile());
console.log(bob.getProfile());
console.log(charlie.getProfile());
console.log(`Total users registered: ${User.getUserCount()}`);

// create doors
const mainEntrance = new Door("D001", "Main Entrance", false); // public door
const serverRoom = new Door("D002", "Server Room", true); // restricted door
const conferenceRoom = new Door("D003", "Conference Room", false); // public door

console.log("\n===== Registered Doors =====");
console.log(mainEntrance.getStatus());
console.log(serverRoom.getStatus());
console.log(conferenceRoom.getStatus());
console.log(`Total doors registered: ${Door.getTotalDoors()}`);

// create access log
const accessLog = new AccessLog();

// stimulate access attempt
console.log("\n=== Access Attempt===");

// Alice (admin) server room (restricted) - should be granted access
let granted = alice.requestAccess(serverRoom);
accessLog.logAttempt(alice, serverRoom, granted);

// Bob (staff) main entrance (public) - should be granted access
granted = bob.requestAccess(serverRoom);
accessLog.logAttempt(bob, serverRoom, granted);

// Charlie (guest) Main entrance (public) - should be granted access
granted = charlie.requestAccess(mainEntrance);
accessLog.logAttempt(charlie, mainEntrance, granted);

// Bob (staff) conference room (public) - should be granted access
granted = bob.requestAccess(conferenceRoom);
accessLog.logAttempt(bob, conferenceRoom, granted);

// update a role //
console.log("\n=== Role Update ===");
bob.updateRole("security");
granted = bob.requestAccess(serverRoom);
accessLog.logAttempt(bob, serverRoom, granted);

// lock a door //
console.log("\n=== Locking a Door ===");
mainEntrance.lock();
serverRoom.lock();

// print the full access log
accessLog.getLogs();

// summary of the system status
console.log("\n=== System Summary ===");
console.log(`Total user registered : ${User.getUserCount()}`);
console.log(`Total doors registered : ${Door.getTotalDoors()}`);
console.log(`Total access log entries : ${AccessLog.getTotalLogs()}`);
console.log(`Alice's profile: ${alice.getProfile()}`);
console.log(`server room restricted status: ${serverRoom.isRestricted()}`);
