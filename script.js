/**
 * Husna & Sabil — Premium Interactive Wedding Invitation
 * Interactive logic:
 * 1. Opening name animation: animates smoothly on entrance and remains permanently fixed.
 * 2. Global tap-anywhere transition from Page One to Page Two.
 * 3. Smooth unblur & opacity transition of the shared photograph.
 * 4. IntersectionObserver scroll reveals for continuous timeline, venue, & closing notes.
 * 5. Return to cover toggle for reviewing the cinematic opening.
 */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const pageOne = document.getElementById('pageOne');
  const pageTwo = document.getElementById('pageTwo');
  const btnReturnToCover = document.getElementById('btnReturnToCover');
  const revealItems = document.querySelectorAll('.reveal-item');
  const welcomeContent = document.querySelector('.welcome-content');

  let isTransitioning = false;

  /**
   * Reset Page One opening animations so they replay and settle into fixed position
   */
  function replayCoverAnimations() {
    if (!welcomeContent) return;
    const animElements = welcomeContent.querySelectorAll(
      '.name-husna, .welcome-ampersand, .name-sabil, .animate-welcome-crest, .animate-welcome-lead, .animate-welcome-divider, .animate-welcome-text'
    );
    animElements.forEach(el => {
      const currentAnim = el.style.animation;
      el.style.animation = 'none';
      void el.offsetHeight; // trigger reflow
      el.style.animation = currentAnim;
    });
  }

  /**
   * Transition from Page One (Welcome Screen) to Page Two (Invitation Details)
   */
  function goToPageTwo() {
    if (isTransitioning || body.classList.contains('state-page-two')) return;
    isTransitioning = true;

    // Trigger transition state: begins unblurring photo & fading out page one
    body.classList.remove('state-page-one');
    body.classList.add('state-transitioning');

    // After animation duration, switch firmly to page-two state
    setTimeout(() => {
      body.classList.remove('state-transitioning');
      body.classList.add('state-page-two');
      isTransitioning = false;

      // Reset scroll position to top of page two
      if (pageTwo) {
        pageTwo.scrollTop = 0;
      }

      // Trigger reveal check for initial visible items in Page Two
      triggerScrollObserver();
    }, 850);
  }

  /**
   * Return from Page Two back to Page One (Welcome Screen)
   */
  function returnToCover(e) {
    if (e) {
      e.stopPropagation();
    }
    if (isTransitioning || body.classList.contains('state-page-one')) return;
    isTransitioning = true;

    body.classList.remove('state-page-two');
    body.classList.add('state-transitioning');

    setTimeout(() => {
      body.classList.remove('state-transitioning');
      body.classList.add('state-page-one');
      replayCoverAnimations();
      isTransitioning = false;
    }, 700);
  }

  /**
   * Event listeners for Page One (Tap anywhere)
   */
  if (pageOne) {
    // Pointer / Click event on the entire screen
    pageOne.addEventListener('click', () => {
      goToPageTwo();
    });

    // Touch event with active feedback
    pageOne.addEventListener('touchend', () => {
      goToPageTwo();
    }, { passive: true });

    // Keyboard accessibility (Enter or Spacebar)
    pageOne.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        goToPageTwo();
      }
    });
  }

  /**
   * Return to cover button listener
   */
  if (btnReturnToCover) {
    btnReturnToCover.addEventListener('click', returnToCover);
  }

  /**
   * Scroll Reveal Observer using IntersectionObserver
   */
  let observer = null;

  function initScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observerOptions = {
      root: pageTwo,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.1
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealItems.forEach(item => {
      observer.observe(item);
    });
  }

  function triggerScrollObserver() {
    if (observer && pageTwo) {
      revealItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          item.classList.add('revealed');
        }
      });
    }
  }

  // Initialize observer
  initScrollObserver();

  // Support direct URL navigation (e.g. ?page=2 or #pageTwo) for testing & sharing
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('page') === '2' || window.location.hash === '#pageTwo') {
    body.classList.remove('state-page-one');
    body.classList.add('state-page-two');
    revealItems.forEach(el => el.classList.add('revealed'));

    const scrollTarget = urlParams.get('scroll');
    if (scrollTarget === 'timeline') {
      setTimeout(() => {
        document.querySelector('.editorial-timeline')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 100);
    } else if (scrollTarget === 'day1') {
      setTimeout(() => {
        document.getElementById('eventDayOne')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 100);
    } else if (scrollTarget === 'day3') {
      setTimeout(() => {
        document.getElementById('eventDayThree')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 100);
    } else if (scrollTarget === 'venue') {
      setTimeout(() => {
        document.querySelector('.venue-section, #venueDetails')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 100);
    }
  }
});
