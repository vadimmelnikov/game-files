// TODO: update rubber functionality (canvas clearRect?)
// TODO: since you've changed the way the border is done, check if the stroke cutoff still happens when mouse and touch leaves the canvas area
// TODO: maybe offsetTop is more suitable than getBoundingClientRect where you've used the latter below
// IIFE for adding membership info to session data
// var userId = "637256e04ddf5200040a3ea0";
var userId = "637256e04ddf5200040a3ea0";

$(window).on("resize.custom1", function () {
  setTimeout(() => {
    centerElementInCanvas($pregameCard);
  }, 1);
});

(async () => {
  const membershipInfo = await MemberStack.onReady;
  drawingData.userInfo = {
    memberstackID: membershipInfo["id"]
  };

  const players = await $.ajax({
    type: "GET",
    url: `https://kanjo-web-app.herokuapp.com/users/${drawingData?.userInfo?.memberstackID || userId}/added-profiles`
  });

  const playerCardGenerator = function (name, avatar, playerID) {
    const jpgStrArr = [
      "634548b9ae4c28d270dc4e8b_avatar_01_pineapple",
      "634548b9235565840ef0b0da_avatar_02_rabbit",
      "634548b9ab5f9d591adb4650_avatar_03_house",
      "634545e58f4ce3058b5c97b4_avatar_04_circle",
      "634548dfab5f9d2d7edb4a21_avatar_05_apple",
      "634545a66c9af3616cf9a595_avatar_06_square",
      "634548ba0f64bcf6af4683fb_avatar_07_cat",
      "634548bb0565145a3fd769ca_avatar_08_melon",
      "634545a61033b34d1f7edc06_avatar_09_triangle",
      "635bb4231f3d76829fb9ba0c_avatar_00_guest"
    ];
    const avatarSlug = "\\d_" + avatar + "$";
    const matchedStr = jpgStrArr.find((str) => {
      const regex = new RegExp(avatarSlug, "g");
      return str.match(regex) !== null;
    });
    const firstName = name.match(/\w+/g)[0];
    const $playerCard = $(
      `<button class="player-card">
        <img class="player-card-avatar" src='https://uploads-ssl.webflow.com/6315d8bfcaf1234c30aa1942/${matchedStr}.jpg'>
        <p class="player-card-name">${firstName}</p>
      </button>`
    );
    $playerCard.click(() => {
      drawingData.playerID = playerID;
      $pregameCard.remove();
      $(window).off("resize.custom1");
      $("#canvas-controls-container").show(0);
      openGameSettings();
    });
    return $playerCard;
  };

  $profilesContainer = $("#profiles-container");
  players.forEach((player) => {
    if (!player.guestUser) {
      $profilesContainer.append(
        playerCardGenerator(player.name, player.avatar, player._id)
      );
    } else {
      $profilesContainer.append(
        playerCardGenerator("Guest", "guest", player._id)
      );
    }
  });
  // A decent delay is needed here as the position must be calculated after the images have loaded - an alternative could be to put an avatar or player card min-height in css?
  setTimeout(() => {
    $pregameCard.show(0);
    centerElementInCanvas($pregameCard);
  }, 1000);
})();

