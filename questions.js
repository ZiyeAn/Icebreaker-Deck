function generateStars(element, count, size) {
    let boxShadow = '';
    for(let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        boxShadow += `${x}px ${y}px #FFF`;
        if(i < count - 1) boxShadow += ', ';
    }
    element.style.boxShadow = boxShadow;
}

document.addEventListener('DOMContentLoaded', () => {
    // Generate stars
    generateStars(document.getElementById('stars'), 700);
    generateStars(document.getElementById('stars2'), 200);
    generateStars(document.getElementById('stars3'), 100);

    const cards = document.querySelectorAll('.question-card');
    let currentIndex = 2; // Start with middle card
    let isSpinning = true;
    let spinSpeed = 200; // Initial speed (ms between switches)
    const maxSpinSpeed = 200; // Fastest speed
    const minSpinSpeed = 800; // Slowest speed before stop
    let spinTimer;

    function updateCardPositions() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'left', 'right', 'far-left', 'far-right');

            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === cards.length - 1)) {
                card.classList.add('left');
            } else if (index === currentIndex - 2 || (currentIndex === 0 && index === cards.length - 2) || (currentIndex === 1 && index === cards.length - 1)) {
                card.classList.add('far-left');
            } else if (index === currentIndex + 1 || (currentIndex === cards.length - 1 && index === 0)) {
                card.classList.add('right');
            } else if (index === currentIndex + 2 || (currentIndex === cards.length - 2 && index === 0) || (currentIndex === cards.length - 1 && index === 1)) {
                card.classList.add('far-right');
            }
        });
    }

    function scrollNext() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCardPositions();
    }

    function scrollPrev() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCardPositions();
    }

    // Initial automatic spinning animation
    function startSpinning() {
        let duration = 0;
        const totalDuration = 3000; // 3 seconds
        const speedIncrement = (minSpinSpeed - maxSpinSpeed) / (totalDuration / maxSpinSpeed);

        function spin() {
            scrollNext();
            duration += spinSpeed;
            
            if (duration < totalDuration) {
                // Gradually increase the interval (slow down)
                spinSpeed = Math.min(minSpinSpeed, spinSpeed + speedIncrement);
                spinTimer = setTimeout(spin, spinSpeed);
            } else {
                // Stop at random card after 3 seconds
                const randomSpins = Math.floor(Math.random() * cards.length);
                let spinsLeft = randomSpins;
                
                function finalSpins() {
                    if (spinsLeft > 0) {
                        scrollNext();
                        spinsLeft--;
                        setTimeout(finalSpins, minSpinSpeed);
                    } else {
                        isSpinning = false;
                        enableInteraction();
                    }
                }
                
                finalSpins();
            }
        }

        spin();
    }

    // Disable all interactions during initial spin
    function disableInteraction() {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        cards.forEach(card => card.style.pointerEvents = 'none');
    }

    // Enable interactions after spin
    function enableInteraction() {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        cards.forEach(card => card.style.pointerEvents = 'auto');
    }

    // Event handler functions
    function handleKeyPress(e) {
        if (isSpinning) return;
        if (e.key === 'ArrowLeft') scrollPrev();
        if (e.key === 'ArrowRight') scrollNext();
    }

    function handleWheel(e) {
        if (isSpinning) return;
        if (e.deltaY > 0) {
            scrollNext();
        } else {
            scrollPrev();
        }
    }

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        if (isSpinning) return;
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        if (isSpinning) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                scrollPrev();
            } else {
                scrollNext();
            }
        }
    }

    // Initialize
    updateCardPositions();
    disableInteraction();
    startSpinning();

    // Click handlers for cards
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (isSpinning) return;
            if (index < currentIndex || (currentIndex === 0 && index === cards.length - 1)) {
                scrollPrev();
            } else if (index > currentIndex || (currentIndex === cards.length - 1 && index === 0)) {
                scrollNext();
            }
        });
    });
});