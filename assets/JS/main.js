/**
 * 1 Render songs
 * 2 Scroll top
 * 3 Play / pause / seek
 * 4 CD rotate
 * 5 Next / prev
 * 6 Ramdom
 * 7 Next / repeat when ended
 * 8 Active song
 * 9 Scroll active song into view
 * 10 Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const playList = $('.playList');
const heading = $('header h2');
const headingSinger = $('header h4');
const cdThumb = $('.cd-thumb')
const audio = $('#audio');

const progress = $('.progress');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const volumeBtn = $('.btn-volume');
const volumehandle = $('.volume');

var shuffleArray = [];

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSeeking: false,
    isVolume: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    config: {},
    songs: [
        {
            name: "Trên Tình Bạn Dưới Tình Yêu - MIN",
            singer: "MIN",
            path: "./assets/music/Song1-TrenTinhBanDuoiTinhYeu-MIN-6802163.mp3",
            image: "./assets/imgs/song1.png"
        },
        {
            name: "Phải Chăng Em Đã Yêu?",
            singer: "Juky San x REDT",
            path: "./assets/music/Song2-PhaiChangEmDaYeu-JukySanRedT-6940932.mp3",
            image: "./assets/imgs/song2.jpeg"
        },
        {
            name: "Lỡ Say Bye Là Bye ",
            singer: "Lemese x Changg",
            path: "./assets/music/Song3-LoSayByeLaBye-LemeseChangg-6926941.mp3",
            image: "./assets/imgs/song3-images.jpeg"
        },
        {
            name: "Sài Gòn Đau Lòng Quá",
            singer: "Hứa Kim Tuyền x Hoàng Duyên",
            path: "./assets/music/Song4-SaiGonDauLongQua-HuaKimTuyenHoangDuyen-6992977.mp3",
            image: "./assets/imgs/song4.jpeg"
        },
        {
            name: "Yêu Thầm",
            singer: "Hoàng Yến Chibi x tlinh x TDK",
            path: "./assets/music/Song5-YeuTham-HoangYenChibiTlinhTDK-6998347.mp3",
            image: "./assets/imgs/song5.jpeg"
        },
        {
            name: "Tình Yêu Màu Hồng ",
            singer: "Hồ Văn Quý x Xám",
            path: "./assets/music/Song6-TinhYeuMauHong-HoVanQuyXam-6914636.mp3",
            image: "./assets/imgs/song6.jpeg"
        },
        {
            name: "Chúng Ta Sau Này ",
            singer: "T.R.I",
            path: "./assets/music/Song7-ChungTaSauNay-TRI-6929586.mp3",
            image: "./assets/imgs/song7.jpeg"
        },
        {
            name: "Câu Hẹn Câu Thề",
            singer: "Đình Dũng x ACV",
            path: "./assets/music/Song8-CauHenCauThe-DinhDung-6994741.mp3",
            image: "./assets/imgs/song8.jpeg"
        },
        {
            name: "Dễ Đến Dễ Đi",
            singer: "Quang Hùng MasterD",
            path: "./assets/music/Song9-DeDenDeDi3-QuangHungMasterD-6791841.mp3",
            image: "./assets/imgs/song9.jpeg"
        },
        {
            name: "Sài Gòn Hôm Nay Mưa",
            singer: "JSOL x Hoàng Duyên",
            path: "./assets/music/Song10-SaiGonHomNayMua-JSOLHoangDuyen-7026537.mp3",
            image: "./assets/imgs/song10.jpeg"
        }
        
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const html = this.songs.map((song, index )=> {
            return `
                <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="ti-more-alt"></i>
                    </div>
                </div>
            `;
        })
        playList.innerHTML = html.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currenIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;
        const csWidth = cd.offsetWidth; 

        // Xử lý cd quay / dừng (CD rotate)
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity // iterations: số lần lặp
        })
        cdThumbAnimate.pause();

        // lắng nghe sk kéo crollTop thu nhỏ cd
        document.onscroll = function() {
            // không có c1 thì lấy c2
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = csWidth  - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / csWidth; 

            // tắt thanh volume khi cuộn trang
            if(_this.isVolume) {
                volume.classList.remove('open');
                _this.isVolume = !_this.isVolume;
            }
        }
        
        // xử lý click play
        playBtn.onclick = function() {
            if(_this.isPlaying) audio.pause();
            else audio.play();
        }

        // khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi song được pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // khi song run
        audio.ontimeupdate = function() {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;   
        }

        // xử lý khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
            if(e.target.value < 100) audio.play();
        }

        // xử lý next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            // _this.render();
            _this.scrollTopActiveSong();
        }

        // xử lý prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            // _this.render();
            _this.scrollTopActiveSong();
        }


        // xử lý random
        randomBtn.onclick = function() {
            _this.setConfig('isRandom', _this.isRandom);
            // thay đỗi ngược lại với chính nó
            _this.isRandom = !_this.isRandom; 
            //nếu isRandom true thì add / false thì remove
            randomBtn.classList.toggle('active', _this.isRandom);
        }   

        // xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                // repeat lại song
                audio.play();
            } else {
                // tự click btn khi end song
                nextBtn.click();
            }
        } 

        // xử lý repeat (lặp lại on e song)
        repeatBtn.onclick = function() {
            _this.setConfig('isRepeat', _this.isRepeat);
            _this.isRepeat = !_this.isRepeat; 
            //nếu isRepeat true thì add / false thì remove
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // lắng nghe click vào playList item
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const option = e.target.closest('.option');
            // xử lý khi click vào song
            if( songNode || option){
                // xử lí khi click vào song
                if(songNode) {
                    _this.currenIndex = Number(songNode.dataset.index);
                    _this.render();
                    _this.loadCurrentSong();
                    audio.play();
                }
                // xử lí khi click vào song option
                if(option) {

                }
            }
        }

        // lắng nghe click vào btn volume
        volumeBtn.onclick = function() {
            _this.isVolume = !_this.isVolume;
            volume.classList.toggle('open', _this.isVolume);
            if(_this.isVolume) {
                volumehandle.oninput= function(e) {
                    const volumeAudio = e.target.value / 100;
                    audio.volume = volumeAudio;
                }
            }
        }
        
    },

    // xử lý scroll active song into view (cuộn song vào view)
    scrollTopActiveSong: function() {
        setTimeout(()=> {
            // scrollIntoView cuộn vào view
            $('.song.active').scrollIntoView({
                behavior: "smooth", // chuyển động mượt
                block: "end",  // cuộn lên view
            });
        },300)

    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        headingSinger.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    // khi next song
    nextSong: function() {
        const songs = $$('.song');
        songs[this.currenIndex].classList.remove('active')

        this.currenIndex++;
        if(this.currenIndex >= this.songs.length) this.currenIndex = 0;
        
        songs[this.currenIndex].classList.add('active')
        this.loadCurrentSong();
    },

    // khi prev song
    prevSong: function() {
        const songs = $$('.song');
        songs[this.currenIndex].classList.remove('active')

        this.currenIndex--;
        if(this.currenIndex < 0) this.currenIndex = this.songs.length - 1;

        songs[this.currenIndex].classList.add('active')
        this.loadCurrentSong();
    },

    // khi random
    playRandomSong: function() {
        // let newIndex;
        // do {
        //     newIndex = Math.floor(Math.random() * this.songs.length);
        // } while(newIndex === this.currenIndex)
        // this.currenIndex = newIndex;
        // this.loadCurrentSong();
        const songs = $$('.song');
        songs[this.currenIndex].classList.remove('active')
        
        if (shuffleArray.length === 0) {
            shuffleArray = [...this.songs]; // Copy the songs array
            for (let i = shuffleArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]]; // Swap elements
            }
        }
        
        const newIndex = shuffleArray.pop();
        this.currenIndex = this.songs.indexOf(newIndex);
        songs[this.currenIndex].classList.add('active')
        this.loadCurrentSong();

    },

    // start run
    start: function() {
        // gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // định nghĩa các thuộc tính trong Object
        this.defineProperties();

        // lắng nghe / xử lí các sk (DOM Events)
        this.handleEvents();    

        // tải bài hát đầu tiên vào UI khi run
        this.loadCurrentSong();

        //Render playList
        this.render();

        // hiển thị trạng thái ban đầu của repeat anh random
        if(this.isRandom) randomBtn.classList.toggle('active', this.isRandom);
        if(this.isRepeat) repeatBtn.classList.toggle('active', this.isRepeat);
    }   
}
app.start();