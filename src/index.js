import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const useConstructor = (callBack = () => { }) => {
    const [hasBeenCalled, setHasBeenCalled] = useState(false);
    if (hasBeenCalled) return;
    callBack();
    setHasBeenCalled(true);
}

const CountryCapitalGame = ({ data }) => {
    const [selectedButton, setSelectedButton] = useState({ button1: null, button2: null });
    const [guessed, setGuessed] = useState([]);
    const [randomizedLabels, setrandomizedLabels] = useState(null); // To have them randomized only once, not on each render

    const handleButtonClick = (label) => {
        // There is nothing selected. 
        if (!selectedButton.button1 && !selectedButton.button2) {
            setSelectedButton({ button1: label, button2: null });
        }
        // There was a selection living there 
        else if (selectedButton.button1 && !selectedButton.button2) {
            // Is a correct guess
            if (data[selectedButton.button1] === label || getKeyByValue(selectedButton.button1) === label) {
                setGuessed([...guessed, label, selectedButton.button1]);
                setSelectedButton({ button1: null, button2: null });
            } else { // Not correct 
                setSelectedButton({ button1: selectedButton.button1, button2: label });
            }
        } else { // Two selections lived there 
            setSelectedButton({ button1: label, button2: null });
        }
    }

    function getKeyByValue(value) {
        return Object.keys(data).find(key => data[key] === value);
    }

    const randomizeThis = (arr) => arr.sort(() => .5 - Math.random());
    const getColor = (label, background = false) => {
        if (selectedButton.button1 === label && !selectedButton.button2) {
            return background ? 'blue' : 'white';
        }
        else if (selectedButton.button1 === label || selectedButton.button2 === label) {
            return background ? 'red' : 'white';
        } else {
            return background ? 'white' : 'black';
        }
    };

    const dictionaryToArray = ((dict) => {
        const arr = [];
        Object.entries(dict).forEach(([key, value]) => {
            arr.push(key);
            arr.push(value)
        });
        return arr;
    });

    const buttonLabels = dictionaryToArray(data);
    useConstructor(() => {
        setrandomizedLabels(randomizeThis(buttonLabels)); // Randomize only once
    });

    return (
        <div>
            {randomizedLabels && randomizedLabels.filter((item) => !guessed.includes(item)).map((value) => (
                <div key={value}>
                    <button key={value} onClick={() => handleButtonClick(value)} style={
                        {
                            backgroundColor: getColor(value, true),
                            color: getColor(value, false)
                        }}>
                        {value}
                    </button>&nbsp;
                </div>
            ))}
            {randomizedLabels && randomizedLabels.length === guessed.length && "Congratulations"}
        </div>
    );
}

const data = {
    Germany: "Berlin",
    Azerbaijan: "Baku",
}

ReactDOM.render(<CountryCapitalGame data={data} />, document.getElementById('root'));
