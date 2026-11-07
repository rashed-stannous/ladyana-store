// All production authentication callbacks return to the primary storefront.
export const siteOrigin = import.meta.env.DEV ? window.location.origin : 'https://ladyanabd.com';
