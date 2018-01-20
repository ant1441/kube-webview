import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {green100, green500, green700} from 'material-ui/styles/colors';

export function createTheme(userAgent) {
    return getMuiTheme({}, {
      avatar: {
        borderColor: null,
      },
      userAgent: userAgent,
    });
}

export let theme = null;
export function getTheme() { return theme; }
export function setAsCurrentTheme(t) {
  theme = t;
  if (process.env.NODE_ENV !== 'production'
    && typeof window !== 'undefined') {
    window.theme = theme;
  }
}
