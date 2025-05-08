export function navigate(to: string) {
    window.history.pushState({}, '', to.startsWith('/') ? to : `/${to}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
}