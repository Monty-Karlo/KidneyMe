// Kidney and Me interactive learning guide.
// No answers are transmitted or saved; recommendations are educational only.

const topics = {
    new: {
        title: "Getting Started",
        description: "Start with the basics and learn how to find reliable kidney-health information.",
        pages: [
            ["Start Here", "start-here.html"],
            ["Kidney Conditions", "conditions.html"],
            ["Trusted Resources", "resources.html"]
        ],
        questions: [
            "What do my kidney test results mean?",
            "Are there any follow-up tests or appointments I should plan for?",
            "What reliable resources would you recommend?"
        ]
    },
    conditions: {
        title: "Kidney Conditions",
        description: "Explore common kidney conditions and general information about monitoring kidney health.",
        pages: [
            ["Kidney Conditions", "conditions.html"],
            ["Warning Signs", "warning-signs.html"],
            ["Trusted Resources", "resources.html"]
        ],
        questions: [
            "What condition are we discussing, and how is it monitored?",
            "What do my blood and urine tests show?",
            "Which symptoms should I contact you about?"
        ]
    },
    nutrition: {
        title: "Diet and Nutrition",
        description: "Learn why nutrition needs can differ and what to discuss with a qualified professional.",
        pages: [
            ["Diet & Nutrition", "nutrition.html"],
            ["Start Here", "start-here.html"],
            ["Trusted Resources", "resources.html"]
        ],
        questions: [
            "Do I need to change how much sodium I eat?",
            "Do my lab results suggest any potassium or phosphorus concerns?",
            "Would meeting with a kidney dietitian be helpful?"
        ]
    },
    medications: {
        title: "Medication Safety",
        description: "Review general medication-safety information and prepare questions for your care team.",
        pages: [
            ["Medications", "medications.html"],
            ["Kidney Conditions", "conditions.html"],
            ["Trusted Resources", "resources.html"]
        ],
        questions: [
            "Does my kidney function affect any of my medicine doses?",
            "Which over-the-counter medicines should I ask about before taking?",
            "What should I do if I become sick or dehydrated?"
        ]
    },
    symptoms: {
        title: "Warning Signs",
        description: "Read general information about warning signs and when to seek medical help. This guide cannot evaluate your symptoms.",
        pages: [
            ["Warning Signs", "warning-signs.html"],
            ["Kidney Conditions", "conditions.html"],
            ["Trusted Resources", "resources.html"]
        ],
        questions: [
            "Which symptoms should prompt me to call your office?",
            "Who should I contact outside normal office hours?",
            "What should I do if my symptoms change?"
        ]
    }
};

const form = document.getElementById("guide-form");
const steps = Array.from(document.querySelectorAll(".guide-step"));
const backButton = document.getElementById("guide-back");
const nextButton = document.getElementById("guide-next");
const error = document.getElementById("guide-error");
const progress = document.getElementById("guide-progress");
const progressFill = document.getElementById("guide-progress-fill");
const results = document.getElementById("guide-results");
let step = 0;

function showStep() {
    steps.forEach((element, index) => { element.hidden = index !== step; });
    progress.textContent = `Question ${step + 1} of ${steps.length}`;
    progressFill.style.width = `${((step + 1) / steps.length) * 100}%`;
    backButton.hidden = step === 0;
    nextButton.textContent = step === steps.length - 1 ? "Show My Guide" : "Next";
    error.hidden = true;
}

function getSelection(name) {
    const selected = form.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
}

function addListItem(list, text) {
    const item = document.createElement("li");
    item.textContent = text;
    list.appendChild(item);
}

function displayResults() {
    const selectedTopic = topics[getSelection("topic")];
    const format = getSelection("format");
    const next = getSelection("next");
    const links = document.getElementById("results-links");
    const questions = document.getElementById("results-questions");
    const intro = document.getElementById("results-intro");
    const extra = document.getElementById("results-extra");

    links.replaceChildren();
    questions.replaceChildren();
    intro.textContent = `${selectedTopic.title}: ${selectedTopic.description}`;

    // Prioritize the requested reading style while retaining safe, relevant links.
    let pages = [...selectedTopic.pages];
    if (format === "resources") {
        pages.sort((a, b) => (a[1] === "resources.html" ? -1 : 0) - (b[1] === "resources.html" ? -1 : 0));
    }
    if (next === "prepare") {
        pages.push(["Start Here: Appointment Questions", "start-here.html#doctor"]);
    }
    pages.forEach(([label, href]) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        item.appendChild(link);
        links.appendChild(item);
    });

    selectedTopic.questions.forEach(question => addListItem(questions, question));
    extra.textContent = format === "questions" || next === "prepare"
        ? "You can write these questions down and bring them to your next appointment."
        : format === "resources"
            ? "The Resources page includes links to reliable health organizations for further reading."
            : "Choose a page above to read more at your own pace.";

    form.hidden = true;
    progress.hidden = true;
    document.querySelector(".guide-progress-track").hidden = true;
    results.hidden = false;
    results.focus();
}

nextButton.addEventListener("click", () => {
    const names = ["topic", "format", "next"];
    if (!getSelection(names[step])) {
        error.hidden = false;
        steps[step].querySelector("input").focus();
        return;
    }
    if (step === steps.length - 1) {
        displayResults();
    } else {
        step += 1;
        showStep();
        steps[step].querySelector("input").focus();
    }
});

backButton.addEventListener("click", () => {
    if (step > 0) {
        step -= 1;
        showStep();
    }
});

form.addEventListener("change", () => { error.hidden = true; });

document.getElementById("guide-restart").addEventListener("click", () => {
    form.reset();
    step = 0;
    results.hidden = true;
    form.hidden = false;
    progress.hidden = false;
    document.querySelector(".guide-progress-track").hidden = false;
    showStep();
    document.getElementById("guide-title").focus();
});

showStep();
