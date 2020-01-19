import '../scss/main.scss';
import * as index from './index.js';

const svg = { path: '../source/**/*.svg', name: 'assets/svg-sprites/[hash].logos.svg' };
require('webpack-svgstore-plugin/src/helpers/svgxhr')(svg);

index.init();

