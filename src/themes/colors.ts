import * as color from 'color';

export default {
	ivoryWhite: "#f8f8f8",
	background: '#fff',
	transparent: 'rgba(0,0,0,0)',
	silver: '#F7F7F7',
	steel: '#CCCCCC',
	error: 'rgba(200, 0, 0, 0.8)',
	frost: '#D8D8D8',
	panther: '#161616',
	charcoal: '#595959',
	coal: '#2d2d2d',
	bloodOrange: '#fb5f26',
	surfGreen: '#a3d9c4',
	get surfGreenDark() {
		return color(this.surfGreen).alpha(0.8);
	},
	banner: '#f4f4f4', // 244, 244, 244
	text: '#E0D7E5', // 224, 215, 229
	textBlack: '#171717', // 23, 23, 23
	textLightGray: '#9b9b9b', // 155, 155, 155
	textPlaceholder: 'rgb(216, 216, 216)',
	shadowGray: '#ccc', // 204, 204, 204
	get borderGray() {
		return color(this.shadowGray).alpha(0.3);
	},
	get tranparentBlack() {
		return color(this.textBlack).alpha(0.7);
	},
	paleRed: '#dd5042',
	pink: '#fa8f89',
};
