console.log("Opening listen");
let currSong = new Audio();

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    let songs =[];
    for (let i = 0; i < as.length; i++) {
        const elem = as[i];
        if(elem.href.endsWith(".mp3"))
        songs.push(elem.href.split("/songs/")[1]);
    }
    return songs;
}

const playMus = (track) => {
    // let audio = new Audio("/songs/" + track);
    // track.addEventListener("loadedmetadata",()=>{
    //     let durate = track.duration;
    // }) // failed exp
    currSong.src = "/songs/" + track;
    currSong.play();
    document.querySelector(".name1").innerHTML = `${track}`;
    document.querySelector(".duration").innerHTML = `${timeline}`;
}

let play = document.getElementById("play");
play.style.cursor = "pointer";

// let pause = document.createElement("div");
// div.innerHTML = <i class="fa-solid fa-pause"></i>;


function timeConvert(seconds){
    if(isNaN(seconds) || seconds<0){
        return "Invalid input";
    }
    const mins = Math.floor(seconds / 60);
    const remSeconds = Math.floor(seconds % 60);

    const formattedmins = String(mins).padStart(2,'0');
    const formattedSeconds = String(remSeconds).padStart(2,'0');

    return `${formattedmins}:${formattedSeconds}`;
}


async function main(){
    let song = await getSongs();
    console.log(song);

    let ulist = document.querySelector(".songlists").getElementsByTagName("ul")[0];
    for (const s of song) {
        ulist.innerHTML = ulist.innerHTML + `
                    <li>
                  <div class="lists">
                    <div class="name">
                        ${s.replaceAll("%20"," ")} 
                    </div>
                  </div>
                </li>`;
    }
    // var audio = new Audio(song[0]);
    // // audio.play();

    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",elem=>{
            console.log(e.querySelector(".lists").firstElementChild.innerHTML);
            playMus(e.querySelector(".lists").firstElementChild.innerHTML.trim());
        });
    });

    play.addEventListener("click",() => {
        if(currSong.paused){
            currSong.play();
            play.src = pause;          
        }else{
            currSong.pause();
            play.src = play;
        }
    })

    currSong.addEventListener("timeupdate",()=>{
        // let timeline = (currSong.currentTime,currSong.duration);
        document.querySelector(".duration").innerHTML = `${timeConvert(currSong.currentTime)} / ${timeConvert(currSong.duration)}`;
        document.querySelector(".circle").style.left = (currSong.currentTime/currSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let perc = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = perc + "%";
        console.log(currSong.currentTime = ((currSong.duration) * perc)/100);
    })

    document.querySelector(".menu").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0%";
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    document.querySelector(".volu").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e);
        currSong.volume = parseInt(e.target.value)/100;
    })
}

main()