import React, { useEffect, useState } from 'react'
import "./App.css"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/Col';

import DraCor from "./data/dracor-hexagon.svg"

function DramaCard({
    title,
    setSelectedDama,
    selectedDama
}) {

    var retrieve_base_url = "https://dracor.org/api/v1/corpora/eng/plays/"

    const [drama, setDrama] = useState(null);


    useEffect(() => {
        fetch(retrieve_base_url + title)
            .then(response => response.json())
            .then(data => {
                setDrama(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
        , [title]);


    return (
        <>
            {drama && (
                <Card className={drama != null ? drama.normalizedGenre : ""} >
                    <Card.Title>{drama.title}</Card.Title>

                    <Card.Body>
                        <span>{drama.description}</span>
                        <span>Authors: {drama.author}</span>
                        <span>Genre: {drama.normalizedGenre}</span>
                        {drama.yearWritten && <span>Year written: {drama.yearWritten}</span>}
                        {drama.yearPrinted && <span>Year printed: {drama.yearPrinted}</span>}
                        {drama.yearPremiered && <span>Year premiered: {drama.yearPremiered}</span>}
                    </Card.Body>
                    <Row className="justify-content-center" style={{ margin: '10px' }}>


                        <Button className="btn btn-light mb-1" onClick={() => setSelectedDama(title)}>
                            Select
                        </Button>


                        {<Button className="btn btn-light mb-1" onClick={() => window.open(`https://dracor.org/eng/${title}`, "_blank")}>
                            <img
                                src={DraCor}
                                alt="DraCor"
                                style={{ width: '30px', height: '30px' }}
                            />
                        </Button>}


                        {drama.wikidataId && <Button className="btn btn-light" onClick={() => window.open(`https://www.wikidata.org/wiki/${drama.wikidataId}`, "_blank")}>Wikidata</Button>}

                    </Row>

                </Card>

            )}
            {!drama && (
                <div>
                    <h2>Loading...</h2>
                </div>
            )}

        </>
    )
}

export default DramaCard