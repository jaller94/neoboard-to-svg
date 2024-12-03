/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'node:fs/promises';
import process from 'node:process';
import { create } from 'xmlbuilder2';
import z from 'zod';
import { zWhiteboard } from './types.ts';

const main = (doc: z.infer<typeof zWhiteboard>, slideIndex = 0): string => {
    // Create the svg document
    const root = create({ version: '1.0' })
        .ele('svg', { width: 1920, height: 1080, version: '1.0', 'xmlns': 'http://www.w3.org/2000/svg' });
    const elements = root;

    // Iterate through all elements of the first slide
    for (const element of doc.whiteboard.slides[slideIndex]?.elements) {
        if (element.type === 'shape') {
            
            // Transform values and apply defaults
            // NeoBoard uses "transparent" but Inkscape only supports the SVG standard "none"
            let fillColor = element.fillColor === 'transparent' ? 'none' : element.fillColor;
            let strokeColor = element.strokeColor ?? element.fillColor;
            if (strokeColor === 'transparent') {
                strokeColor = 'none';
            }
            const strokeWidth = element.strokeWidth ?? 2;

            if (element.kind === 'rectangle') {
                elements.ele('rect', {
                    x: element.position.x,
                    y: element.position.y,
                    fill: fillColor,
                    width: element.width,
                    height: element.height,
                    stroke: strokeColor,
                    'stroke-width': element.strokeWidth ?? 2,
                    ...(typeof element.borderRadius === 'number' ? {
                        rx: element.borderRadius,
                        ry: element.borderRadius,
                    } : undefined),
                });
            } else if (element.kind === 'circle' || element.kind === 'ellipse') {
                elements.ele('ellipse', {
                    cx: element.position.x + element.width / 2,
                    cy: element.position.y + element.height / 2,
                    fill: fillColor,
                    rx: element.width / 2,
                    ry: element.height / 2,
                    stroke: strokeColor,
                    'stroke-width': strokeWidth,
                });
            } else if (element.kind === 'triangle') {
                // elements.ele('polygon', {
                //     // TODO
                //     points: `${1},${1} ${1},${1} ${1},${1}`,
                //     fill: fillColor,
                //     stroke: strokeColor,
                //     'stroke-width': strokeWidth,
                // });
            }
        }
    }
    return root.end({ prettyPrint: true });
};

const inputPath = process.argv[2];
const outputPath = process.argv[3];
try {
    const data = JSON.parse(await fs.readFile(inputPath, 'utf8'));
    const safeWhiteboard = zWhiteboard.safeParse(data);
    if (!safeWhiteboard.success) {
        console.error(safeWhiteboard.error);
        throw Error('Invalid or unsupported NeoBoard');
    }
    const output = main(safeWhiteboard.data);
    await fs.writeFile(outputPath, output, 'utf8');
} catch (err) {
    console.error(err);
    process.exit(1);
}
