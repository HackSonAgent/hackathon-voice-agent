import webrtcvad
import sounddevice as sd
import asyncio
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent

# Settings
REGION = 'us-west-2'
LANGUAGE_CODE = 'zh-CN'
SAMPLE_RATE = 16000
FRAME_SIZE = int(SAMPLE_RATE * 30 / 1000)
VAD_MODE = 0  # 0-3, higher = more aggressive in detecting silence
SILENT_COUNT = 50

# Create AWS Transcribe client
transcribe_client = TranscribeStreamingClient(region=REGION)

# Initialize VAD
vad = webrtcvad.Vad(VAD_MODE)

def audio_stream():
    with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype='int16') as stream:
        while True:
            data, overflowed = stream.read(FRAME_SIZE)  # Small frames (10ms ~ 160 samples at 16kHz)
            is_speech = vad.is_speech(data.tobytes(), SAMPLE_RATE)
            yield data, is_speech

class MyEventHandler(TranscriptResultStreamHandler):
    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        results = transcript_event.transcript.results
        for result in results:
            if result.is_partial:
                continue
            for alt in result.alternatives:
                print("Recognized:", alt.transcript)
                # 🚀 Here you can call your Bedrock Flow with alt.transcript

async def basic_transcribe():
    stream = await transcribe_client.start_stream_transcription(
        language_code=LANGUAGE_CODE,
        media_sample_rate_hz=SAMPLE_RATE,
        media_encoding='pcm'
    )

    async def send_audio():
        silent_count = 0
        for data, is_speech in audio_stream():
            print(is_speech)
            if is_speech:
                silent_count = 0
                await stream.input_stream.send_audio_event(audio_chunk=data.tobytes())
            else:
                silent_count += 1
                if silent_count > SILENT_COUNT:  # No speech for 1500 s
                    print("🛑 User stopped speaking.")
                    await stream.input_stream.end_stream()
                    break

    handler = MyEventHandler(stream.output_stream)

    await asyncio.gather(send_audio(), handler.handle_events())

# Run
asyncio.run(basic_transcribe())
