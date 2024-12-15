const noteFrequencies: { [key: string]: number } = {
    E4: 329.63, // 1st String
    B3: 246.94, // 2nd String
    G3: 196.00, // 3rd String
    D3: 146.83, // 4th String
    A2: 110.00, // 5th String
    E2: 82.41,  // 6th String
  };
  
  let currentString: string = "E4";
  let audioContext: AudioContext;
  let analyser: AnalyserNode;
  let microphone: MediaStreamAudioSourceNode;
  let bufferLength: number;
  let dataArray: Uint8Array;
  
  const noteDisplay = document.getElementById("note-display")!;
  const progressBar = document.getElementById("progress-bar") as HTMLElement;
  
  document.getElementById("strings")!.addEventListener("change", (e) => {
    currentString = (e.target as HTMLSelectElement).value;
  });
  
  document.getElementById("start-button")!.addEventListener("click", async () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphone = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      microphone.connect(analyser);
  
      analyser.fftSize = 2048;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
    listenToPitch();
  });
  
  function listenToPitch() {
    analyser.getByteTimeDomainData(dataArray);
    const pitch = calculatePitch();
    const target = noteFrequencies[currentString];
    const accuracy = getAccuracy(pitch, target);
  
    noteDisplay.textContent = `Pitch: ${pitch.toFixed(2)} Hz`;
    progressBar.style.width = `${accuracy}%`;
  
    if (accuracy > 95) {
      playBingSound();
      progressBar.style.backgroundColor = "#0f0";
    } else {
      progressBar.style.backgroundColor = "#fff";
    }
  
    requestAnimationFrame(listenToPitch);
  }
  
  function calculatePitch(): number {
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += (dataArray[i] - 128) ** 2;
    }
    return Math.sqrt(sum / bufferLength) * audioContext.sampleRate / analyser.fftSize;
  }
  
  function getAccuracy(pitch: number, target: number): number {
    const diff = Math.abs(pitch - target);
    return Math.max(0, 100 - (diff / target) * 100);
  }
  
  function playBingSound() {
    const bing = new Audio("sounds/bing.mp3");
    bing.play();
  }
  