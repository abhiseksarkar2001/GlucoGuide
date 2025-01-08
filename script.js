// Store user data in session storage
function storeUserData() {
    const name = document.getElementById('name')?.value || '';
    const age = document.getElementById('age')?.value || '';
    const gender = document.getElementById('gender')?.value || '';
    const height = document.getElementById('height')?.value || '';
    const weight = document.getElementById('weight')?.value || '';

    sessionStorage.setItem('name', name);
    sessionStorage.setItem('age', age);
    sessionStorage.setItem('gender', gender);
    sessionStorage.setItem('height', height);
    sessionStorage.setItem('weight', weight);

    console.log("User data stored:", { name, age, gender, height, weight });
}

// Navigate to the next page based on user input
function nextPage(hasCheckedBloodSugar) {
    storeUserData();
    if (hasCheckedBloodSugar) {
        window.location.href = 'page3.html';
    } else {
        window.location.href = 'page4.html';
    }
}

// Function to handle blood test submission
function submitBloodTest() {
    // Retrieve blood test data from the form
    const fastingGlucose = document.getElementById('fastingGlucose').value;
    const postPrandialGlucose = document.getElementById('postPrandialGlucose').value;
    const hba1c = document.getElementById('hba1c').value;
    const randomGlucose = document.getElementById('randomGlucose').value;

    // Store blood test data in session storage
    sessionStorage.setItem('fastingGlucose', fastingGlucose);
    sessionStorage.setItem('postPrandialGlucose', postPrandialGlucose);
    sessionStorage.setItem('hba1c', hba1c);
    sessionStorage.setItem('randomGlucose', randomGlucose);

    console.log("Blood test data stored:", { fastingGlucose, postPrandialGlucose, hba1c, randomGlucose });

    // Navigate to the next page (page 4)
    window.location.href = 'page4.html';
}

function calculateRisk() {
    // Retrieve necessary data from session storage
    const age = parseInt(sessionStorage.getItem('age')) || 0;
    const gender = sessionStorage.getItem('gender') || '';
    const height = parseFloat(sessionStorage.getItem('height')) || 0;
    const weight = parseFloat(sessionStorage.getItem('weight')) || 0;
    const waist = parseFloat(sessionStorage.getItem('waist')) || 0;
    const physicalActivity = sessionStorage.getItem('physicalActivity') || '';
    const familyHistory = sessionStorage.getItem('familyHistory') || '';
    const hypertension = sessionStorage.getItem('hypertension') === 'yes';
    const highBloodSugarMed = sessionStorage.getItem('highBloodSugarMed') === 'yes';
    const fruitIntake = sessionStorage.getItem('fruitIntake') === 'everyday';
    const highBloodGlucose = sessionStorage.getItem('highBloodGlucose') === 'yes';

    // Validate retrieved data
    console.log("Data Retrieved:", {
        age, gender, height, weight, waist, physicalActivity,
        familyHistory, hypertension, highBloodSugarMed, fruitIntake, highBloodGlucose,
    });

    // Calculate BMI
    const bmi = (height > 0 && weight > 0) ? (weight / (height * height)).toFixed(2) : 0;
    sessionStorage.setItem('bmi', bmi);

    // Initialize scores
    let idrsScore = 0;
    let adaScore = 0;
    let findriscScore = 0;

    // Age-based scores
    if (age < 35) idrsScore += 0;
    else if (age >= 35 && age <= 49) idrsScore += 20;
    else if (age >= 50) idrsScore += 30;

    if (age < 40) adaScore += 0;
    else if (age >= 40 && age <= 49) adaScore += 1;
    else if (age >= 50 && age <= 59) adaScore += 2;
    else if (age >= 60) adaScore += 3;

    if (age < 45) findriscScore += 0;
    else if (age >= 45 && age <= 54) findriscScore += 2;
    else if (age >= 55 && age <= 64) findriscScore += 3;
    else if (age >= 64) findriscScore += 4;

    // Gender-based scores (for ADA)
    if (gender === 'male') adaScore += 1;

    // Physical activity
    if (physicalActivity === 'c') {
        idrsScore += 30;
        findriscScore += 2;
    } else if (physicalActivity === 'b') {
        idrsScore += 20;
    }

    // Family history
    if (familyHistory === 'e') {
        idrsScore += 20;
        adaScore += 1;
        findriscScore += 5;
    } else if (familyHistory === 'd') {
        idrsScore += 10;
        adaScore += 1;
        findriscScore += 5;
    } else if (familyHistory === 'c') {
        findriscScore += 5;
    } else if (familyHistory === 'b') {
        findriscScore += 3;
    }

    // Waist circumference
    if (gender === 'female') {
        if (waist >= 90) idrsScore += 20;
        else if (waist < 90 && waist >= 80) idrsScore += 10;

        if (waist > 88) findriscScore += 4;
        else if (waist <= 88 && waist >= 80) findriscScore += 3;
    } else if (gender === 'male') {
        if (waist >= 100) idrsScore += 20;
        else if (waist < 100 && waist >= 90) idrsScore += 10;

        if (waist > 102) findriscScore += 4;
        else if (waist <= 102 && waist >= 94) findriscScore += 3;
    }

    // Hypertension
    if (hypertension) adaScore += 1;

    // High blood sugar medication
    if (highBloodSugarMed) findriscScore += 2;

    // Fruit/vegetable intake
    if (!fruitIntake) findriscScore += 1;

    // High blood glucose
    if (highBloodGlucose) findriscScore += 5;

    // BMI-based scores
    if (bmi > 40) {
        adaScore += 3;
        findriscScore += 3;
    } else if (bmi >= 30) {
        adaScore += 2;
        findriscScore += 3;
    } else if (bmi >= 25) {
        adaScore += 1;
        findriscScore += 1;
    }

    // Store scores in session storage
    sessionStorage.setItem('idrsScore', idrsScore);
    sessionStorage.setItem('adaScore', adaScore);
    sessionStorage.setItem('findriscScore', findriscScore);

    console.log("Risk scores calculated:", { idrsScore, adaScore, findriscScore });

    // Navigate to the results page
    window.location.href = 'page5.html';
}


