import { getCurrentHub, initAndBind, Integrations as CoreIntegrations } from '@sentry/core';
import { getMainCarrier, setHubOnCarrier } from '@sentry/hub';
import * as domain from 'domain';
import { NodeOptions } from './backend';
import { NodeClient } from './client';
import { Console, Http, LinkedErrors, OnUncaughtException, OnUnhandledRejection } from './integrations';

export const defaultIntegrations = [
  // Common
  new CoreIntegrations.Dedupe(),
  new CoreIntegrations.InboundFilters(),
  new CoreIntegrations.FunctionToString(),
  // Native Wrappers
  new Console(),
  new Http(),
  // Global Handlers
  new OnUncaughtException(),
  new OnUnhandledRejection(),
  // Misc
  new LinkedErrors(),
];

/**
 * The Sentry Node SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible in the
 * main entry module. To set context information or send manual events, use the
 * provided methods.
 *
 * @example
 * const { init } = require('@sentry/node');
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 *
 *
 * @example
 * const { configureScope } = require('@sentry/node');
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 *
 * @example
 * const { addBreadcrumb } = require('@sentry/node');
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 *
 * @example
 * const Sentry = require('@sentry/node');
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 *
 * @see NodeOptions for documentation on configuration options.
 */
export function init(options: NodeOptions = {}): void {
  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = defaultIntegrations;
  }

  if (domain.active) {
    setHubOnCarrier(getMainCarrier(), getCurrentHub());
  }

  initAndBind(NodeClient, options);
}

/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
export function lastEventId(): string | undefined {
  return getCurrentHub().lastEventId();
}
