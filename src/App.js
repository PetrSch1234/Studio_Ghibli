import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [welcome, setWelcome] = useState(true);
    const [filmsList, setFilmsList] = useState({});
    const [filmDetails, setFilmDetails] = useState({});
    const [filmSpecies, setFilmSpecies] = useState([]);


    function getFilmDetails(index) {
        fetch("http://localhost:88/api/films/film?id=" + index)
            .then((res) => res.json())
            .then((data) => {
                setFilmDetails(data.details)
                setFilmSpecies(data.species)
            });
    }

    async function getInitData() {
        const res = await fetch("http://localhost:88/api/films");
        const data = await res.json();
        setFilmsList(data.films);
        getFilmDetails(0);
    }


    useEffect(() => {
        setTimeout(() => {
            setWelcome(false);
        }, 2500);

        getInitData();
    }, []);


    const selectFL = (index) => {
        getFilmDetails(index);
    };

    return (
        <div className="App">
            {welcome ? (
                <Welcome />
            ) : (
                <>
                    <div className="div-FilmList">
                        <br></br>
                        <h3>Films list</h3>
                        <FilmsList films={filmsList} cb={selectFL} />
                    </div>
                    <div className="div-Details">
                        <br></br>
                        <h3>Details</h3>
                        <Details details={filmDetails} />
                        <br></br>
                        <h3>Species</h3>
                        <Species species={filmSpecies} />
                    </div>
                </>
            )}
        </div>
    );
}
export default App;


const FilmsList = (props) => {
    let titles = props.films.map((title, index) => {
        return (
            <li key={index} onClick={() => props.cb(index)}>
                {title}
            </li>
        );
    });
    return <ul>{titles}</ul>;
};

const Details = (props) => {
    let detailList = []

    for (const [key, value] of Object.entries(props.details)) {
        detailList.push(
            <li key={key}>
                <div className='div-cont-details'>
                    <div className='div-title'>{key} :</div>
                    <div className='div-text'>{value}</div>
                </div>
            </li>
        )
    }
    return <ul>{detailList}</ul>
}

const Species = (props) => {
    let speciesList = props.species.map((oneSpec, index) => {
        return <li key={index}>{oneSpec}</li>;
    })

    return <ul>{speciesList}</ul>;
}

const Welcome = () => {
    return <div className='welcome'>Vítejte na stránkách</div>;
}