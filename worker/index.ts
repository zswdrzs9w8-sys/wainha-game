import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

type SitesExecutionContext = ExecutionContext & {
  props?: {
    CONNECTORS?: ConnectorBinding;
  };
};

export default {
  fetch(request, env, ctx) {
    const sitesContext = ctx as SitesExecutionContext;
    const connectorBinding = sitesContext.props?.CONNECTORS ?? env.CONNECTORS;

    return runWithConnectorBinding(connectorBinding, () =>
      handler.fetch(request, env, ctx),
    );
  },
} satisfies ExportedHandler<Cloudflare.Env>;
