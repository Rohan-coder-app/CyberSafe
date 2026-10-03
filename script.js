function checkAnswer(answer) {
    const feedback = document.getElementById("feedback");

    if (answer === "report") {
        feedback.innerHTML =
            "✅ Correct! This message has several warning signs. Report it instead of clicking the link.";
        feedback.style.background = "#123d35";
        feedback.style.color = "#5ee7d3";
    } else {
        feedback.innerHTML =
            "⚠️ Not quite. Don't click or reply to a suspicious message. Report it instead.";
        feedback.style.background = "#3d2020";
        feedback.style.color = "#ff8d8d";
    }
}

function quizAnswer(correct) {
    const feedback = document.getElementById("quiz-feedback");

    if (correct) {
        feedback.innerHTML = "✅ Correct! Don't click suspicious links or provide your password.";
        feedback.style.background = "#123d35";
        feedback.style.color = "#5ee7d3";
    } else {
        feedback.innerHTML = "❌ Not quite. You should avoid the link and report the message.";
        feedback.style.background = "#3d2020";
        feedback.style.color = "#ff8d8d";
    }
}