import JavaScriptObfuscator from 'javascript-obfuscator';
import micromatch from 'micromatch';
import { promises as fs } from 'fs';
import { transform } from 'esbuild';

export function ObfuscatorPlugin({ filter = [], shouldObfuscateOutput = false, ...options } = {}) {
  return {
    name: 'obfuscator',
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
        build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
          const isTs = args.path.endsWith('.ts');
          let loader = isTs ? 'ts' : 'js';

          // Read the file contents
          let source = await fs.readFile(args.path, 'utf8');

          // Use micromatch to check if the input file matches any patterns in the filter array
          const shouldObfuscate = micromatch.isMatch(args.path, filter);

          // If the input file does not match the filter, skip obfuscation
          if (shouldObfuscate) {
            // If it's a TypeScript file, transpile it to JavaScript using esbuild
            if (isTs) {
              const result = await transform(await fs.readFile(args.path, 'utf8'), {
                loader: 'ts',
                sourcemap: false,
              });
              source = result.code;
            }

            source = JavaScriptObfuscator.obfuscate(source, options).getObfuscatedCode();
          }

          return {
            contents: source,
            loader
          };
        });
      }
    },
  };
}
