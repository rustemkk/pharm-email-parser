print = (message) => {
    console.log((new Date()).toLocaleTimeString() + ' - ' + message);
};

module.exports = print;