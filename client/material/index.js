import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {green100, green500, green700} from 'material-ui/styles/colors';

export default function getTheme(userAgent) {
    return getMuiTheme({}, {
      avatar: {
        borderColor: null,
      },
      userAgent: userAgent,
    });
}
