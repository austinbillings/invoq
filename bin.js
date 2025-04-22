#!/usr/bin/env node

const fs = require('fs')
const invoq = require('./index')
const { resolve } = require('path')

const invoqFilename = 'invoq.js';

(function () {
    let lastInvoqPath = null
    let closestInvoqPath = resolve(process.cwd(), invoqFilename)
    let parentCount = 0

    while (!fs.existsSync(closestInvoqPath) && closestInvoqPath !== lastInvoqPath) {
        lastInvoqPath = closestInvoqPath;
        parentCount++;
        let pathArgs = [
            process.cwd(),
            ...(new Array(parentCount)).fill('..'),
            invoqFilename
        ]
        closestInvoqPath = resolve(...pathArgs)
    }

    if (!fs.existsSync(closestInvoqPath)) {
        console.warn('[ ! ] No invoq.js file detected in current or any parent directories. Please add an invoq.js file describing the commands you want to be able to invoq.')
    } else {
        let definitions
        let args = process.argv.slice(2)
        try {
            definitions = require(closestInvoqPath);
            invoq(definitions, args, closestInvoqPath)
        } catch (e) {
            console.error(`[ ! ] Error loading commands from ${closestInvoqPath}: ${e.message}`)
        }
    }
})();
