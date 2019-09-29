import {createMuiTheme} from '@material-ui/core/styles';

// use default theme
// const theme = createMuiTheme();

// Or Create your Own theme:
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#b1a11d'
		},
		secondary: {
			main: '#fff'
		},
	},
	typography: {
		useNextVariants: true,
	},
});

export default theme;