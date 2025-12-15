document.addEventListener('DOMContentLoaded', function() {
    const profilePicInput = document.getElementById('profile-pic');
    const postTextInput = document.getElementById('post-text');
    const postMediaInput = document.getElementById('post-media');
    const postTypeSelect = document.getElementById('post-type');
    const watermarkImageInput = document.getElementById('watermark-image');
    const formatSelect = document.getElementById('format-select');
    const preview = document.getElementById('preview');
    const profileImg = document.getElementById('profile-img');
    const textDisplay = document.getElementById('text-display');
    const typeDisplay = document.getElementById('type-display');
    const postImg = document.getElementById('post-img');
    const postVideo = document.getElementById('post-video');
    const watermarkImg = document.getElementById('watermark-img');
    const imageControls = document.getElementById('image-controls');
    const cropBtn = document.getElementById('crop-btn');
    const watermarkControls = document.getElementById('watermark-controls');
    const watermarkActive = document.getElementById('watermark-active');
    const watermarkSize = document.getElementById('watermark-size');
    const watermarkOpacity = document.getElementById('watermark-opacity');
    const watermarkPosition = document.getElementById('watermark-position');
    const exportBtn = document.getElementById('export-btn');

    let cropper = null;
    let postMediaFile = null;
    let isVideo = false;

    // Carregar foto de perfil do localStorage
    const savedProfilePic = localStorage.getItem('profilePic');
    if (savedProfilePic) profileImg.src = savedProfilePic;

    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                profileImg.src = ev.target.result;
                localStorage.setItem('profilePic', ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    postTextInput.addEventListener('input', function() {
        textDisplay.textContent = this.value;
    });

    postTypeSelect.addEventListener('change', function() {
        typeDisplay.textContent = this.value ? '- ' + this.value : '';
    });

    postMediaInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        postMediaFile = file;
        const reader = new FileReader();
        reader.onload = function(ev) {
            if (file.type.startsWith('video/')) {
                isVideo = true;
                postImg.style.display = 'none';
                postVideo.style.display = 'block';
                postVideo.src = ev.target.result;
                imageControls.style.display = 'none';
            } else {
                isVideo = false;
                postVideo.style.display = 'none';
                postImg.style.display = 'block';
                postImg.src = ev.target.result;
                imageControls.style.display = 'block';
                if (cropper) cropper.destroy();
                cropper = new Cropper(postImg, { viewMode: 1 });
            }
        };
        reader.readAsDataURL(file);
    });

    cropBtn.addEventListener('click', function() {
        if (cropper && !isVideo) {
            const canvas = cropper.getCroppedCanvas();
            postImg.src = canvas.toDataURL();
            cropper.destroy();
            cropper = null;
        }
    });

    watermarkImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                watermarkImg.src = ev.target.result;
                watermarkControls.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    watermarkActive.addEventListener('change', function() {
        watermarkImg.style.display = this.checked
