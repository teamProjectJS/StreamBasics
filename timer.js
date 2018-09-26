module.exports = function timer() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
            if(memory <= 30){
                resolve (memory);
            }
            else{
                reject(new Error('Memory usage > 30 Mb'));
            }
        }, 300)
    }).then ((memory) => {
        console.log(`The script uses ${memory} Mb`);
    })
};

