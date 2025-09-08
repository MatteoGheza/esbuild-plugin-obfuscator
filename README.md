# esbuild-plugin-obfuscator

A plugin for [esbuild](https://esbuild.github.io/) that obfuscates JavaScript using [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator). This plugin allows developers to selectively obfuscate JavaScript files during the build process, enhancing security by making the code more difficult to read and understand.

## Installation

Install the plugin with npm:

```bash
npm install esbuild-plugin-obfuscator --save-dev
```

## Usage

To use the `esbuild-plugin-obfuscator`, import it in your build script and configure it according to your needs. Below is an example of how to set up the plugin with `esbuild`:

### Example

```javascript
import esbuild from 'esbuild';
import { ObfuscatorPlugin } from 'esbuild-plugin-obfuscator';

// Run esbuild with the obfuscator plugin and micromatch file filtering
esbuild.build({
  entryPoints: ['src/main.js'], // Entry files to build
  bundle: true,
  outfile: 'dist/output.js', // Output file
  plugins: [
    ObfuscatorPlugin({
      compact: true, // Obfuscator options
      controlFlowFlattening: true,
      filter: ['**/sanitize.js'], // Obfuscate 'sanitize.js' only
    }),
  ],
}).then(() => {
  console.log('Build complete with selective obfuscation');
}).catch(() => process.exit(1));
```

### Options

The `ObfuscatorPlugin` accepts the following options:

- **filter** (`Array<string>`): A list of micromatch patterns that specify which files should be obfuscated. Default is an empty array `[]`.

- **shouldObfuscateOutput** (`boolean`): If set to `true`, the plugin will obfuscate all output files after the build process is completed. Default is `false`.

- **shouldWriteOutputSourceMap** (`boolean`): If set to `true`, writes the output source map files when obfuscating the final output. This option is only relevant if `shouldObfuscateOutput` is true. Default is `false`.

- **ignoreRequireImports** (`boolean`): If set to `true`, it prevents obfuscation of `require` imports. Could be helpful in some cases when for some reason runtime environment requires these imports with static strings only.

- **options** (`Object`): Additional options for the `javascript-obfuscator`. This can include various configurations available in [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator#options).

### Source Maps Support

The plugin automatically generates source maps for obfuscated code to help with debugging:

- **During transform phase**: Source maps are automatically generated and included in esbuild's source map chain, allowing you to debug obfuscated code back to the original source.
- **During output phase**: When using `shouldObfuscateOutput: true`, you can enable `shouldWriteOutputSourceMap: true` to write separate `.map` files alongside the obfuscated output files.

### Example with Output Obfuscation and Source Maps

You can also configure the plugin to obfuscate the output files with source map generation:

```javascript
esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/output.js',
  sourcemap: true, // Enable esbuild source maps
  plugins: [
    ObfuscatorPlugin({
      shouldObfuscateOutput: true, // Obfuscate all output files
      shouldWriteOutputSourceMap: true, // Generate .map files for obfuscated output
      compact: true,
      controlFlowFlattening: true,
    }),
  ],
}).then(() => {
  console.log('Build complete with output obfuscation and source maps');
}).catch(() => process.exit(1));
```

### Example with Transform-time Obfuscation and Source Maps

For transform-time obfuscation, source maps are automatically integrated into esbuild's source map chain:

```javascript
esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/output.js',
  sourcemap: true, // Enable esbuild source maps
  plugins: [
    ObfuscatorPlugin({
      filter: ['**/sanitize.js'], // Obfuscate specific files
      compact: true,
      controlFlowFlattening: true,
    }),
  ],
}).then(() => {
  console.log('Build complete with selective obfuscation and integrated source maps');
}).catch(() => process.exit(1));
```

## File Filtering

The plugin uses [micromatch](https://github.com/micromatch/micromatch) to filter which files are obfuscated. You can use patterns like:

- `**/*.js` to match all JavaScript files.
- `**/folder/*.js` to match JavaScript files in a specific folder.
- `!**/exclude/**` to exclude files from being obfuscated.

### Example of Filtering

```javascript
ObfuscatorPlugin({
  filter: ['**/*.js', '!**/exclude/**'],
});
```

## Contributing

Contributions are welcome! If you would like to contribute to this project, please fork the repository and submit a pull request. Ensure that your code follows the project's style and is well-documented.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [esbuild](https://esbuild.github.io/) for providing a fast and efficient JavaScript bundler.
- [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) for powerful obfuscation capabilities.
- [esbuild-extra](https://github.com/aleclarson/esbuild-extra) - for extending Esbuild plugins abilities, especially for the `onTransform` and `onEnd` hooks.

## Support

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/MatteoGheza/esbuild-plugin-obfuscator/issues).
