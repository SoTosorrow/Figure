/*
    webgl & webgl2 & bitmaprenderer??
*/


export class WebGLRenderer{
    public canvas : HTMLCanvasElement;
    public gl !: WebGL2RenderingContext;
    public enable : boolean = true;
    public image : any;
    public vertex_shader_source = `#version 300 es
        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec2 a_position;
        in vec2 a_texCoord;

        // Used to pass in the resolution of the canvas
        uniform vec2 u_resolution;

        // Used to pass the texture coordinates to the fragment shader
        out vec2 v_texCoord;

        // all shaders have a main function
        void main() {

        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

        // pass the texCoord to the fragment shader
        // The GPU will interpolate this value between points.
        v_texCoord = a_texCoord;
        }
    `;
    public fragment_shader_source = `#version 300 es
        precision highp float;
        uniform sampler2D u_image;
        
        // the texCoords passed in from the vertex shader.
        in vec2 v_texCoord;
        
        out vec4 outColor;
        
        void main() {
            vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));
 
            vec4 colorSum =
                texture(u_image, v_texCoord + onePixel * vec2(-1, -1)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2( 0, -1)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2( 1, -1)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2(-1,  0)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2( 0,  0)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2( 1,  0)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2(-1,  1)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2( 0,  1)) * 1.0 +
                texture(u_image, v_texCoord + onePixel * vec2( 1,  1)) * 1.0 ;
            outColor = vec4((colorSum / 9.0).rgb, 1);
        }
    `;

    public update(totalTime:number, interTime:number):void{
        // fps
        console.log(1/interTime);
        this.image = document.getElementById('myVideo');
        this.render(this.gl);
    }
    
    public constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;

        let temp = canvas.getContext('webgl2');
        
        if(temp !== null)
            this.gl = temp;
        
        this.image = new Image();
            this.image.src = "./test/1.jpg"; 
            this.image.onload = function() {
                // console.log(1);
                // this.enable = true;
        };
        let myVideo = document.getElementById('myVideo');
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (mediaStream) {
            (myVideo as HTMLVideoElement).srcObject = mediaStream;
            (myVideo as HTMLVideoElement).onloadedmetadata = function () {
            (myVideo as HTMLVideoElement).play();
            }
        });
    }

    public render(gl:any){
          // setup GLSL program
        var vertex_shader = this.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertex_shader_source);
        var fragment_shader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragment_shader_source);
        var program = this.createProgram(this.gl, vertex_shader, fragment_shader);

        // look up where the vertex data needs to go.
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        var imageLocation = gl.getUniformLocation(program, "u_image");

        // Create a vertex array object (attribute state)
        var vao = gl.createVertexArray();

        // and make it the one we're currently working with
        gl.bindVertexArray(vao);

        // Create a buffer and put a single pixel space rectangle in
        // it (2 triangles)
        var positionBuffer = gl.createBuffer();

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // provide texture coordinates for the rectangle.
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0,
        ]), gl.STATIC_DRAW);

        // Turn on the attribute
        gl.enableVertexAttribArray(texCoordAttributeLocation);

        // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texCoordAttributeLocation, size, type, normalize, stride, offset);

        // Create a texture.
        var texture = gl.createTexture();

        // make unit 0 the active texture uint
        // (ie, the unit all other texture commands will affect
        gl.activeTexture(gl.TEXTURE0 + 0);

        // Bind it to texture unit 0' 2D bind point
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we don't need mips and so we're not filtering
        // and we don't repeat at the edges
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
        gl.texImage2D(gl.TEXTURE_2D,
                    mipLevel,
                    internalFormat,
                    srcFormat,
                    srcType,
                    this.image);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(imageLocation, 0);

        // Bind the position buffer so gl.bufferData that will be called
        // in setRectangle puts data in the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Set a rectangle the same size as the image.
        this.setRectangle(gl, 0, 0, this.canvas.width, this.canvas.height);

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    public setRectangle(gl:any, x:number, y:number, width:number, height:number) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
           x1, y1,
           x2, y1,
           x1, y2,
           x1, y2,
           x2, y1,
           x2, y2,
        ]), gl.STATIC_DRAW);
      }

    public createShader(gl:any, type:any, source:any) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
          return shader;
        }
       
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
      }
      
    public createProgram(gl:any, vertexShader:any, fragmentShader:any) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
          return program;
        }
       
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
      }


    



}