// Example usage: Call calculateRiskScores when needed
// calculateRiskScores();


// Function to populate results on the results page
function populateResults() {
    // Retrieve user data from session storage
    const name = sessionStorage.getItem('name');
    const age = sessionStorage.getItem('age');
    const height = sessionStorage.getItem('height');
    const weight = sessionStorage.getItem('weight');
    const bmi = sessionStorage.getItem('bmi');
    const idrsScore = parseInt(sessionStorage.getItem('idrsScore')) || 0;
    const adaScore = parseInt(sessionStorage.getItem('adaScore')) || 0;
    const findriscScore = parseInt(sessionStorage.getItem('findriscScore')) || 0;

    // Debug logs
    console.log("Retrieved user data:", { name, age, height, weight, bmi, idrsScore, adaScore, findriscScore });

    // Populate data into the DOM
    document.getElementById('resultName').innerText = name;
    document.getElementById('resultAge').innerText = age;
    document.getElementById('resultHeight').innerText = height;
    document.getElementById('resultWeight').innerText = weight;
    document.getElementById('resultBMI').innerText = bmi;
    
    // Display user data
    document.getElementById('resultName').innerText = name || 'N/A';
    document.getElementById('resultAge').innerText = age || 'N/A';
    document.getElementById('resultHeight').innerText = height || 'N/A';
    document.getElementById('resultWeight').innerText = weight || 'N/A';
    document.getElementById('resultBMI').innerText = bmi || 'Invalid';

    // BMI Comment
    if (bmi) {
        const bmiValue = parseFloat(bmi);
        let bmiComment = '';
        if (bmiValue < 18.5) {
            bmiComment = 'You are Underweight.';
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            bmiComment = 'You have a Healthy weight.';
        } else if (bmiValue >= 25 && bmiValue < 30) {
            bmiComment = 'You are Overweight.';
        } else if (bmiValue >= 30 && bmiValue < 35) {
            bmiComment = 'You have Obesity class I.';
        } else if (bmiValue >= 35 && bmiValue < 40) {
            bmiComment = 'You have Obesity class II.';
        } else {
            bmiComment = 'You have Severe obesity.';
        }
        if (bmiValue >= 23) {
            bmiComment += ' You have a high BMI which can lead to diabetes.';
        }
        document.getElementById('bmiComment').innerText = bmiComment;
    }

    // IDRS Comment
    document.getElementById('resultIDRS').innerText = idrsScore || '0';
    let idrsComment = '';
    if (idrsScore >= 60) {
        idrsComment = 'Very high risk of having diabetes. Oral Glucose Tolerance Test (OGTT) is recommended.';
    } else if (idrsScore >= 30) {
        idrsComment = 'Moderate risk of diabetes. A checkup is recommended.';
    } else {
        idrsComment = 'Low risk of diabetes.';
    }
    document.getElementById('idrsComment').innerText = idrsComment;

    // ADA Comment
    document.getElementById('resultADA').innerText = adaScore || '0';
    let adaComment = '';
    if (adaScore >= 5) {
        adaComment = 'Increased risk of type 2 diabetes.';
    } else if (adaScore === 4) {
        adaComment = 'Prediabetes risk present.';
    } else {
        adaComment = 'ADA score indicates safety.';
    }
    document.getElementById('adaComment').innerText = adaComment;

    // FINDRISC Comment
    document.getElementById('resultFINDRISC').innerText = findriscScore || '0';
    let findriscComment = '';
    if (findriscScore < 7) {
        findriscComment = 'Low risk: 1 in 100 will develop the disease.';
    } else if (findriscScore <= 11) {
        findriscComment = 'Slightly elevated risk: 1 in 25 will develop the disease.';
    } else if (findriscScore <= 14) {
        findriscComment = 'Moderate risk: 1 in 6 will develop the disease.';
    } else if (findriscScore <= 20) {
        findriscComment = 'High risk: 1 in 3 will develop the disease.';
    } else {
        findriscComment = 'Very high risk: 1 in 2 will develop the disease.';
    }
    document.getElementById('findriscComment').innerText = findriscComment;

    // Blood Sugar Test Report
    const bloodSugarReport = document.getElementById('bloodSugarReport');
    const fastingGlucose = parseFloat(sessionStorage.getItem('fastingGlucose'));
    const postPrandialGlucose = parseFloat(sessionStorage.getItem('postPrandialGlucose'));
    const hba1c = parseFloat(sessionStorage.getItem('hba1c'));
    const randomGlucose = parseFloat(sessionStorage.getItem('randomGlucose'));

    if (fastingGlucose || postPrandialGlucose || hba1c || randomGlucose) {
        bloodSugarReport.innerHTML = `
            <p>Fasting Plasma Glucose (mg/dl): ${fastingGlucose || 'N/A'} - ${getFastingComment(fastingGlucose)}</p>
            <p>Post Prandial Plasma Glucose (mg/dl): ${postPrandialGlucose || 'N/A'} - ${getPostPrandialComment(postPrandialGlucose)}</p>
            <p>HbA1c%: ${hba1c || 'N/A'} - ${getHba1cComment(hba1c)}</p>
            <p>Random Plasma Glucose (mg/dl): ${randomGlucose || 'N/A'} - ${getRandomComment(randomGlucose)}</p>
        `;
    }
}

// Helper functions for blood sugar comments
function getFastingComment(value) {
    if (!value) return 'N/A';
    if (value < 100) return 'No diabetes';
    if (value < 126) return 'Higher risk of prediabetes';
    return 'Higher risk for diabetes';
}

function getPostPrandialComment(value) {
    if (!value) return 'N/A';
    if (value < 140) return 'No diabetes';
    if (value < 199) return 'Higher risk of prediabetes';
    return 'Higher risk for diabetes';
}

function getHba1cComment(value) {
    if (!value) return 'N/A';
    if (value < 5.7) return 'Optimal and lower diabetes risk';
    if (value < 6.5) return 'Elevated risk of prediabetes';
    return 'High risk for diabetes';
}

function getRandomComment(value) {
    if (!value) return 'N/A';
    if (value < 140) return 'No diabetes';
    if (value < 199) return 'Higher risk of prediabetes';
    return 'Higher risk for diabetes';
}

// Call the function to populate results when the page loads
window.onload = populateResults;

// Function to download the prescription as a PDF
function downloadPDF() {
    alert('PDF download functionality is not implemented yet.');
}
