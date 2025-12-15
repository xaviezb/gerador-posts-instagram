// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
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
    if (savedProfilePic) {
        profileImg.src = savedProfilePic;
    }

    // Atualizar foto de perfil em tempo real
    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImg.src = e.target.result;
                localStorage.setItem('profilePic', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Atualizar texto em tempo real
    postTextInput.addEventListener('input', function() {
        textDisplay.textContent = this.value;
    });

    // Atualizar tipo de post em tempo real
    postTypeSelect.addEventListener('change', function() {
        if (this.value) {
            typeDisplay.textContent = '- ' + this.value;
        } else {
            typeDisplay.textContent = '';
        }
    });

    // Upload mídia do post (imagem ou vídeo) em tempo real
    postMediaInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            postMediaFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                if (file.type.startsWith('video/')) {
                    isVideo = true;
                    postImg.style.display = 'none';
                    postVideo.style.display = 'block';
                    postVideo.src = e.target.result;
                    imageControls.style.display = 'none'; // Sem crop para vídeos
                } else {
                    isVideo = false;
                    postVideo.style.display = 'none';
                    postImg.style.display = 'block';
                    postImg.src = e.target.result;
                    imageControls.style.display = 'block';
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(postImg, {
                        aspectRatio: NaN, // Livre
                        viewMode: 1,
                        responsive: true,
                        restore: false,
                        checkCrossOrigin: false,
                        checkOrientation: false,
                        modal: true,
                        guides: true,
                        center: true,
                        highlight: false,
                        background: false,
                        autoCrop: true,
                        autoCropArea: 1,
                        movable: true,
                        rotatable: true,
                        scalable: true,
                        zoomable: true,
                        zoomOnTouch: true,
                        zoomOnWheel: true,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        toggleDragModeOnDblclick: true,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Botão de crop (apenas para imagens) - atualiza em tempo real após crop
    cropBtn.addEventListener('click', function() {
        if (cropper && !isVideo) {
            const canvas = cropper.getCroppedCanvas();
            postImg.src = canvas.toDataURL();
            cropper.destroy();
            cropper = null;
        }
    });

    // Upload marca d'água em tempo real
    watermarkImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                watermarkImg.src = e.target.result;
                watermarkControls.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Controles da marca d'água em tempo real
    watermarkActive.addEventListener('change', function() {
        watermarkImg.style.display = this.checked ? 'block' : 'none';
    });

    watermarkSize.addEventListener('input', function() {
        watermarkImg.style.maxWidth = this.value + 'px';
    });

    watermarkOpacity.addEventListener('input', function() {
        watermarkImg.style.opacity = this.value;
    });

    watermarkPosition.addEventListener('change', function() {
        watermarkImg.className = ''; // Reset classes
        switch (this.value) {
            case 'bottom-right':
                watermarkImg.style.bottom = '15px';
                watermarkImg.style.right = '15px';
                watermarkImg.style.top = 'auto';
                watermarkImg.style.left = 'auto';
                break;
            case 'bottom-left':
                watermarkImg.style.bottom = '15px';
                watermarkImg.style.left = '15px';
                watermarkImg.style.top = 'auto';
                watermarkImg.style.right = 'auto';
                break;
            case 'top-right':
                watermarkImg.style.top = '15px';
                watermarkImg.style.right = '15px';
                watermarkImg.style.bottom = 'auto';
                watermarkImg.style.left = 'auto';
                break;
            case 'top-left':
                watermarkImg.style.top = '15px';
                watermarkImg.style.left = '15px';
                watermarkImg.style.bottom = 'auto';
                watermarkImg.style.right = 'auto';
                break;
        }
    });

    // Seletor de formato em tempo real
    formatSelect.addEventListener('change', function() {
        const mediaContainer = document.querySelector('.media-container');
        if (this.value === '1:1') {
            preview.style.maxWidth = '500px';
            mediaContainer.style.height = '300px';
        } else { // 16:9
            preview.style.maxWidth = '600px';
            mediaContainer.style.height = '337.5px'; // 600 * 9/16
        }
    });

    // Exportar PNG
    exportBtn.addEventListener('click', function() {
        if (!postMediaFile) {
            alert('Por favor
