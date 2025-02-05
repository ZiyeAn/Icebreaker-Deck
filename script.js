// check for which page
const currentPage = window.location.pathname;

// profile, index.html
if (currentPage.endsWith('index.html')) {
    window.onload = function () {
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (savedProfile) {
            document.getElementById('display-name').textContent = savedProfile.name;
            document.getElementById('display-bio').textContent = savedProfile.bio;
            document.getElementById('display-interests').textContent = savedProfile.interests;
            document.getElementById('profile-pic').src = savedProfile.avatar;

            // after profile created, go to questions
            document.getElementById('go-to-questions').style.display = 'block';
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

        const profile = { name, bio, interests, avatar };
        localStorage.setItem('userProfile', JSON.stringify(profile));

        // update profile display
        document.getElementById('display-name').textContent = name;
        document.getElementById('display-bio').textContent = bio || 'A short bio about yourself...';
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
    let hasAnswered = localStorage.getItem('hasAnswered');

    // if question is already answered
    if (hasAnswered) {
        alert("you already answered a question! going to answers...");
        window.location.href = 'answers.html';
    }

    document.querySelectorAll('.question-card').forEach(card => {
        card.addEventListener('click', function () {
            if (localStorage.getItem('hasAnswered')) {
                alert("you already chose your question!");
                return;
            }

            const question = this.getAttribute('data-question');

            let answers = JSON.parse(localStorage.getItem('answers')) || [];
            let userProfile = JSON.parse(localStorage.getItem('userProfile'));

            // checks if user already answered question
            let alreadyAnswered = answers.some(ans => ans.user.name === userProfile.name);

            if (alreadyAnswered) {
                alert("you already chose your question!");
                return;
            }

            const answer = prompt(`Question: ${question}\nAnswer:`);

            if (answer) {
                const answerData = {
                    question,
                    answer,
                    user: userProfile
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
}
