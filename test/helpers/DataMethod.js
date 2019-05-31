
const MathTool = require('./MathTool');

function createData(sourceData, lengthMin = 2, lengthMax = sourceData.length, repeat = false){ 
    let dataList = [];

    lengthMax = sourceData.length > lengthMax ? lengthMax : sourceData.length;
    lengthMax = lengthMin < lengthMax ? lengthMax : lengthMin;
    lengthMin = lengthMin < lengthMax ? lengthMin : lengthMax;

    if (lengthMax <= 0)
        return dataList;

    var listIndex = 0;
    for (let index = 0; index < lengthMax; index++) {

        listIndex = MathTool.randomNum(0,sourceData.length - 1);
        if(!repeat && dataList.indexOf(sourceData[listIndex]) >=0){
            index--;
            continue;
        }
        dataList[dataList.length] = sourceData[listIndex];

        if(index == MathTool.randomNum(lengthMin, lengthMax))
            break; 
    }
    return dataList;
}

function createIndex(sourceData, lengthMin = 2, lengthMax = sourceData.length, repeat = false){ 
    let dataList = [];

    lengthMax = sourceData.length > lengthMax ? lengthMax : sourceData.length;
    lengthMax = lengthMin < lengthMax ? lengthMax : lengthMin;
    lengthMin = lengthMin < lengthMax ? lengthMin : lengthMax;

    if (lengthMax <= 0)
        return dataList;

    var listIndex = 0;
    for (let index = 0; index < lengthMax; index++) {

        listIndex = MathTool.randomNum(0,sourceData.length - 1);
        if(!repeat && dataList.indexOf(listIndex) >=0){
            index--;
            continue;
        }
        dataList[dataList.length] = listIndex;

        if(index == MathTool.randomNum(lengthMin, lengthMax))
            break; 
    }
    return dataList;
}

module.exports = {
    createData            : createData,
    createIndex           : createIndex
};