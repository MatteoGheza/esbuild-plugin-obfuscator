import esbuild from 'esbuild';
import { esbuildObfuscatorPlugin } from '../esbuild-obfuscator-plugin.js';

// Run esbuild with the obfuscator plugin and micromatch file filtering
esbuild.build({
  entryPoints: ['test/src/main.js'], // Entry files to build
  bundle: true,
  outfile: 'test/dist/output.js', // Output file
  plugins: [
    esbuildObfuscatorPlugin({
      compact: true, // Obfuscator options
      controlFlowFlattening: true,

      //shouldObfuscateOutput: true, // Obfuscate all output files

      // Use micromatch patterns to only obfuscate specific files
      filter: ['**/sanitize.js'], // Obfuscate 'input.js', but exclude files in 'exclude' folder
    }),
  ],
}).then(() => {
  console.log('Build complete with selective obfuscation');
}).catch(() => process.exit(1));
