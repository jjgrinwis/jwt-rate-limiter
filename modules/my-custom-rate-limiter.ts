import { ZuploContext, ZuploRequest, CustomRateLimitDetails } from "@zuplo/runtime";

export const rateLimitKey = (
  request: ZuploRequest,
  context: ZuploContext
): CustomRateLimitDetails | undefined => {
  
  // show user request.user created by upper JWT validation policy
  context.log.info(request.user);

  // Validate user and rate_limit data
  if (!request.user || !request.user.data || !request.user.data.rate_limit) {
    context.log.error("Missing rate_limit data in bearer token");
    return undefined;
  }

  const { window, limit } = request.user.data.rate_limit;

  // Validate window and limit
  if (typeof window !== "number" || window <= 0) {
    context.log.error("Invalid rate_limit window value");
    return undefined;
  }
  if (typeof limit !== "number" || limit <= 0) {
    context.log.error("Invalid rate_limit limit value");
    return undefined;
  }

  // doesn't matter if we are using API key or JWT token as bearer, sub will either be the API key or sub claim from JWT.
  if (!request.user.sub) {
    context.log.error("Missing sub bearer token");
    return undefined;
  }

  return {
    key: request.user.sub,
    requestsAllowed: limit,
    timeWindowMinutes: window / 60
  };
};