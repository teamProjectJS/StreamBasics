module.exports = function timer() {
    const memorySize = 30;
       interval = setInterval(() => {
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
            if(usedMemory <= memorySize){
                return console.log(usedMemory);
            }
            return new Error(`Memory usage > ${memorySize} Mb`);
    },300);
};

