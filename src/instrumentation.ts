export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
      const Sentry = await import('@sentry/nextjs');
      Sentry.init({
        dsn,
        tracesSampleRate: 0,
        sendDefaultPii: false,
      });
    }
  }
}

export const onRequestError = async (
  err: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
  context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
    renderSource?:
      | 'react-server-components'
      | 'server-side-rendering'
      | 'edge';
    revalidateReason?: 'on-demand' | 'stale' | undefined;
    renderType?: 'dynamic' | 'dynamic-resume';
  }
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    if (typeof (Sentry as any).captureRequestError === 'function') {
      (Sentry as any).captureRequestError(err, request, context);
    } else {
      Sentry.captureException(err, {
        extra: {
          path: request.path,
          method: request.method,
          routePath: context.routePath,
          routeType: context.routeType,
        },
      });
    }
  }
};
