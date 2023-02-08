const googleTrends = require('google-trends-api');


function getTrends(req, res) {
    const { keyword } = req.body;
    googleTrends.relatedQueries({ keyword: keyword })
        .then(function (results) {
            return JSON.parse(results)
        })
        .then(data => {
            const filtered = data.default.rankedList[0].rankedKeyword.map( n => {
                return {
                    query: n.query,
                    value: n.value
                }
            })
            res.json(filtered)
        })
        .catch(function (err) {
            console.error('Oh no there was an error', err);
            res.status(500).json({
                message: 'Something went wrong'
            })
        });

}

module.exports = getTrends