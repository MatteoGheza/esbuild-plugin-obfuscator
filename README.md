# esbuild-obfuscator-plugin

A plugin for [esbuild](https://esbuild.github.io/) that obfuscates JavaScript using [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator). This plugin allows developers to selectively obfuscate JavaScript files during the build process, enhancing security by making the code more difficult to read and understand.

## Installation

Install the plugin with npm:

```bash
npm install esbuild-obfuscator-plugin --save-dev
```

## Usage

To use the `esbuild-obfuscator-plugin`, import it in your build script and configure it according to your needs. Below is an example of how to set up the plugin with `esbuild`:

### Example

```javascript
import esbuild from 'esbuild';
import { ObfuscatorPlugin } from 'esbuild-obfuscator-plugin';

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

- **ignoreRequireImports** (`boolean`): If set to `true`, it prevents obfuscation of `require` imports. Could be helpful in some cases when for some reason runtime environment requires these imports with static strings only.

- **options** (`Object`): Additional options for the `javascript-obfuscator`. This can include various configurations available in [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator#options).

### Example with Output Obfuscation

You can also configure the plugin to obfuscate the output files as follows:

```javascript
esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/output.js',
  plugins: [
    ObfuscatorPlugin({
      shouldObfuscateOutput: true, // Obfuscate all output files
      compact: true,
      controlFlowFlattening: true,
    }),
  ],
}).then(() => {
  console.log('Build complete with output obfuscation');
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

## Support

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/MatteoGheza/esbuild-plugin-obfuscator/issues).
