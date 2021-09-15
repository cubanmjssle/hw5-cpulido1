"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(momentOutput) {
    return momentOutput
        .replace(/a day/, '1d')
        .replace(/ days/, 'd')
        .replace(/an hour/, '1h')
        .replace(/ hours/, 'h')
        .replace(/a minute/, '1m')
        .replace(/ minutes/, 'm')
        .replace(/a month/, '1mo')
        .replace(/ months/, 'mo')
        .replace(/a year?/, '1y')
        .replace(/ years/, 'y');
}
exports.default = default_1;
