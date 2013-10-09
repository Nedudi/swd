(function(window){
  "use strict";

  /**
   *
   * @param data
   *  canvas
   *  image
   *  fragmentShader
   *  vertextShader
   */
  function CanvasGLFilter(data) {
    var _defFragmentShader = 'precision highp float; varying vec2 texCoord; uniform sampler2D uSampler; void main(void) { gl_FragColor = texture2D(uSampler, texCoord); }';
    var _defVertexShader = 'attribute highp vec2 vVertexPosition; attribute highp vec2 vTextureCoord; varying highp vec2 texCoord; void main(void) { gl_Position = vec4(vVertexPosition * 2.0 - 1.0, 0.0, 1.0); texCoord = vTextureCoord; }';
    var _data = {};
    this._canvas = data.canvas;
    this._sourceElement = data.image;
    this._fragmentShader = data.fragmentShader || _defFragmentShader;
    this._vertextShader = data.vertextShader || _defVertexShader;

    this._cubeVerticesBuffer = null;
    this._cubeVerticesTextureCoordBuffer = null;
    this._cubeTexture = null;
    this._vertexPositionAttribute = null;
    this._textureCoordAttribute = null;
    this._shaderProgram = null;

    if(this._initWebGL()) {
      this._gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
      this._gl.clearDepth(1.0);                 // Clear everything
      this._gl.enable(this._gl.DEPTH_TEST);           // Enable depth testing
      this._gl.depthFunc(this._gl.LEQUAL);            // Near things obscure far things
      this._initShaders();
      this._initBuffers();
      this._initTextures();
    }
  }
  window.CanvasGLFilter = CanvasGLFilter;

  CanvasGLFilter.prototype._initWebGL = function() {
    this._gl = null;

    try {
      this._gl = this._canvas.getContext("experimental-webgl", { premultipliedAlpha: false }) ||
        this._canvas.getContext("webgl", { premultipliedAlpha: false });
    } catch(e) {
      return false;
    }

    if (!this._gl) {
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      return false;
    }
    return true;
  };

  CanvasGLFilter.prototype._initBuffers = function() {
    // Create a buffer for the cube's vertices.
    this._cubeVerticesBuffer = this._gl.createBuffer();

    // Select the cubeVerticesBuffer as the one to apply vertex
    // operations to from here out.
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._cubeVerticesBuffer);

    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 1 ]), this._gl.STATIC_DRAW);

    // Map the texture onto the cube's faces.
    this._cubeVerticesTextureCoordBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._cubeVerticesTextureCoordBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 1 ]), this._gl.STATIC_DRAW);
  };

  CanvasGLFilter.prototype._initTextures = function() {
    this._cubeTexture = this._gl.createTexture();
  };

  CanvasGLFilter.prototype._updateTexture = function() {
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._cubeTexture);
    this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._sourceElement);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
  };

  CanvasGLFilter.prototype._initShaders = function() {
    // Create the shader program
    this._shaderProgram = this._gl.createProgram();
    this._gl.attachShader(this._shaderProgram, this.createShader(false, this._fragmentShader));
    this._gl.attachShader(this._shaderProgram, this.createShader(true, this._vertextShader));
    this._gl.linkProgram(this._shaderProgram);

    // If creating the shader program failed, alert
    if (!this._gl.getProgramParameter(this._shaderProgram, this._gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program.");
    }

    this._gl.useProgram(this._shaderProgram);

    this._vertexPositionAttribute = this._gl.getAttribLocation(this._shaderProgram, "vVertexPosition");
    this._gl.enableVertexAttribArray(this._vertexPositionAttribute);

    this._textureCoordAttribute = this._gl.getAttribLocation(this._shaderProgram, "vTextureCoord");
    this._gl.enableVertexAttribArray(this._textureCoordAttribute);
  };

  CanvasGLFilter.prototype.getShader = function(gl, id) {
    var shaderScript = document.getElementById(id);

    // Didn't find an element with the specified ID; abort.
    if (!shaderScript) {
      return null;
    }

    // Walk through the source element's children, building the
    // shader source string.
    var theSource = "";
    var currentChild = shaderScript.firstChild;

    while(currentChild) {
      if (currentChild.nodeType === 3) {
        theSource += currentChild.textContent;
      }
      currentChild = currentChild.nextSibling;
    }

    // Now figure out what type of shader script we have,
    // based on its MIME type.
    var shader;
    if (shaderScript.type === "x-shader/x-fragment") {
      shader = this.createShader(false, theSource);
    } else if (shaderScript.type === "x-shader/x-vertex") {
      shader = this.createShader(true, theSource);
    } else {
      return null;
    }
    return shader;
  };

  CanvasGLFilter.prototype.createShader = function(isVertextShader, theSource) {
    var shader = this._gl.createShader(isVertextShader ? this._gl.VERTEX_SHADER : this._gl.FRAGMENT_SHADER);

    // Send the source to the shader object
    this._gl.shaderSource(shader, theSource);

    // Compile the shader program
    this._gl.compileShader(shader);

    // See if it compiled successfully
    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      console.error("An error occurred compiling the shaders: " + this._gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };

  CanvasGLFilter.prototype.doProcess = function() {
    this._updateTexture();

    // Clear the canvas before we start drawing on it.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // Draw the cube by binding the array buffer to the cube's vertices
    // array, setting attributes, and pushing it to GL.
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._cubeVerticesBuffer);
    this._gl.vertexAttribPointer(this._vertexPositionAttribute, 2, this._gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._cubeVerticesTextureCoordBuffer);
    this._gl.vertexAttribPointer(this._textureCoordAttribute, 2, this._gl.FLOAT, false, 0, 0);

    // Specify the texture to map onto the faces.
    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._cubeTexture);
    this._gl.uniform1i(this._gl.getUniformLocation(this._shaderProgram, "uSampler"), 0);

    // Draw
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  };
})(window);

