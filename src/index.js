// ============================================================
//  Access Control System — OOP Implementation (JavaScript)
// ============================================================

// ─────────────────────────────────────────────
//  CLASS: User
// ─────────────────────────────────────────────

class User {
  // Private fields — cannot be accessed directly outside the class
  #userId;
  #name;
  #role;
  #active;

  static #userCount = 0;

  constructor(name, role, userId) {
    this.#name = name;
    this.#role = this.#validateRole(role);
    this.#userId = userId;
    this.#active = true; // default to active when created

    User.#userCount++;
  }

  #validateRole(role) {
    const allowed = ["admin", "security", "staff", "guest"];
    if (!allowed.includes(role)) {
      throw new Error(
        `invalid role "${role}". Must be one of : ${allowed.join(",")}`,
      );
    }
    return role;
  }

  // Getter //
  get userId() {
    return this.#userId;
  }
  get name() {
    return this.#name;
  }
  get role() {
    return this.#role;
  }
  get active() {
    return this.#active;
  }

  // ── Setters (with internal validation hidden from caller) ──
  set name(newName) {
    if (!newName || newName.trim() === "") {
      throw new Error("Name cannot be empty.");
    }
    this.#name = newName.trim();
  }

  set role(newRole) {
    this.#role = this.#validateRole(newRole);
  }

  // static getteer
  static get userCount() {
    return User.#userCount;
  }

  // public methods
  requestAccess(door) {
    const granted = door.unlock(this.#userId, this.#role);
    const status = granted ? "GRANTED" : "DENIED";
    console.log(
      `Access ${status} for ${this.#name} (${this.role}) to ${door.doorId} at ${door.location}`,
    );
    return granted;
  }

  getProfile() {
    return `User Profile: ${this.#name} (ID: ${this.#userId}) - Role: ${this.#role} - Status: ${this.#active ? "Active" : "Inactive"}`;
  }

  // Return weather the user is active or not
  deactivate() {
    this.#active = false;
    console.log(`[Deactivated] ${this.#name}'s account has been disable`);
  }
}

// ─────────────────────────────────────────────
//  CLASS: Door
// ─────────────────────────────────────────────

class Door {
  // Private fields
  #doorId;
  #location;
  #isLocked;
  #restricted;

  static #totalDoors = 0;
  static #ALLOWED_ROLES = ["admin", "security"];

  constructor(doorId, location, restricted = false) {
    this.#doorId = doorId;
    this.#location = location;
    this.#isLocked = true; // doors locked by default
    this.#restricted = restricted;

    Door.#totalDoors++;
  }

  // ── Private method (abstraction: hides access-check logic) ──
  #isAuthorised(role) {
    if (!this.#restricted) return true;
    return Door.#ALLOWED_ROLES.includes(role);
  }

  // Getter
  get doorId() {
    return this.#doorId;
  }
  get location() {
    return this.#location;
  }
  get isLocked() {
    return this.#isLocked;
  }

  get restricted() {
    return this.restricted;
  }

  // Setter
  set location(newLocation) {
    if (!newLocation || newLocation.trim() === "") {
      throw new Error("Location cannot be empty.");
    }
    this.#location = newLocation.trim();
  }

  // static getter //
  static get totalDoors() {
    return Door.#totalDoors;
  }

  // public methods //
  unlock(userId, role) {
    if (!this.#isAuthorised(role)) return false;
    this.#isLocked = false;
    return true;
  }

  lock() {
    this.#isLocked = true;
    console.log(`[locked] ${this.#location} (${this.#doorId})`);
  }

  getStatus() {
    const lockState = this.#isLocked ? "Locked" : "Unlocked";
    const accessType = this.#restricted ? "Restricted" : "Public";
    return `Door(${this.#doorId} | ${this.#location} | ${lockState} | ${accessType})`;
  }
}

// ─────────────────────────────────────────────
//  CLASS: AccessLog
// ─────────────────────────────────────────────

class AccessLog {
  #entries;

  static #logCount = 0;

  constructor() {
    this.#entries = [];
  }

  // ── Private method (abstraction: hides entry-building logic) ──
  #buildEntry(user, door, granted) {
    AccessLog.#logCount++;

    return {
      logId: `Log-${AccessLog.#logCount}.padStart(3, '0')`,
      timestamp: new Date().toLocaleTimeString(),
      userId: user.userId,
      doorId: door.doorId,
      userName: user.name,
      doorLocation: door.location,
      result: granted ? "GRANTED" : "DENIED",
    };
  }

  // Getter //
  get totalEntries() {
    return this.#entries.length;
  }

  //  static getter//
  static get logCount() {
    return AccessLog.#logCount;
  }

  // Public methods //
  logAttempt(user, door, granted) {
    const entry = this.#buildEntry(user, door, granted);
    this.#entries.push(entry);
  }

  printLog() {
    console.log("\n  ──────────── ACCESS LOG ────────────");
    if (this.#entries.length === 0) {
      console.log("No entries recorded");
    } else {
      this.#entries.forEach((e) => {
        console.log(
          `[${e.logId} ${e.timestamp} | ${e.userName} -> ${e.location} | ${e.result} ]`,
        );
      });
    }
  }
}

// ─────────────────────────────────────────────
//  USAGE - create instance and call methods
// ─────────────────────────────────────────────

console.log("=== Access Control System Simulation ===");

// create users
const alice = new User("Alice", "admin", "U001");
const bob = new User("Bob", "security", "U002");
const charlie = new User("Charlie", "staff", "U003");
const Okoro = new User("Okoro", "guest", "U004");

console.log("===== Users via getters =====");
console.log(alice.getProfile());
console.log(bob.getProfile());
console.log(charlie.getProfile());
console.log(Okoro.getProfile());

console.log(`Total users registered: ${User.userCount}`);

// ── Demonstrate setter with validation ──
console.log("--- Setter: update Bob's name ---");
bob.name = "Robert Okafor";
console.log(`Updated name: ${bob.name}\n`);

// ── Demonstrate role setter with validation ──
console.log("--- Setter: update Bob's role ---");
bob.role = "security";
console.log(`Updated role: ${bob.role}\n`);

// ── Attempt invalid role (abstraction hides the validation) ──
console.log("--- Invalid role attempt ---");
try {
  Okoro.role = "superuser";
} catch (e) {
  console.log(`  Error caught: ${e.message}\n`);
}

// create doors
const mainEntrance = new Door("D001", "Main Entrance", false); // public door
const serverRoom = new Door("D002", "Server Room", true); // restricted door
const conferenceRoom = new Door("D003", "Conference Room", false); // public door

console.log("--- Doors (via getters) ---");
console.log(mainEntrance.getStatus());
console.log(serverRoom.getStatus());
console.log(conferenceRoom.getStatus());
console.log(`Total doors: ${Door.totalDoors}\n`);

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

// ── Deactivate a user ──
console.log("\n--- Deactivate Okoro ---");
Okoro.deactivate();
console.log(`Okoro active status: ${Okoro.active}`);

// ── Lock doors ──
console.log("\n--- Lock doors ---");
serverRoom.lock();
mainEntrance.lock();

// ── Summary ──
console.log("--- Summary ---");
console.log(`Total users registered : ${User.userCount}`);
console.log(`Total doors registered : ${Door.totalDoors}`);
console.log(`Total log entries      : ${AccessLog.logCount}`);
