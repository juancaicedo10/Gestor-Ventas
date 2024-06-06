module.exports = function paginate(data, page, limit) {
    const startIndex = (parseInt(page) - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < data.length) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    results.results = data.slice(startIndex, endIndex);

    return results.results;
}

//hola