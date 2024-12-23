import { Injectable } from "@angular/core";
import { datadogRum } from "@datadog/browser-rum";

@Injectable({
  providedIn: "root",
})
export class DatadogService {
  constructor() {}

  public initializeRUM(): void {
    datadogRum.init({
      applicationId: "4d8a122b-0dd0-4444-b09e-463345640668",
      clientToken: "pub9a701f45bb9cc1034776e5e128f67ce1",
      site: "datadoghq.eu",
      service: "gas-frontend",
      env: this.getEnvironment(),
      // version: '1.0.0', // Could be useful in the future
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackResources: true,
      trackLongTasks: true,
      trackUserInteractions: true,
    });

    datadogRum.startSessionReplayRecording();
  }

  private getEnvironment(): string {
    const hostname = window.location.hostname;
    if (hostname.includes("localhost")) {
      return "local";
    } else if (hostname.includes("test")) {
      return "test";
    } else if (hostname.includes("uat")) {
      return "uat";
    } else {
      return "prod"; // Default environment
    }
  }
}
