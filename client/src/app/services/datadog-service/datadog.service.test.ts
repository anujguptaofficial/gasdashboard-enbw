import { DatadogService } from "./datadog.service";
import { datadogRum } from "@datadog/browser-rum";

jest.mock("@datadog/browser-rum", () => ({
  datadogRum: {
    init: jest.fn(),
    startSessionReplayRecording: jest.fn(),
  },
}));

describe("DatadogRumService", () => {
  let sut: DatadogService;

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new DatadogService();
  });

  it('should initialize Datadog RUM with "local" environment for localhost', () => {
    // Redefine window.location
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost:4200"),
      writable: true,
    });

    sut.initializeRUM();

    expect(datadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        env: "local",
      })
    );
  });

  it('should initialize Datadog RUM with "test" environment for test hostnames', () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://test.example.com"),
      writable: true,
    });

    sut.initializeRUM();

    expect(datadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        env: "test",
      })
    );
  });

  it('should initialize Datadog RUM with "uat" environment for uat hostnames', () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://uat.example.com"),
      writable: true,
    });

    sut.initializeRUM();

    expect(datadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        env: "uat",
      })
    );
  });

  it('should initialize Datadog RUM with "prod" environment for other hostnames', () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://prod.example.com"),
      writable: true,
    });

    sut.initializeRUM();

    expect(datadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        env: "prod",
      })
    );
  });

  it("should start session replay recording", () => {
    sut.initializeRUM();
    expect(datadogRum.startSessionReplayRecording).toHaveBeenCalled();
  });
});
