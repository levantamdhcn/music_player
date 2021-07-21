const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn.btn-next')
const prevBtn = $('.btn.btn-prev')
const randomBtn = $('.btn.btn-random')
const repeatBtn = $('.btn-repeat')
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: 'Happy For You',
            singger: 'Lukas Graham, Vũ.',
            path: './assets/music/song1.mp3',
            image: './assets/imgs/song1.jpg',
        },
        {
            name: 'Đợi',
            singger: 'Vũ.',
            path: './assets/music/song2.mp3',
            image: './assets/imgs/song2.jpg',
        },
        {
            name: 'Đông Kiếm Em',
            singger: 'Vũ.',
            path: './assets/music/song3.mp3',
            image: './assets/imgs/song3.jpg',
        },
        {
            name: 'Còn Anh',
            singger: 'Vũ.',
            path: './assets/music/song4.mp3',
            image: './assets/imgs/song4.jpg',
        },
        {
            name: 'Em Là Ai',
            singger: 'Vũ.',
            path: './assets/music/song5.mp3',
            image: './assets/imgs/song5.jpg',
        },
        {
            name: 'Chuyện Những Người Yêu Xa',
            singger: 'Vũ.',
            path: './assets/music/song6.mp3',
            image: './assets/imgs/song6.jpg',
        },
        {
            name: 'Hành Tinh Song Song',
            singger: 'Vũ.',
            path: './assets/music/song7.mp3',
            image: './assets/imgs/song7.jpg',
        }
    ],
    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singger}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('\n')
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function(){
        const cdWidth = cd.offsetWidth
        const _this = this

        // Xử lý CD
        // const cdThumbAnimate = cdThumb.animate([
        //     { transfrom: 'rotate(360deg)' }
        // ], {
        //     duration: 10000,
        //     iterations: Infinity    
        // })

        // cdThumbAnimate.pause()

        // Xử lý thu phóng CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop 
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xử lý click nút play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }

            // Xử lý tua 
            progress.onchange = function(e){
                const seekTime = Math.floor(audio.duration * e.target.value / 100)
                audio.currentTime = seekTime
            }

        }
        //Xử lý tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Khi bài hát đang phát
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            // cdThumbAnimate.play()
        }
        
        // Khi bài hát đã dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            // cdThumbAnimate.pause()
        }
        //Xử lý next bài
        nextBtn.onclick = function() {
            if ($('.btn.btn-random.active')){
                _this.playRandomSong()
                
            }
            else {
                _this.nextSong()
            }
            _this.render()
            audio.play()
            _this.scrollToActiveSong()
        }

        //Xử lý lùi bài
        prevBtn.onclick = function() {
            if ($('.btn.btn-random.active')){
                _this.playRandomSong()
                _this.render()
            }
            else {
                _this.prevSong()
                _this.render()
            }
            audio.play()
        }

        randomBtn.onclick = function() {
            if($('.btn.btn-random.active')){
                randomBtn.classList.remove('active')
            }
            else {
                randomBtn.classList.add('active')
            }
        }

        //Xử lý lặp lại khi hết bài
        audio.onended = function() {
            if ($('.btn.btn-repeat.active')){
                audio.play()
            }
            else if ($('.btn.btn-random.active')) {
                _this.playRandomSong()
                _this.render()
            }
            else {
                _this.nextSong()
                _this.render()
            }    
            audio.play()
        }

        //Xử lý phát lặp lại 1 bài hát 
        repeatBtn.onclick = function() {
            if($('.btn.btn-repeat.active')){
                repeatBtn.classList.remove('active')
            }
            else {
                repeatBtn.classList.add('active')
                audio.play()
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },10)

    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        if(this.currentIndex != 0){
            this.currentIndex--;
        }
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
        } while(randomIndex === this.currentIndex)
        this.currentIndex = randomIndex
        this.loadCurrentSong()
        audio.play()
    },
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe và xử lý các sự kiện
        this.handleEvent()
        
        //Tải bài hát hiện tại vào trình phát
        this.loadCurrentSong()

        // Render lại danh sách bài hát
        this.render()
        
    }
}

app.start()