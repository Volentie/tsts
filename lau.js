(function() {
    var chunkId = 96166
    var url = "https://cdn.jsdelivr.net/gh/Volentie/tsts@main/lau.js";

    installedChunks[chunkId] = undefined;

    __webpack_require__.f.j(chunkId, []).then(() => {
        console.log("Chunk loaded successfully");
    }).catch(err => {
        console.error("Chunk loading failed", err);
    });

    var onScriptComplete = function(event) {
        var chunk = installedChunks[chunkId];
        if(chunk !== 0) {
            if(chunk) {
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
                error.type = errorType;
                error.request = realSrc;
                chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
        }
    };

    __webpack_require__.l(url, onScriptComplete, "chunk-" + chunkId, chunkId);
})();
