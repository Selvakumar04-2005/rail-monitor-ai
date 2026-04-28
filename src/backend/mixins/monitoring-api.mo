import Types "../types/monitoring";
import MonitoringLib "../lib/monitoring";
import List "mo:core/List";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Char "mo:core/Char";

mixin (
  coaches : List.List<Types.CoachOccupancy>,
  alerts : List.List<Types.Alert>,
  reports : List.List<Types.Report>,
  counters : Types.Counters,
  trainId : Text
) {
  // Query: get latest occupancy for all coaches
  public query func getCoachOccupancies() : async [Types.CoachOccupancy] {
    coaches.toArray();
  };

  // Query: get all alerts (resolved and active)
  public query func getAlerts() : async [Types.Alert] {
    alerts.toArray();
  };

  // Query: get only active (unresolved) alerts
  public query func getActiveAlerts() : async [Types.Alert] {
    alerts.filter(func(a) { not a.resolved }).toArray();
  };

  // Update: resolve an alert by its id
  public shared func resolveAlert(alertId : Nat) : async Bool {
    let now = Time.now();
    MonitoringLib.resolveAlert(alerts, alertId, now);
  };

  // Update: trigger data refresh (simulate passenger boarding/alighting) and generate new alerts
  public shared func refreshOccupancy() : async () {
    counters.refreshCounter += 1;
    MonitoringLib.refreshCoaches(coaches, trainId, counters.refreshCounter);
    counters.nextAlertId := MonitoringLib.generateAlerts(coaches, alerts, trainId, counters.nextAlertId);
  };

  // Update: generate an AI report via Gemini HTTP outcall and store it
  public shared ({ caller }) func generateReport(req : Types.GenerateReportRequest) : async Types.Report {
    let now = Time.now();
    let snapshot = MonitoringLib.buildSnapshot(coaches, req.trainId, now);
    let prompt = MonitoringLib.buildGeminiPrompt(snapshot, alerts);

    let geminiApiKey = "YOUR_GEMINI_API_KEY";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # geminiApiKey;

    let body = "{\"contents\":[{\"parts\":[{\"text\":" # escapeJson(prompt) # "}]}]}";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];

    let responseText = await OutCall.httpPostRequest(url, headers, body, transform);

    let totalPassengers = snapshot.coaches.foldLeft(0, func(acc, c) { acc + c.occupiedSeats });
    let activeAlerts = alerts.filter(func(a) { not a.resolved }).size();

    let report : Types.Report = {
      id = counters.nextReportId;
      trainId = req.trainId;
      adminId = req.adminId;
      geminiResponse = responseText;
      timestamp = now;
      totalPassengers;
      activeAlerts;
    };
    reports.add(report);
    counters.nextReportId += 1;
    report;
  };

  // Query transform for HTTP outcalls (required by IC)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Query: get all stored reports
  public query func getReports() : async [Types.Report] {
    reports.toArray();
  };

  // Query: get occupancy snapshot for the current train
  public query func getOccupancySnapshot() : async Types.OccupancySnapshot {
    let now = Time.now();
    MonitoringLib.buildSnapshot(coaches, trainId, now);
  };

  // Helper: escape a text string for JSON embedding
  private func escapeJson(text : Text) : Text {
    var result = "\"";
    for (c in text.toIter()) {
      let n = c.toNat32();
      if (n == 34) { result #= "\\\"" }       // "
      else if (n == 92) { result #= "\\\\" }   // \
      else if (n == 10) { result #= "\\n" }    // newline
      else if (n == 13) { result #= "\\r" }    // carriage return
      else if (n == 9)  { result #= "\\t" }    // tab
      else { result #= Text.fromChar(c) };
    };
    result # "\"";
  };
};
