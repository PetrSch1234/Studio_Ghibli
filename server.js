var express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

var app = express();

app.use(cors({ origin: '*', }));

app.get("/api/films", (req, res) => {
    getFilmsList(res)
    getSpeciesList()
});
app.get("/api/films/film", (req, res) => {
    getDetailsSpecies(res, req.query.id)
});

app.use(express.static(path.join(__dirname, '/build')));

app.listen(88);


let filmsIDs = [];
let speciesList = {};

function getFilmsList(res) {

    axios.get('https://ghibliapi.herokuapp.com/films')
        .then(function (response) {
            filmsIDs = [];

            let filmsList = response.data.map((el) => {
                filmsIDs.push(el.id);
                return el.title;
            })
            return res.json({ films: filmsList });
        })
        .catch(function (error) {
            console.log(error);
        })
}

function getSpeciesList() {

    axios.get('https://ghibliapi.herokuapp.com/species')
        .then(function (response) {
            speciesList = {};

            response.data.forEach(el => {
                speciesList = {...speciesList, [el.id]: el.name}
            });
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function getDetailsSpecies(res, selectedFilm) {

    const resFilm = await axios.get('https://ghibliapi.herokuapp.com/films/' + filmsIDs[selectedFilm]);
    const reducedFilm = getFilmDetails(resFilm.data);
    const specList = getSpeciesIDs(resFilm.data);

    let speciesNames = specList.map((el)=>{
        return speciesList[el]
    })

    return res.json({ details: reducedFilm, species: speciesNames });
}


function getFilmDetails(data) {

    const selectedDetails = [
        'title',
        'original_title',
        'original_title_romanised',
        'description',
        'director',
        'producer',
        'release_date',
        'running_time',
        'rt_score',
    ];

    function getReducedData(el) {
        const allKeys = Object.keys(el);

        return allKeys.reduce((next, key) => {
            if (selectedDetails.includes(key)) {
                return { ...next, [key]: el[key] };
            } else {
                return next;
            }
        }, {});
    }

    return getReducedData(data);
}


function getSpeciesIDs(data) {
    
    let ids = data.species.map((el) => {
        let newStr = el.replace('https://ghibliapi.herokuapp.com/species/', '');
        return newStr;
    })
    return ids;
}
