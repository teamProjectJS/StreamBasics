module.exports = function timer() {
    const interval = setInterval(()=>{
        const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
                if(memory <= 30) {
                    return console.log(`The script uses ${memory} Mb`);
                }
                    return new Error('Memory usage > 30 Mb');

    },300);

set Timeout(()=>{
        clearInterval(interval);

    },1000);
    // return new Promise((resolve, reject) => {
    //     const interval = setInterval(() => {
    //         const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    //         if(memory <= 30){
    //             resolve(memory);
    //         }
    //         else{
    //             reject(new Error('Memory usage > 30 Mb'));
    //         }
    //     }, 300)
    // }).then ((memory) => {
    //     console.log(`The script uses ${memory} Mb`);
    // })
};

