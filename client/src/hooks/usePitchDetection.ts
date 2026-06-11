import { useEffect, useState, useRef } from "react";
import { PitchDetector } from "pitchy";

const NOTE_STRINGS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function frequencyToNote(freq: number) {
  const A4 = 440;
  const noteNumber = 12 * Math.log2(freq / A4) + 69;
  const index = Math.round(noteNumber) % 12;
  return NOTE_STRINGS[index];
}

export function usePitchDetection(enabled: boolean) {
  const [note, setNote] = useState<string>("");

  const lastNotes = useRef<string[]>([]);
  const lastEmitTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let detector: ReturnType<typeof PitchDetector.forFloat32Array>;
    let mediaStream: MediaStream;
    let animationId: number;

    const NOTE_BUFFER_SIZE = 7;
    const MIN_CLARITY = 0.96;
    const MIN_VOLUME = 0.06;
    const MIN_PITCH = 70;
    const COOLDOWN_MS = 120;

    async function start() {
      audioContext = new AudioContext();

      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const source = audioContext.createMediaStreamSource(mediaStream);

      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      detector = PitchDetector.forFloat32Array(analyser.fftSize);

      const getVolume = (data: Float32Array) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i] * data[i];
        }
        return Math.sqrt(sum / data.length);
      };

      const update = () => {
        analyser.getFloatTimeDomainData(buffer);

        const volume = getVolume(buffer);

        // 1. silence gate
        if (volume < MIN_VOLUME) {
          lastNotes.current = [];
          animationId = requestAnimationFrame(update);
          return;
        }

        const [pitch, clarity] = detector.findPitch(
          buffer,
          audioContext.sampleRate,
        );

        // 2. reject weak detections
        if (clarity < MIN_CLARITY || pitch < MIN_PITCH) {
          animationId = requestAnimationFrame(update);
          return;
        }

        const detected = frequencyToNote(pitch);

        // 3. build stability buffer
        lastNotes.current.push(detected);
        if (lastNotes.current.length > NOTE_BUFFER_SIZE) {
          lastNotes.current.shift();
        }

        const stable =
          lastNotes.current.length === NOTE_BUFFER_SIZE &&
          lastNotes.current.every((n) => n === detected);

        if (!stable) {
          animationId = requestAnimationFrame(update);
          return;
        }

        // 4. cooldown (prevents spam triggers)
        const now = Date.now();
        if (now - lastEmitTime.current < COOLDOWN_MS) {
          animationId = requestAnimationFrame(update);
          return;
        }

        lastEmitTime.current = now;

        setNote(detected);

        animationId = requestAnimationFrame(update);
      };

      update();
    }

    start();

    return () => {
      cancelAnimationFrame(animationId);
      mediaStream?.getTracks().forEach((t) => t.stop());
      audioContext?.close();
    };
  }, [enabled]);

  return note;
}
