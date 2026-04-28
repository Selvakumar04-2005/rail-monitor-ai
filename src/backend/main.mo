import Types "types/monitoring";
import MonitoringLib "lib/monitoring";
import MonitoringApi "mixins/monitoring-api";
import List "mo:core/List";
import Time "mo:core/Time";

actor {
  // Train configuration
  let trainId : Text = "12345";

  // Monitoring state
  let coaches : List.List<Types.CoachOccupancy> = List.empty();
  let alerts : List.List<Types.Alert> = List.empty();
  let reports : List.List<Types.Report> = List.empty();
  let counters : Types.Counters = {
    var nextAlertId = 0;
    var nextReportId = 0;
    var refreshCounter = 0;
  };

  // Initialize coaches on first use (lazily via the first refresh call)
  // Seed initial coach data
  do {
    let now = Time.now();
    for (coachId in MonitoringLib.coachIds.values()) {
      let total = MonitoringLib.defaultTotalSeats;
      let occupied = MonitoringLib.simulateOccupancy(coachId, total, 0);
      let status = MonitoringLib.occupancyStatus(occupied, total);
      coaches.add({
        coachId;
        totalSeats = total;
        occupiedSeats = occupied;
        status;
        lastUpdated = now;
      });
    };
    // Seed initial alerts based on starting occupancy
    counters.nextAlertId := MonitoringLib.generateAlerts(coaches, alerts, trainId, counters.nextAlertId);
  };

  include MonitoringApi(coaches, alerts, reports, counters, trainId);
};
