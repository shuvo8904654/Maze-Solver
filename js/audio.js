"use strict";

var audioCtx = null;
var masterGain = null;

function initAudio() {
    if (audioCtx === null) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.1; // Adjust volume here
            masterGain.connect(audioCtx.destination);
        }
    }
}

function playSound(name) {
    if (!audioCtx) return;

    // Resume context if suspended (browser auto-play policies)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    var osc = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    var now = audioCtx.currentTime;

    switch (name) {
        case 'click':
            // High short pop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gainNode.gain.setValueAtTime(1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
        case 'node':
            // Soft low beep for exploration
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        case 'finding':
            // Slightly higher soft beep
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(480, now);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        case 'path':
            // Bright chime for path
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(0.8, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
        case 'start':
            // Ascending chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.1);
            gainNode.gain.setValueAtTime(0.8, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
        case 'error':
            // Low buzz for no path
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.8, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        default:
            break;
    }
}
