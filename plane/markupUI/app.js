let container = document.querySelector("#container");
let activeItem = null;
let active = false;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);
let coords = {
  world: {
    lt: [0, 0],
    rt: [0, 0],
    lb: [0, 0],
    lt: [0, 0]
  },
  screen: {
    lt: [0, 0],
    rt: [0, 0],
    lb: [0, 0],
    rb: [0, 0]
  }
};

function dragStart(e) {
  if (e.target !== e.currentTarget) {
    active = true;

    // this is the item we are interacting with
    activeItem = e.target;

    if (activeItem !== null) {
      if (!activeItem.xOffset) {
        activeItem.xOffset = 0;
      }

      if (!activeItem.yOffset) {
        activeItem.yOffset = 0;
      }

      if (e.type === "touchstart") {
        activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
        activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
      } else {
        console.log("doing something!");
        activeItem.initialX = e.clientX - activeItem.xOffset;
        activeItem.initialY = e.clientY - activeItem.yOffset;
      }
    }
  }
}

function dragEnd(e) {
  if (activeItem !== null) {
    activeItem.initialX = activeItem.currentX;
    activeItem.initialY = activeItem.currentY;
    let rect = container.getBoundingClientRect();
    let circle = activeItem.getBoundingClientRect();
    let x = Math.round(circle.left + 5 - rect.left);
    let y = Math.round(circle.top + 5 - rect.top);
    let field = 'lt';
    switch (activeItem.id) {
      case 'one':
        field = 'lt';
        coords.screen.lt = [x, y];
        break;
      case 'two':
        field = 'rt';
        coords.screen.rt = [x, y];
        break;
      case 'three':
        field = 'lb';
        coords.screen.lb = [x, y];
        break;
      case 'four':
        field = 'rb';
        coords.screen.rb = [x, y];
    }
    document.querySelector('#' + field).textContent = 'Image X=' + x + '\n' + 'Image Y=' + y;
  }

  active = false;
  activeItem = null;
}

function drag(e) {
  if (active) {
    if (e.type === "touchmove") {
      e.preventDefault();

      activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
      activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
    } else {
      activeItem.currentX = e.clientX - activeItem.initialX;
      activeItem.currentY = e.clientY - activeItem.initialY;
    }

    activeItem.xOffset = activeItem.currentX;
    activeItem.yOffset = activeItem.currentY;

    setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function getval(name) {
  return Number(document.getElementById(name).value);
}

function getWorldCoord(e) {
  coords.world = {
    lt: [getval("ltx"), getval("lty")],
    rt: [getval("rtx"), getval("rty")],
    lb: [getval("lbx"), getval("lby")],
    rb: [getval("rbx"), getval("rby")]
  };
}

function sendCoords(e) {
  getWorldCoord();
  var coordStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(coords));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", coordStr);
  dlAnchorElem.setAttribute("download", "scene.json");
  dlAnchorElem.click();
}