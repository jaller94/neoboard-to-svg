# NeoBoard to SVG

This script can partially convert [NeoBoard whiteboards](https://neoboard.io/) to SVG files.

## Support table

Yes:
- Rectangles
- Circles and ellipses
- Lines and Polylines (except `endMarker`)

No:
- Text
- Triangles
- Images

## Usage

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts ./input.nwb ./output.png
```

## License

This project is licensed under [APACHE 2.0](./LICENSE).

The disclaimer for other OSS components can be accessed via the `/NOTICE.txt` endpoint.
The list of dependencies and their licenses are also available in a machine readable format at `/usr/share/nginx/html/licenses.json` in the container image.
