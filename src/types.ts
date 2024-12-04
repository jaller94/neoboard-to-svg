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

import z from 'zod';

export const zPoint = z.object({
    x: z.number(),
    y: z.number(),
});

export const zWhiteboard = z.object({
    version: z.literal('net.nordeck.whiteboard@v1'),
    whiteboard: z.object({
        files: z.array(z.object({
            mxc: z.string(),
            data: z.string(),
        })).optional(),
        slides: z.array(z.object({
            elements: z.array(z.discriminatedUnion('type', [
                z.object({
                    type: z.literal('shape'),
                    kind: z.enum(['rectangle', 'circle', 'ellipse', 'triangle']),
                    position: zPoint,
                    width: z.number(),
                    height: z.number(),
                    fillColor: z.string(),
                    strokeColor: z.string().optional(),
                    strokeWidth: z.number().min(0).optional(),
                    borderRadius: z.number().optional(),
                    text: z.string(),
                    textAlignment: z.enum(['left', 'center', 'right']).optional(),
                    textColor: z.string().optional(),
                    textBold: z.boolean().optional(),
                    textItalic: z.boolean().optional(),
                }),
                z.object({
                    type: z.literal('path'),
                    kind: z.enum(['line', 'polyline']),
                    position: zPoint,
                    points: z.array(zPoint),
                    strokeColor: z.string(),
                    endMarker: z.enum(['arrow-head-line']).optional(),
                }),
                z.object({
                    type: z.literal('image'),
                    mxc: z.string(),
                    fileName: z.string(),
                    mimeType: z.enum(['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml']).optional(),
                    position: zPoint,
                    width: z.number().min(0),
                    height: z.number().min(0),
                }),
            ])),
        })),
    }),
});
