(function(){
    const wheel = document.getElementById('wheel')
    const button =  document.querySelectorAll('.spin')

    let deg = 0

    button.forEach((e) => { 
        e.addEventListener('click', () =>{
            deg = Math.floor(5500 + Math.random() * 5000)
            wheel.style.transition = 'all 7s ease-out'
            wheel.style.transform = `rotate(${deg}deg)`
        })
    })

    wheel.addEventListener('click', () =>{
        wheel.style.transition = 'none'
        const actualDeg = deg % 360
        wheel.style.transform = `rotate(${actualDeg}deg)`
    })

})()