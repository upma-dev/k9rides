const fs = require('fs');
const path = 'c:/Users/MAYAN/Appzeto Projects/k9rides/frontend/src/modules/Food/pages/user/Dining.jsx';
let content = fs.readFileSync(path, 'utf8');

// The file might have \r\n instead of \n, so let's normalize to \n first for easier regex
content = content.replace(/\r\n/g, '\n');

// Replace the fallback skeleton with a beautiful static image banner
// Use a regex that ignores exact whitespace for the start string
const fallbackRegex = /\)\s*:\s*\(\s*<div\s+className=\{`relative\s+h-full\s+w-full\s+bg-\[radial-gradient\(/s;
const fallbackMatch = content.match(fallbackRegex);

if (fallbackMatch) {
    const fallbackStart = fallbackMatch.index;
    
    // Find the end of this block which is the closing of the `else` div and the closing of the overall `}`
    const fallbackEndStr = '              </div>\n            )}';
    let fallbackEnd = content.indexOf(fallbackEndStr, fallbackStart);
    
    if (fallbackEnd === -1) {
        // try with different indentation
        const fallbackEndRegex = /<\/div>\s*\}\)/s;
        const endMatch = content.substring(fallbackStart).match(fallbackEndRegex);
        if (endMatch) {
            fallbackEnd = fallbackStart + endMatch.index + endMatch[0].length;
        }
    } else {
        fallbackEnd += fallbackEndStr.length;
    }
    
    if (fallbackEnd > fallbackStart) {
        const replacement = `) : (
              <div className="relative h-full w-full">
                <OptimizedImage
                  src={gourmetBanner}
                  alt="Premium Dining"
                  className="w-full h-full"
                  objectFit="cover"
                  priority={true}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 lg:p-8">
                  <div className="max-w-[75%] rounded-2xl bg-black/20 px-3 py-3 text-white backdrop-blur-sm sm:px-4 md:px-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6d00] sm:text-xs">
                      PREMIUM
                    </p>
                    <h2 className="mt-2 text-lg font-bold leading-tight sm:text-2xl md:text-3xl">
                      {loading ? "Curating dining picks..." : "Experience the best dining near you"}
                    </h2>
                  </div>
                </div>
              </div>
            )}`;
        content = content.substring(0, fallbackStart) + replacement + content.substring(fallbackEnd);
    }
}

// Add hover effects to restaurant cards
// Look for the Link wrapper around restaurant card
content = content.replace(/className="block h-full"/g, 'className="block h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl"');

// Make the desktop header glassmorphic (if it isn't already)
const mobileHeaderRegex = /className="sticky top-0 z-50 w-full bg-white\/90 dark:bg-\[#0a0a0a\]\/90 backdrop-blur-xl shadow-sm border-b\s+border-gray-100 dark:border-gray-900 md:hidden pb-3"/s;
const mobileHeaderEndStr = 'className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#d82c23]/95 to-[#ff6d00]/95 backdrop-blur-xl shadow-md border-b border-orange-500/30 md:hidden pb-3"';
content = content.replace(mobileHeaderRegex, mobileHeaderEndStr);

// Also update text colors inside the header to be white so they show on gradient
// Since we can't easily isolate just the header without parsing JSX, we will replace `text-gray-900 dark:text-white` 
// to `text-white` universally for `Dining.jsx`, which is mostly safe for this themed page.
content = content.replace(/text-gray-900 dark:text-white/g, 'text-white');
content = content.replace(/text-gray-500/g, 'text-white/80');

fs.writeFileSync(path, content, 'utf8');
console.log('Interactions updated successfully.');
