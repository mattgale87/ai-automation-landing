# GaleOps Video Narration Config
# Voice pipeline default (2026-07-22 — user chose Daniel)
TTS_ENGINE=kokoro
KOKORO_LANG=b
KOKORO_VOICE=bm_daniel   # British male — user preference
KOKORO_SAMPLE_RATE=24000

# Previous: en-US-GuyNeural (Edge TTS) — replaced after A/B test, user picked Daniel
# Parakeet (NVIDIA) is ASR (speech->text), NOT TTS — do not use for narration.

# Pipeline notes:
# - Kokoro runs LOCAL on RTX 3060, $0, no quota (vs Edge TTS cloud rate-limits)
# - Generate wav via KPipeline(lang_code='b'), then pad/trim to video duration with silence
# - Mux: ffmpeg -i SRC.mp4 -i VOICE.mp3 -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest
# - DO NOT set .clip{opacity:0} in HyperFrames — caused blank-frame bug (fixed 2026-07-22)
