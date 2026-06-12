import app from '../src/app.js';

function printRoutes(app) {
    const routes = [];
    
    function traverse(router, pathPrefix = '') {
        if (!router || !router.stack) return;
        
        router.stack.forEach(layer => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
                const path = pathPrefix + layer.route.path;
                methods.forEach(method => {
                    routes.push({ method, path });
                });
            } else if (layer.name === 'router') {
                let nextPrefix = pathPrefix;
                if (layer.regexp) {
                    const match = layer.regexp.toString().match(/^\/\^\\(\/.*?)\\\/\?\(\?\=\\\/\|\$\)\/i?/);
                    if (match && match[1]) {
                        nextPrefix += match[1].replace(/\\/g, '');
                    }
                }
                traverse(layer.handle, nextPrefix);
            }
        });
    }
    
    traverse(app._router);
    return routes;
}

const allRoutes = printRoutes(app);
const filtered = allRoutes.filter(r => r.path.includes('hero-banners') || r.path.includes('link-restaurants'));
console.log(JSON.stringify(filtered, null, 2));
process.exit(0);
