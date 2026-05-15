import { GetQuotaDetailFunction } from "@zuplo/runtime";
/**
 * Quota detail handler for Zuplo rate limiting policy.
 * 
 * GetQuotaDetailFunction type signature:
 * (request: ZuploRequest, context: ZuploContext, policyName: string) => Promise<QuotaDetail>
 */

export const getQuotaDetail: GetQuotaDetailFunction = async (
  request,
  context,
  policyName,
) => {

  //context.log.info(request.user);

  // Validate user and rate_limit data
  if (!request.user || !request.user.data || !request.user.data.quota) {
    context.log.error("Missing quota data in bearer token");
    return undefined;
  }

  if (!Number.isFinite(request.user.data.quota) || request.user.data.quota >= 250 ) {
    context.log.error("Using quota > 250");
    return undefined;
  }

  return {
    key: request.user.sub,
    allowances: {
      requests: request.user.data.quota,
    }
  };
};