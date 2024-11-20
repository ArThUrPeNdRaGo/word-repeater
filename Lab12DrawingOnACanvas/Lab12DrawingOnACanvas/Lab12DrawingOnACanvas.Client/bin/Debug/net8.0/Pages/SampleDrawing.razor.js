
// Global state Variables
var animating = false;
var animationFrameId = 0;

/**
 * Called by C# to turn the animation on or off.
 * @param {any} on - start or stop animation.
 */
export function ToggleAnimation( on )
{
    console.log("S: Toggle Animation " + on);
    animating = on;
    if (on)
    {
        animationFrameId = window.requestAnimationFrame(AnimationLoopJS);
    }
    else
    {
        window.cancelAnimationFrame(animationFrameId);
    }
}

/**
 * This code tells the C# side to draw the scene.
 * It then "sleeps" and recalls itself X frames a second
 * where X is usually 60, or whatever the browser is optimized
 * for.  
 * 
 * Additionally, it only calls this method if the windows is
 * showing. If you switch to a different tab, the animation stops.
 * 
 * @param {any} timeStamp - provided by the browser. how many seconds
 * have elapsed sense the page was loaded.
 */
function AnimationLoopJS(timeStamp)
{
    DotNetSide.invokeMethodAsync('Draw', timeStamp);
    if ( animating )
    {
        animationFrameId = window.requestAnimationFrame(AnimationLoopJS);
    }
}

/**
 * This is a resize event handler that allows the screen
 * to be resized and gives C# the opportunity to do something
 * about it (if you wish);
 */
function resizeCanvasToFitWindow()
{
    var holder = document.getElementById('myCanvas');
    var canvas = holder.querySelector('canvas');
    if (canvas)
    {
        var sideCar = document.getElementsByClassName('sidebar');
        var main = document.getElementsByTagName('main');

        //var width = window.innerWidth - sideCar[0].getBoundingClientRect().width;
        let width = document.getElementsByTagName('main')[0].offsetWidth;
        width = Math.min(width - 100, 1000);
        canvas.width = width;

        DotNetSide.invokeMethodAsync('ResizeInBlazor', width, width );
    }
}

/**
 * Setup the JavaScript side so:
 * 1) It knows about the C# side --> DotNetSide
 * 2) It has a resize window handler
 * 
 * @param {any} DotNetSide - the C# instance from the razor code.
 */
export function initJS( DotNetSide )
{
    window.DotNetSide = DotNetSide;
    window.addEventListener("resize", resizeCanvasToFitWindow);
    resizeCanvasToFitWindow();
}

/**
 * Stop the animation when we leave the page.
 * This is probably not used, as we are running the code on the server.
 */
window.addEventListener("unload", () =>
{
    console.log("Networked JS: leaving page.");
    animating = false;
});

/**
 *  setup the key event connection to C#.
 */
document.addEventListener('keydown', function (event)
{
    // Optionally log the key for testing
    console.log('Key pressed:', event.key);

    // Call the C# method and pass the key pressed
    // DotNetSide.invokeMethodAsync('HandleKeyPress', event.key);
});