const centerElementInCanvas = function (jqueryElement) {
  const rect = $canvas[0].getBoundingClientRect();
  const canvasOffset = {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
  jqueryElement.css(
    "top",
    ($canvas[0].height - jqueryElement.outerHeight()) / 2 + canvasOffset.top
  );
};

// Creating session data object to store data points to be sent to backend
let drawingData = {
  userInfo: {},
  playerID: "",
  selectedPromptAbsoluteNumber: 0,
  UTCDate: 0,
  UTCEndDate: 0,
  outOfTime: false,
  userUTCOffset: new Date().getTimezoneOffset(),
  promptData: [],
  strokeData: [],
  canvasSize: {
    width: 0,
    height: 0
  },
  deviceData: bowser.parse(window.navigator.userAgent),
  selectedCategory: "",
  selectedDifficulty: 0
};

// Adding device pixel ratio to drawing data
drawingData.deviceData.platform.platformPixelRatio = window.devicePixelRatio;

// Setting default values for painting parameters
let gameParameters = {
  painting: false,
  erasing: false,
  eraserSelected: false,
  savedPencilVals: {
    strokeStyle: "black",
    lineWidth: 16
  },
  savedEraserVals: {
    lineWidth: 16
  },
  strokeNumber: 0,
  gameStartTime: 0,
  currentStrokeLength: 0
};

// Selecting required DOM elements
const $pregameCard = $("#pregame-card");
const $gameSettingsCard = $("#game-settings-card");
const $difficultyWidthSlider = $("#difficulty-width-slider");
const $submitSettingsButton = $("#submit-settings-button");
const $canvasWrap = $("#canvas-wrap");
const $topProtrusion = $("#top-protrusion");
const $selectedPrompt = $("#selected-prompt");
const $canvasBorder = $("canvas-border-div");
const $canvas = $("#canvas");
const $canvasOverlay = $("#canvas-overlay");
const $strokeWidthSlider = $("#stroke-width-slider");
const $eraserButton = $("#eraser-button");
const $pencilButton = $("#pencil-button-selected");
const $eraserImage = $("#eraser-image");
// const $pencilSVG = $("#pencil-svg");
const $penColor = $(".color-pen");
const $colorPicker = $("#color-picker");
const $submitCountdownContainer = $("#submit-countdown-container");
// const $countdownContainer = $("#countdown");
const $countdownStroke = $(".cls-1");
const $countdownNumber = $("#countdown-number");
const $promptsAndSkipContainer = $("#prompts-and-skip-container");
const $prompts = $("#prompts");
const $promptButtons = $(".prompt");
const $skipButton = $("#skip-button");
const $submitEarlyButton = $("#submit-early-button");
const $endgameOptions = $("#endgame-options-container");
const $playAgainButton = $("#play-again-button");
const $changeSettingsPlayAgainButton = $("#change-settings-button");


const mobileMediaMatcher = window.matchMedia(
  "only screen and (max-width: 480px), only screen and (max-width: 950px) and (orientation: landscape)"
);
const tabletMediaMatcher = window.matchMedia(
  "only screen and (max-width: 780px), only screen and (max-width: 1125px) and (orientation: landscape)"
);

if (mobileMediaMatcher.matches) {
  // $("body").prepend(`<p style='color: black;'>mobile</p>`);
  // const [smallerDimension, largerDimension] = [window.screen.height, window.screen.width].sort((a, b) => a - b);

  const [smallerDimension, largerDimension] = [
    $(window).height(),
    $(window).width()
  ].sort((a, b) => a - b);
  // const [smallerDimension, largerDimension] = [window.innerHeight, window.innerWidth].sort((a, b) => a - b);

  $canvas[0].width = drawingData.canvasSize.width = largerDimension * 0.95;
  // $canvas[0].height = drawingData.canvasSize.height = smallerDimension * 0.75;
  $canvas[0].height = drawingData.canvasSize.height =
    smallerDimension -
    $topProtrusion.outerHeight() -
    ($canvasOverlay.height() / 2 - 10) -
    20 -
    10;

  $canvasOverlay.css("width", $canvas[0].width * 0.9);
  $strokeWidthSlider.css({ width: $canvasOverlay.width() * 0.3 });

  // Initializing element positions not achievable with CSS
  // $canvasOverlay.css({position: "absolute", bottom: - });
  $canvasOverlay.css({ position: "absolute", bottom: -20 });
  // $gameSettingsCard.css({
  //   height: $canvasOverlay.css("width"),
  //   maxHeight: $canvasOverlay.css("width")
  // });
} else if (tabletMediaMatcher.matches) {
  // $("body").prepend(`<p style='color: black;'>tablet</p>`);

  // Initializing element dimensions not achievable with CSS
  // const [smallerDimension, largerDimension] = [window.screen.height, window.screen.width].sort((a, b) => a - b);
  const [smallerDimension, largerDimension] = [
    $(window).height(),
    $(window).width()
  ].sort((a, b) => a - b);
  $canvas[0].width = drawingData.canvasSize.width = largerDimension * 0.85;
  // $canvas[0].height = drawingData.canvasSize.height = smallerDimension * 0.75;
  $canvas[0].height = drawingData.canvasSize.height =
    smallerDimension -
    $topProtrusion.outerHeight() -
    ($canvasOverlay.height() / 2 - 10) -
    80 -
    10;
  // $promptsAndSkipContainer.css("max-width", $canvas[0].width * 0.93);
  $canvasOverlay.css("width", $canvas[0].width * 0.8);
  $strokeWidthSlider.css({ width: $canvasOverlay.width() * 0.3 });

  // Initializing element positions not achievable with CSS
  $canvasOverlay.css({
    position: "absolute",
    bottom: -(($canvasOverlay.outerHeight() - 25) / 2)
  });
} else {
  // $("body").prepend(`<p style='color: black;'>desktop</p>`);
  // Initializing element dimensions not achievable with CSS
  // const [smallerDimension, largerDimension] = [window.innerHeight, window.innerWidth].sort((a, b) => a - b);
  const [smallerDimension, largerDimension] = [
    $(window).height(),
    $(window).width()
  ].sort((a, b) => a - b);
  $canvas[0].width = drawingData.canvasSize.width = largerDimension * 0.85;
  // $canvas[0].height = drawingData.canvasSize.height = smallerDimension * 0.8;
  $canvas[0].height = drawingData.canvasSize.height =
    smallerDimension -
    $topProtrusion.outerHeight() -
    ($canvasOverlay.height() / 2 - 10) -
    80 -
    10;
  // $promptsAndSkipContainer.css("max-width", $canvas[0].width * 0.93);
  $canvasOverlay.css("width", $canvas[0].width * 0.8);
  $strokeWidthSlider.css({ width: $canvasOverlay.width() * 0.3 });

  // Initializing element positions not achievable with CSS
  $canvasOverlay.css({
    position: "absolute",
    bottom: -(($canvasOverlay.outerHeight() - 25) / 2)
  });
}

// $topProtrusion.css({
//   minWidth: $canvas[0].width * 0.67,
//   maxWidth: $canvas[0].width
// });

// $gameSettingsCard.css({
//   width: $canvasOverlay.css("width"),
//   maxWidth: $canvasOverlay.css("width")
// });

if (window.matchMedia("(orientation: portrait)").matches) {
  $(window).on("resize.custom2", function () {
    if (window.matchMedia("(orientation: landscape)").matches) {
      const [smallerDimension, largerDimension] = [
        $(window).height(),
        $(window).width()
      ].sort((a, b) => a - b);
      if (mobileMediaMatcher.matches) {
        $canvas[0].width = drawingData.canvasSize.width =
          largerDimension * 0.95;
        $canvas[0].height = drawingData.canvasSize.height =
          smallerDimension -
          $topProtrusion.outerHeight() -
          ($canvasOverlay.height() / 2 - 10) -
          20 -
          10;
        $canvasOverlay.css("width", $canvas[0].width * 0.9);
        $strokeWidthSlider.css({ width: $canvasOverlay.width() * 0.3 });
        $canvasOverlay.css({ position: "absolute", bottom: -20 });
      } else if (tabletMediaMatcher.matches) {
        $canvas[0].width = drawingData.canvasSize.width =
          largerDimension * 0.85;
        $canvas[0].height = drawingData.canvasSize.height =
          smallerDimension -
          $topProtrusion.outerHeight() -
          ($canvasOverlay.height() / 2 - 10) -
          50 -
          10;
        $canvasOverlay.css("width", $canvas[0].width * 0.8);
        $strokeWidthSlider.css({ width: $canvasOverlay.width() * 0.3 });
        $canvasOverlay.css({
          position: "absolute",
          bottom: -(($canvasOverlay.outerHeight() - 25) / 2)
        });
      } else {
        $canvas[0].width = drawingData.canvasSize.width =
          largerDimension * 0.85;
        $canvas[0].height = drawingData.canvasSize.height =
          smallerDimension -
          $topProtrusion.outerHeight() -
          ($canvasOverlay.height() / 2 - 10) -
          50 -
          10;
        $canvasOverlay.css("width", $canvas[0].width * 0.8);
        $strokeWidthSlider.css({ width: $canvasOverlay.width() * 0.3 });
        $canvasOverlay.css({
          position: "absolute",
          bottom: -(($canvasOverlay.outerHeight() - 25) / 2)
        });
      }
      $topProtrusion.css({
        minWidth: $canvas[0].width * 0.67,
        maxWidth: $canvas[0].width
      });

      $gameSettingsCard.css({
        width: $canvasOverlay.css("width"),
        maxWidth: $canvasOverlay.css("width")
      });
      $(window).off("resize.custom2");
    }
  });
}

// Getting context from canvas API and creating function to reset to default stroke / line values
const context = $canvas[0].getContext("2d");
const resetStrokeParameters = function () {
  $colorPicker.val("#000000");
  $penColor.css("fill", "#000000");
  $pencilButton.css("transform", "scaleX(1)");
  $eraserImage.css("transform", "scaleX(1)");
  context.lineWidth = 16;
  context.strokeStyle = "black";
  context.lineCap = "round";
  $strokeWidthSlider.val(16);
  $eraserButton.prop("id", "eraser-button");
  $pencilButton.prop("id", "pencil-button-selected");
};

// Three painting / erasing functions for 1) starting new stroke 2) continuing stroke and 3) ending stroke
const startPosition = function () {
  if (gameParameters.eraserSelected) {
    gameParameters.erasing = true;
    if (context.strokeStyle !== "white") context.strokeStyle === "white";
  } else {
    gameParameters.painting = true;
  }
  gameParameters.strokeNumber++;
};

const drawLine = function (event) {
  if (gameParameters.painting || gameParameters.erasing) {
    // Safari doesn't show single points (from my testing, a stroke needs at least four points before safari displays it on the canvas). The following if statement checks if the point is the first in the stroke and if the browser is safari, and draws a circle where the point would've otherwise appeared in other browsers
    if (
      gameParameters.currentStrokeLength === 0 &&
      drawingData.deviceData.browser.name === "Safari"
    ) {
      context.fillStyle = context.strokeStyle;
      context.moveTo(event.offsetX + context.lineWidth / 2, event.offsetY);
      context.arc(
        event.offsetX,
        event.offsetY,
        context.lineWidth / 2,
        0,
        Math.PI * 2
      );
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(event.offsetX, event.offsetY);
    } else {
      context.lineTo(event.offsetX, event.offsetY);
      context.stroke();
    }
    drawingData.strokeData.push({
      xPosition: event.offsetX,
      yPosition: event.offsetY,
      color: context.strokeStyle,
      width: context.lineWidth,
      timeSinceGameStart: Date.now() - gameParameters.gameStartTime,
      strokeNumber: gameParameters.strokeNumber,
      eraser: gameParameters.eraserSelected
    });
    gameParameters.currentStrokeLength++;
  }
};

const endPosition = function () {
  if (gameParameters.erasing) {
    gameParameters.erasing = false;
  } else {
    gameParameters.painting = false;
  }
  context.beginPath();
  gameParameters.currentStrokeLength = 0;
};

// Predicate function which checks if touch / mouse is within the canvas bounds
const checkIfInCanvasBounds = function (event) {
  return event.offsetX < drawingData.canvasSize.width &&
    event.offsetX > 0 &&
    event.offsetY < drawingData.canvasSize.height &&
    event.offsetY > 0
    ? true
    : false;
};

// Equivalent of the three drawing functions above for touch interfaces
const touchStartPosition = function (event) {
  startPosition();
};
const touchEndPosition = function (event) {
  endPosition();
};
const touchDrawLine = function (event) {
  drawLine(event.targetTouches[0]);
  // Prevent default needed to stop scrolling, which is default behaviour for touch events
  event.preventDefault();
};

// Adds offsetX and offsetY to touch events - these are needed in the drawLine function (see above) but touch events do not include them by default, thus they must be manually calculated and added as properties
const addTouchEventOffset = function (event) {
  const rect = event.target.getBoundingClientRect();
  event.targetTouches[0].offsetX =
    event.targetTouches[0].pageX -
    rect.left -
    window.scrollX -
    parseInt($canvas.css("border-left-width"));
  event.targetTouches[0].offsetY =
    event.targetTouches[0].pageY -
    rect.top -
    window.scrollY -
    parseInt($canvas.css("border-top-width"));
};

// Canvas event handleers which call the above painting functions
const addCanvasPaintEvents = function () {
  // Mouse events
  $canvas.mousedown((event) => {
    if (!checkIfInCanvasBounds(event)) return;
    startPosition();
    drawLine(event);
  });
  $canvas.mouseup(endPosition);
  $canvas.mouseleave(endPosition);
  $canvas.mousemove((event) => {
    if (!checkIfInCanvasBounds(event)) {
      endPosition();
      return;
    }
    drawLine(event);
  });

  // Touch events
  $canvas.on("touchstart", (event) => {
    addTouchEventOffset(event);
    const touch = event.targetTouches[0];
    if (!checkIfInCanvasBounds(touch)) return;
    touchStartPosition();
    touchDrawLine(event);
  });
  $canvas.on("touchend", touchEndPosition);
  $canvas.on("touchmove", (event) => {
    addTouchEventOffset(event);
    const touch = event.targetTouches[0];
    // add equivalent functionality of mouseleave for touch
    if (!checkIfInCanvasBounds(touch)) {
      touchEndPosition();
      return;
    }
    touchDrawLine(event);
  });
};

// Function for toggling eraser
const toggleEraser = function () {
  if (gameParameters.eraserSelected) {
    gameParameters.savedEraserVals.lineWidth = context.lineWidth;
    context.strokeStyle = gameParameters.savedPencilVals.strokeStyle;
    context.lineWidth = gameParameters.savedPencilVals.lineWidth;
    gameParameters.eraserSelected = false;
    $strokeWidthSlider.val(gameParameters.savedPencilVals.lineWidth);
    $eraserButton.prop("id", "eraser-button");
    $pencilButton.prop("id", "pencil-button-selected");
  } else {
    const { strokeStyle, lineWidth } = context;
    gameParameters.savedPencilVals.strokeStyle = strokeStyle;
    gameParameters.savedPencilVals.lineWidth = lineWidth;
    context.lineWidth = gameParameters.savedEraserVals.lineWidth;
    context.strokeStyle = "white";
    gameParameters.eraserSelected = true;
    $strokeWidthSlider.val(gameParameters.savedEraserVals.lineWidth);
    $eraserButton.prop("id", "eraser-button-selected");
    $pencilButton.prop("id", "pencil-button");
  }
};

// Event handler which calls toggle eraser function on eraser button click;
$eraserButton.click(() => {
  toggleEraser();
  //TODO - do you need the below touchend?
  $eraserButton.trigger("touchend");
});

// Event handler for changing stroke width using width slider
$strokeWidthSlider.on("input", function () {
  context.lineWidth = $strokeWidthSlider.val();
  if (gameParameters.eraserSelected) {
    $eraserImage.css(
      "transform",
      `scaleX(${0.6 + $strokeWidthSlider.val() * (1 / 40)})`
    );
  } else {
    $pencilButton.css(
      "transform",
      `scaleX(${0.5 + $strokeWidthSlider.val() * (3 / 80)})`
    );
  }
});

// if ((drawingData.deviceData.os.name === "iOS" || drawingData.deviceData.platform.model === "iPhone" || (drawingData.deviceData.platform.vendor === "Apple" && drawingData.deviceData.platform.type === "mobile")) && drawingData.deviceData.platform.type !== "tablet") {
// iPhones and iPads (which the if statement detects) experience a game-breaking bug if the user taps the range input - this bug is fixed by disabling and re-enabling the input
if (
  (navigator.userAgent.match(/Mac/) &&
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2) ||
  drawingData.deviceData.os.name === "iOS" ||
  drawingData.deviceData.platform.model === "iPhone" ||
  (drawingData.deviceData.platform.vendor === "Apple" &&
    drawingData.deviceData.platform.type === "mobile")
) {
  $("input[type=range]").on("touchend", function () {
    setTimeout(() => {
      $(this).prop("disabled", true);
      $(this).prop("disabled", false);
      // Performance unreliable with a delay of 1ms
    }, 10);
  });
}

// Event handler for changing stroke color using color picker
$colorPicker.change(function () {
  context.strokeStyle = $colorPicker.val();
  // console.log("current color:", context.strokeStyle);
  $penColor.css("fill", $colorPicker.val());
});

// Event handler for disabling eraser if player presses pencil
$pencilButton.click(() => {
  if (gameParameters.eraserSelected) {
    toggleEraser();
  }
});

// TODO - do you need the below touchstart event handler?
$pencilButton.on("touchstart", () => {
  if (gameParameters.eraserSelected) {
    toggleEraser();
  }
});

// Create globally accessible obj for accessing prompt data across functions
let promptParameters = {
  promptObj: {},
  promptShowTimestamp: 0,
  // seenPromptAbsoluteNumbers: [],
  prompts: [],
  currentPromptIndex: 0
};

// Function for updating the displayed prompt options
const updatePrompts = function () {
  // console.log(promptParameters.currentPromptIndex);
  let prompt;
  if (promptParameters.currentPromptIndex === promptParameters.prompts.length) {
    prompt = promptParameters.prompts[0];
    promptParameters.currentPromptIndex = 1;
  } else {
    prompt = promptParameters.prompts[promptParameters.currentPromptIndex];
    promptParameters.currentPromptIndex++;
  }
  // promptParameters.seenPromptAbsoluteNumbers.push(prompt.number_absolute);
  const promptOptions = [prompt.option_1, prompt.option_2, prompt.option_3];
  $promptButtons.each((index, button) => {
    $(button).html(`<span>${index + 1}</span>${promptOptions[index]}`);
  });
  // if ($promptsAndSkipContainer.height() > 100) {
  centerElementInCanvas($promptsAndSkipContainer);
  // }
  // else {
  //   $promptsAndSkipContainer.css("top", ($canvasWrap.height() - (tabletMediaMatcher.matches || mobileMediaMatcher.matched ? 150 : 170)) / 2);
  // };
  promptParameters.promptObj = prompt;
  promptParameters.promptShowTimestamp = Date.now();
};

// Function for handling skipping a prompt group
$skipButton.click(async () => {
  // $skipButton.prop("disabled", true);
  const promptsSelectedTime = Date.now();
  drawingData.promptData.push({
    promptNumberAbsolute: promptParameters.promptObj.number_absolute,
    displayTime: promptsSelectedTime - promptParameters.promptShowTimestamp,
    selected: false,
    selectedPrompt: null
  });
  updatePrompts();
  // $skipButton.prop("disabled", false);
});

// Function for handling selection of a prompt
$promptButtons.click(function () {
  const promptsSelectedTime = Date.now();
  drawingData.selectedPromptAbsoluteNumber =
    promptParameters.promptObj.number_absolute;
  drawingData.promptData.push({
    promptNumberAbsolute: promptParameters.promptObj.number_absolute,
    displayTime: promptsSelectedTime - promptParameters.promptShowTimestamp,
    selected: true,
    selectedPrompt: `option_${$(this).index() + 1}`
  });
  $promptsAndSkipContainer.hide(0);
  $prompts.hide(0);
  $skipButton.hide(0);
  $selectedPrompt.text($(this).text());
  beginDrawing();
});

const beginDrawing = function () {
  gameParameters.gameStartTime = Date.now();
  addCanvasPaintEvents();
  startCountdown();
};

const startCountdown = function () {
  // $submitCountdownContainer.show(500);
  $submitCountdownContainer.show(0);
  let countdownFrom = 60;
  $countdownNumber.text(countdownFrom);
  const countdownInterval = setInterval(function () {
    countdownFrom = --countdownFrom <= 0 ? 0 : countdownFrom;
    $countdownNumber.text(countdownFrom);
  }, 1000);

  const cancelCounterTimeout = setTimeout(() => {
    drawingData.UTCEndDate = Date.now() - gameParameters.gameStartTime;
    drawingData.outOfTime = true;
    clearInterval(countdownInterval);
    $submitEarlyButton.unbind();
    const dashOffset = $("#countdown-svg circle").css("stroke-dashoffset");
    $("#countdown-svg circle").css({
      animation: "none",
      "stroke-dashoffset": dashOffset
    });
    handleGameEnd();
  }, 60000);

  $submitEarlyButton.click(() => {
    drawingData.UTCEndDate = Date.now() - gameParameters.gameStartTime;
    $submitEarlyButton.unbind();
    clearTimeout(cancelCounterTimeout);
    clearInterval(countdownInterval);
    const dashOffset = $("#countdown-svg circle").css("stroke-dashoffset");
    $("#countdown-svg circle").css({
      animation: "none",
      "stroke-dashoffset": dashOffset
    });
    handleGameEnd();
  });
};

const handleGameEnd = function () {
  $canvas.unbind();
  resetStrokeParameters();
  // $eraserButton.unbind();
  // console.log(drawingData);
  $.ajax({
    type: "POST",
    url: "https://kanjo-web-app.herokuapp.com/drawings",
    // url: "http://127.0.0.1:3000/drawings",
    data: JSON.stringify(drawingData),
    contentType: "application/json"
  });

  $countdownStroke.removeAttr("style");

  drawingData = {
    userInfo: drawingData.userInfo,
    playerID: drawingData.playerID,
    selectedPromptAbsoluteNumber: 0,
    UTCDate: 0,
    UTCEndDate: 0,
    outOfTime: false,
    userUTCOffset: new Date().getTimezoneOffset(),
    promptData: [],
    strokeData: [],
    canvasSize: drawingData.canvasSize,
    deviceData: drawingData.deviceData,
    selectedCategory: drawingData.selectedCategory,
    selectedDifficulty: drawingData.selectedDifficulty
  };

  gameParameters = {
    painting: false,
    erasing: false,
    eraserSelected: false,
    savedPencilVals: {
      strokeStyle: "black",
      lineWidth: 16
    },
    savedEraserVals: {
      lineWidth: 16
    },
    strokeNumber: 0,
    gameStartTime: 0,
    currentStrokeLength: 0
  };

  promptParameters = {
    promptObj: {},
    promptShowTimestamp: 0,
    // seenPromptNumbers: promptParameters.see,
    prompts: promptParameters.prompts,
    currentPromptIndex: promptParameters.currentPromptIndex
  };

  context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
  $submitCountdownContainer.hide();
  $canvas.css("background-color", "transparent");
  $selectedPrompt.text("Sketch & Guess");

  $endgameOptions.show(0);
  centerElementInCanvas($endgameOptions);
  // $endgameOptions.css("top", ($canvasWrap.height() - $endgameOptions.height()) / 2);
};

$playAgainButton.click(() => {
  $endgameOptions.hide(0);
  startNewRound();
});

$changeSettingsPlayAgainButton.click(() => {
  $endgameOptions.hide(0);
  openGameSettings();
});

const openGameSettings = function () {
  $gameSettingsCard.show(0);
  centerElementInCanvas($gameSettingsCard);
};

const setPromptPreferences = function () {
  drawingData.selectedCategory = $("input[name=category]:checked").val();
  drawingData.selectedDifficulty = parseInt($difficultyWidthSlider.val());
  $gameSettingsCard.hide(0);
};

$submitSettingsButton.click(async () => {
  setPromptPreferences();
  await fetchNewPrompts();
  startNewRound();
});

const fetchNewPrompts = async function () {
  promptParameters.currentPromptIndex = 0;
  promptParameters.prompts = await $.ajax({
    type: "GET",
    url: `https://kanjo-web-app.herokuapp.com/prompts/${drawingData.selectedCategory}/${drawingData.selectedDifficulty}`
    // url: `http://127.0.0.1:3000/prompts/${drawingData.selectedCategory}/${drawingData.selectedDifficulty}`
  });
};

const startNewRound = async function () {
  drawingData.UTCDate = new Date().toISOString();
  updatePrompts();
  $prompts.show(0);
  $skipButton.show(0);
  $canvas.css("background-color", "#fff");
  // $promptsAndSkipContainer.css("background-color", "#b9a2cf");
  // without the setTimeout, on iPad specifically (thanks apple) the prompts sometimes pop in rather than fading in smoothly
  setTimeout(() => {
    $promptsAndSkipContainer.show(0);
    centerElementInCanvas($promptsAndSkipContainer);
  }, 0);
  resetStrokeParameters();
};
