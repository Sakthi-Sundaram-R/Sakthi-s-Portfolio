# Hero avatar assets

## What's here now

`eye-left.png` / `eye-right.png` — the iris sprites used by `AvatarEyes`. They
are generated, not hand-made. Regenerate them after any change to `avatar.png`:

```bash
node scripts/generate-eye-sprites.mjs
```

That script also rewrites `components/Hero/eyeGeometry.json`, which is the
single source of truth for where the eyes sit. The eye positions inside it were
measured off `avatar.png`; if you swap the avatar for a different render you
must re-measure them (the constants are at the top of the script).

## Upgrading to the video head-turn

`HeroAvatar` prefers a real head-turn clip over moving the irises. Drop a file
at `public/hero/avatar-scrub.mp4` and it switches over on the next load — no
code change needed. Remove the file and it falls back to the eyes.

### 1. Generate two clips

Use `public/avatar.png` as the input image for two separate image-to-video
generations. It is already a neutral, camera-facing pose, which is what makes
the two clips joinable.

> **Head turns right** — The character slowly and smoothly turns his head to the
> right until his profile faces right, in one continuous even motion. Body,
> shoulders, and hoodie stay completely still. Camera is locked and static, no
> zoom, no pan. Background remains frozen. Lighting stays constant. No blinking,
> no cap movement.

> **Head turns left** — The character slowly and smoothly turns his head to the
> left until his profile faces left, in one continuous even motion. Body,
> shoulders, and hoodie stay completely still. Camera is locked and static, no
> zoom, no pan. Background remains frozen. Lighting stays constant. No blinking,
> no cap movement.

### 2. Merge and re-encode

This step is **not optional**. A normal export only carries a keyframe every
couple of seconds, so seeking to an arbitrary frame makes the browser decode
forward from the last one — that is what causes stutter. Re-encode with a
keyframe on every frame, reversing the "left" clip so the neutral pose lands at
the midpoint of a single continuous sweep:

```bash
ffmpeg -i turn-left.mp4 -i turn-right.mp4 \
  -filter_complex "[0:v]reverse,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,scale=1920:-2[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -an -movflags +faststart \
  public/hero/avatar-scrub.mp4
```

ffmpeg is not currently installed in this project's environment — install it
first (`winget install Gyan.FFmpeg` on Windows).

If the output is too large, raise `-crf` until it comes back down; all-intra
encoding inflates high-detail footage.

### 3. Nothing else

`AvatarScrub` already maps pointer X straight onto `currentTime` with no
smoothing, throttles seeks while one is in flight or the delta is sub-frame,
and falls back to the static poster for touch devices and
`prefers-reduced-motion`.
