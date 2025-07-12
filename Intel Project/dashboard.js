
document.addEventListener('DOMContentLoaded', () => {
    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Visual Input Elements
    const visualInputLabel = document.getElementById('visualInputLabel');
    const imageInput = document.getElementById('imageInput');
    const choiceModalOverlay = document.getElementById('choiceModalOverlay');
    const takePhotoOptionBtn = document.getElementById('takePhotoOption');
    const chooseFromGalleryOptionBtn = document.getElementById('chooseFromGalleryOption');
    const cancelVisualInputBtn = document.getElementById('cancelVisualInput');

    // Camera Elements
    const cameraPreviewContainer = document.getElementById('cameraPreviewContainer');
    const cameraFeed = document.getElementById('camera-feed');
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const cancelPhotoBtn = document.getElementById('cancelPhotoBtn');
    const photoCanvas = document.getElementById('photo-canvas');
    const previewArea = document.getElementById('preview-area');

    // Voice Query Elements
    const voiceQueryCard = document.getElementById('voiceQueryCard');
    const voiceRecorderModal = document.getElementById('voiceRecorderModal');
    const recordingStatus = document.getElementById('recording-status');
    const playRecordingBtn = document.getElementById('playRecordingBtn');
    const sendVoiceQueryBtn = document.getElementById('sendVoiceQueryBtn');
    const recordAgainBtn = document.getElementById('recordAgainBtn');
    const cancelVoiceRecordingBtn = document.getElementById('cancelVoiceRecordingBtn');
    const audioPlayback = document.getElementById('audioPlayback');

    // Chat Elements
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const micBtn = document.getElementById('micBtn');

    let currentStream = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let audioBlob = null;

    // Modal Functions
    function toggleModal(modal, show) {
        modal.classList.toggle('active', show);
    }

    function closeAllModals() {
        toggleModal(choiceModalOverlay, false);
        toggleModal(cameraPreviewContainer, false);
        toggleModal(voiceRecorderModal, false);
    }

    // Visual Input Handlers
    visualInputLabel.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(choiceModalOverlay, true);
    });

    takePhotoOptionBtn.addEventListener('click', async () => {
        toggleModal(choiceModalOverlay, false);
        toggleModal(cameraPreviewContainer, true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            currentStream = stream;
            cameraFeed.srcObject = stream;
        } catch (err) {
            console.error("Camera error:", err);
            alert("Camera access denied.");
            toggleModal(cameraPreviewContainer, false);
        }
    });

    chooseFromGalleryOptionBtn.addEventListener('click', () => {
        toggleModal(choiceModalOverlay, false);
        imageInput.click();
    });

    cancelVisualInputBtn.addEventListener('click', () => {
        toggleModal(choiceModalOverlay, false);
    });

    takePhotoBtn.addEventListener('click', () => {
        const ctx = photoCanvas.getContext('2d');
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;
        ctx.drawImage(cameraFeed, 0, 0);

        photoCanvas.toBlob(blob => {
            if (blob) {
                const file = new File([blob], `captured_${Date.now()}.png`, { type: 'image/png' });
                handleSelectedFile(file);
            }
        });
        closeCamera();
    });

    cancelPhotoBtn.addEventListener('click', closeCamera);

    function closeCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        toggleModal(cameraPreviewContainer, false);
    }

    function handleSelectedFile(file) {
        const reader = new FileReader();
        reader.onload = e => {
            let preview = document.getElementById('imagePreview');
            if (!preview) {
                preview = document.createElement('img');
                preview.id = 'imagePreview';
                previewArea.appendChild(preview);
            }
            preview.src = e.target.result;
            preview.alt = file.name;
        };
        reader.readAsDataURL(file);
    }

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleSelectedFile(e.target.files[0]);
        }
        e.target.value = '';
    });

    // Voice Query
    voiceQueryCard.addEventListener('click', () => {
        toggleModal(voiceRecorderModal, true);
        recordingStatus.textContent = "Ready to record";
        audioPlayback.style.display = 'none';
    });

    recordAgainBtn.addEventListener('click', startRecording);

    playRecordingBtn.addEventListener('click', () => {
        if (audioBlob) {
            audioPlayback.style.display = 'block';
            audioPlayback.play();
        }
    });

    sendVoiceQueryBtn.addEventListener('click', () => {
        if (audioBlob) {
            alert("Voice query sent to server!");
            toggleModal(voiceRecorderModal, false);
        }
    });

    cancelVoiceRecordingBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        toggleModal(voiceRecorderModal, false);
    });

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            currentStream = stream;
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                audioPlayback.src = url;
                recordingStatus.textContent = "Recording complete!";
                playRecordingBtn.style.display = 'inline-flex';
                sendVoiceQueryBtn.style.display = 'inline-flex';
            };

            mediaRecorder.start();
            recordingStatus.textContent = "Recording...";
            playRecordingBtn.style.display = 'none';
            sendVoiceQueryBtn.style.display = 'none';
            audioPlayback.style.display = 'none';

            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                }
            }, 10000);
        } catch (err) {
            console.error("Mic error:", err);
            alert("Microphone access denied.");
            toggleModal(voiceRecorderModal, false);
        }
    }

    function appendUserMessage(text) {
        const msg = document.createElement('div');
        msg.classList.add('message');
        msg.style.justifyContent = 'flex-end';
        msg.innerHTML = `<div style="text-align: right;"><div class="bubble" style="background-color: #2f80ed; color: white;">${escapeHTML(text)}</div><div class="timestamp">Just now</div></div>`;
        chatContainer.appendChild(msg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function createTypingResponseElement() {
        const msg = document.createElement('div');
        msg.classList.add('message');
        msg.innerHTML = `<div class="icon green">🤖</div><div><div class="bubble typing">🔍 Searching...</div><div class="timestamp">${new Date().toLocaleTimeString()}</div></div>`;
        chatContainer.appendChild(msg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return msg.querySelector('.bubble');
    }

    async function streamTextToElement(text, element) {
        element.innerHTML += "<br>"; 
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += escapeHTML(text.charAt(i));
            chatContainer.scrollTop = chatContainer.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, 15));
        }
    }

    sendChatBtn.addEventListener('click', async () => {
        const query = chatInput.value.trim();
        if (!query) return;

        appendUserMessage(query);
        chatInput.value = '';

        const typingElement = createTypingResponseElement();

        const statusTimeout = setTimeout(() => {
            typingElement.textContent = '⏳ Fetching data...';
        }, 10000);

        try {
            const response = await fetch("http://localhost:3000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query })
            });

            const data = await response.json();
            let answer = data.answer || "⚠️ No answer received.";
            if (answer.length > 3000) {
                answer = answer.slice(0, 3000) + "...";
            }

            clearTimeout(statusTimeout);
            typingElement.textContent = "";
            await streamTextToElement(answer, typingElement);

        } catch (err) {
            console.error(err);
            typingElement.textContent = "❌ Failed to fetch answer from server.";
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatBtn.click();
        }
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        micBtn.addEventListener('click', () => {
            recognition.start();
        });

        recognition.onstart = () => {
            micBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendChatBtn.click();
        };

        recognition.onerror = (event) => {
            alert("🎤 Voice recognition error: " + event.error);
        };

        recognition.onend = () => {
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
    } else {
        micBtn.disabled = true;
        micBtn.title = "Speech recognition not supported in this browser";
    }

    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const resetEmail = document.getElementById('resetEmail').value.trim();
            if (!resetEmail) {
                alert("Please enter your email address.");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/send-reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: resetEmail })
                });

                const result = await response.json();
                alert(result.message || "Password reset link sent successfully.");
            } catch (error) {
                console.error("Reset error:", error);
                alert("Failed to send reset link. Try again later.");
            }
        });
    }
});
