function toggleMenu() {
  const element = document.querySelector('aside');
  element.classList.toggle('open');
}

(function () {
  const aside = document.querySelector('aside');
  let currentAnchor = '';
  const anchorPositions = {};
  const navList = document.querySelector('nav').querySelectorAll('a');
  const hash = location.hash;
  const bodyTop = document.body.getBoundingClientRect().top;
  function changeAnchor() {
    navList.forEach((el) => {
      const id = el.hash.substring(1);
      if (id === currentAnchor) {
        el.classList.add('active');
        if (history.pushState) {
          history.pushState(null, null, el.hash);
        }
      } else {
        el.classList.remove('active');
      }
    });
  }
  function getClosest(currentTop) {
    let dist = null;
    let closest = '';
    Object.entries(anchorPositions).map(([id, top]) => {
      if (dist === null || (0 < currentTop - top && currentTop - top < dist)) {
        dist = currentTop - top;
        closest = id;
      }
    });
    // console.log(dist, closest);
    return closest;
  }
  navList.forEach((el) => {
    const id = el.hash.substring(1);
    const target = document.getElementById(id);
    if (target) {
      anchorPositions[id] = target.getBoundingClientRect().top - bodyTop;
    }
    ['touchstart', 'click'].map((type) =>
      el.addEventListener(type, (event) => {
        event.preventDefault();
        if (window.innerWidth <= 768) {
          aside.classList.remove('open');
        }
        if (history.pushState) {
          history.pushState(null, null, el.hash);
        }
        window.scrollTo({
          behavior: 'smooth',
          top:
            target?.getBoundingClientRect().top -
              document.body.getBoundingClientRect().top ?? 0,
        });
      })
    );
    if (el.hash === hash) {
      el.classList.add('active');
      currentAnchor = id;
    }
  });
  let ticking = false;
  ['scroll', 'resize'].map((event) =>
    document.addEventListener(event, function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const anchor = getClosest(window.scrollY + 10);
          if (anchor !== currentAnchor) {
            currentAnchor = anchor;
            changeAnchor();
          }
          ticking = false;
        });
        ticking = true;
      }
    })
  );
})();
