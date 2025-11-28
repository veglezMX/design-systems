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
    console.log('📁 Output: build/css/variables.css');
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
