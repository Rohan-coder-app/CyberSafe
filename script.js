const progressStorageKey = "cybersafeProgressV1";
const lessonPages = ["spotting", "links", "actions"];
const isPageRefresh = performance.getEntriesByType("navigation")[0]?.type === "reload";
if (isPageRefresh) localStorage.removeItem(progressStorageKey);
const quizQuestions = [
    {
        question: "A text says your bank account will be locked in 10 minutes unless you sign in using its link. What should you do?",
        answers: [
            "Open the link quickly so your account stays active",
            "Ignore the link and contact your bank using its official app or a number you trust",
            "Reply with your account number to prove it is yours"
        ],
        correct: 1,
        explanation: "Urgent threats are a common pressure tactic. Check your account through the official app or a trusted contact method."
    },
    {
        question: "An email says it is from your employer, but the sender address has an unfamiliar domain. What is the safest next step?",
        answers: [
            "Check with your employer through a known work channel before acting",
            "Trust it because the display name looks familiar",
            "Forward it to your coworkers to see what they think"
        ],
        correct: 0,
        explanation: "Display names can be faked. Verify unexpected requests with the person using a contact method you already know."
    },
    {
        question: "You receive an unexpected invoice attachment from someone you do not recognize. What should you do?",
        answers: [
            "Open it to find out what it is",
            "Download it on your phone instead",
            "Do not open it; verify with the supposed sender through a trusted channel"
        ],
        correct: 2,
        explanation: "Unexpected attachments can be unsafe. Verify the message independently before opening anything."
    },
    {
        question: "A message asks you to pay a fee with gift cards to avoid a penalty. What does that suggest?",
        answers: [
            "It is a normal way for official organizations to collect payment",
            "It is a strong warning sign of a scam; do not pay and report the message",
            "You should buy one gift card first to check"
        ],
        correct: 1,
        explanation: "Requests for gift cards, cryptocurrency, or unusual payment methods are strong scam warning signs."
    },
    {
        question: "A caller claiming to be IT asks you to read them the one-time sign-in code you just received. What should you do?",
        answers: [
            "Share it if they know your name",
            "Read only the first few digits",
            "Never share the code; end the call and verify with your IT team using a trusted contact"
        ],
        correct: 2,
        explanation: "One-time codes are meant only for you. Sharing them can let someone access your account."
    },
    {
        question: "A delivery notice links to a page asking for your email password to release a package. What is the safest choice?",
        answers: [
            "Do not enter your password; check delivery details on the carrier's official website or app",
            "Enter it if the page has the carrier's logo",
            "Use your work password instead of your personal one"
        ],
        correct: 0,
        explanation: "A delivery service should not need your email password. Go to the carrier's official site yourself."
    },
    {
        question: "A QR code on a flyer promises a prize and asks you to sign in. How should you handle it?",
        answers: [
            "Scan it because QR codes are always safe",
            "Avoid entering personal information and verify the offer through the organization's official site",
            "Sign in if the page loads quickly"
        ],
        correct: 1,
        explanation: "QR codes can hide suspicious links. Check the destination and verify unexpected offers independently."
    },
    {
        question: "A friend messages from a new number asking for emergency money. What should you do first?",
        answers: [
            "Send a small amount to help right away",
            "Ask them to send a photo of their ID",
            "Call your friend using the number you already have to confirm it is really them"
        ],
        correct: 2,
        explanation: "Scammers can impersonate people you know. Confirm unusual requests through a separate, trusted contact method."
    },
    {
        question: "You clicked a suspicious link but did not enter any information. What should you do now?",
        answers: [
            "Close the page, avoid downloading anything, and report the message; if a file downloaded, do not open it",
            "Click the link again to check whether it was dangerous",
            "Reply to the sender and ask if they are legitimate"
        ],
        correct: 0,
        explanation: "Close the page and report the message. If you downloaded a file, do not open it and ask your IT team for help."
    },
    {
        question: "You realize you entered your password on a fake sign-in page. What should you do first?",
        answers: [
            "Wait to see whether anything happens",
            "Change that password on the real site immediately, update reused passwords, and tell your IT team if it is a work account",
            "Send the same password to the message sender to confirm"
        ],
        correct: 1,
        explanation: "Change the compromised password using the real site, update any reused passwords, and notify your IT team when relevant."
    }
];

function loadProgress() {
    const storedProgress = localStorage.getItem(progressStorageKey);
    if (!storedProgress) {
        return { lessons: [], quizAnswered: 0, quizScore: 0 };
    }

    const saved = JSON.parse(storedProgress);
    const lessons = Array.isArray(saved.lessons)
        ? lessonPages.filter((page) => saved.lessons.includes(page))
        : [];
    const quizAnswered = Number.isInteger(saved.quizAnswered)
        ? Math.min(Math.max(saved.quizAnswered, 0), quizQuestions.length)
        : 0;
    const quizScore = Number.isInteger(saved.quizScore)
        ? Math.min(Math.max(saved.quizScore, 0), quizAnswered)
        : 0;

    return { lessons, quizAnswered, quizScore };
}

const websiteProgress = loadProgress();

function saveProgress() {
    localStorage.setItem(progressStorageKey, JSON.stringify(websiteProgress));
}

