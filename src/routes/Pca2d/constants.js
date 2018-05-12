export const POINTS = 100
export const POINT_RADIUS = 10
export const CORRELATION = 0.9
export const ALLOWED_SIZE = 0.6
export const CHOLESKY = [
  [1, 0],
  [CORRELATION, Math.sqrt(1 - CORRELATION ** 2)],
]
