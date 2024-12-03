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
import { convertNeoboardSlideToSvg } from './convert.ts';
import { zWhiteboard } from './types.ts';

const inputPath = process.argv[2];
const outputPath = process.argv[3];
try {
    const data = JSON.parse(await fs.readFile(inputPath, 'utf8'));
    const safeWhiteboard = zWhiteboard.safeParse(data);
    if (!safeWhiteboard.success) {
        console.error(safeWhiteboard.error);
        throw Error('Invalid or unsupported NeoBoard');
    }
    const output = convertNeoboardSlideToSvg(safeWhiteboard.data);
    await fs.writeFile(outputPath, output, 'utf8');
} catch (err) {
    console.error(err);
    process.exit(1);
}
