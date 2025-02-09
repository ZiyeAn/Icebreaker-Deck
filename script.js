// check for which page
const currentPage = window.location.pathname;

// profile, index.html
if (currentPage.endsWith('index.html')) {
    window.onload = function () {
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        const currentProfileName = localStorage.getItem('currentProfile');

        if (savedProfile) {
            const currentProfile = savedProfiles.find(profile => profile.name === currentProfileName);
            if (currentProfile) {
                document.getElementById('display-name').textContent = savedProfile.name;
                document.getElementById('display-bio').textContent = savedProfile.bio;
                document.getElementById('display-interests').textContent = savedProfile.interests;
                document.getElementById('profile-pic').src = savedProfile.avatar;
            }
        }
    };

    // saves profile and updates
    function updateProfile() {
        const name = document.getElementById('name').value;
        const bio = document.getElementById('bio').value;
        const interests = document.getElementById('interests').value;
        const avatar = document.getElementById('profile-pic').src;

        if (!name) {
            alert('hey! enter your name or else...');
            return;
        }

        const newProfile = { name, bio, interests, avatar };
        let savedProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];

        const existingProfileIndex = savedProfiles.findIndex(profile => profile.name === name);
        if (existingProfileIndex !== -1) {
            alert('profile with this name already exists!');
            return;
        }

        savedProfiles.push(newProfile);
        localStorage.setItem('userProfiles', JSON.stringify(savedProfiles));

        // sets current active profile
        localStorage.setItem('currentProfile', name);

        // update profile display
        document.getElementById('display-name').textContent = name;
        document.getElementById('display-bio').textContent = bio || 'tell me about yourself...';
        document.getElementById('display-interests').textContent = interests || 'None';
        document.getElementById('profile-pic').src = avatar;

        // after profile created, go to questions
        document.getElementById('go-to-questions').style.display = 'block';
    }

    // go to questions page
    function goToQuestions() {
        window.location.href = 'questions.html';
    }

    // sets avatar from choice
    function setAvatar(avatarSrc) {
        document.getElementById('profile-pic').src = avatarSrc;
    };   
}



// questions page function, questions.html
if (window.location.pathname.endsWith('questions.html')) {
    let currentProfileName = localStorage.getItem('currentProfile');
    let savedProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];

    // if no profile, redirect to index
    if (!currentProfileName) {
        alert("no profile, please create a profile first!");
        window.location.href = 'index.html';
    }

    let currentProfile = savedProfiles.find(profile => profile.name === currentProfileName);

    document.querySelectorAll('.question-card').forEach(card => {
        card.addEventListener('click', function () {
            const question = this.getAttribute('data-question');

            let answers = JSON.parse(localStorage.getItem('answers')) || [];
            let profileAnswers = answers.filter(answer => answer.user.name === currentProfile.name && answer.question === question);

            // Check if this specific question has been answered
            if (profileAnswers.length > 0) {
                alert("You've already answered this question!");
                return;
            }

            // Create answer input section
            createAnswerInput(this);
        });
    });

    function createAnswerInput(card) {
        const cardBack = card.querySelector('.card-back');
        
        // Remove any existing answer sections
        const existingSection = cardBack.querySelector('.answer-input-section');
        if (existingSection) {
            existingSection.remove();
        }

        const answerSection = document.createElement('div');
        answerSection.className = 'answer-input-section';
        answerSection.innerHTML = `
            <textarea placeholder="Type your answer here..." required></textarea>
            <div class="underline"></div>
            <div class="sideline"></div>
            <div class="upperline"></div>
            <div class="line"></div>
            <div class="answer-buttons">
                <button class="submit">Submit</button>
                <button class="cancel">Cancel</button>
            </div>
        `;

        cardBack.appendChild(answerSection);
        
        // Show the section after a brief delay (for animation)
        setTimeout(() => {
            answerSection.classList.add('show');
            answerSection.querySelector('textarea').focus();
        }, 50);

        // Handle submit button
        answerSection.querySelector('.submit').addEventListener('click', () => {
            const answer = answerSection.querySelector('textarea').value.trim();
            if (!answer) {
                alert('Please type an answer before submitting!');
                return;
            }

            const answerData = {
                question: card.getAttribute('data-question'),
                answer,
                user: currentProfile
            };
            saveAnswer(answerData);

            // Redirect to answers page
            window.location.href = 'answers.html';
        });

        // Handle cancel button
        answerSection.querySelector('.cancel').addEventListener('click', () => {
            answerSection.classList.remove('show');
            setTimeout(() => answerSection.remove(), 300);
        });
    }

    function saveAnswer(answerData) {
        let answers = JSON.parse(localStorage.getItem('answers')) || [];
        answers.push(answerData);
        localStorage.setItem('answers', JSON.stringify(answers));
    }
}

