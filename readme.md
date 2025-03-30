# @flemminghansen/color-tools

[![npm version](https://badge.fury.io/js/@flemminghansen%2Fcolor-tools.svg)](https://badge.fury.io/js/@flemminghansen%2Fcolor-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A small collection of tools to make it easier to work with and convert colors in JavaScript/TypeScript. It provides functions for converting between HEX, RGBA, and HSLA formats, mixing colors, and calculating brightness and contrast ratios.

---

## Table of Contents

- [@flemminghansen/color-tools](#flemminghansencolor-tools)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Example](#example)
  - [API Documentation](#api-documentation)
    - [Color Conversion Functions](#color-conversion-functions)
    - [Color Mixing \& Channel Utilities](#color-mixing--channel-utilities)
    - [Brightness and Contrast](#brightness-and-contrast)
    - [HSLA String Utilities](#hsla-string-utilities)


## Features

- **Color Conversions:**  
  - Convert HEX strings to RGBA/HSLA objects.  
  - Convert RGBA and HSLA values back to HEX strings.
- **Color Mixing:**  
  - Blend individual color channels by a specified percentage.
  - Mix two colors gradually in a given number of steps.
- **Brightness & Contrast:**  
  - Calculate the brightness factor for a color channel.
  - Compute overall brightness for an RGB color.
  - Determine the contrast ratio between two brightness values.
- **HSLA Utilities:**  
  - Validate and adjust HSLA values.
  - Generate formatted HSLA strings, with optional modifications.

## Installation

Install via npm:

```bash
npm install @flemminghansen/color-tools
```

## Example
```TypeScript
import {
  hexToRGBA,
  hexToHSLA,
  hslaToHex,
  rgbaToHex,
  hslaToRGBA,
  rgbaToHSLA,
  mixColors,
  getRGBBrightness,
  getContrastRatio,
  getHSLaAsString,
} from '@flemminghansen/color-tools';

// Convert HEX to RGBA
const rgba = hexToRGBA('#3498db');
console.log(rgba); // { R: 52, G: 152, B: 219, A: 1 }

// Convert HEX to HSLA
const hsla = hexToHSLA('#3498db');
console.log(hsla);

// Mix two colors (in a simple way)
const color1 = { R: 255, G: 0, B: 0 };
const color2 = { R: 0, G: 0, B: 255 };
const mixedColor = mixColors(color1, color2, 10);
console.log(mixedColor);

// Get brightness of an RGB color
const brightness = getRGBBrightness(52, 152, 219);
console.log(`Brightness: ${brightness}`);

// Get contrast ratio between two brightness values
const contrast = getContrastRatio(0.5, 0.8);
console.log(`Contrast Ratio: ${contrast}`);

// Generate an HSLA string with optional modifications
const hslaString = getHSLaAsString({ H: 200, S: 50, L: 40, A: 1 }, { L: 10 });
console.log(hslaString);

```

## API Documentation

### Color Conversion Functions

* hexToRGBA(hex: string): { R: number; G: number; B: number; A: number }
Converts a HEX color string to an RGBA object.
Example: hexToRGBA("#ff5733")

* hexToHSLA(hex: string): { H: number; S: number; L: number; A: number }
Converts a HEX color string to an HSLA object by first converting it to RGBA.

* hslaToHex(H: number, S: number, L: number, A?: number): string
Converts HSLA values to a HEX string.
Note: The alpha channel is appended only if it’s less than 1.

* rgbaToHex(R: number, G: number, B: number, A?: number): string
Converts RGBA values to a HEX string.

* hslaToRGBA(H: number, S: number, L: number, A?: number): IRGBa
Converts HSLA values to an RGBA object.

* rgbaToHSLA(R: number, G: number, B: number, A?: number): { H: number; S: number; L: number; A: number }
Converts RGBA values to an HSLA object.

### Color Mixing & Channel Utilities
* channelBlendByPercentage(percentage: number, baseChannel: number, mixChannel: number): number
Blends a single color channel between two values based on a percentage.

* mixColors(firstColor: IRGB, oppositeColor: IRGB, steps: number): IRGB
Mixes two colors by blending their RGB channels gradually over the specified number of steps.

### Brightness and Contrast
* getBrightnessFactor(value: number): number
Computes a normalized brightness factor for a single RGB channel.

* getRGBBrightness(R: number, G: number, B: number): number
Calculates overall brightness for an RGB color using weighted factors for red, green, and blue.

* getContrastRatio(brightness1: number, brightness2: number): number
Computes the contrast ratio between two brightness values.

### HSLA String Utilities
* getValidatedHSLAValues({ H, S, L, A }: IHSLa): IHSLa
Validates and clamps HSLA values within expected ranges.

* getHSLaAsString(baseHSLA: IHSLa, modifyHSLA?: Partial<IHSLa>): string
Returns a formatted HSLA string. Optionally, modifications can be applied to the base values.


License MIT
