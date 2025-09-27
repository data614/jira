import os from "node:os";

type RedisConnectionStatus = "disabled" | "connecting" | "connected" | "error";

interface ICollaborativeConnectionEvent {
  documentName?: string;
  requiresAuthentication?: boolean;
  isAuthenticated?: boolean;
}

interface IHttpRequestEvent {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
}

interface IIncidentRecord {
  scope: string;
  message: string;
  stack?: string;
  timestamp: string;
}

export interface IMonitoringSnapshot {
  startedAt: string;
  uptimeMs: number;
  hostname: string;
  serverName?: string;
  port?: number;
  lastActivityAt?: string;
  http: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageDurationMs: number;
    lastRequestAt?: string;
    lastRoute?: string;
    lastStatusCode?: number;
  };
  collaboration: {
    totalConnections: number;
    activeConnections: number;
    documentConnections: Record<string, number>;
    totalDocumentChanges: number;
    totalAwarenessUpdates: number;
    totalStatelessEvents: number;
    lastEventAt?: string;
  };
  redis: {
    status: RedisConnectionStatus;
    configured: boolean;
    lastChangedAt: string;
    lastError?: string;
  };
  incidents: IIncidentRecord[];
}

type RedisState = {
  status: RedisConnectionStatus;
  configured: boolean;
  lastChangedAt: string;
  lastError?: string;
};

class MonitoringService {
  private readonly startedAt: number;
  private port?: number;
  private serverName?: string;
  private lastActivityAt?: string;

  private totalConnections = 0;
  private activeConnections = 0;
  private documentConnections: Map<string, number> = new Map();
  private totalDocumentChanges = 0;
  private totalAwarenessUpdates = 0;
  private totalStatelessEvents = 0;
  private lastEventAt?: string;

  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalRequestDurationMs = 0;
  private lastRequestAt?: string;
  private lastRoute?: string;
  private lastStatusCode?: number;

  private readonly incidents: IIncidentRecord[] = [];
  private readonly maxIncidentRecords = 50;

  private redisState: RedisState = {
    status: "disabled",
    configured: false,
    lastChangedAt: new Date().toISOString(),
    lastError: undefined,
  };

  constructor() {
    this.startedAt = Date.now();
  }

  public setServerName(name: string) {
    this.serverName = name;
  }

  public setPort(port: number | string) {
    const parsedPort = typeof port === "string" ? Number.parseInt(port, 10) : port;
    if (!Number.isNaN(parsedPort)) {
      this.port = parsedPort;
    }
  }

  public recordCollaborativeConnection(event: ICollaborativeConnectionEvent) {
    this.totalConnections += 1;
    this.activeConnections = Math.max(0, this.activeConnections + 1);
    const documentName = event.documentName ?? "unknown";
    const current = this.documentConnections.get(documentName) ?? 0;
    this.documentConnections.set(documentName, current + 1);
    this.touchActivity();
  }

  public recordCollaborativeDisconnection(documentName?: string) {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
    if (documentName) {
      const current = this.documentConnections.get(documentName) ?? 0;
      if (current <= 1) {
        this.documentConnections.delete(documentName);
      } else {
        this.documentConnections.set(documentName, current - 1);
      }
    }
    this.touchActivity();
  }

  public recordDocumentChange(documentName?: string) {
    this.totalDocumentChanges += 1;
    this.registerDocumentActivity(documentName);
  }

  public recordAwarenessUpdate(documentName?: string) {
    this.totalAwarenessUpdates += 1;
    this.registerDocumentActivity(documentName);
  }

  public recordStatelessEvent(documentName?: string) {
    this.totalStatelessEvents += 1;
    this.registerDocumentActivity(documentName);
  }

  public trackHttpRequest(event: IHttpRequestEvent) {
    this.totalRequests += 1;
    const isSuccessful = event.statusCode >= 200 && event.statusCode < 400;
    if (isSuccessful) {
      this.successfulRequests += 1;
    } else {
      this.failedRequests += 1;
    }
    this.totalRequestDurationMs += event.durationMs;
    this.lastRequestAt = new Date().toISOString();
    this.lastRoute = `${event.method.toUpperCase()} ${event.path}`;
    this.lastStatusCode = event.statusCode;
    this.touchActivity();
  }

  public recordIncident(scope: string, error: unknown) {
    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    this.incidents.unshift({ scope, message, stack, timestamp });
    if (this.incidents.length > this.maxIncidentRecords) {
      this.incidents.length = this.maxIncidentRecords;
    }
    this.touchActivity();
  }

  public resetCollaborativeState() {
    this.activeConnections = 0;
    this.documentConnections.clear();
    this.totalDocumentChanges = 0;
    this.totalAwarenessUpdates = 0;
    this.totalStatelessEvents = 0;
    this.lastEventAt = new Date().toISOString();
    this.touchActivity();
  }

  public markRedisDisabled() {
    this.redisState = {
      status: "disabled",
      configured: false,
      lastChangedAt: new Date().toISOString(),
      lastError: undefined,
    };
  }

  public markRedisConnecting() {
    this.redisState = {
      status: "connecting",
      configured: true,
      lastChangedAt: new Date().toISOString(),
      lastError: undefined,
    };
  }

  public markRedisConnected() {
    this.redisState = {
      status: "connected",
      configured: true,
      lastChangedAt: new Date().toISOString(),
      lastError: undefined,
    };
  }

  public markRedisError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    this.redisState = {
      status: "error",
      configured: true,
      lastChangedAt: new Date().toISOString(),
      lastError: message,
    };
    this.recordIncident("redis", error);
  }

  public getSnapshot(): IMonitoringSnapshot {
    const uptimeMs = Date.now() - this.startedAt;
    const documentConnections = Object.fromEntries(this.documentConnections.entries());
    const averageDurationMs = this.totalRequests === 0 ? 0 : this.totalRequestDurationMs / this.totalRequests;

    return {
      startedAt: new Date(this.startedAt).toISOString(),
      uptimeMs,
      hostname: os.hostname(),
      serverName: this.serverName,
      port: this.port,
      lastActivityAt: this.lastActivityAt,
      http: {
        totalRequests: this.totalRequests,
        successfulRequests: this.successfulRequests,
        failedRequests: this.failedRequests,
        averageDurationMs,
        lastRequestAt: this.lastRequestAt,
        lastRoute: this.lastRoute,
        lastStatusCode: this.lastStatusCode,
      },
      collaboration: {
        totalConnections: this.totalConnections,
        activeConnections: this.activeConnections,
        documentConnections,
        totalDocumentChanges: this.totalDocumentChanges,
        totalAwarenessUpdates: this.totalAwarenessUpdates,
        totalStatelessEvents: this.totalStatelessEvents,
        lastEventAt: this.lastEventAt,
      },
      redis: {
        status: this.redisState.status,
        configured: this.redisState.configured,
        lastChangedAt: this.redisState.lastChangedAt,
        lastError: this.redisState.lastError,
      },
      incidents: [...this.incidents],
    };
  }

  private touchActivity() {
    this.lastActivityAt = new Date().toISOString();
  }

  private registerDocumentActivity(documentName?: string) {
    if (documentName) {
      const current = this.documentConnections.get(documentName) ?? 0;
      if (current === 0) {
        this.documentConnections.set(documentName, 0);
      }
    }
    this.lastEventAt = new Date().toISOString();
    this.touchActivity();
  }
}

export const monitoringService = new MonitoringService();