// answers, answers.html
if (currentPage.endsWith('answers.html')) {
    function renderAnswers() {
        const container = document.getElementById('answers-container');
        const answers = JSON.parse(localStorage.getItem('answers')) || [];

        container.innerHTML = ''; // clears previous answers

        answers.forEach((answerData, index) => {
            const card = document.createElement('div');
            card.className = 'answer-card';
            card.innerHTML = `
                <p><strong>Q:</strong> ${answerData.question}</p>
                <p><strong>A:</strong> ${answerData.answer}</p>
                <button onclick="showUserProfile(${index})">who else answered?</button>
            `;
            container.appendChild(card);
        });
    }

    function showUserProfile(answerIndex) {
        const answers = JSON.parse(localStorage.getItem('answers')) || [];
        const userProfile = answers[answerIndex].user;

        alert(`
            name: ${userProfile.name}
            bio: ${userProfile.bio || 'no bio here, hmmm...'}
            hobbies: ${userProfile.interests || 'none... boring!'}
        `);
    }

    // loads answers
    window.onload = renderAnswers;

    // create new profile
    function createNewProfile() {
        
        // redirect to index.html
        window.location.href = 'index.html';
    }
}


function generateStars(element, count, size) {
    let boxShadow = '';
    for(let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        boxShadow += `${x}px ${y}px #FFF`;
        if(i < count - 1) boxShadow += ', ';
    }
    element.style.boxShadow = boxShadow;
}

document.addEventListener('DOMContentLoaded', () => {
    // Generate stars
    generateStars(document.getElementById('stars'), 700);
    generateStars(document.getElementById('stars2'), 200);
    generateStars(document.getElementById('stars3'), 100);

    const cards = document.querySelectorAll('.question-card');
    let currentIndex = 2; // Start with middle card
    let isSpinning = true;
    let spinSpeed = 200; // Initial speed (ms between switches)
    const maxSpinSpeed = 200; // Fastest speed
    const minSpinSpeed = 800; // Slowest speed before stop
    let spinTimer;

    function updateCardPositions() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'left', 'right', 'far-left', 'far-right');

            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === cards.length - 1)) {
                card.classList.add('left');
            } else if (index === currentIndex - 2 || (currentIndex === 0 && index === cards.length - 2) || (currentIndex === 1 && index === cards.length - 1)) {
                card.classList.add('far-left');
            } else if (index === currentIndex + 1 || (currentIndex === cards.length - 1 && index === 0)) {
                card.classList.add('right');
            } else if (index === currentIndex + 2 || (currentIndex === cards.length - 2 && index === 0) || (currentIndex === cards.length - 1 && index === 1)) {
                card.classList.add('far-right');
            }
        });
    }

    function scrollNext() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCardPositions();
    }

    function scrollPrev() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCardPositions();
    }

    // Initial automatic spinning animation
    function startSpinning() {
        let duration = 0;
        const totalDuration = 3000; // 3 seconds
        const speedIncrement = (minSpinSpeed - maxSpinSpeed) / (totalDuration / maxSpinSpeed);

        function spin() {
            scrollNext();
            duration += spinSpeed;
            
            if (duration < totalDuration) {
                // Gradually increase the interval (slow down)
                spinSpeed = Math.min(minSpinSpeed, spinSpeed + speedIncrement);
                spinTimer = setTimeout(spin, spinSpeed);
            } else {
                // Stop at random card after 3 seconds
                const randomSpins = Math.floor(Math.random() * cards.length);
                let spinsLeft = randomSpins;
                
                function finalSpins() {
                    if (spinsLeft > 0) {
                        scrollNext();
                        spinsLeft--;
                        setTimeout(finalSpins, minSpinSpeed);
                    } else {
                        isSpinning = false;
                        enableInteraction();
                    }
                }
                
                finalSpins();
            }
        }

        spin();
    }

    // Disable all interactions during initial spin
    function disableInteraction() {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        cards.forEach(card => card.style.pointerEvents = 'none');
    }

    // Enable interactions after spin
    function enableInteraction() {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        cards.forEach(card => card.style.pointerEvents = 'auto');
    }

    // Event handler functions
    function handleKeyPress(e) {
        if (isSpinning) return;
        if (e.key === 'ArrowLeft') scrollPrev();
        if (e.key === 'ArrowRight') scrollNext();
    }

    function handleWheel(e) {
        if (isSpinning) return;
        if (e.deltaY > 0) {
            scrollNext();
        } else {
            scrollPrev();
        }
    }

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        if (isSpinning) return;
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        if (isSpinning) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                scrollPrev();
            } else {
                scrollNext();
            }
        }
    }

    // Initialize
    updateCardPositions();
    disableInteraction();
    startSpinning();

    // Click handlers for cards
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (isSpinning) return;
            if (index < currentIndex || (currentIndex === 0 && index === cards.length - 1)) {
                scrollPrev();
            } else if (index > currentIndex || (currentIndex === cards.length - 1 && index === 0)) {
                scrollNext();
            }
        });
    });

    function createAnswerInput(card) {
        const cardBack = card.querySelector('.card-back');
        
        // Remove any existing answer sections
        const existingSection = cardBack.querySelector('.answer-input-section');
        if (existingSection) {
            existingSection.remove();
        }

        const answerSection = document.createElement('div');
        answerSection.className = 'answer-input-section';
        answerSection.innerHTML = `
            <textarea placeholder="Type your answer here..." required></textarea>
            <div class="answer-buttons">
                <button class="submit">Submit</button>
                <button class="cancel">Cancel</button>
            </div>
        `;

        cardBack.appendChild(answerSection);
        
        // Show the section after a brief delay (for animation)
        setTimeout(() => {
            answerSection.classList.add('show');
            answerSection.querySelector('textarea').focus();
        }, 50);

        // Rest of your event handlers...
    }
})