import mixpanel from 'mixpanel-browser';

mixpanel.init('ee6bd10d675d4eb08634ab00a9b36a5f', {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage'
});

mixpanel.register({ default_theme: 'dark' });

export const trackEvent = (name: string, props?: any) => {
  mixpanel.track(name, props);
};
