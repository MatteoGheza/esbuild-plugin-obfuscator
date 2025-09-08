import type { Plugin } from 'esbuild';
import type { ObfuscatorOptions } from 'javascript-obfuscator';

export interface ObfuscatorPluginOptions extends ObfuscatorOptions {
  /**
   * Array of glob patterns to filter which files should be obfuscated.
   * Only files matching these patterns will be processed.
   */
  filter?: string[];
  
  /**
   * If true, obfuscates the final output files instead of individual source files.
   * When enabled, the plugin will process the bundled output.
   * @default false
   */
  shouldObfuscateOutput?: boolean;

  /**
   * If true, writes the output source map files when obfuscating the final output.
   * This option is only relevant if `shouldObfuscateOutput` is true.
   * @default false
   */
  shouldWriteOutputSourceMap?: boolean;
  
  /**
   * Whether to ignore require imports during obfuscation.
   * @default true
   */
  ignoreRequireImports?: boolean;
}

/**
 * Creates an esbuild plugin that obfuscates JavaScript/TypeScript code using javascript-obfuscator.
 * 
 * @param options - Configuration options for the obfuscator plugin
 * @returns An esbuild plugin instance
 */
export function ObfuscatorPlugin(options?: ObfuscatorPluginOptions): Plugin;
