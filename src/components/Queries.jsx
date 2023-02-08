import React, {useState , useEffect} from "react";

export default function Queries() {
    const [queries, setQueries] = useState([])
    const [keyword, setKeyword] = useState("")
    
    const onChange = (e) => {
        setKeyword(e.target.value)
    }
    const handleClick = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/trends', {
                method: "POST",
                body: JSON.stringify({keyword: keyword}),
                headers: {
                    "Content-type": "application/json"
                }
            })
            const data = await res.json()
            setQueries(data)
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div id="queries">
            <h1>{keyword}</h1>
            <div>
                <input type='text' value={keyword} onChange={onChange} />
                <button onClick={handleClick}>Search</button>
            </div>
            <ul>
                {
                    queries.map((item, index) => {
                        return <li key={item.value}>{item.query}</li>
                    })
                }
            </ul>
        </div>
    )

}