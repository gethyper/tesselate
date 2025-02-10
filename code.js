// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// Creates a "rotate" transform.
function rotate(theta) {
    return [
        [Math.cos(theta), Math.sin(theta), 0],
        [-Math.sin(theta), Math.cos(theta), 0]
    ];
}
var w = 1000;
var h = 800;
var tile_h;
var tile_w;
var tri_w = 100;
var tri_h = 100;
// Combines two transforms by doing a matrix multiplication.
// The first transform applied is a, followed by b, which
// is normally written b * a.
function multiply(a, b) {
    return [
        [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]],
        [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + 0, a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]]
    ];
}
// Creates a "move" transform.
function move(x, y) {
    return [
        [1, 0, x],
        [0, 1, y]
    ];
}
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: w, height: h, title: "My title" });
function turnFrameIntoComponent() {
    const selection = figma.currentPage.selection[0];
    if (!selection) {
        return;
    }
    if (selection.type !== 'FRAME') {
        return;
    } // <----
    const component = figma.createComponent();
    component.x = selection.x;
    component.y = selection.y;
    component.resize(selection.width, selection.height);
    // Copy children into new node
    for (const child of selection.children) {
        component.appendChild(child);
    }
    selection.remove();
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-pattern') {
        const nodes = [];
        //const component = figma.createComponent()
        /*component.resizeWithoutConstraints(tile_w, tile_h)
          for (const child of tile.children) {
            component.appendChild(child)
        }*/
        for (let i = 0; i < msg.count; i++) {
            const tri = figma.createPolygon();
            //const grp = figma.group(tri);
            //tri.resize(tri_w, tri_h);
            tri.x = ((i * tri_w) / 2);
            tri.y = 0;
            tri.cornerRadius = 0;
            if (!Number.isInteger(i / 2 + 1)) {
                console.log(rotate(180).length);
                tri.y = tri.y + tri_h;
                tri.rotation = 180;
            }
            //rect.relativeTransform = multiply(rotate(180), rect.relativeTransform)
            tri.fills = [{ type: 'SOLID', color: { r: 1, g: 0.45, b: 0 } }];
            const grp = figma.group(tri, figma.currentPage);
            figma.flatten(tri, figma.currentPage);
            grp.resize(tri_w, tri_h);
            //figma.currentPage.appendChild(nodes);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
