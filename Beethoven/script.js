var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var noteFrequencies = {
    E4: 329.63, // 1st String
    B3: 246.94, // 2nd String
    G3: 196.00, // 3rd String
    D3: 146.83, // 4th String
    A2: 110.00, // 5th String
    E2: 82.41, // 6th String
};
var currentString = "E4";
var audioContext;
var analyser;
var microphone;
var bufferLength;
var dataArray;
var noteDisplay = document.getElementById("note-display");
var progressBar = document.getElementById("progress-bar");
document.getElementById("strings").addEventListener("change", function (e) {
    currentString = e.target.value;
});
document.getElementById("start-button").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
    var stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!audioContext) return [3 /*break*/, 2];
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
            case 1:
                stream = _a.sent();
                microphone = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                microphone.connect(analyser);
                analyser.fftSize = 2048;
                bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                _a.label = 2;
            case 2:
                listenToPitch();
                return [2 /*return*/];
        }
    });
}); });
function listenToPitch() {
    analyser.getByteTimeDomainData(dataArray);
    var pitch = calculatePitch();
    var target = noteFrequencies[currentString];
    var accuracy = getAccuracy(pitch, target);
    noteDisplay.textContent = "Pitch: ".concat(pitch.toFixed(2), " Hz");
    progressBar.style.width = "".concat(accuracy, "%");
    if (accuracy > 95) {
        playBingSound();
        progressBar.style.backgroundColor = "#0f0";
    }
    else {
        progressBar.style.backgroundColor = "#fff";
    }
    requestAnimationFrame(listenToPitch);
}
function calculatePitch() {
    var sum = 0;
    for (var i = 0; i < bufferLength; i++) {
        sum += Math.pow((dataArray[i] - 128), 2);
    }
    return Math.sqrt(sum / bufferLength) * audioContext.sampleRate / analyser.fftSize;
}
function getAccuracy(pitch, target) {
    var diff = Math.abs(pitch - target);
    return Math.max(0, 100 - (diff / target) * 100);
}
function playBingSound() {
    var bing = new Audio("sounds/bing.mp3");
    bing.play();
}
