/** Precomputed paths for avatar loop frames (12 fps × 10s). */
export const AVATAR_FRAME_COUNT = 120

export function avatarFrameSrc(index: number) {
  const n = String(((index % AVATAR_FRAME_COUNT) + AVATAR_FRAME_COUNT) % AVATAR_FRAME_COUNT + 1).padStart(
    3,
    '0',
  )
  return `/avatar-frames/frame_${n}.jpg`
}
