import boto3
import sounddevice as sd
import numpy as np
import io
import wave

# ---- SETTINGS ----
REGION = 'us-west-2'
TEXT = "你好，欢迎使用语音合成服务。"
VOICE_ID = 'Zhiyu'  # Mandarin Chinese female voice
OUTPUT_FORMAT = 'pcm'  # raw audio format
SAMPLE_RATE = 16000  # 16kHz

# ---- INIT CLIENT ----
polly = boto3.client('polly', region_name=REGION)

# ---- CALL POLLY ----
response = polly.synthesize_speech(
    Text=TEXT,
    OutputFormat=OUTPUT_FORMAT,
    VoiceId=VOICE_ID,
    SampleRate=str(SAMPLE_RATE)
)

# ---- READ AUDIO ----
audio_stream = response['AudioStream'].read()

# Convert raw bytes into numpy array
audio_data = np.frombuffer(audio_stream, dtype=np.int16)

# ---- PLAY AUDIO ----
sd.play(audio_data, samplerate=SAMPLE_RATE)
sd.wait()  # wait until playback is finished

print("✅ Playback finished!")
