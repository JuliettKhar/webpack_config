import '../scss/styles.scss'; 
import * as app from './app.js';

const __svg__  = { path: '../source/**/*.svg', name: 'assets/svg-sprites/[hash].logos.svg' };
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

app.init();

