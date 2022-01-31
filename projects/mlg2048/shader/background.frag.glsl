#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform float time_level;
uniform float level;
uniform float scale;
uniform vec2 resolution;

void main(void) {
	float center_motion = clamp(level * 2. - 1., 0., 1.);
	vec2 center = vec2(
		resolution.x * .5 + cos(time * 6.) * resolution.x * .25 * center_motion,
		resolution.y * .5 + sin(time * 2.) * resolution.y * .25 * center_motion
	);
	float wave = log(distance(gl_FragCoord.xy / scale, center / scale)) * 8.;

	vec3 normal_color = vec3(
		cos(wave      - time_level) * .5 + .5,
		cos(wave + 2. - time_level) * .5 + .5,
		cos(wave + 4. - time_level) * .5 + .5
	);
	vec3 flip_color = vec3(cos(wave - time_level) * .5 + .5);

	gl_FragColor = vec4(mix(normal_color, flip_color, step(.8, level) * (cos(time * 8.) * .5 + .5)), 1.);
}
