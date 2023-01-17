window.addEventListener('DOMContentLoaded', async function() {
    var memberstackLocal = localStorage.getItem('memberstack');
    if(!memberstackLocal) {
        window.location.href = 'https://new-3d33ad.webflow.io/login'
    }

    var userInfo = JSON.parse(memberstackLocal);
    var userId = userInfo.information.id;

    const timeoutArr = [];

    const drawingsArrays = await $.ajax({
        type: "GET",
        url: `https://kanjo-web-app.herokuapp.com/users/${userId}/drawings`
    });

    let outerCanvasWidth = null;

    const requestQuestion = [];

    const drawingsArray = drawingsArrays.filter((item) => item.drawingGuessID === null && item.strokeData.length > 0).reverse();
    const drawingsTabArray = drawingsArrays.filter((item) => item.drawingGuessID != null && item.strokeData.length > 0).reverse();

    drawingsArray.forEach((drawing, drawingIndex) => {
        const {_id: id, playerID } = drawing;
        const nameText = drawing.playerID.name === null ? "Guest" : drawing.playerID.name.match(/\w+/g)[0];

        const { selectedPrompt } = drawing;

        const dateText = UTCToLocalTimeString(new Date(drawing.UTCDate), drawing.userUTCOffset);

        let imageDiv = '';
        if(playerID.avatar === null) {
            imageDiv = `<img src='${getAvatar(playerID.avatar)}'> `;
        } else {
            imageDiv = `<div class="new-player_select-lottie" data-src="${getAvatar(playerID.avatar)}"></div>`;
        }

        const promptOptions = [
            {
                option: 'option_1',
                value: selectedPrompt.option_1
            },
            {
                option: 'option_2',
                value: selectedPrompt.option_2
            },
            {
                option: 'option_3',
                value: selectedPrompt.option_3
            },
        ];

        const question = promptOptions.map((item, index) => {
            const letter = "abc"[index];
            return `
                     <div data-option="${item.option}" data-id="${id}" class="draw-ch_item questions status_${id}_${item.option}">
                        <div class="draw-ch_item_left">
                            <div class="draw-ch_numb status_${id}_${item.option}">
                                <div class="draw-ch_txt">${letter}</div>
                            </div>
                            <div class="txt-20-26">${item.value}</div>
                        </div>
                        <div class="draw-success-img status_${id}_${item.option}"></div>
                    </div>
            `
        })

        const div = `
                <div id="container-${id}" class="draw-ch_slide-block">
                        <div class="draw-ch_top">
                            <div class="draw-ch_img-wrap">${imageDiv}</div>
                            <div class="deaw-ch_top-para">
                                <div class="par-dash-txt-16-21">${nameText}</div>
                                <div class="par-dash-txt-16-21 op-6">${dateText}</div>
                            </div>
                        </div>
                        <div id="canvas-${id}" class="canv-block w-embed">
                            <div id="play_but_${id}" data-id="${id}" class="canv-play-btn play_canvas"><img src="https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63c65fe703ef9cdc086b505d_play-btn.svg" loading="lazy" alt="" class="canv-play-img"></div>
                            <canvas id="canvas_${id}" class="draw-canv" data-original-width="${drawing.canvasSize.width}" data-original-height="${drawing.canvasSize.height}" data-scale-factor=""></canvas>
                        </div>
                        <div class="draw-ch_slide_bttm">${question.join('')}</div>
                    </div>
        `;

        $("#drawings-container").append(div)
    });


    function timer(draw) {
        const {_id: dataId} = draw;

        const drawingTime = draw.strokeData[draw.strokeData.length - 1].timeSinceGameStart;
        let countdownVal = Math.ceil(drawingTime / 1000) + 5;

        $(`#canvas-${dataId}`).append(`
         <div id="countdown-${dataId}" class="countdown">
            <?xml version="1.0" encoding="UTF-8"?>
            <?xml version="1.0" encoding="UTF-8"?>
            <svg class="countdown-svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87 87">
              <circle id="timer-circle-${dataId}" class="timer-circle" cx="43.5" cy="43.5" r="30"/>
              <circle id="cls-1-${dataId}" class="cls-1" cx="43.5" cy="43.5" r="30"/>
            </svg>
            <span id="countdown-number-${dataId}" class="countdown-number"></span>
          </div>
        `)

        $(`#timer-circle-${dataId}`).css("animation", `circletimer2 ${countdownVal}s cubic-bezier(.7,.03,.96,.74)`);
        $(`#cls-1-${dataId}`).css("animation", `circletimer ${countdownVal * 2.666667}s linear`);
        const $countdownNumber = $(`#countdown-number-${dataId}`);
        $countdownNumber.text(countdownVal);

        const countdownInterval = setInterval(() => {
            countdownVal = --countdownVal <= 0 ? 0 : countdownVal;
            // If the user runs out of time clear the interval and invoke the game end handler with a true flag
            if (countdownVal === 0) {
                clearInterval(countdownInterval);
            }
            $countdownNumber.text(countdownVal);
        }, 1000);
    }

    const setTimeoutWithReturnedObj = function(fn, delay) {
        const id = setTimeout(fn, delay);
        return { fn, delay, id };
    };

    function loadAnimation() {
        const anim = document.getElementsByClassName('new-player_select-lottie');
        setTimeout(() => {
            for (let i = 0; i < anim.length; i++) {
                lottie.loadAnimation({
                    container: anim[i],
                    render: 'svg',
                    loop: false,
                    autoplay: true,
                    path: anim[i]?.getAttribute('data-src'),
                })
            }
        }, 500)
    }

    function setCanvasWidthHeight(drawArrays) {
        drawArrays.forEach((drawing, drawingIndex) => {
            const {_id: id} = drawing;

            const canvas = document.getElementById(`canvas_${id}`);

            const originalCanvasDimensions = {
                width: drawing.canvasSize.width,
                height: drawing.canvasSize.height
            };

            const canvasWidth = $(`#canvas_${id}`).outerWidth() || outerCanvasWidth;
            outerCanvasWidth = canvasWidth;
            if(canvasWidth > 0) {
                $(`#canvas-${id}`).height(canvasWidth / 2.17);

                const canvasScaleFactor = canvasWidth / originalCanvasDimensions.width;

                canvas.width = canvasWidth;
                canvas.height = canvasScaleFactor * originalCanvasDimensions.height;


                $(`#canvas_${id}`).attr("data-scale-factor", canvasScaleFactor);
            }
        });
    }

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
    }

    function getAvatar(avatar) {
        if (avatar === null) {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63c51697a9b6a0691084908b_guest-norm.png';
        }

        if(avatar === 'pineapple') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa236a47c02d5e7bdc2_Konjo_6_Yellow_orange_bake.json';
        } else if(avatar === 'rabbit') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2e38261a8839209a9_Konjo_3_Green_bake.json';
        }else if(avatar === 'house') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa1ccb1e1320b34ee7f_Konjo_1_Purplesmile_bake.json';
        }else if(avatar === 'circle') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa26cd7cb745d745573_Konjo_7_Robot_bake.json';
        }else if(avatar === 'apple') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa236a47c02d5e7bdc2_Konjo_6_Yellow_orange_bake.json';
        }else if(avatar === 'square') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2e3826121349209a8_Konjo_5_Yellow_bake.json';
        }else if(avatar === 'cat') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2e38261eb289209ab_Konjo_9_Owl_bake.json';
        }else if(avatar === 'melon') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2335f3837cbdeba09_Konjo_4_Ninja_bake.json';
        }else if(avatar === 'triangle') {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa294906e9c5cfbf74c_Konjo_8_Pink_bake.json';
        }
    }

    function tabs() {
        const groupPlayer = drawingsTabArray.reduce((res, item) => {
         if(!res[item.playerID._id]) {
             res[item.playerID._id] = [];
             res[item.playerID._id].push(item)
         } else {
             res[item.playerID._id].push(item)
         }

        return res
        }, {});

        let playerIds = [];
        let guestId = '';
        for(const item in groupPlayer) {
           if(groupPlayer[item][0].playerID.name === null) {
               guestId = item;
           } else {
               playerIds.push(item);
           }
        }

        const sortPlayers = [];
        for(let i=0; i<playerIds.length; i++){
            sortPlayers[i] = [];
            sortPlayers[i].push(...groupPlayer[playerIds[i]]);
        }
        sortPlayers[sortPlayers.length] = groupPlayer[guestId];


        let tabPlayerCount = 1;
        for(let i=0; i<sortPlayers.length; i++){
            addPlayerInTab(sortPlayers[i][0].playerID, tabPlayerCount);
            tabPlayerCount++;
        }


        let tabCount = 1;
        for(let i=0; i<sortPlayers.length; i++){
            let isTabActive = '';
            if(tabCount === 1) {
                isTabActive = 'w--tab-active draw-all-pls-tab-pane';
            }

            const tabDiv = `
                        <div data-w-tab="Tab ${tabCount}" class="w-tab-pane ${isTabActive}"
                             id="w-tabs-0-data-w-pane-${tabCount}" role="tabpanel" aria-labelledby="w-tabs-0-data-w-tab-${tabCount}">
                            <div class="draw-all-pls-tab-pane_all-blocks"></div>
                        </div>
            `;

            $(".w-tab-content").append(tabDiv)

            const newTab = $(`#w-tabs-0-data-w-pane-${tabCount} .draw-all-pls-tab-pane_all-blocks`);

            for(let j=0; j<sortPlayers[i].length; j++){
                addDrawTab(newTab, sortPlayers[i][j])
            }

            tabCount++;
        }

        window.Webflow.require('tabs').redraw()
    }

    function addPlayerInTab(player, tabCount) {

        let imageDiv = '';
        if(player.avatar === null) {
            imageDiv = `<img src='${getAvatar(player.avatar)}'> `;
        } else {
            imageDiv = `<div class="new-player_select-lottie" data-w-id="b9331727-d1d7-9e55-2192-f208b7a36580"
                                     data-animation-type="lottie"
                                     data-src="${getAvatar(player.avatar)}"
                                     data-loop="0" data-direction="1" data-autoplay="1" data-is-ix2-target="0"
                                     data-renderer="svg" data-duration="0">`;
        }

        let isTabActive = '';
        if(tabCount === 1) {
            isTabActive = 'w--current';
        }

        const tabDiv = `
               <a data-w-tab="Tab ${tabCount}"
                           class="draw-all-pls-item w-inline-block w-tab-link ${isTabActive}"
                           id="w-tabs-0-data-w-tab-${tabCount}"
                           href="#w-tabs-0-data-w-pane-${tabCount}" role="tab"
                           aria-controls="w-tabs-0-data-w-pane-${tabCount}"
                           aria-selected="true">
                            <div class="draw-ch_img-wrap">${imageDiv}</div>
                            </div>
                            <div class="par-dash-txt-16-21">${player.name || 'Guest'}</div>
                        </a>
        `;

        $(".w-tab-menu").append(tabDiv)
    }

    function addDrawTab(tab, item) {
        const { drawingGuessID: { firstGuess, secondGuess, thirdGuess } , promptData, outOfTime } = item;
        const [ promptDataArray ] = promptData;
        const {selectedPrompt} = promptDataArray;

        let imageDiv = '';
        if(item.playerID.avatar === null) {
            imageDiv = `<img src='${getAvatar(item.playerID.avatar)}'> `;
        } else {
            imageDiv = `<div class="new-player_select-lottie"
                                                 data-w-id="fd4c501f-8b68-e11a-16e0-43bab8406715"
                                                 data-animation-type="lottie"
                                                 data-src="${getAvatar(item.playerID.avatar)}"
                                                 data-loop="0" data-direction="1" data-autoplay="1"
                                                 data-is-ix2-target="0" data-renderer="svg" data-duration="0">
                                            </div>`;
        }

        const dateText = UTCToLocalTimeString(new Date(item.UTCDate), item.userUTCOffset);

        const promptOptions = [
            {
                option: 'option_1',
                value: item.selectedPrompt.option_1
            },
            {
                option: 'option_2',
                value: item.selectedPrompt.option_2
            },
            {
                option: 'option_3',
                value: item.selectedPrompt.option_3
            },
        ];

        const question = promptOptions.map((item, index) => {
            const letter = "abc"[index];

            let statusClass = '';
            if(
                (item.option === firstGuess?.selectedPrompt && item.option === selectedPrompt) ||
                (item.option === secondGuess?.selectedPrompt && item.option === selectedPrompt) ||
                (item.option === thirdGuess?.selectedPrompt && item.option === selectedPrompt)
            ) {
                statusClass = 'success';
            }

            if(
                (firstGuess && item.option === firstGuess.selectedPrompt && item.option !== selectedPrompt) ||
                (secondGuess && item.option === secondGuess.selectedPrompt && item.option !== selectedPrompt) ||
                (thirdGuess && item.option === thirdGuess.selectedPrompt && item.option !== selectedPrompt)
            ) {
                statusClass = 'error';
            }

            if(
                ((outOfTime && item.option === selectedPrompt) || (!firstGuess && !secondGuess && !thirdGuess)) &&
                item.option === selectedPrompt
            ) {
                statusClass = 'waiting';
            }

            return `
                    <div class="draw-ch_item ${statusClass}">
                        <div class="draw-ch_item_left">
                            <div class="draw-ch_numb ${statusClass}">
                                <div class="draw-ch_txt">${letter}</div>
                            </div>
                            <div class="txt-20-26">${item.value}</div>
                        </div>
                        <div class="draw-success-img ${statusClass}"></div>
                    </div>
            `
        })

        const div = `
                     <div class="draw-all-answ-item">
                                    <div class="draw-ch_top">
                                        <div class="draw-ch_img-wrap">${imageDiv}</div>
                                        <div class="deaw-ch_top-para">
                                            <div class="par-dash-txt-16-21">${item.playerID.name || "Guest"}</div>
                                            <div class="par-dash-txt-16-21 op-6">${dateText}</div>
                                        </div>
                                    </div>
                                    <div class="canv-block w-embed">
                                        <canvas id="canvas_${item._id}" class="draw-canv" data-original-width="${item.canvasSize.width}" data-original-height="${item.canvasSize.height}"></canvas>
                                    </div>
                                    <div class="draw-ch_slide_bttm">${question.join('')}</div>
                                </div>
        `;

        $(tab).append(div);
    }


    function drawCanvas() {
        drawingsTabArray.forEach((drawing, drawingIndex) => {
            const canvas = document.getElementById(`canvas_${drawing._id}`);
            const context = canvas.getContext("2d");
            const currentScaleFactor = canvas.dataset.scaleFactor;

            let currentStroke = 0;
            for (let point of drawing.strokeData) {
                // Uses the previously created setTimeout wrapper to return an object containing the callback argument, delay, and id of the timeout
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
                    context.arc(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor, context.lineWidth / 2, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                    context.beginPath();
                    context.moveTo(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor);
                } else {
                    context.lineTo(point.xPosition * currentScaleFactor, point.yPosition * currentScaleFactor);
                    context.stroke();
                    timeoutArr.shift();
                }
            }
        })
    }

    tabs();
    loadAnimation();
    setCanvasWidthHeight(drawingsArray);
    setCanvasWidthHeight(drawingsTabArray, false);
    drawCanvas(drawingsTabArray);

    $(document).ready(() => {
        $(".txt-or").text(drawingsArray.length);
        $(".home-dash-link_number > div").text(drawingsArray.length);
        $(".txt-20-26 > span").text(drawingsTabArray.length);
        $(".par-name").text(userInfo.information['first-name']);

        $(".draw-all-pls-item").click(() => {
            drawCanvas(drawingsTabArray);
        })

        $(document).on( "click", ".play_canvas", function() {
            $(this).css({display: 'none'})
            const dataId = $(this).attr('data-id');
            const draw = drawingsArrays.find((item) => item._id === dataId);

            if(draw.strokeData.length === 0) {
                return false;
            }

            const drawingTime = draw.strokeData[draw.strokeData.length - 1].timeSinceGameStart;

            const requestSetTimeOut = (id) => {
                return setTimeout(() => {
                    const index = requestQuestion.findIndex((item) => item.id === id);
                    clearTimeout(requestQuestion[index].timeOut);

                    if(requestQuestion[index].status === 'pending') {
                        requestQuestion[index].status = 'done';
                        sendQuestion(requestQuestion[index].data);

                        const draw = drawingsArray.find((item) => item._id === id);
                        const option = draw.promptData[0].selectedPrompt;
                        $(`.status_${id}_${option}`).addClass('waiting');
                    }
                }, drawingTime + 5000);
            }

            requestQuestion.push({
                status: 'pending',
                dateNow: Date.now(),
                id: draw._id,
                timeOut: requestSetTimeOut(draw._id),
                selectoptions: [],
                data: {
                    userInfo: {memberstackID: userId},
                    drawingID: draw._id,
                    UTCDate: (new Date()).toISOString(),
                    userUTCOffset: (new Date()).getTimezoneOffset(),
                    firstGuess:	null,
                    secondGuess: null,
                    thirdGuess: null,
                    guessCountdownTime: drawingTime + 5000,
                    correctPromptChosen: false
                }
            })

            const canvas = document.getElementById(`canvas_${dataId}`);
            const context = canvas.getContext("2d");
            const currentScaleFactor = canvas.dataset.scaleFactor;

            timer(draw)

            // Variable to track the current stroke
            let currentStroke = 0;
            for (let point of draw.strokeData) {
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
        });

        $(document).on( "click", ".questions", function() {
            const option = $(this).attr("data-option");
            const id = $(this).attr("data-id");
            const isPlayIndex = requestQuestion.findIndex((item) => item.id === id);

            if(isPlayIndex < 0) {
                $(`#play_but_${id}`).addClass('animate').one('animationend', function() {
                    $(this).removeClass('animate');
                });
            } else {
                if(requestQuestion[isPlayIndex].selectoptions.includes(option)){
                    return false;
                }

                if(requestQuestion[isPlayIndex].status === 'pending') {
                    requestQuestion[isPlayIndex].selectoptions.push(option);

                    const draw = drawingsArray.find((item) => item._id === requestQuestion[isPlayIndex].id);

                    let isWrite = false;
                    if (requestQuestion[isPlayIndex].data.firstGuess === null && !isWrite) {
                        requestQuestion[isPlayIndex].data.firstGuess = {
                            selectedPrompt: option,
                            timeSinceGuessStart: Date.now() - requestQuestion[isPlayIndex].dateNow
                        }
                        requestQuestion[isPlayIndex].data.correctPromptChosen = draw.promptData[0].selectedPrompt === option;
                        isWrite = true;
                    }

                    if (requestQuestion[isPlayIndex].data.secondGuess === null && !isWrite) {
                        requestQuestion[isPlayIndex].data.secondGuess = {
                            selectedPrompt: option,
                            timeSinceGuessStart: Date.now() - requestQuestion[isPlayIndex].dateNow
                        }
                        requestQuestion[isPlayIndex].data.correctPromptChosen = draw.promptData[0].selectedPrompt === option;
                        isWrite = true;
                    }

                    if (requestQuestion[isPlayIndex].data.thirdGuess === null && !isWrite) {
                        requestQuestion[isPlayIndex].data.thirdGuess = {
                            selectedPrompt: option,
                            timeSinceGuessStart: Date.now() - requestQuestion[isPlayIndex].dateNow
                        }
                        requestQuestion[isPlayIndex].data.correctPromptChosen = draw.promptData[0].selectedPrompt === option;
                    }

                    let statusClass = '';
                    if(requestQuestion[isPlayIndex].data.correctPromptChosen && requestQuestion[isPlayIndex].status === 'pending'){
                        requestQuestion[isPlayIndex].status = 'done';
                        clearTimeout(requestQuestion[isPlayIndex].timeOut);
                        sendQuestion(requestQuestion[isPlayIndex].data);

                        statusClass = 'success';
                    }

                    if(!requestQuestion[isPlayIndex].data.correctPromptChosen) {
                        statusClass = 'error';
                    }

                    $(`.status_${id}_${option}`).addClass(statusClass);

                } else {
                    console.log('DONE', requestQuestion[isPlayIndex]);
                }
            }
        })
    })

    function sendQuestion(data) {
        $.ajax({
            type: "PUT",
            url: "https://kanjo-web-app.herokuapp.com/guesses",
            data: JSON.stringify(data),
            contentType: "application/json",
        });
    }
})
