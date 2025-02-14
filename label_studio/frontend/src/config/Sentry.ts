import * as Sentry from "@sentry/browser";
import * as ReactSentry from '@sentry/react';
import { RouterHistory } from "@sentry/react/dist/reactrouter";
import { Integrations } from "@sentry/tracing";
import { Route } from 'react-router-dom';

export const initSentry = (history: RouterHistory) => {
  setTags();

  Sentry.init({
    dsn: "https://71c213547cc7427f865b585ca7e36ff9@o1041015.ingest.sentry.io/6010995",
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: ReactSentry.reactRouterV5Instrumentation(history),
      }),
    ],
    environment: process.env.NODE_ENV,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.25,
    release: process.env.RELEASE_NAME,
  });
};

const setTags = () => {
  const tags: Record<string, any> = {};

  if (APP_SETTINGS.user.email) {
    Sentry.setUser({
      email: APP_SETTINGS.user.email,
      username: APP_SETTINGS.user.username,
    });
  }

  if (APP_SETTINGS.version) {
    Object.entries(APP_SETTINGS.version).forEach(([packageName, data]: [string, any]) => {
      const {version, commit} = data ?? {};

      if (version) {
        tags['version-' + packageName] = version;
      }
      if (commit) {
        tags['commit-' + packageName] = commit;
      }
    });
  }

  Sentry.setTags(tags);
};

export const SentryRoute = ReactSentry.withSentryRouting(Route);
