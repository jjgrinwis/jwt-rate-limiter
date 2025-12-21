import {
  RuntimeExtensions,
  LokiLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new LokiLoggingPlugin({
      // This is the URL of your Loki server
      url: "https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push",
      username: "283556",
      job: "zupo-api-gw",
      password: environment.LOKI_PASSWORD,
      version: 2,
      fields: {
        customer: "tomtom"
      },
    }),
  );
}