import JavaScriptObfuscator from 'javascript-obfuscator';
import micromatch from 'micromatch';
import { promises as fs } from 'fs';

export function esbuildObfuscatorPlugin({ filter = [], shouldObfuscateOutput = false, ...options } = {}) {
  return {
    name: 'esbuild-obfuscator',
    async setup(build) {
      if (shouldObfuscateOutput) {
        build.initialOptions.write = false;

        build.onEnd(async (result) => {
          let tasks = [];

          for (const output of result.outputFiles) {
            const filePath = output.path;

            const originalCode = output.text;

            // Obfuscate the code using javascript-obfuscator
            const obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, options).getObfuscatedCode();

            // Write the obfuscated code to the file
            tasks.push(fs.writeFile(filePath, obfuscatedCode));
          }

          await Promise.all(tasks);
        });
      } else {
        build.onLoad({ filter: /\.js$/ }, async (args) => {
          // Read the file content
          let source = await fs.readFile(args.path, 'utf8');
  
          const inputFilePath = args.path;
  
          // Use micromatch to check if the input file matches any patterns in the filter array
          const shouldObfuscate = micromatch.isMatch(inputFilePath, filter);
  
          // If the input file does not match the filter, skip obfuscation
          if (shouldObfuscate) {
            source = JavaScriptObfuscator.obfuscate(source, options).getObfuscatedCode();
          }
    
          return {
            contents: source,
            loader: 'js',
          };
        });
      }
    },
  };
}
