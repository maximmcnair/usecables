vec2 x = vec2(0.5, 0.5);
vec2 mouse = (u_mouse.xy / u_resolution.xy);
vec2 grad = 2.0 * (mouse-x);
vec2 dist = (gl_FragCoord.xy / u_resolution.xy) - x;
vec3 col = vec3(dot(grad, dist) * 2.);
gl_FragColor = vec4(col, 1.0);
