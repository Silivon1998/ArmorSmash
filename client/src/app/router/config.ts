
// Routing symbols & conventions
export const OPTIONAL_PARAM_PREFIX = '__';
export const OPTIONAL_PARAM_SUFFIX = '?';
export const PARAM_SEPARATOR = '&';
export const PARAM_DETECTOR = ':';


export const SPECIAL_FOLDER_BEHAVIOR: Record<string, {
  alias?: string; // optional path remap
  guard?: () => boolean; //custom guard ( not only for auth purpose )
  fallback?: string; // default fallback is not-found
}> = {
  main: { alias: '' },
  protected: {
    alias: 'private',
    guard: () => true,//!!localStorage.getItem('token'),
    fallback: '/',
  },
};

// Regular expressions
export const REGEX_TRAILING_SLASH = /\/?$/;
export const REGEX_DYNAMIC_PARAM_BLOCK = /\[([^\]]+)\]/g;
export const REGEX_PAGE_MATCH = /\/pages\/(.+)\/index\.tsx$/;
export const REGEX_LAYOUT_MATCH = /\/pages\/(.+)\/layout\.tsx$/;

// meta imports

export const PAGES_IMPORT_META = import.meta.glob('@pages/**/index.tsx', { eager: true });
export const LAYOUTS_IMPORT_META = import.meta.glob('@pages/**/layout.tsx', { eager: true });

