import JavaScriptObfuscator from 'javascript-obfuscator';
import micromatch from 'micromatch';
import { promises as fs } from 'fs';
import { getBuildExtensions } from 'esbuild-extra';

export function ObfuscatorPlugin({
  filter = [],
  shouldObfuscateOutput = false,
  shouldWriteOutputSourceMap = false,
  ignoreRequireImports = true,
  ...options
} = {}) {
  return {
    name: 'obfuscator',
    async setup(build) {
      const { onTransform } = getBuildExtensions(build, 'obfuscator');
      
      options = {
        ignoreRequireImports,
        ...options,
      };

      if (shouldObfuscateOutput) {
        build.initialOptions.write = false;

        build.onEnd(async (result) => {
          let tasks = [];

          for (const output of result.outputFiles) {
            const filePath = output.path;

            const originalCode = output.text;

            // Obfuscate the code using javascript-obfuscator with sourcemap generation
            const obfuscationResult = JavaScriptObfuscator.obfuscate(originalCode, {
              ...options,
              sourceMap: true,
              sourceMapFileName: filePath + '.map'
            });

            const obfuscatedCode = obfuscationResult.getObfuscatedCode();
            const sourceMap = obfuscationResult.getSourceMap();

            // Write the obfuscated code to the file
            tasks.push(fs.writeFile(filePath, obfuscatedCode));
            
            if (shouldWriteOutputSourceMap) {
              // Write the sourcemap file
              tasks.push(fs.writeFile(filePath + '.map', sourceMap));
            }
          }

          await Promise.all(tasks);
        });
      } else {
        onTransform({ 
          loaders: ['js'],
          namespace: 'file'
        }, async (args) => {
          // Use micromatch to check if the input file matches any patterns in the filter array
          const shouldObfuscate = micromatch.isMatch(args.path, filter);

          // If the input file does not match the filter, skip obfuscation
          if (!shouldObfuscate) {
            return { code: args.code };
          }

          // Obfuscate the JavaScript code with sourcemap generation
          const obfuscationResult = JavaScriptObfuscator.obfuscate(args.code, {
            ...options,
            sourceMap: true,
            sourceMapFileName: args.path + '.map'
          });

          const obfuscatedCode = obfuscationResult.getObfuscatedCode();
          let sourceMap = obfuscationResult.getSourceMap();

          sourceMap = JSON.parse(sourceMap);
          sourceMap.sources = [];

          return {
            code: obfuscatedCode,
            map: sourceMap
          };
        });
      }
    },
  };
}
