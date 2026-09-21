/**
 * Tears down a p5 instance so it cannot leave an orphaned canvas behind.
 *
 * p5 2.x starts a sketch asynchronously: the constructor kicks off `_start`,
 * which awaits the `presetup` lifecycle hooks before it creates any canvas.
 * `remove()` only does its work once a canvas exists, so an instance disposed
 * while setup is still in flight ignores the call, finishes setting up, and
 * attaches its canvas to a `<main>` element of its own. That stray canvas is
 * never redrawn, and because it is appended to the body it paints over the
 * live sketch, which makes the app look frozen.
 *
 * React StrictMode hits this on every mount in development, since it runs the
 * effect, cleans it up, and runs it again within the same tick.
 *
 * p5 guards each step of its async startup with `hitCriticalError`, so setting
 * that flag first makes an in-flight setup bail out instead of creating a
 * canvas. The explicit canvas removal afterwards covers the case where setup
 * had already completed.
 *
 * @param {Object|null} instance - The p5 instance to dispose of.
 */
const disposeP5Instance = (instance) => {
  if (!instance) return;

  instance.hitCriticalError = true;

  try {
    instance.remove();
  } catch (err) {
    // A sketch torn down mid-setup can throw from its own teardown; the canvas
    // sweep below is what actually has to happen.
  }

  const canvas = instance.canvas;
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }
};

export default disposeP5Instance;
