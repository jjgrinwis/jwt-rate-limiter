import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { QuotaInboundPolicy } from "@zuplo/runtime";

export default async (
  request: ZuploRequest,
  context: ZuploContext,
  options: never,
  policyName: string
) => {
  // Get usage from a quota policy named 'my-quota-policy'
  const usage = QuotaInboundPolicy.getUsage(context, 'quota-inbound');
  
  context.log.info("Quota usage:", usage);
  
  return request;
};