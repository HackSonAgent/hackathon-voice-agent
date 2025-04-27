/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Loader2, X } from 'lucide-react'
import * as THREE from 'three'
import { OpenAI } from 'openai'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { vertexShader, fragmentShader } from '../const/index'

interface VoiceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTranscriptComplete?: (transcript: string) => void
  playbackMode?: boolean
  audioUrl?: string
}

export function VoiceDialog({
  isOpen,
  onOpenChange,
  onTranscriptComplete,
  playbackMode = false,
  audioUrl = '',
}: VoiceDialogProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)


  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const blobRef = useRef<THREE.Mesh | null>(null)
  const uniformsRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)

  // Audio references
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUpdateFrameRef = useRef<number | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  // Update audio level for visualization
  const updateAudioLevel = useCallback(() => {
    if ((!isListening && !isPlaying) || !analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average volume level
    let sum = 0
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i]
    }
    const avg = sum / bufferLength

    // Normalize between 0 and 1 with some amplification
    setAudioLevel(Math.min(1, avg / 128))

    // Continue updating if still listening or playing
    audioUpdateFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }, [isListening, isPlaying])

  // Animation function
  const animate = useCallback(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !blobRef.current ||
      !uniformsRef.current ||
      !clockRef.current
    )
      return

    // Update uniforms
    uniformsRef.current.u_time.value = 0.4 * clockRef.current.getElapsedTime()

    // Target intensity based on audio
    const targetIntensity = 0.15 + audioLevel * 0.85
    uniformsRef.current.u_intensity.value +=
      (targetIntensity - uniformsRef.current.u_intensity.value) * 0.05
    uniformsRef.current.u_audioLevel.value = audioLevel

    // Update blob scale based on audio
    const scale = 1.5 + audioLevel * 0.5
    blobRef.current.scale.set(scale, scale, scale)

    // Add rotation based on audio
    blobRef.current.rotation.y += 0.002 + audioLevel * 0.01
    blobRef.current.rotation.z += 0.001 + audioLevel * 0.005

    rendererRef.current.render(sceneRef.current, cameraRef.current)

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [audioLevel])

  // Initialize Three.js scene
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return

    // Setup Three.js
    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(100, 1, 0.1, 1000)
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    clockRef.current = new THREE.Clock()

    // Configure renderer
    rendererRef.current.setSize(300, 300) // Dialog-appropriate size
    rendererRef.current.setPixelRatio(window.devicePixelRatio)
    canvasRef.current.appendChild(rendererRef.current.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    sceneRef.current.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    sceneRef.current.add(pointLight)

    // Position camera
    cameraRef.current.position.z = 5

    // Create shader uniforms
    uniformsRef.current = {
      u_time: { value: 0 },
      u_intensity: { value: 0.3 },
      u_audioLevel: { value: 0 },
    }

    // Create blob with shaders
    const geometry = new THREE.IcosahedronGeometry(2, 20)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
    })

    blobRef.current = new THREE.Mesh(geometry, material)
    sceneRef.current.add(blobRef.current)

    // Start animation
    animate()

    // Start playback if in playback mode
    if (playbackMode && audioUrl) {
      startPlayback(audioUrl)
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement)
      }

      // Clean up audio
      stopPlayback()
    }
  }, [isOpen, animate, playbackMode, audioUrl])

  // Handle audio level updates
  useEffect(() => {
    if (isListening || isPlaying) {
      updateAudioLevel()
    } else {
      // Cancel the audio update if not listening or playing
      if (audioUpdateFrameRef.current) {
        cancelAnimationFrame(audioUpdateFrameRef.current)
        audioUpdateFrameRef.current = null
      }
    }

    return () => {
      if (audioUpdateFrameRef.current) {
        cancelAnimationFrame(audioUpdateFrameRef.current)
        audioUpdateFrameRef.current = null
      }
    }
  }, [isListening, isPlaying, updateAudioLevel])

  // Start audio playback and analysis
  const startPlayback = (url: string) => {
    try {
      // Create audio context for analysis
      audioContextRef.current = new (window.AudioContext ||
        window.AudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      // Create audio element
      audioElementRef.current = new Audio(url)
      audioElementRef.current.crossOrigin = 'anonymous' // Required for external audio sources

      // Connect audio to analyzer
      audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current)
      audioSourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(audioContextRef.current.destination)

      // Play audio
      audioElementRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(error => {
        console.error('Audio playback error:', error)
      })

      // Handle when audio finishes
      audioElementRef.current.onended = () => {
        stopPlayback()
      }
    } catch (error) {
      console.error('Audio playback setup error:', error)
    }
  }

  // Stop audio playback
  const stopPlayback = () => {
    setIsPlaying(false)
    setAudioLevel(0)

    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current.currentTime = 0
      audioElementRef.current = null
    }

    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect()
      audioSourceRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(e => console.error(e))
      audioContextRef.current = null
    }
  }

  // Start audio recording and analysis
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsListening(true)

      // Create audio context and analyzer
      audioContextRef.current = new (window.AudioContext ||
        window.AudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream)

      microphoneRef.current.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      // Setup media recorder for transcription
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
    } catch (error) {
      alert('Please allow microphone access to use voice reactivity' + error)
    }
  }

  // Transcribe audio using OpenAI API
  const transcribeAudio = async () => {
    try {
      setIsTranscribing(true);

      // Create audio blob from recorded chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });

      // Initialize OpenAI client
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPEN_API_KEY,
        dangerouslyAllowBrowser: true 
      });

      // Make API request
      try {
        // Convert blob to file with proper extension matching the MIME type
        const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

        // For debugging - log file size and type
        console.log('File size:', file.size, 'bytes');
        console.log('File type:', file.type);

        // Call the OpenAI API
        const transcription = await client.audio.transcriptions.create({
          model: "whisper-1", // Use whisper-1 which is more reliable for browser-recorded audio
          file: file
        });

        // Update transcript state
        setTranscript(transcription.text);
      } catch (error) {
        console.error('Transcription API error:', error);
        setTranscript(`Error transcribing audio: ${error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Audio processing error:', error);
      setTranscript('Error processing audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Stop audio recording and start transcription
  const stopListening = () => {
    setIsListening(false)
    setAudioLevel(0)

    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()

      // Process recording and transcribe
      mediaRecorderRef.current.onstop = async () => {
        await transcribeAudio();
      }
    }
  }


  // Complete transcription and close dialog
  const handleComplete = () => {
    if (onTranscriptComplete && transcript) {
      onTranscriptComplete(transcript)
    }
    onOpenChange(false)
  }

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTranscript('')
      setIsListening(false)
      setIsPlaying(false)
      setAudioLevel(0)
      setIsTranscribing(false)

      // Ensure all animation frames are canceled
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      if (audioUpdateFrameRef.current) {
        cancelAnimationFrame(audioUpdateFrameRef.current)
        audioUpdateFrameRef.current = null
      }

      // Stop any ongoing playback
      stopPlayback()
    }
  }, [isOpen])



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {playbackMode ? 'AI Voice Message' : 'Voice Recording'}
          </DialogTitle>
          <DialogDescription>
            {playbackMode
              ? 'Listening to AI message'
              : 'Speak clearly to record your message'}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center py-4'>
          {/* Three.js canvas container */}
          <div
            ref={canvasRef}
            className='mb-4 flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-black'
          />

          {/* Audio level meter */}
          <div className='h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200'>
            <div
              className='h-full bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 transition-all duration-100'
              style={{ width: `${audioLevel * 100}%` }}
            />
          </div>

     

          {/* Transcript display */}
          {!playbackMode && transcript && (
            <div className='mt-4 w-full max-w-xs rounded bg-gray-100 p-3 text-sm text-gray-800'>
              {transcript}
            </div>
          )}
        </div>

        <DialogFooter className='flex flex-row justify-between gap-2 sm:justify-between'>
          {playbackMode ? (
            <Button onClick={() => onOpenChange(false)} className='w-full'>
              <X className='mr-2 h-4 w-4' /> Close
            </Button>
          ) : isTranscribing ? (
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Transcribing...
            </div>
          ) : transcript ? (
            <Button onClick={handleComplete} className='w-full'>
              Use Transcript
            </Button>
          ) : (
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? 'destructive' : 'default'}
              className='flex w-full items-center gap-2'
            >
              {isListening ? (
                <>
                  <MicOff className='h-4 w-4' />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className='h-4 w-4' />
                  Start Recording
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
