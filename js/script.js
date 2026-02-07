document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('navMenu');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    });

    burger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    const audio = new Audio();
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const currentTrackEl = document.getElementById('currentTrack');
    const playlistItems = document.querySelectorAll('.playlist-item');

    let currentTrackIndex = 0;
    let isPlaying = false;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadTrack(index) {
        const track = playlistItems[index];
        if (!track) return;

        const trackName = track.querySelector('.track-name').textContent;
        const trackSrc = track.getAttribute('data-src');

        currentTrackEl.textContent = trackName;
        audio.src = trackSrc;

        playlistItems.forEach(item => item.classList.remove('active'));
        track.classList.add('active');
    }

    function playTrack() {
        if (audio.src) {
            audio.play();
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    prevBtn.addEventListener('click', function() {
        currentTrackIndex--;
        if (currentTrackIndex < 0) {
            currentTrackIndex = playlistItems.length - 1;
        }
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    });

    nextBtn.addEventListener('click', function() {
        currentTrackIndex++;
        if (currentTrackIndex >= playlistItems.length) {
            currentTrackIndex = 0;
        }
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    });

    audio.addEventListener('timeupdate', function() {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', function() {
        nextBtn.click();
    });

    progressBar.addEventListener('click', function(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    playlistItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
    });

    const uploadZone = document.getElementById('uploadZone');
    const audioInput = document.getElementById('audioInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const playlist = document.getElementById('playlist');

    uploadBtn.addEventListener('click', function() {
        audioInput.click();
    });

    uploadZone.addEventListener('click', function(e) {
        if (e.target === uploadZone || e.target.classList.contains('upload-text')) {
            audioInput.click();
        }
    });

    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    audioInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        for (let file of files) {
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                addToPlaylist(file.name.replace(/\.[^/.]+$/, ""), url);
            }
        }
    }

    function addToPlaylist(name, src) {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.setAttribute('data-src', src);
        li.innerHTML = `
            <div class="track-info">
                <i class="fas fa-music"></i>
                <span class="track-name">${name}</span>
            </div>
            <i class="fas fa-play"></i>
        `;

        li.addEventListener('click', function() {
            const items = document.querySelectorAll('.playlist-item');
            currentTrackIndex = Array.from(items).indexOf(this);
            loadTrack(currentTrackIndex);
            playTrack();
        });

        playlist.appendChild(li);
    }

    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const addVideoBtn = document.getElementById('addVideoBtn');
    const videoInput = document.getElementById('videoInput');
    const uploadVideoBtn = document.getElementById('uploadVideoBtn');
    const videoList = document.getElementById('videoList');
    const videoContainer = document.getElementById('videoContainer');

    addVideoBtn.addEventListener('click', function() {
        const url = youtubeUrlInput.value.trim();
        if (url) {
            const embedUrl = convertToEmbedUrl(url);
            if (embedUrl) {
                addVideo('YouTube видео', embedUrl, 'youtube');
                youtubeUrlInput.value = '';
            }
        }
    });

    youtubeUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addVideoBtn.click();
        }
    });

    function convertToEmbedUrl(url) {
        let videoId = null;

        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            return url;
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return null;
    }

    uploadVideoBtn.addEventListener('click', function() {
        videoInput.click();
    });

    videoInput.addEventListener('change', function() {
        for (let file of this.files) {
            if (file.type.startsWith('video/')) {
                const url = URL.createObjectURL(file);
                addVideo(file.name.replace(/\.[^/.]+$/, ""), url, 'local');
            }
        }
    });

    function addVideo(name, src, type) {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.setAttribute('data-src', src);
        div.setAttribute('data-type', type);

        div.innerHTML = `
            <div class="video-thumbnail">
                <i class="fab fa-${type === 'youtube' ? 'youtube' : 'video'}"></i>
            </div>
            <div class="video-info">
                <h4>${name}</h4>
                <p>${type === 'youtube' ? 'YouTube' : 'Локальное видео'}</p>
            </div>
        `;

        div.addEventListener('click', function() {
            playVideo(src, type);
        });

        videoList.appendChild(div);
    }

    function playVideo(src, type) {
        const items = document.querySelectorAll('.video-item');
        items.forEach(item => item.classList.remove('active'));

        const activeItem = Array.from(items).find(item => item.getAttribute('data-src') === src);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        if (type === 'youtube') {
            videoContainer.innerHTML = `
                <iframe src="${src}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        } else {
            videoContainer.innerHTML = `
                <video controls autoplay>
                    <source src="${src}" type="video/mp4">
                    Ваш браузер не поддерживает видео.
                </video>
            `;
        }
    }

    const existingVideos = document.querySelectorAll('.video-item');
    existingVideos.forEach(video => {
        video.addEventListener('click', function() {
            const src = this.getAttribute('data-src');
            const type = 'youtube';
            playVideo(src, type);
        });
    });

    function init() {
        loadTrack(0);
    }

    init();
});