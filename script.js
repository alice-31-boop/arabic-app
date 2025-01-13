// File: script.js
const form = document.getElementById('add-item-form');
const cardList = document.getElementById('card-list');
const recordButton = document.getElementById('record-audio');

let audioBlob = null;
let mediaRecorder = null;

// Start recording audio
recordButton.addEventListener('click', async () => {
    try {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                audioBlob = event.data;
                console.log('Audio data captured:', audioBlob);
            };

            mediaRecorder.onstart = () => console.log('Recording started');
            mediaRecorder.onstop = () => {
                console.log('Recording stopped');
                recordButton.textContent = 'Record Audio';
                alert('Recording saved! You can now submit it with the word and translation.');
            };

            mediaRecorder.start();
            recordButton.textContent = 'Stop Recording';
        } else if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check your permissions or browser settings.');
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const word = document.getElementById('word').value;
    const translation = document.getElementById('translation').value;

    if (!audioBlob) {
        alert('Please record audio before submitting.');
        return;
    }

    const audioSrc = URL.createObjectURL(audioBlob);

    addCard(word, translation, audioSrc);
    form.reset();
    audioBlob = null;
    recordButton.textContent = 'Record Audio';
});

function addCard(word, translation, audioSrc) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <div>
            <p><strong>${word}</strong></p>
            <p>${translation}</p>
            ${audioSrc ? `<audio controls src="${audioSrc}"></audio>` : ''}
        </div>
        <button onclick="this.parentElement.remove()">Delete</button>
    `;

    cardList.appendChild(card);
}
