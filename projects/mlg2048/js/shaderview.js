import { Observable } from './misc.js';
import * as Random from './random.js';


function compileProgram(gl, shaderSources) {
	let shaders = Object.keys(shaderSources)
		.map(type => {
			let shader = gl.createShader(gl[type]);
			gl.shaderSource(shader, shaderSources[type]);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				gl.deleteShader(shader);
				throw new Error(gl.getShaderInfoLog(shader));
			}
			return shader;
		});

	let prog = gl.createProgram();
	shaders.forEach(shader => gl.attachShader(prog, shader));
	gl.linkProgram(prog);
	shaders.forEach(shader => {
		gl.detachShader(prog, shader);
		gl.deleteShader(shader);
	});
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		gl.deleteProgram(prog);
		throw new Error(gl.getProgramInfoLog(prog));
	}
	return prog;
}

function getGL(canvas) {
	let gl;
	try {
		gl = canvas.getContext('webgl');
	} catch (err) {
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl) {
		throw new Error('Unable to get WebGL context');
	}
	return gl;
}


export class ShaderView extends Observable {
	constructor(canvas, glsl) {
		super();
		this.canvas = canvas;
		this.uniforms = {};
		this.scale = 1;
		this.gl = getGL(canvas);

		this.resize();
		window.addEventListener('resize', this.resize.bind(this));

		this.prog = compileProgram(this.gl, {
			VERTEX_SHADER: `
				attribute vec3 vert;
				void main(void) {
					gl_Position = vec4(vert, 1.0);
				}
			`,
			FRAGMENT_SHADER: glsl,
		});
		this.gl.useProgram(this.prog);
		this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.prog, 'vert'));

		const vertices = [
			-1.0, -1.0,  0.0,
			 1.0, -1.0,  0.0,
			-1.0,  1.0,  0.0,
			 1.0,  1.0,  0.0,
		];
		this.square = this.gl.createBuffer();
		this.square.itemSize = 3;
		this.square.numItems = 4;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.square);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.prog, 'vert'), this.square.itemSize, this.gl.FLOAT, false, 0, 0);

		let prevRenderStart = performance.now() / 1000;
		function loop() {
			requestAnimationFrame(() => {
				const curRenderStart = performance.now() / 1000;
				const fps = 1 / (curRenderStart - prevRenderStart);
				if (fps < 10) {
					this.scale = Math.max(this.scale / 2, 0.03);
					this.resize();
				}
				prevRenderStart = curRenderStart;

				this.render();
				loop.call(this);
			});
		}
		loop.call(this);
	}

	resize() {
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;
		this.canvas.width = width * this.scale;
		this.canvas.height = height * this.scale;
		this.gl.viewport(0, 0, width, height);
		this.trigger('resize', { width, height });
	}

	uniform(name) {
		return this.uniforms[name] || (this.uniforms[name] = this.gl.getUniformLocation(this.prog, name));
	}

	render() {
		this.trigger('pre-render');
		this.gl.uniform1f(this.uniform('time'), performance.now() / 1000);
		this.gl.uniform1f(this.uniform('scale'), this.scale);
		this.gl.uniform2f(this.uniform('resolution'), this.canvas.width, this.canvas.height);
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.square.numItems);
	}
}
