var canvas = document.getElementById("example");
function main() {
    if (!canvas) {
        return false;
    }
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("Failed to Create WebGL");
        return;
    }
    // sets the default background clear color.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // clears the specified buffer to default values. in this sets whole framebuffer to default color set above
    gl.clear(gl.COLOR_BUFFER_BIT);
    //drawPoint0(gl);
    //drawPoint1(gl, 0.5, 0.2);
    drawPoint2(gl);
}

function drawPoint0(gl) {
    var VERTEX_SOURCE =
        " void main() {\n" +
        //modifying this value moves the position of the point in WebGL space.
        "   gl_Position = vec4(0.5,0.4,0.0,1.0);\n" +
        //size of the 'point' in pixels. by default it is one pixel for a point
        "   gl_PointSize = 10.0;\n" +
        "}\n";
    var FRAG_SOURCE =
        "void main(){\n" + "gl_FragColor = vec4(0.0,0.8,0.4,1.0);\n" + "}\n";

    if (!initShaders(gl, VERTEX_SOURCE, FRAG_SOURCE)) {
        console.log("Failed to load the Shaders");
        return;
    }
    // can accept parameters, detailed from the vertex data and shader programs that are provided
    // mode: gl.LINE_LOOP, POINTS, LINE_STRIP, LINE_LOOP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
    gl.drawArrays(gl.POINTS, 0, 1);
}

function drawPoint1(gl, x, y) {
    //here we attempt to draw a point by passing two values to the shader.
    var VERTEX_SOURCE =
        "attribute vec4 aPos;\n" +
        "attribute float aSize;\n" +
        "void main() {\n" +
        //modifying this value moves the position of the point in WebGL space.
        "   gl_Position = aPos;\n" +
        //size of the 'point' in pixels. by default it is one pixel for a point
        "   gl_PointSize = aSize;\n" +
        "}\n";
    var FRAG_SOURCE =
        "void main(){\n" + "  gl_FragColor = vec4(0.0,0.8,0.4,1.0);\n" + "}\n";

    if (!initShaders(gl, VERTEX_SOURCE, FRAG_SOURCE)) {
        console.log("Failed to load the Shaders");
        return;
    }
    //set name of the attribute variable. returns location of the attribute variable
    // WebGL automatically parses shader code and allocates memory space for the attribute
    var aPos = gl.getAttribLocation(gl.program, "aPos");
    var aSize = gl.getAttribLocation(gl.program, "aSize");
    if (aPos < 0 && aSize < 0) {
        console.log("Failed to get storage location");
        return;
    }
    // pass vertex position, as a vertex position of type vec4 or a few different points
    // function vertexAttribPasses values to the attriburte variable. 3 floats
    gl.vertexAttrib3f(aPos, x, y, 0.0);
    gl.vertexAttrib1f(aSize, 30.0);
    // there exists differetn versions of this function that can pass one float, 2, and 4 floats to attribute

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}
function drawPoint2(gl) {
    var VERTEX_SOURCE =
        "attribute vec4 aPos;\n" +
        "void main() {\n" +
        "   gl_Position = aPos;\n" +
        "   gl_PointSize = 13.0;\n" +
        "}\n";
    var FRAG_SOURCE =
        "precision mediump float;\n" +
        "uniform vec4 uFragColor;\n" +
        "void main(){\n" +
        "  gl_FragColor = uFragColor;\n" +
        "}\n";

    if (!initShaders(gl, VERTEX_SOURCE, FRAG_SOURCE)) {
        console.log("Failed to load the Shaders");
        return;
    }
    var aPos = gl.getAttribLocation(gl.program, "aPos");
    // similar to attribute data however this time it is with uniform.
    // however this time it is with the color of th block that we are dealing with here
    var uFragColor = gl.getUniformLocation(gl.program, "uFragColor");
    if (aPos < 0 || uFragColor < 0) {
        console.log("Failed to get storage location");
        return;
    }
    console.log(uFragColor);
    var g_points = [];
    var g_colors = [];
    function click(ev, gl, canvas, aPos, uFragColor) {
        var x = ev.clientX;
        var y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        g_points.push([x,y]);
        var distance = Math.sqrt( Math.pow(x, 2) + Math.pow(y,2));
        g_colors.push([distance * Math.abs(x), distance * Math.abs(y),distance , 1.0]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var len = g_points.length;
        for (var i = 0; i < len; i ++) {
            var xy = g_points[i];
            var xx = xy[0];
            var yy = xy[1];
            gl.vertexAttrib3f(aPos, xx ,yy, 0.0);
            var rgba = g_colors[i];
            gl.uniform4f(uFragColor, rgba[0],rgba[1], rgba[2], rgba[3]);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, aPos, uFragColor);
    };
}
