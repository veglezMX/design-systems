/**
 * Style Dictionary v5 Configuration
 *
 * This configuration transforms design tokens from DTCG format
 * into platform-specific outputs (CSS, SCSS, Flutter, Vanilla Extract).
 *
 * Key Features:
 * - Uses @tokens-studio/sd-transforms preprocessor for DTCG support
 * - Expands token references and types automatically
 * - Generates CSS custom properties with kebab-case naming
 * - Preserves token references using var() in CSS output
 */

// ES Module imports (Style Dictionary v5 requirement)
import StyleDictionary from 'style-dictionary';
import { register, expandTypesMap } from '@tokens-studio/sd-transforms';

// Register sd-transforms preprocessor
// This enables DTCG format support and token reference resolution
register(StyleDictionary);

// Custom Flutter format (Dart constants)
StyleDictionary.registerFormat({
  name: 'flutter/tokens',
  format: async ({ dictionary }) => {
    const tokens = dictionary.allTokens;

    // Filter tokens by type
    const colors = tokens.filter(
      (t) => t.$type === 'color' || t.type === 'color'
    );
    const spacing = tokens.filter(
      (t) =>
        t.$type === 'dimension' ||
        t.type === 'spacing' ||
        t.type === 'sizing' ||
        t.$type === 'sizing'
    );

    // Convert token path to camelCase for Dart identifiers
    const toDartName = (token) => {
      return token.path
        .join('-')
        .split(/[.\-]/)
        .map((part, index) =>
          index === 0
            ? part.toLowerCase()
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join('');
    };

    // Convert hex string to Flutter Color()
    const toFlutterColor = (value) => {
      if (typeof value !== 'string') return 'Color(0xFF000000)';
      const hex = value.replace('#', '');
      return `Color(0xFF${hex.toUpperCase().padStart(6, '0')})`;
    };

    let output = `// Do not edit directly, this file was auto-generated.
// ignore_for_file: constant_identifier_names

import 'package:flutter/material.dart';

abstract class DSTokens {
`;

    if (colors.length > 0) {
      output += '\n  // Colors\n';
      colors.forEach((token) => {
        const resolvedValue = token.value ?? token.$value;
        output += `  static const Color ${toDartName(token)} = ${toFlutterColor(resolvedValue)};\n`;
      });
    }

    if (spacing.length > 0) {
      output += '\n  // Spacing\n';
      spacing.forEach((token) => {
        const resolvedValue = token.value ?? token.$value;
        const numericValue = parseFloat(resolvedValue) || 0;
        output += `  static const double ${toDartName(token)} = ${numericValue};\n`;
      });
    }

    output += '}\n';
    return output;
  },
});

// Custom Vanilla Extract format (typed token object)
StyleDictionary.registerFormat({
  name: 'vanilla-extract/tokens',
  format: async ({ dictionary }) => {
    const buildNestedObject = (tokens) => {
      const result = {};

      tokens.forEach((token) => {
        const parts = token.path;
        const resolvedValue = token.value ?? token.$value;
        let current = result;

        parts.forEach((part, index) => {
          if (index === parts.length - 1) {
            current[part] = resolvedValue;
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
      });

      return result;
    };

    const nestedTokens = buildNestedObject(dictionary.allTokens);

    return `// Do not edit directly, this file was auto-generated.

export const tokens = ${JSON.stringify(nestedTokens, null, 2)} as const;

export type Tokens = typeof tokens;
`;
  },
});

/**
 * Style Dictionary Configuration
 *
 * Source: All JSON files in tokens/ directory (DTCG format with $value, $type)
 * Output: build/css/variables.css
 */
const config = {
  // Source token files (DTCG format)
  source: ['tokens/**/*.json'],

  // Preprocessor: tokens-studio
  // Resolves references like {color.primitive.blue.500} → #0066ff
  // Expands composite tokens (typography, shadows, etc.)
  preprocessors: ['tokens-studio'],

  // Expand configuration
  // Maps DTCG token types to Style Dictionary internal types
  expand: {
    typesMap: expandTypesMap,
  },

  // Platform configurations
  platforms: {
    // CSS Custom Properties (CSS Variables)
    css: {
      // Transform group from sd-transforms
      // Applies transforms for web/CSS output
      transformGroup: 'tokens-studio',

      // Additional transforms
      // name/kebab: Converts token names to kebab-case
      transforms: ['name/kebab'],

      // Prefix for all CSS custom properties
      // Example: --ds-color-action-primary
      prefix: 'ds',

      // Output directory
      buildPath: 'build/css/',

      // Output files
      files: [
        {
          // Output file name
          destination: 'variables.css',

          // Format: CSS custom properties in :root selector
          format: 'css/variables',

          // Options
          options: {
            // outputReferences: Preserve token references as var() in CSS
            // Example: --ds-color-action-primary: var(--ds-color-primitive-blue-500);
            // This maintains the token hierarchy in the output
            outputReferences: true,
          },
        },
      ],
    },

    // SCSS variables
    scss: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      prefix: 'ds',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },

    // Flutter/Dart constants
    flutter: {
      transformGroup: 'tokens-studio',
      buildPath: 'build/flutter/',
      files: [
        {
          destination: 'tokens.dart',
          format: 'flutter/tokens',
        },
      ],
    },

    // Vanilla Extract typed tokens
    'vanilla-extract': {
      transformGroup: 'tokens-studio',
      buildPath: 'build/vanilla-extract/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'vanilla-extract/tokens',
        },
      ],
    },
  },
};

/**
 * Async build function
 *
 * Style Dictionary v5 uses async/await pattern.
 * Must await hasInitialized before building.
 */
async function build() {
  console.log('🎨 Building design tokens...\n');

  try {
    // Create Style Dictionary instance
    const sd = new StyleDictionary(config);

    // Wait for initialization to complete
    // This processes all source files and applies preprocessors
    await sd.hasInitialized;

    // Build all configured platforms
    // Generates output files for each platform
    await sd.buildAllPlatforms();

    console.log('\n✅ Build complete!');
    console.log('📁 Output:');
    console.log('  - build/css/variables.css');
    console.log('  - build/scss/_variables.scss');
    console.log('  - build/flutter/tokens.dart');
    console.log('  - build/vanilla-extract/tokens.ts');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Execute build and handle errors
build().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
