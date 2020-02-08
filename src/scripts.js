window.addEventListener("load", function initMixer() {
  mixer.socket.on("event", handleEvents);
  mixer.isLoaded();
});

console.clear();
console.log("Start");
setInterval(() => {
  if (!vis && !isrunning) {
    $(".team").toggleClass("animated");
  }
}, 5000);
let vis = false;
let isrunning = false;
let changingteams = false;
let data = { hasteam: false, lastupdate: Date.now() };

var vue = new Vue({
  el: "#app",
  data: data,
  methods: {
    clicked: function(el) {
      console.log(el);
      mixer.socket.call(
        "giveInput",
        {
          controlID: "team",
          event: "mousedown",
          member: el
        },
        true
      );
    },
    toggle: function() {
      toggleCards();
    }
  }
});

function handleEvents(event) {
  switch (event.type) {
    case "startingoptions":
      console.log("Got new team");
      console.log(event.teamdata);
      if (vis) {
        changingteams = true;
        closeCards(event);
      } else {
        vue.hasteam = false;
        vue.team = event.teamdata.team;
        vue.members = event.teamdata.members;
        vue.hasteam = true;
        runonce = false;
        changingteams = false;
      }
      break;
    default:
      console.log("Unknown Event Type: " + event.type);
      console.log(event);
  }
}
var stagger, duration, board, deck, cards;
var runonce = false;
function setup() {
  if (!runonce) {
    console.log("Setting it up");
    runonce = true;
    stagger = 0.1;
    duration = 3;

    board = $(".board")[0];
    deck = $(".deck")[0];

    cards = $(".card")
      .toArray()
      .map(element => {
        // Initialize GSAP transforms on element
        TweenLite.set(element, { x: "+=0", overwrite: false });

        return {
          element,
          transform: element._gsTransform,
          first: { x: 0, y: 0 },
          last: { x: 0, y: 0 }
        };
      });
  }
}

function closeCards(event) {
  if ((changingteams && vis) || isrunning) {
    toggleCards();
    setTimeout(() => {
      closeCards(event);
    }, 500);
  } else {
    vue.hasteam = false;
    vue.team = event.teamdata.team;
    vue.members = event.teamdata.members;
    vue.hasteam = true;
    runonce = false;
    changingteams = false;
  }
}

function toggleCards() {
  console.log("Togglin'!");
  setup();
  if (!isrunning) {
    isrunning = true;

    $(".team").removeClass("animated");
    setTimeout(() => {
      isrunning = false;
    }, 3000 + 100 * cards.length);

    const tl = new TimelineMax();

    let alpha = 1;
    if (vis) {
      alpha = 0;
      vis = false;
      tl.to(".team", (3000 + 100 * cards.length) / 1000, { rotation: 0 });
    } else {
      vue.members = shuffle(vue.members);
      vue.lastupdate = Date.now();
      vis = true;
      tl.to(".team", (3000 + 100 * cards.length) / 1000, { rotation: 180 });
    }

    // First - record start position
    for (let card of cards) {
      card.element.style.transform = "none";
      const rect = card.element.getBoundingClientRect();
      card.first.x = rect.left;
      card.first.y = rect.top;
    }

    // State change, render new DOM
    for (let card of cards) {
      const parent = card.element.parentNode === board ? deck : board;
      parent.appendChild(card.element);
    }

    // Last - record new position
    for (let card of cards) {
      const rect = card.element.getBoundingClientRect();
      card.last.x = rect.left;
      card.last.y = rect.top;
    }

    // Invert - animate from first position

    for (let i = 0; i < cards.length; i++) {
      const { element, transform, first, last } = cards[i];

      TweenLite.set(element, {
        x: transform.x + first.x - last.x,
        y: transform.y + first.y - last.y
      });

      tl.to(
        element,
        duration,
        {
          x: 0,
          y: 0,
          autoAlpha: alpha,
          scale: alpha
        },
        stagger * i
      );
    }
  }
}

function shuffle(array) {
  console.log("Everyday I'm shuffling");
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
