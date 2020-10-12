// use event listener - i only want the contents pf this file to run only once
document.addEventListener('DOMContentLoaded',() =>{
    const grid = document.querySelector('.grid') // querySelector - java scripit method which lets you pick elements from html
    const doodler = document.createElement('div') // create an element(div here) not already present
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0


    function createDoodler(){
        grid.appendChild(doodler) // put in a child into the element
        doodler.classList.add('doodler') // add doodler css style
        doodlerLeftSpace = platforms[0].left
        //doodlerBottomSpace = platforms[0].bottom
        //move doodler
        doodler.style.left = doodlerLeftSpace+'px'
        doodler.style.bottom = doodlerBottomSpace+'px'
    }
    class Platform{
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom
            this.left = Math.random()*315 // generate platform left spacing randomly
            this.visual = document.createElement('div') // create a div for each platform

            const visual = this.visual;
            visual.classList.add('platform')//add platform style
            visual.style.left = this.left+'px'
            visual.style.bottom = this.bottom+'px'
            grid.appendChild(visual) // append platform visual to the grid
        }
    }
    function createPlatforms(){
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatformBottom = 100+ (i*platformGap)
            platforms.push(new Platform(newPlatformBottom))
        }
        console.log(platforms)
    }
    function movePlatforms(){
        // move only if near to the top position
        if(doodlerBottomSpace > 200){
            platforms.forEach(platform =>{
                platform.bottom-=4    // decrease the platform variable
                let visual = platform.visual
                visual.style.bottom = platform.bottom +'px' //move the platform down
                //removing platforms from bottom and adding new one's at the top
                if (platform.bottom < 10 ){
                    let firstPlatform = platforms[0].visual
                    // classlist -  method to add and remove elements to div
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform  = new Platform(600)
                    platforms.push(newPlatform)

                }
            } )
        }
    }
    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20 //increase space
            doodler.style.bottom = doodlerBottomSpace + 'px' // and apply to element
            if (doodlerBottomSpace > startPoint+200 | doodlerBottomSpace > 600){
                fall()
            }
        },30)
    }

    function fall() {
        clearInterval(upTimerId) // method to clear the interval. once started falling dont go up
        isJumping = false
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px' //decrease and apply to element
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            //check for landing on paltform to be able to jump again
            platforms.forEach(platform =>{
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom +15) &&
                    (doodlerLeftSpace+60 >=platform.left) &&
                    (doodlerLeftSpace <= platform.left+ 85 ) &&
                    !isJumping
                ) {
                    console.log("landed")
                    startPoint = doodlerBottomSpace //reset the starting point if we hit a platform
                    jump()
                }
            })
        },30)
    }   

    function gameOver() {
        console.log('game over')
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(downTimerId)
        clearInterval(upTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        isGoingRight = false
        isGoingLeft = false
    }

    function control (e) {
        // user keyboard event
        if(e.key === "ArrowLeft") {
            //move left
            moveLeft()
        } else if (e.key === "ArrowRight") {
            // move right
            moveRight()
        } else if (e.key === "ArrowUp") {
            // move up
        }
    }

    function moveLeft () {
        if (isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        } 
        isGoingLeft = true
        // clearInterval(leftTimerId)
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace > 0) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
            
        },30)
    }
    function moveRight () {
        if (isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        } 
        isGoingRight = true
        // clearInterval(rightTimerId)
        rightTimerId = setInterval(function() { 
            if (doodlerLeftSpace <= 340 ) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else moveLeft()
        },30)
    }

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)

    }

    // doodler appearences control
    function start(){
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,30) // this method runs the moveplatforms every 30ms
            jump()
            document.addEventListener('keyup',control)

        }   
    }
    //??????attach to a button later
    start()
})