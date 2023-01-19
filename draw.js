// to make it load quicker, you could make the script external, then make it async,
// and then put the part that makes ajax call outside of the DOMContentLoaded callback

// TODO - the way you're absolutely positioning the labels will cause them to be out of place on screen resizes, either position them properly using css or reposition them on resize event

// All code contained within the below block will only fire once document has been parsed and all scripts with defer attribute have finished have evaluating
window.addEventListener('DOMContentLoaded', async function() {

    // localStorage.setItem('memberstack', '{"spEditor":false,"defaultMembership":"6317441a067d830004f55397","colorCode":"2aa8ff","loginPage":"","allow_signup":false,"protected":[{"id":"basic-members","redirect":"login","urls":[{"url":"members","filter":"Starts"}],"access":true,"hide_links":false}],"hasRecaptchaV2":false,"hasRecaptchaV3":false,"redirectOverride":"","membership":{"id":"6317441a067d830004f55397","amount":"","status":"active","cancel_at_period_end":false,"name":"Basic","signupDate":"2022-12-14T10:55:14.000Z"},"information":{"first-name":"Marina","last-name":"Romanova","newsletter-optin":false,"webflow-member-id":"6399ab9545bd049fdddbc676","mongo-account-created":"created","id":"6399ab9269253100049eef34"},"testWarning":false,"email":"marigoroma@gmail.com","hash":"02c026758ee975877aa142f4c839b4cfefe8e4491beb0e5b9a948ef9d60120ef","redirect":"members/dashboard","client_secret":"","requires_payment":false,"loginRedirect":"members/dashboard","logoutRedirect":"logout","uniqueContent":"","canceled":false}')

    var memberstackLocal = localStorage.getItem('memberstack');
    if(!memberstackLocal) {
        window.location.href = 'https://new-3d33ad.webflow.io/login'
    }

    var userInfo = JSON.parse(memberstackLocal);
    var userId = userInfo.information.id;
    //
    // const userInfo = {
    //     memberstackID: membershipInfo["id"]
    // };

    // TODO - dates need to be reformatted in the resize event listener
    // Helper function which takes the UTC datetime of a drawing and shifts it so that it is set to the player's local time when they created the drawing
    function UTCToLocalTimeString(drawingDate, drawingTimeOffset) {
        let options;
        // Shorter format for smaller screens
        if (matchMedia("only screen and (max-width: 480px)").matches) {
            options = { year: 'numeric', month: 'long', day: 'numeric' };
        }
        // Longer format for smaller screens
        else {
            options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        };
        const timeOffsetInHours = (drawingTimeOffset / 60) * -1;
        drawingDate.setHours(drawingDate.getHours() + timeOffsetInHours);
        // Returns a formatted string of the adjusted UTC date
        return drawingDate.toLocaleDateString("en-GB", options);
    };

    // Custom wrapper for setTimeout - this is needed to provide the speed up functionality when a parent correctly guesses a drawing before completion
    const setTimeoutWithReturnedObj = function(fn, delay) {
        const id = setTimeout(fn, delay);
        return { fn, delay, id };
    };

    // Wait for the memberstack information to load and extract the user's memberstackID
    // const membershipInfo = await MemberStack.onReady;
    // const userInfo = {
    //     // webflowID: membershipInfo["webflow-member-id"],
    //     memberstackID: membershipInfo["id"]
    // };

    const $drawingsContainer = $("#drawings-container");
    const $spinnerContainer = $("#spinner-container");

    // Configure and add spinner
    const spinnerOptions = {
        lines: 10, // The number of lines to draw
        length: 0, // The length of each line
        width: 22, // The line thickness
        radius: 47, // The radius of the inner circle
        scale: 1.75, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        speed: 0.8, // Rounds per second
        rotate: 36, // The rotation offset
        animation: 'spinner-line-shrink', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#77509c', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        // top: "25%", // Top position relative to parent
        // left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        zIndex: 2000000000, // The z-index (defaults to 2e9)
        className: 'spinner', // The CSS class to assign to the spinner
        position: 'absolute', // Element positioning
    };
    const target = $spinnerContainer[0];
    // new Spin.Spinner(spinnerOptions).spin(target);

    // Get drawings and reverse the array so that they're in reverse chronological order (most recent first)
    const drawingsArrays = await $.ajax({
        type: "GET",
        url: `https://kanjo-web-app.herokuapp.com/users/${userId}/drawings`
    });
    console.log('drawingsArray', drawingsArrays)

    const drawingsArray = drawingsArrays.filter((item) => item.drawingGuessID === null).reverse();
    console.log('drawingsArray', drawingsArray)
    // Remove spinner
    $spinnerContainer.remove();

    // If no drawings in drawingsArray, show no drawings notification and terminate script
    if (drawingsArray.length === 0) {
        $('#no-drawings-section').css({display: "block", animation: "fade-in 0.7s"});
        return;
    }

    // Format the drawing count notification
    const $totalDrawingsSpan = $("#total-drawing-count");
    const $pluralSpan1 = $("#plural-span-1");
    const $pluralSpan2 = $("#plural-span-2");
    const $unguessedDrawingsSpan = $("#unguessed-drawing-count");
    $totalDrawingsSpan.text(drawingsArray.length);
    if (drawingsArray.length === 1) {
        $pluralSpan1.text("")
        $pluralSpan2.text("is")
    }
    else {
        $pluralSpan1.text("s");
        $pluralSpan2.text("are");
    };
    $unguessedDrawingsSpan.text(drawingsArray.filter((drawing) => drawing.drawingGuessID === null).length);

    // Display the drawing count notification
    $('#drawing-stats-section').css({display: "block", animation: "fade-in 0.7s"});

    // For each drawing in drawingsArray
    drawingsArray.forEach((drawing, drawingIndex) => {

        // Terminate callback function if the strokeData is empty
        if (drawing.strokeData.length === 0) return;
        // Create and format drawing card
        // const $guessCard = $(`<div id="container-${drawingIndex}" class="guess-card"></div>`);
        const $guessCard = $(`<div id="container-${drawingIndex}" class="draw-ch_wrapper"></div>`);
        const $drawChBlock = $(`<div class="draw-ch_slide-block"></div>`);
        $guessCard.append($drawChBlock);

        // Create and append name and dates to drawing card
        const nameText = drawing.playerID.name === null ? "Guest" : drawing.playerID.name.match(/\w+/g)[0];
        const dateText = UTCToLocalTimeString(new Date(drawing.UTCDate), drawing.userUTCOffset);
        // const $nameAndDateContainer = $(`<!--<div class="name-and-date-container"></div>-->`);
        const $nameAndDateContainer = $(`<div class="draw-ch_top">
                            <div class="draw-ch_img-wrap">
                                <div class="new-player_select-lottie" data-w-id="c57a3bd2-fcf7-3c6e-e6b3-8dcf2860210a"
                                     data-animation-type="lottie"
                                     data-src="https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa1bd9b3282a0dbdb36_Konjo_2_Glasses_bake.json"
                                     data-loop="0" data-direction="1" data-autoplay="1" data-is-ix2-target="0"
                                     data-renderer="svg" data-duration="0">
                                </div>
                            </div>
                            <div class="deaw-ch_top-para">
                                <div class="par-dash-txt-16-21">${nameText}</div>
                                <div class="par-dash-txt-16-21 op-6">3 hours ago</div>
                            </div>
                        </div>`);



        // const nameText = drawing.playerID.name === null ? "Guest" : drawing.playerID.name.match(/\w+/g)[0];
        // const dateText = UTCToLocalTimeString(new Date(drawing.UTCDate), drawing.userUTCOffset);
        $drawChBlock.append($nameAndDateContainer);
        // $nameAndDateContainer.append(`<p>${nameText}</p>`).append($(`<p>${dateText}</p>`))

        // Create and append canvas and prompt buttons. Add data attributes to canvas for future reference
        // const $canvasContainer = $(`<div class="canvas-container"></div>`);
        const $canvasContainer = $(`<div class="canv-block w-embed"></div>`);


        // const $newCanvas = $(`<canvas id="canvas-${drawingIndex}" class="canvas" data-original-width="${drawing.canvasSize.width}" data-original-height="${drawing.canvasSize.height}" data-scale-factor="" data-guessed=""></canvas>`);
        const $newCanvas = $(`<canvas id="canvas-${drawingIndex}" class="draw-canv" data-original-width="${drawing.canvasSize.width}" data-original-height="${drawing.canvasSize.height}" data-scale-factor="" data-guessed=""></canvas>`);
        $canvasContainer.append($newCanvas);

        // const $promptsContainer = $(`<div id="prompt-container-${drawingIndex}" class="prompt-container"></div>`);
        const $promptsContainer = $(`<div id="prompt-container-${drawingIndex}" class="draw-ch_slide_bttm"></div>`);

        const { selectedPrompt } = drawing;
        const promptOptions = [selectedPrompt.option_1, selectedPrompt.option_2, selectedPrompt.option_3];
        const selectedPromptOption = drawing.promptData[drawing.promptData.length - 1].selectedPrompt;
        promptOptions.forEach((prompt, promptIndex) => {
            const letter = "abc"[promptIndex];
            // const $button = $(`<button class="prompt-button-${drawingIndex} prompt-button">${letter}. ${prompt}</button>`);

            const $button = $(`<div class="prompt-button-${drawingIndex} draw-ch_item">
                                <div class="draw-ch_item_left">
                                    <div class="draw-ch_numb">
                                        <div class="draw-ch_txt">${letter}</div>
                                    </div>
                                    <div class="txt-20-26">${prompt}</div>
                                </div>
                                <div class="draw-success-img"></div>
                            </div>`);


            $promptsContainer.append($button);
        });
        $drawChBlock.append($canvasContainer).append($promptsContainer);
        $drawingsContainer.append($guessCard);

        // Save reference to the prompt buttons, and reference to the correct prompt button
        const $promptBtns = $(`.prompt-button-${drawingIndex}`);
        const $rightPromptBtn = $promptBtns.eq(parseInt(selectedPromptOption.match(/\d$/g)[0]) - 1);
        // TODO - delete the below three lines if the above line works
        // const $rightPromptBtn = $promptBtns.filter((index) => {
        //   return index + 1 === parseInt(selectedPromptOption.match(/\d/g)[0]);
        // });

        console.log("$newCanvas[0]", $newCanvas[0])
        console.log("$newCanvas[0].dataset.scaleFactor", $newCanvas[0].dataset)
        // Get canvas drawing context
        const context = $newCanvas[0].getContext("2d");

        // Get original drawing canvas dimensions
        const originalCanvasDimensions = {
            width: drawing.canvasSize.width,
            height: drawing.canvasSize.height
        };

        // Fit canvas to width of canvas container (so all canvases on page have the same width) and save the scale factor as a data attribute for future reference
        const canvasWidth = $canvasContainer.outerWidth();
        const canvasScaleFactor = canvasWidth / originalCanvasDimensions.width;
        $newCanvas[0].dataset.scaleFactor = canvasScaleFactor;

        // Set canvas dimensions whilst maintaining drawing aspect ratio
        $newCanvas[0].width = canvasWidth;
        $newCanvas[0].height = canvasScaleFactor * originalCanvasDimensions.height;
        // 2.17 is chosen aspect ratio - this can be changed by modifying all occurrences of this value in the file. Manually set in this file as the css aspect-ratio property was not working on mobile safari
        $canvasContainer.height(canvasWidth / 2.17);

        // If the drawing hasn't been guessed yet
        if (drawing.drawingGuessID === null) {
            // Update guessed status data attribute
            $newCanvas[0].dataset.guessed = "false"

            // Add CSS class to prompt buttons
            $promptBtns.addClass("unguessed-prompt-button");

            // Create, add, and position game start button
            const $playButton = $(`<button class="play-button">
                                <img src='https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/635a5f48a34410d549905234_Group%20138playbutton.png' />
                            </button>`).css({width: $canvasContainer.width()/3, height: "auto"});
            $canvasContainer.append($playButton);
            $playButton.css({ left: ($canvasContainer.width() - $playButton.width()) / 2, top: ($canvasContainer.height() - $playButton.width()) / 2 });

            // Make game start button spin if the prompt buttons are pressed before game start
            $promptBtns.click(() => {
                $playButton.css("animation", "");
                // Without setTimeout, animation only runs once
                setTimeout(() => {
                    $playButton.css("animation", "spin 1s");
                }, 0);
            });

            // Initiate game upon pressing the game start button
            $playButton.click(() => {
                console.log('..$playButton...')
                // Update guessed status data attribute and remove game start button
                $newCanvas[0].dataset.guessed = "true"
                $playButton.fadeOut(300);

                // Disable all other game start buttons and remove the current event handlers from the prompt buttons
                $(".play-button").css("opacity", 0.5).prop("disabled", "true");
                $promptBtns.unbind();

                // Get the drawing duration (time between prompt selection and the creation of the last point of the last stroke) and initialise countdown value
                const drawingTime = drawing.strokeData[drawing.strokeData.length - 1].timeSinceGameStart;
                let countdownVal = Math.ceil(drawingTime / 1000) + 5;

                // Create object to track game session data
                const sessionData = {
                    userInfo,
                    drawingID: drawing._id,
                    UTCDate: (new Date()).toISOString(),
                    userUTCOffset: (new Date()).getTimezoneOffset(),
                    firstGuess:	null,
                    secondGuess: null,
                    thirdGuess: null,
                    guessCountdownTime: drawingTime + 5000,
                    correctPromptChosen: false
                };

                // Add countdown timer to canvas container
                $canvasContainer.append(`
          <div id="countdown-${drawingIndex}" class="countdown">
            <?xml version="1.0" encoding="UTF-8"?>
            <?xml version="1.0" encoding="UTF-8"?>
            <svg class="countdown-svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87 87">
              <circle id="timer-circle-${drawingIndex}" class="timer-circle" cx="43.5" cy="43.5" r="30"/>
              <circle id="cls-1-${drawingIndex}" class="cls-1" cx="43.5" cy="43.5" r="30"/>
            </svg>
            <span id="countdown-number-${drawingIndex}" class="countdown-number"></span>
          </div>
        `);

                // TODO - below can probably just be added to the class in CSS
                // Add animation to countdown timer and create interval to decrement the timer value every second
                $(`#timer-circle-${drawingIndex}`).css("animation", `circletimer2 ${countdownVal}s cubic-bezier(.7,.03,.96,.74)`);
                $(`#cls-1-${drawingIndex}`).css("animation", `circletimer ${countdownVal * 2.666667}s linear`);
                const $countdownNumber = $(`#countdown-number-${drawingIndex}`);
                $countdownNumber.text(countdownVal);
                const countdownInterval = setInterval(() => {
                    countdownVal = --countdownVal <= 0 ? 0 : countdownVal;
                    // If the user runs out of time clear the interval and invoke the game end handler with a true flag
                    if (countdownVal === 0) {
                        clearInterval(countdownInterval);
                        handleGuessEnd(true);
                    }
                    $countdownNumber.text(countdownVal);
                }, 1000);

                // Get the guessing start time
                const guessingStartTime = Date.now();

                // Get the current scale factor from the canvas dataset
                const currentScaleFactor = $newCanvas[0].dataset.scaleFactor;

                // Set stroke linecap to round (this is the linecap for all drawings and single points do not appear with the default value of "butt")
                context.lineCap = "round";

                // Create array to save reference to the cached timeouts which recreate the drawing in real-time
                const timeoutArr = [];

                // Variable to track the current stroke
                let currentStroke = 0;

                // Loop which iterates through the strokeData and uses setTimeouts to asynchronously recreate the drawing in real-time
                for (let point of drawing.strokeData) {
                    // Uses the previously created setTimeout wrapper to return an object containing the callback argument, delay, and id of the timeout
                    const drawPointTimeoutObj = setTimeoutWithReturnedObj(() => {
                        let firstPoint = false;
                        if (point.strokeNumber !== currentStroke) {
                            firstPoint = true;
                            context.beginPath();
                            currentStroke++;
                            context.lineWidth = point.width * currentScaleFactor;
                            context.strokeStyle = point.color;
                        };

                        // A stroke won't show up on Safari if it consists of less than 4 points - the below if statement manually creates a circle at the location of the first point of each stroke on Safari browsers
                        if (firstPoint && bowser.getParser(window.navigator.userAgent).getBrowserName() === "Safari") {
                            context.fillStyle = context.strokeStyle;
                            context.moveTo(point.xPosition * currentScaleFactor + context.lineWidth / 2, point.yPosition * currentScaleFactor);
                            context.arc(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor, context.lineWidth / 2, 0, Math.PI*2);
                            context.closePath();
                            context.fill();
                            context.beginPath();
                            context.moveTo(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor);
                        }
                        else {
                            context.lineTo(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor);
                            context.stroke();
                            timeoutArr.shift();
                        }
                    }, point.timeSinceGameStart);

                    // Add the timeout data object to the timeoutArr
                    timeoutArr.push(drawPointTimeoutObj);
                };

                // Zero-indexed variable to track the number of guesses and sessionData field name mapper
                let guessCount = 0;
                const guessMapArr = ["firstGuess", "secondGuess", "thirdGuess"];

                // Handle guess upon clicking prompt button
                $promptBtns.click(function () {
                    const promptOptionNumber = $(this).index() + 1;
                    const promptOptionNumberStr = `option_${promptOptionNumber}`;

                    // If the prompt button is the correct prompt button
                    if (this === $rightPromptBtn[0]) {
                        // Add guess data to the sessionData
                        sessionData[guessMapArr[guessCount]] = {
                            selectedPrompt: promptOptionNumberStr,
                            timeSinceGuessStart: Date.now() - guessingStartTime
                        };
                        sessionData.correctPromptChosen = true;

                        // Invoke the game end handler with a false flag, clear the countdown interval, set the countdown timer's styles so they remain as they were when the countdown was stopped
                        handleGuessEnd(false);
                        clearInterval(countdownInterval);
                        const $countdownRing = $(`#cls-1-${drawingIndex}`);
                        const dashOffset = $countdownRing.css("stroke-dashoffset");
                        const dashArray = $countdownRing.css("stroke-dasharray");
                        $countdownRing.css({animation: "none", "stroke-dashoffset": dashOffset, "stroke-dasharray": dashArray});
                        const $countdownColorRing = $(`#timer-circle-${drawingIndex}`);
                        const ringColor = $countdownColorRing.css("stroke");
                        $countdownColorRing.css({animation: "none", stroke: ringColor});
                    }
                    // If the prompt button was not the correct prompt button
                    else {
                        // Add the red cross label to the prompt button
                        const label = $(`<img class="prompt-label" src="https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/63597f151c87991509f3f9ed_Group%2015red%20cross.png"></img>`)
                        $(this).append(label)

                        // Add guess data to the sessionData
                        sessionData[guessMapArr[guessCount]] = {
                            selectedPrompt: promptOptionNumberStr,
                            timeSinceGuessStart: Date.now() - guessingStartTime
                        };

                        // Increment the guess count value
                        guessCount++;
                    };
                });

                // Function to handle the end of the guessing game. Takes a boolean argument which indicates whether the user ran out of time or not
                const handleGuessEnd = function (timeout) {
                    // Remove the current event handlers from the prompt buttons, disable them, and modify their CSS class
                    $promptBtns.unbind();
                    $promptBtns.prop("disabled", "true");
                    $promptBtns.removeClass("unguessed-prompt-button");

                    // If the player ran out of time add the timeout label to the correct prompt button
                    if (timeout) {
                        const label = $(`<img class="prompt-label" src="https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/635999e4821a2123ef0d06a9_Group%20137timeout.png"></img>`)
                        $rightPromptBtn.append(label)
                    }
                    // Otherwise add the green tick label to the correct prompt button
                    else {
                        const label = $(`<img class="prompt-label" src="https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/63597f0fc3d553886a85c763_Group%2017green%20tick.png"></img>`)
                        $rightPromptBtn.append(label)
                    };

                    // Send the collected guess sessionData to the server, which also flags the corresponding drawing as 'guessed'
                    $.ajax({
                        type: "PUT",
                        url: "https://kanjo-web-app.herokuapp.com/guesses",
                        data: JSON.stringify(sessionData),
                        contentType: "application/json",
                    });

                    // Enable game start buttons on other drawing cards
                    $(".play-button").css("opacity", 1).removeAttr('disabled');

                    // If the drawing hasn't finished yet, speed up whatever is remaining by a factor of 6
                    const timeForGuessCompletion = Date.now() - guessingStartTime;
                    if (timeoutArr.length) {
                        timeoutArr.forEach((drawPointTimeoutObj) => {
                            const { fn } = drawPointTimeoutObj;
                            const { delay } = drawPointTimeoutObj;
                            clearTimeout(drawPointTimeoutObj.id);
                            setTimeout(fn, (delay - timeForGuessCompletion) / 6);
                        });
                    };
                };
            });
        }
        // If the drawing has been guessed
        else {
            // Same logic as above
            $newCanvas[0].dataset.guessed = "true";
            const currentScaleFactor = $newCanvas[0].dataset.scaleFactor;
            context.lineCap = "round";

            // Same logic as above but no setTimeouts used so the complete drawing is instantly rendered onto the canvas on page load
            let currentStroke = 0;
            for (let point of drawing.strokeData) {
                let firstPoint = false;
                if (point.strokeNumber !== currentStroke) {
                    firstPoint = true;
                    context.beginPath();
                    currentStroke++;
                    context.lineWidth = point.width * currentScaleFactor;
                    context.strokeStyle = point.color;
                };
                if (firstPoint && bowser.getParser(window.navigator.userAgent).getBrowserName() === "Safari") {
                    context.fillStyle = context.strokeStyle;
                    context.moveTo(point.xPosition * currentScaleFactor + context.lineWidth / 2, point.yPosition * currentScaleFactor);
                    context.arc(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor, context.lineWidth / 2, 0, Math.PI*2);
                    context.closePath();
                    context.fill();
                    context.beginPath();
                    context.moveTo(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor);
                }
                else {
                    context.lineTo(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor);
                    context.stroke();
                };
            };

            // Access guess object which contains data about the guesses the parent made for the drawing in the past
            const guessesObj = drawing.drawingGuessID;

            // Create sessionData field name mapper
            const guessMapArr = ["firstGuess", "secondGuess", "thirdGuess"];

            // Disable the prompt buttons
            $promptBtns.prop("disabled", "true");

            // Depending on whether the parent ran out of time when guessing the drawing or didn't, add the timeout label or the green tick label to the correct prompt button, respectively
            if (guessesObj.correctPromptChosen) {
                const label = $(`<img class="prompt-label" src="https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/63597f0fc3d553886a85c763_Group%2017green%20tick.png"></img>`)
                $rightPromptBtn.append(label)
            }
            else {
                const label = $(`<img class="prompt-label" src="https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/635999e4821a2123ef0d06a9_Group%20137timeout.png"></img>`)
                $rightPromptBtn.append(label)
            };

            // Loop through any guesses prior to the correct guess to add the correct labels to the prompt buttons
            for (let i = 0; i < 2; i++) {
                const guess = guessesObj[guessMapArr[i]];
                const promptOptionNumber = guess?.selectedPrompt;
                if (guess === null || promptOptionNumber === selectedPromptOption) {
                    break;
                };
                const $matchingPromptBtn = $promptBtns.filter((index) => {
                    return index + 1 === parseInt(promptOptionNumber.match(/\d/g)[0]);
                });
                const label = $(`<img class="prompt-label" src="https://uploads-ssl.webflow.com/633ada5bbb1872aa840e5386/63597f151c87991509f3f9ed_Group%2015red%20cross.png"></img>`);
                $matchingPromptBtn.append(label);
            }
        };
    });

    // Save references to elements
    const $canvasContainers = $(".canvas-container");
    const $firstCanvasContainer = $canvasContainers.eq(0);
    const $canvases = $(".canvas");
    const $playButtons = $(".play-button");

    // Save window width
    let windowWidth = $(window).width();

    // Canvas elements do not resize automatically, and when manually resized, they are cleared (so the strokeData must be both rescaled and drawn onto the canvas once again) - the resizeCanvases function does just this
    const resizeCanvases = function () {
        // Only proceeds if the window width has changed - changes in window height alone are ignored as this should not affect the width of the canvases
        if ($(window).width() === windowWidth) return;
        else {
            // Update the window width to the new value
            windowWidth = $(window).width();
        };
        // Retrieve the width of an arbitrary canvas container (they should all have the same dimensions) to set the width of all the canvases to
        const canvasWidth = $firstCanvasContainer.outerWidth();

        // Track the number of empty drawings
        let emptyDrawings = 0;

        // Loop through each canvas element
        $canvases.each((index, canvas) => {
            // Calculate the updated scale factor of the canvas and set the canvas dimensions
            const canvasScaleFactor = canvasWidth / parseFloat(canvas.dataset.originalWidth);
            canvas.width = canvasWidth;
            canvas.height = canvasScaleFactor * parseFloat(canvas.dataset.originalHeight);

            // Update the scale factor data attribute
            canvas.dataset.scaleFactor = canvasScaleFactor;

            // If the canvas has a drawing on it
            if (canvas.dataset.guessed === "true") {
                // Redraw the entire drawing from scratch (instantaneously, not in real-time). Skip over any empty drawings
                const context = canvas.getContext("2d");
                context.lineCap = "round";
                let drawing = drawingsArray[index + emptyDrawings];
                while (drawing.strokeData.length === 0) {
                    emptyDrawings++;
                    drawing = drawingsArray[index + emptyDrawings];
                };
                let currentStroke = 0;
                for (let point of drawing.strokeData) {
                    let firstPoint = false;
                    if (point.strokeNumber !== currentStroke) {
                        firstPoint = true;
                        context.beginPath();
                        currentStroke++;
                        context.lineWidth = point.width * canvasScaleFactor;
                        context.strokeStyle = point.color;
                    };
                    if (firstPoint && bowser.getParser(window.navigator.userAgent).getBrowserName() === "Safari") {
                        context.fillStyle = context.strokeStyle;
                        context.moveTo(point.xPosition * canvasScaleFactor + context.lineWidth / 2, point.yPosition * canvasScaleFactor);
                        context.arc(point.xPosition * canvasScaleFactor, point.yPosition * canvasScaleFactor, context.lineWidth / 2, 0, Math.PI*2);
                        context.closePath();
                        context.fill();
                        context.beginPath();
                        context.moveTo(point.xPosition * canvasScaleFactor, point.yPosition * canvasScaleFactor);
                    }
                    else {
                        context.lineTo(point.xPosition * canvasScaleFactor, point.yPosition * canvasScaleFactor);
                        context.stroke();
                    };
                };
            };
        });
    };

    // Initialise timeout variable - this is used so that the above resize function is only invoked 100ms after resizing has stopped to prevent unnecessary repeated calls
    let resizeCanvasTimeout;
    $(window).on("resize", function () {
        // Maintain aspect ratio of canvas containers
        const canvasWidth = $firstCanvasContainer.outerWidth();
        $canvasContainers.height(canvasWidth / 2.17);
        // Recenter game start buttons
        $playButtons.css("width", $firstCanvasContainer.width()/3);
        $playButtons.css({
            left: ($firstCanvasContainer.outerWidth() - $playButtons.eq(0).width()) / 2,
            top: ($firstCanvasContainer.outerHeight() - $playButtons.eq(0).width()) / 2,
        });
        // Clear and recreate the timeout if still resizing
        clearTimeout(resizeCanvasTimeout);
        resizeCanvasTimeout = setTimeout(resizeCanvases, 100);
    });

});
