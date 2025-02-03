// 创建名牌逻辑
if (window.location.pathname.endsWith('index.html')) {
    document.getElementById('profile-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const hobby = document.getElementById('hobby').value;

        const profile = { name, hobby };
        localStorage.setItem('userProfile', JSON.stringify(profile));

        window.location.href = 'questions.html'; 
    });
}

// 问题卡片逻辑
if (window.location.pathname.endsWith('questions.html')) {
    document.querySelectorAll('.question-card').forEach(card => {
        card.addEventListener('click', function () {
            const question = this.getAttribute('data-question');
            const answer = prompt(`question：${question}\nAnswer：`);
            if (answer) {
                const userProfile = JSON.parse(localStorage.getItem('userProfile'));
                const answerData = {
                    question,
                    answer,
                    user: userProfile
                };
                saveAnswer(answerData);

                // 跳转到 answers.html
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

// 查看回答逻辑
if (window.location.pathname.endsWith('answers.html')) {
    function renderAnswers() {
        const container = document.getElementById('answers-container');
        const answers = JSON.parse(localStorage.getItem('answers')) || [];
        answers.forEach((answerData, index) => {
            const card = document.createElement('div');
            card.className = 'answer-card';
            card.innerHTML = `
                <p><strong>Q：</strong>${answerData.question}</p>
                <p><strong>A：</strong>${answerData.answer}</p>
                <button onclick="showUserProfile(${index})">check who answered this</button>
            `;
            container.appendChild(card);
        });
    }

    function showUserProfile(answerIndex) {
        const answers = JSON.parse(localStorage.getItem('answers')) || [];
        const userProfile = answers[answerIndex].user;
        alert(`
            name:${userProfile.name}
            info:${userProfile.hobby || 'nothing yet'}
        `);
    }

    // 页面加载时渲染回答
    window.onload = renderAnswers;
}