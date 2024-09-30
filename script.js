let correctCountry;
let options = [];
let score = 0; 
let hintUsed = false; 

document.addEventListener('DOMContentLoaded', () => {
    getRandomCountries();

    
    document.getElementById('dica').style.display = 'block';
});

function getCountryNameInPortuguese(country) {
    
    return country.translations && country.translations.por ?
        country.translations.por.common : country.name.common;
}

function getRandomCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            
            const randomIndex = Math.floor(Math.random() * data.length);
            correctCountry = data[randomIndex];
            options = [correctCountry];

            
            while (options.length < 4) {
                const randomOption = data[Math.floor(Math.random() * data.length)];
                if (!options.includes(randomOption)) {
                    options.push(randomOption);
                }
            }

            
            options.sort(() => Math.random() - 0.5);

            displayQuestion();
        })
        .catch(error => console.error('Erro:', error));
}

function displayQuestion() {
    
    hintUsed = false;

    
    const flagImage = document.getElementById('flagImage');
    flagImage.src = correctCountry.flags.png;
    flagImage.style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; 

    
    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-warning');
        button.innerText = getCountryNameInPortuguese(option);
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });

    
    document.getElementById('dica').style.display = 'block';
}

function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    const optionButtons = document.querySelectorAll('#options button');

    
    optionButtons.forEach(button => {
        button.disabled = true;
        button.classList.remove('btn-warning');
        button.classList.add('btn-secondary');
    });

    if (selected.name.common === correctCountry.name.common) {
        if (!hintUsed) {
            score += 2; 
            resultDiv.innerHTML = '<p class="text-success">Correto! <i class="fas fa-check-circle"></i> +2 Pontos</p>';
        } else {
            score += 1; 
            resultDiv.innerHTML = '<p class="text-success">Correto! <i class="fas fa-check-circle"></i> +1 Ponto</p>';
        }
    } else {
        resultDiv.innerHTML = `<p class="text-danger">Incorreto! O país correto era: <strong>${getCountryNameInPortuguese(correctCountry)}</strong> <i class="fas fa-times-circle"></i></p>`;
    }

    
    document.getElementById('score').innerText = score;

    
    document.getElementById('nextButton').style.display = 'block';
    
    document.getElementById('dica').style.display = 'none';
}

document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('nextButton').style.display = 'none'; 
    document.getElementById('dicaTexto').innerHTML = ''; 
    document.getElementById('dica').style.display = 'block'; 
    getRandomCountries(); 
};

async function buscarInformacoesPais() {
    try {
        const resposta = await fetch(`https://restcountries.com/v3.1/name/${correctCountry.name.common}`);
        if (!resposta.ok) {
            alert('País não encontrado');
            return;
        }

        const dados = await resposta.json(); 
        const pais = dados[0]; 

       
        const dicaTexto = document.getElementById('dicaTexto');
        dicaTexto.innerHTML = `
            <h3>Dicas do País</h3>
            <p><strong>População:</strong> ${pais.population.toLocaleString()}</p>
            <p><strong>Continente:</strong> ${pais.continents[0]}</p>
            <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : 'N/A'}</p>
            <p><strong>Moeda:</strong> ${Object.values(pais.currencies || {}).map(m => m.name).join(', ')}</p>
            <p><strong>Idiomas:</strong> ${Object.values(pais.languages || {}).join(', ')}</p>
        `;
        dicaTexto.classList.add('fade-in');
        hintUsed = true; 
    } catch (error) {
        console.error('Erro ao buscar informações do país:', error);
    }
}

document.getElementById('dica').onclick = () => {
    buscarInformacoesPais();
};
