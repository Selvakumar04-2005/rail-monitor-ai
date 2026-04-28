import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CoachOccupancy {
    status: OccupancyStatus;
    lastUpdated: Timestamp;
    totalSeats: bigint;
    coachId: CoachId;
    occupiedSeats: bigint;
}
export interface OccupancySnapshot {
    trainId: TrainId;
    coaches: Array<CoachOccupancy>;
    timestamp: Timestamp;
}
export type TrainId = string;
export interface GenerateReportRequest {
    trainId: TrainId;
    adminId: string;
}
export type CoachId = string;
export interface Report {
    id: bigint;
    totalPassengers: bigint;
    geminiResponse: string;
    trainId: TrainId;
    activeAlerts: bigint;
    timestamp: Timestamp;
    adminId: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Alert {
    id: bigint;
    resolved: boolean;
    description: string;
    trainId: TrainId;
    coachId: CoachId;
    timestamp: Timestamp;
    severity: AlertSeverity;
    resolvedAt?: Timestamp;
}
export enum AlertSeverity {
    warning = "warning",
    critical = "critical"
}
export enum OccupancyStatus {
    red = "red",
    green = "green",
    yellow = "yellow"
}
export interface backendInterface {
    generateReport(req: GenerateReportRequest): Promise<Report>;
    getActiveAlerts(): Promise<Array<Alert>>;
    getAlerts(): Promise<Array<Alert>>;
    getCoachOccupancies(): Promise<Array<CoachOccupancy>>;
    getOccupancySnapshot(): Promise<OccupancySnapshot>;
    getReports(): Promise<Array<Report>>;
    refreshOccupancy(): Promise<void>;
    resolveAlert(alertId: bigint): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
