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
    }

    // or upload pfp
    document.getElementById('profile-pic-upload').addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            document.getElementById('profile-pic').src = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });
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
            let profileAnswers = answers.filter(answer => answer.user.name === currentProfile.name);

            // checks if profile has already answered
            if (profileAnswers.length > 0) {
                alert("you already answered a question!");
                return;
            }

            const answer = prompt(`Question: ${question}\nAnswer:`);

            if (answer) {
                const answerData = {
                    question,
                    answer,
                    user: currentProfile
                };
                saveAnswer(answerData);

                localStorage.setItem('hasAnswered', 'true');

                // go to answers
                window.location.href = 'answers.html';
            }
        });
    });

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
