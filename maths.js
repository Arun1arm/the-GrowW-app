var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
    
    const n1 = Math.round (Math.random() * 4);
    const n2 = Math.floor (Math.random() * 6);
    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;
    answer = n1+n2;

}

function checkAnswer() {

    const prediction = predict_image();
    console.log(`answer: ${answer}, prediction: ${prediction}`);

    if(prediction == answer){
        score++;
        console.log(`correct. Score ${score}`);
        if(score <= 6 ){
        backgroundImages.push(`url('images/background${score}.svg')`);
        document.body.style.backgroundImage = backgroundImages;
        }
        else
        {
            alert('Gimme, space to GrowW!!!');
            score = 0;
            backgroundImages = [];
            document.body.style.backgroundImage = backgroundImages;
        }
        
    }else{
        if (score !=0 && score < 0) {score--};
        console.log(`Wrong! Score ${score}`);
        alert ('Oops! Check your calculation and try writing neat next time.');
        setTimeout(function(){
            backgroundImages.pop();
            document.body.style.backgroundImage = backgroundImages;
        }, 1000);
    } 

    
}