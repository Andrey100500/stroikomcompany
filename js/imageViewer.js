document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('imageViewer');
    const fullImg = document.getElementById('fullImage');
    const captionText = document.getElementById('viewerCaption');
    
    let currentGallery = [];
    let currentIndex = 0;

    const showImage = (index, title) => {
        if (index < 0) index = currentGallery.length - 1;
        if (index >= currentGallery.length) index = 0;
        currentIndex = index;

        // Получаем путь маленькой картинки
        const smallSrc = currentGallery[currentIndex].src;
        
        // Формируем путь к большой картинке: вставляем /big/ перед именем файла
        // Пример: .../objects/9/1.webp -> .../objects/9/big/1.webp
        const bigSrc = smallSrc.replace(/([^/]+)$/, 'big/$1');

        fullImg.classList.add('img-changing');

        const tempImg = new Image();
        tempImg.src = bigSrc; // Грузим тяжелый файл
        
        tempImg.onload = () => {
            fullImg.src = bigSrc;
            captionText.innerHTML = `<span class="fw-bold text-uppercase">${title}</span><br>
                                    <small class="opacity-75">Фото ${currentIndex + 1} из ${currentGallery.length}</small>`;
            
            fullImg.classList.remove('img-changing');
        };

        // Обработка ошибки (если большой картинки нет, грузим маленькую)
        tempImg.onerror = () => {
            fullImg.src = smallSrc;
            fullImg.classList.remove('img-changing');
        };
    };

    const openViewer = (index, title) => {
        showImage(index, title);
        viewer.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closeViewer = () => {
        viewer.classList.remove('show');
        setTimeout(() => {
            if (!viewer.classList.contains('show')) {
                fullImg.src = "";
            }
        }, 300);
        document.body.style.overflow = 'auto';
    };

    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.ui-media-wrapper');
        if (!wrapper) return;

        const galleryContainer = wrapper.closest('[data-gallery-container]');
        if (!galleryContainer) return;

        currentGallery = Array.from(galleryContainer.querySelectorAll('.ui-map-img'));
        currentIndex = currentGallery.indexOf(wrapper.querySelector('img'));
        
        const projectItem = galleryContainer.closest('.ui-project-item');
        const sectionTitle = projectItem ? projectItem.querySelector('h2').innerText : "Объект";
        
        openViewer(currentIndex, sectionTitle);
    });

    const navigate = (step) => {
        const title = captionText.querySelector('.fw-bold').innerText;
        showImage(currentIndex + step, title);
    };

    document.querySelector('.next-image').onclick = (e) => { e.stopPropagation(); navigate(1); };
    document.querySelector('.prev-image').onclick = (e) => { e.stopPropagation(); navigate(-1); };
    document.querySelector('.close-viewer').onclick = closeViewer;
    viewer.onclick = (e) => { if (e.target === viewer) closeViewer(); };

    document.onkeydown = (e) => {
        if (!viewer.classList.contains('show')) return;
        if (e.key === "ArrowRight") navigate(1);
        if (e.key === "ArrowLeft") navigate(-1);
        if (e.key === "Escape") closeViewer();
    };
});