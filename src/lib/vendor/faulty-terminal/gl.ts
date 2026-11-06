/** A linked program and the locations of the uniforms it was asked for. */
export interface Program<Name extends string> {
  program: WebGLProgram;
  uniforms: Record<Name, WebGLUniformLocation | null>;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

/** Compiles and links one program. Null if either stage fails. */
export function linkProgram<Name extends string>(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  uniformNames: readonly Name[],
): Program<Name> | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  const uniforms = Object.fromEntries(
    uniformNames.map((name) => [name, gl.getUniformLocation(program, name)]),
  ) as Record<Name, WebGLUniformLocation | null>;
  return { program, uniforms };
}

/** An RGBA8 texture that is read texel by texel, never filtered. */
export function createCellTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  resizeTexture(gl, texture, 1, 1);
  return texture;
}

export function resizeTexture(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  width: number,
  height: number,
) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
}

/** What the cell pass writes and the screen pass reads. See cells.frag. */
export interface CellTarget {
  rings: WebGLTexture;
  detail: WebGLTexture;
  framebuffer: WebGLFramebuffer;
}

export function createCellTarget(gl: WebGL2RenderingContext): CellTarget {
  const rings = createCellTexture(gl);
  const detail = createCellTexture(gl);
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    rings,
    0,
  );
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT1,
    gl.TEXTURE_2D,
    detail,
    0,
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { rings, detail, framebuffer };
}

export function deleteCellTarget(
  gl: WebGL2RenderingContext,
  target: CellTarget,
) {
  gl.deleteTexture(target.rings);
  gl.deleteTexture(target.detail);
  gl.deleteFramebuffer(target.framebuffer);
}
