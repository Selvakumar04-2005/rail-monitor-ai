module {
  public type CoachId = Text;
  public type TrainId = Text;
  public type Timestamp = Int;

  public type OccupancyStatus = {
    #green;   // < 75%
    #yellow;  // 75-90%
    #red;     // > 90%
  };

  public type CoachOccupancy = {
    coachId : CoachId;
    totalSeats : Nat;
    occupiedSeats : Nat;
    status : OccupancyStatus;
    lastUpdated : Timestamp;
  };

  public type AlertSeverity = {
    #warning;
    #critical;
  };

  public type Alert = {
    id : Nat;
    coachId : CoachId;
    trainId : TrainId;
    severity : AlertSeverity;
    description : Text;
    timestamp : Timestamp;
    resolved : Bool;
    resolvedAt : ?Timestamp;
  };

  public type OccupancySnapshot = {
    trainId : TrainId;
    coaches : [CoachOccupancy];
    timestamp : Timestamp;
  };

  public type Report = {
    id : Nat;
    trainId : TrainId;
    adminId : Text;
    geminiResponse : Text;
    timestamp : Timestamp;
    totalPassengers : Nat;
    activeAlerts : Nat;
  };

  public type GenerateReportRequest = {
    trainId : TrainId;
    adminId : Text;
  };

  // Mutable counter state passed to the mixin
  public type Counters = {
    var nextAlertId : Nat;
    var nextReportId : Nat;
    var refreshCounter : Nat;
  };
};
