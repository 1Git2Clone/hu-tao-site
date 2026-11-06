#version 300 es

// One triangle that covers the whole viewport, made from gl_VertexID alone, so
// no vertex buffer is needed. Vertices land at (-1, -1), (3, -1) and (-1, 3).
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
