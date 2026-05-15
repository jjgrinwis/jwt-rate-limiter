import { OpenTelemetryPlugin } from "@zuplo/otel";
import {
  RuntimeExtensions,
  LokiLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addResponseSendingFinalHook(async (response, request, context) => {

    // only send log when we have a 429 as by default it won't be logged
    if (response.status === 429) {
      context.log.warn("Request completed", {
        code: "429 Too Many Requests",
        status: response.status,
        user: request.user.data.name,
        ip: request.headers.get(
          "x-true-client-ip"
        )
      });
    };
  });

  runtime.addPlugin(
    new OpenTelemetryPlugin({
      exporter: {
        url: "https://api.honeycomb.io/v1/traces",
        headers: {
          "x-honeycomb-team": environment.HONEYCOMB,
        },
      },
      service: {
        name: "zuplo-jwt-rate-limiter",
        version: "0.0.1",
      },
    }),
  );
  
  runtime.addPlugin(
    new LokiLoggingPlugin({
      // This is the URL of your Loki server
      url: "https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push",
      username: "283556",
      job: "zupo-api-gw",
      password: environment.LOKI_PASSWORD,
      version: 2,
      fields: {
        customer: "akamai-demo"
      },
    }),
  );
}