function getDate(){
    const dateElements = new Date().toLocaleDateString().split('.');
    const buffer = dateElements[0];
    dateElements[0] = dateElements[2];
    dateElements[2] = buffer;
    return dateElements.join('-');
}

export default getDate;