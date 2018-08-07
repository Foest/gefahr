function checkResponse(userResponse, correctResponse) {
    return levenshtein(userResponse, correctResponse) <= 3 ? true : false;
}

function minThree(a, b, c){
    let min = a;
    if(b < min) min = b;
    if(c < min) min = c;
    return min;
}

function levenshtein(s1, s2) {
    //Remove non-alphanumeric and set lowercase
    const str1 = s1.toLowerCase().replace(/\W/g, '');
    const str2 = s2.toLowerCase().replace(/\W/g, '');
    const n = str1.length;
    const m = str2.length;
    let matrix = new Array(n + 1);
    for(var z = 0; z < matrix.length; z++){
        matrix[z] = new Array(m + 1);
    }
    let cost;

    if (n === 0) return m;
    if (m === 0) return n;

    for (var i = 0; i <= n; i++) {
        matrix[i][0] = i;
    }
    for (var j = 0; j <= m; j++) {
        matrix[0][j] = j;
    }

    for(var i = 1; i <= n; i++){
        for(j = 1; j <= m; j++){
            if(str1[i-1] === str2[j-1]){
                cost = 0;
            } else {
                cost = 1;
            }
            matrix[i][j] = minThree(matrix[i-1][j] + 1, matrix[i][j-1] + 1, matrix[i-1][j-1] + cost);
        }
    }
    return matrix[n][m];
}