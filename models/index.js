exports.wrapper = function() {
    
    var obj = {
        isSuccessful : true,
        message : null,
        data : {}
    }
    
    return obj;
}

exports.url = function() {
    var obj = {
        shortCode : null,
        userId : null,
        createDate : null,
        accessedDate : null,
        longUrl : null,
        shortUrl : null,
        hitCount : 0
    }

    return obj;
}