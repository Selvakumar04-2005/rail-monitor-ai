import Types "../types/monitoring";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // Coach IDs used when initializing
  public let coachIds : [Types.CoachId] = ["C1", "C2", "C3", "C4", "C5", "C6"];
  public let defaultTotalSeats : Nat = 72;

  // Simulate realistic occupancy for a coach using seed for variation.
  // Occupancy is kept between 50% and 95% of total seats.
  public func simulateOccupancy(coachId : Types.CoachId, totalSeats : Nat, seed : Nat) : Nat {
    // Use coachId hash + seed to produce a deterministic-but-varying number
    let coachHash = coachId.size();
    let base = (coachHash * 13 + seed * 7) % 100;
    // Map to 50–95% range: 50 + (base % 46) => [50, 95]
    let pct = 50 + base % 46;
    totalSeats * pct / 100;
  };

  // Determine occupancy status based on percentage thresholds.
  public func occupancyStatus(occupied : Nat, total : Nat) : Types.OccupancyStatus {
    if (total == 0) return #green;
    let pct = occupied * 100 / total;
    if (pct > 90) #red
    else if (pct >= 75) #yellow
    else #green;
  };

  // Refresh all coaches' occupancy data with simulated values.
  // Mutates the list in-place via mapInPlace.
  public func refreshCoaches(
    coaches : List.List<Types.CoachOccupancy>,
    _trainId : Types.TrainId,
    counter : Nat
  ) : () {
    let now = Time.now();
    coaches.mapInPlace(func(coach) {
      let occupied = simulateOccupancy(coach.coachId, coach.totalSeats, counter);
      let status = occupancyStatus(occupied, coach.totalSeats);
      { coach with occupiedSeats = occupied; status; lastUpdated = now };
    });
  };

  // Check if an unresolved alert already exists for a given coach.
  public func hasActiveAlert(alerts : List.List<Types.Alert>, coachId : Types.CoachId) : Bool {
    alerts.any(func(a) { a.coachId == coachId and not a.resolved });
  };

  // Generate new alerts for coaches exceeding >90% occupancy; returns the new nextId.
  public func generateAlerts(
    coaches : List.List<Types.CoachOccupancy>,
    alerts : List.List<Types.Alert>,
    trainId : Types.TrainId,
    nextId : Nat
  ) : Nat {
    let now = Time.now();
    var id = nextId;
    coaches.forEach(func(coach) {
      switch (coach.status) {
        case (#red) {
          if (not hasActiveAlert(alerts, coach.coachId)) {
            let pct = coach.occupiedSeats * 100 / coach.totalSeats;
            let severity : Types.AlertSeverity = if (pct > 95) #critical else #warning;
            let desc = "Coach " # coach.coachId # " is at " # coach.occupiedSeats.toText() # "/" # coach.totalSeats.toText() # " seats (" # (pct).toText() # "%)";
            alerts.add({
              id;
              coachId = coach.coachId;
              trainId;
              severity;
              description = desc;
              timestamp = now;
              resolved = false;
              resolvedAt = null;
            });
            id += 1;
          };
        };
        case (_) {};
      };
    });
    id;
  };

  // Resolve an alert by id; returns true if found and resolved.
  public func resolveAlert(alerts : List.List<Types.Alert>, alertId : Nat, now : Int) : Bool {
    var found = false;
    alerts.mapInPlace(func(a) {
      if (a.id == alertId and not a.resolved) {
        found := true;
        { a with resolved = true; resolvedAt = ?now };
      } else {
        a;
      };
    });
    found;
  };

  // Build occupancy snapshot from current coaches list.
  public func buildSnapshot(
    coaches : List.List<Types.CoachOccupancy>,
    trainId : Types.TrainId,
    now : Int
  ) : Types.OccupancySnapshot {
    { trainId; coaches = coaches.toArray(); timestamp = now };
  };

  // Build Gemini API prompt payload from current occupancy and alert state.
  public func buildGeminiPrompt(
    snapshot : Types.OccupancySnapshot,
    alerts : List.List<Types.Alert>
  ) : Text {
    var coachLines = "";
    for (c in snapshot.coaches.values()) {
      let pct = if (c.totalSeats == 0) 0 else c.occupiedSeats * 100 / c.totalSeats;
      let statusText = switch (c.status) {
        case (#green) "GREEN";
        case (#yellow) "YELLOW";
        case (#red) "RED";
      };
      coachLines #= "  - Coach " # c.coachId # ": " # c.occupiedSeats.toText() # "/" # c.totalSeats.toText() # " seats (" # pct.toText() # "%) [" # statusText # "]\n";
    };

    let activeAlerts = alerts.filter(func(a) { not a.resolved });
    var alertLines = "";
    activeAlerts.forEach(func(a) {
      let sev = switch (a.severity) { case (#critical) "CRITICAL"; case (#warning) "WARNING" };
      alertLines #= "  - [" # sev # "] Coach " # a.coachId # ": " # a.description # "\n";
    });

    let totalPassengers = snapshot.coaches.foldLeft(0, func(acc, c) { acc + c.occupiedSeats });
    let activeCount = activeAlerts.size();

    "You are an AI railway safety analyst. Analyze the following real-time train occupancy data and generate an executive summary.\n\n" #
    "Train ID: " # snapshot.trainId # "\n" #
    "Total Passengers: " # totalPassengers.toText() # "\n" #
    "Active Alerts: " # activeCount.toText() # "\n\n" #
    "Coach Occupancy:\n" # coachLines # "\n" #
    "Active Alerts:\n" # (if (activeCount == 0) "  None\n" else alertLines) # "\n" #
    "Please provide:\n" #
    "1. Executive Summary\n" #
    "2. Passenger Status Analysis\n" #
    "3. Risk Assessment\n" #
    "4. Safety Recommendations\n";
  };
};