function updateWebsiteProgress() {
    const progressLabel = document.getElementById("site-progress-label");
    const progressBar = document.querySelector(".site-progress-track");
    const progressFill = document.querySelector(".site-progress-fill");
    if (!progressLabel || !progressBar || !progressFill) return;

    const percent = Math.round(
        ((websiteProgress.lessons.length + websiteProgress.quizAnswered / quizQuestions.length) /
            (lessonPages.length + 1)) *
            100
    );

    progressLabel.textContent = `${percent}% complete · ${websiteProgress.lessons.length}/3 lessons · quiz ${websiteProgress.quizAnswered}/10`;
    progressBar.setAttribute("aria-valuenow", String(percent));
    progressFill.style.width = `${percent}%`;
}

function initializeWebsiteProgress() {
    const currentPage = document.body.dataset.page;
    const pageLinks = {
        home: "index.html",
        spotting: "spotting-phishing.html",
        links: "suspicious-links.html",
        actions: "what-to-do.html",
        quiz: "test-your-knowledge.html"
    };
    const currentLink = document.querySelector(`.nav-links a[href="${pageLinks[currentPage]}"]`);
    if (currentLink) currentLink.setAttribute("aria-current", "page");

    if (!isPageRefresh && lessonPages.includes(currentPage) && !websiteProgress.lessons.includes(currentPage)) {
        websiteProgress.lessons.push(currentPage);
        saveProgress();
    }
    updateWebsiteProgress();
}

function initializeQuiz() {
    const quizCard = document.getElementById("quiz-card");
    if (!quizCard) return;

    const questionCount = document.getElementById("quiz-question-count");
    const scoreDisplay = document.getElementById("quiz-score");
    const questionText = document.getElementById("quiz-question");
    const answersContainer = document.getElementById("quiz-answers");
    const feedback = document.getElementById("quiz-feedback");
    const nextButton = document.getElementById("quiz-next");
    const quizProgressBar = document.querySelector(".quiz-progress-track");
    const quizProgressFill = document.querySelector(".quiz-progress-fill");

    function renderResult() {
        questionCount.textContent = "Quiz complete!";
        scoreDisplay.textContent = `⭐ ${websiteProgress.quizScore} / ${quizQuestions.length} points`;
        quizProgressBar.setAttribute("aria-valuenow", String(quizQuestions.length));
        quizProgressFill.style.width = "100%";
        questionText.textContent =
            websiteProgress.quizScore === quizQuestions.length
                ? "Perfect score! You spotted every phishing trap."
                : "Nice work finishing the challenge. Every safe choice helps protect you online.";
        answersContainer.replaceChildren();
        feedback.hidden = false;
        feedback.className = "quiz-result";
        feedback.textContent = `You got ${websiteProgress.quizScore} out of ${quizQuestions.length} right. Review any lessons you want to practice, then play again to beat your score.`;
        nextButton.hidden = false;
        nextButton.textContent = "Play again ↻";
        nextButton.dataset.restart = "true";
        websiteProgress.quizAnswered = quizQuestions.length;
        saveProgress();
        updateWebsiteProgress();
    }

    function renderQuestion() {
        if (websiteProgress.quizAnswered >= quizQuestions.length) {
            renderResult();
            return;
        }

        const questionIndex = websiteProgress.quizAnswered;
        const currentQuestion = quizQuestions[questionIndex];
        questionCount.textContent = `Question ${questionIndex + 1} of ${quizQuestions.length}`;
        scoreDisplay.textContent = `⭐ ${websiteProgress.quizScore} points`;
        questionText.textContent = currentQuestion.question;
        quizProgressBar.setAttribute("aria-valuenow", String(questionIndex));
        quizProgressFill.style.width = `${(questionIndex / quizQuestions.length) * 100}%`;
        answersContainer.replaceChildren();
        feedback.hidden = true;
        feedback.className = "";
        nextButton.hidden = true;
        delete nextButton.dataset.restart;

        currentQuestion.answers.forEach((answer, answerIndex) => {
            const answerButton = document.createElement("button");
            answerButton.type = "button";
            answerButton.className = "quiz-answer";
            answerButton.textContent = answer;
            answerButton.addEventListener("click", () => {
                const correct = answerIndex === currentQuestion.correct;
                websiteProgress.quizAnswered += 1;
                if (correct) websiteProgress.quizScore += 1;
                saveProgress();
                updateWebsiteProgress();
                scoreDisplay.textContent = `⭐ ${websiteProgress.quizScore} points`;
                quizProgressBar.setAttribute("aria-valuenow", String(websiteProgress.quizAnswered));
                quizProgressFill.style.width = `${(websiteProgress.quizAnswered / quizQuestions.length) * 100}%`;

                answersContainer.querySelectorAll("button").forEach((button) => {
                    button.disabled = true;
                });
                answerButton.classList.add(correct ? "is-correct" : "is-incorrect");
                feedback.hidden = false;
                feedback.className = correct ? "quiz-feedback-correct" : "quiz-feedback-incorrect";
                feedback.textContent = `${correct ? "Correct!" : "Not quite."} ${currentQuestion.explanation}`;
                nextButton.hidden = false;
                nextButton.textContent =
                    websiteProgress.quizAnswered === quizQuestions.length ? "See your results →" : "Next question →";
                if (websiteProgress.quizAnswered === quizQuestions.length) {
                    quizProgressBar.setAttribute("aria-valuenow", String(quizQuestions.length));
                    quizProgressFill.style.width = "100%";
                }
            });
            answersContainer.append(answerButton);
        });
    }

    nextButton.addEventListener("click", () => {
        if (nextButton.dataset.restart === "true") {
            websiteProgress.quizAnswered = 0;
            websiteProgress.quizScore = 0;
            delete nextButton.dataset.restart;
            saveProgress();
        }
        renderQuestion();
    });

    renderQuestion();
}

initializeWebsiteProgress();
initializeQuiz();
