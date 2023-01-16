// Remember - the fetch for insight data itself is very quick - it appears it's the generation of the graphs which takes a while
// TODO - you're sending datatable objects from the back end to the frontend - might be better to send an array instead so order is preserved, or change the logic in the frontend
// TODO - maybe create all the sunburst charts to begin with and then just hide and hide/show them accordingly? that way you won't need to change the data which causes the slowdown
// either that or do something which recursively goes through each document and just updates the colour - as that's less expensive than changing all of the data

// if(avatar === 'pineapple') {
//     jsonFile = 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa236a47c02d5e7bdc2_Konjo_6_Yellow_orange_bake.json';
// } else if(avatar === 'rabbit') {
//     jsonFile = 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2e38261a8839209a9_Konjo_3_Green_bake.json';
// }else if(avatar === 'house') {
//     jsonFile = 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa1ccb1e1320b34ee7f_Konjo_1_Purplesmile_bake.json';
// }else if(avatar === 'circle') {
//     jsonFile='https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa26cd7cb745d745573_Konjo_7_Robot_bake.json';
// }else if(avatar === 'apple') {
//     jsonFile='https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa236a47c02d5e7bdc2_Konjo_6_Yellow_orange_bake.json';
// }else if(avatar === 'square') {
//     jsonFile='https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2e3826121349209a8_Konjo_5_Yellow_bake.json';
// }else if(avatar === 'cat') {
//     jsonFile='https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2e38261eb289209ab_Konjo_9_Owl_bake.json';
// }else if(avatar === 'melon') {
//     jsonFile='https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa2335f3837cbdeba09_Konjo_4_Ninja_bake.json';
// }else if(avatar === 'triangle') {
//     jsonFile='https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63bfcfa294906e9c5cfbf74c_Konjo_8_Pink_bake.json';
// }

// window.Webflow.require('lottie').init()


$(document).ready(async function () {

    localStorage.setItem('memberstack', '{"spEditor":false,"defaultMembership":"6317441a067d830004f55397","colorCode":"2aa8ff","loginPage":"","allow_signup":false,"protected":[{"id":"basic-members","redirect":"login","urls":[{"url":"members","filter":"Starts"}],"access":true,"hide_links":false}],"hasRecaptchaV2":false,"hasRecaptchaV3":false,"redirectOverride":"","membership":{"id":"6317441a067d830004f55397","amount":"","status":"active","cancel_at_period_end":false,"name":"Basic","signupDate":"2022-12-14T10:55:14.000Z"},"information":{"first-name":"Marina","last-name":"Romanova","newsletter-optin":false,"webflow-member-id":"6399ab9545bd049fdddbc676","mongo-account-created":"created","id":"6399ab9269253100049eef34"},"testWarning":false,"email":"marigoroma@gmail.com","hash":"02c026758ee975877aa142f4c839b4cfefe8e4491beb0e5b9a948ef9d60120ef","redirect":"members/dashboard","client_secret":"","requires_payment":false,"loginRedirect":"members/dashboard","logoutRedirect":"logout","uniqueContent":"","canceled":false}')

    var memberstackLocal = localStorage.getItem('memberstack');
    if(!memberstackLocal) {
        window.location.href = 'https://new-3d33ad.webflow.io/login'
    }

    var jMemeber = JSON.parse(memberstackLocal);
    var userId = jMemeber.information.id;

    // $(".w-embed").append(``);
    // $(".w-embed").append(`
    // <div id="sunburst-chart-container">

    // </div>
    // `);

    const $section = $(".embed-container");
    // const $sideBar = $(`<div id="side-bar" style="display: none;"></div>`).пре($("body"));
    const $sideBar = $(`#side-bar`);
    let $sideBarPlayerButtons;
    const $insightsGrid = $("#insights-grid");
    const $insightParagraphs = $(".insight-description");
    const $dropdownMenu = $("#player-dropdown");
    const $dropdownMenuButton = $("#dropdown-select-button");
    const $dropdownMenuSelectedAvatar = $("#dropdown-select-button-avatar");
    const $dropdownMenuSelectedName = $("#dropdown-select-button-text");
    const $dropdownMenuOptions = $("#dropdown-menu-options")
    const $navigationBar = $(".navigation");
    const $footerBar = $(".footer");

    // $(window).on("resize.custom", () => {
    //
    //     $insightParagraphs.css("min-height", "initial");
    //     let maxHeight = 0;
    //     $insightParagraphs.each((index, element) => {
    //         if ($(element).height() > maxHeight) {
    //             maxHeight = $(element).height();
    //         };
    //     });
    //     $insightParagraphs.css("min-height", maxHeight);
    //
    //     if (!sideBarAtBottom) {
    //         $sideBar.css({
    //             top: (($(window).height() - $navigationBar.outerHeight()) - $sideBar.outerHeight()) / 2 + $navigationBar.outerHeight()
    //         });
    //     };
    //
    //     sizeSunburstFont();
    //
    // });

    // $(document).on("scroll.positionSidebar", () => {
    //     const footerOffset = $footerBar.offset().top;
    //     if ($sideBar.offset().top + $sideBar.outerHeight() + 20 >= footerOffset) {
    //         $sideBar.css({
    //             position: "absolute",
    //             top: $footerBar.offset().top - 20 - $sideBar.outerHeight(),
    //         });
    //         sideBarAtBottom = true;
    //     };
    //     if (Math.abs($sideBar[0].getBoundingClientRect().bottom - window.innerHeight) < (($(window).height() - $navigationBar.outerHeight()) - $sideBar.outerHeight()) / 2) {
    //         $sideBar.css({
    //             position: "fixed",
    //             top: (($(window).height() - $navigationBar.outerHeight()) - $sideBar.outerHeight()) / 2 + $navigationBar.outerHeight()
    //         });
    //         sideBarAtBottom = false;
    //     };
    // });

    let sideBarAtBottom = false;
    let dropdownPressed = false;

    $dropdownMenuButton.click(() => {
        if (!dropdownPressed) {
            $dropdownMenuOptions.css({
                "-webkit-animation-duration": "0.35s",
                "animation-duration": "0.35s"
            });
            dropdownPressed = true;
        }
        $dropdownMenu.toggleClass("active");
    })

    // $sideBar.css({
    //     top: (($(window).height() - $navigationBar.outerHeight()) - $sideBar.outerHeight()) / 2 + $navigationBar.outerHeight()
    // });

    const getPlayerAvatarSrc = function (avatar) {
        // if (avatar === null) {
        //     avatar = "guest";
        // };
        // const jpgStrArr = ["634548b9ae4c28d270dc4e8b_avatar_01_pineapple", "634548b9235565840ef0b0da_avatar_02_rabbit", "634548b9ab5f9d591adb4650_avatar_03_house", "634545e58f4ce3058b5c97b4_avatar_04_circle", "634548dfab5f9d2d7edb4a21_avatar_05_apple", "634545a66c9af3616cf9a595_avatar_06_square", "634548ba0f64bcf6af4683fb_avatar_07_cat", "634548bb0565145a3fd769ca_avatar_08_melon", "634545a61033b34d1f7edc06_avatar_09_triangle", "635bb4231f3d76829fb9ba0c_avatar_00_guest"];
        // const avatarSlug = "\\d_" + avatar + "$";
        // const matchedStr = jpgStrArr.find((str) => {
        //     const regex = new RegExp(avatarSlug, "g");
        //     return str.match(regex) !== null;
        // });
        // return `https://uploads-ssl.webflow.com/6315d8bfcaf1234c30aa1942/${matchedStr}.jpg`;

        if (avatar === null) {
            return 'https://uploads-ssl.webflow.com/639b28d64a19b13d69a32af9/63c51697a9b6a0691084908b_guest-norm.png';
        };

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

    };

    const getPlayerFirstName = function (name) {
        if (name === null) {
            name = "Guest";
        };
        return name.match(/\w+/g)[0];
    };

    const playerButtonGenerator = function (name, avatar) {
        const firstName = getPlayerFirstName(name);

        let image = '';
        if(avatar === null) {
            image = `<img class="avatarimg" src="${getPlayerAvatarSrc(avatar)}">`
        } else {
            image = `<div class="player-button-avatar" data-src=${getPlayerAvatarSrc(avatar)}></div>`
        }

        const $playerButton = $(
            `<button class="player-button">
             ${image}
        <p class="player-button-name">${firstName}</p>
      </button>`
        );
        $playerButton.click(function () {
            const playerNumber = $sideBarPlayerButtons.index(this) + 1;
            if (selectedPlayerNumber !== playerNumber) {
                selectedPlayerNumber = playerNumber;
                changeChartData(selectedPlayerNumber);
                $sideBarPlayerButtons.attr('class', 'player-button');
                $(this).attr('class', 'player-button player-button-selected');

                $dropdownMenuSelectedAvatar.attr("src", getPlayerAvatarSrc(players[playerNumber - 1].avatar));
                $dropdownMenuSelectedName.text(getPlayerFirstName(players[playerNumber - 1].name));

                $dropdownMenuSelectedAvatar.attr("src", getPlayerAvatarSrc(players[playerNumber - 1].avatar));
                $dropdownMenuSelectedName.text(getPlayerFirstName(players[playerNumber - 1].name));
            };
        });
        return $playerButton;
    };

    const playerDropdownOptionGenerator = function (name, avatar) {
        const firstName = getPlayerFirstName(name);
        const $playerDropdownOption = $(`
    <li class="dropdown-menu-option">
      <img class="dropdown-menu-option-avatar" src=${getPlayerAvatarSrc(avatar)}>
      <span class="dropdown-menu-option-text">${firstName}</span>
    </li>
    `)
        $playerDropdownOption.click(function () {
            const playerNumber = $dropdownPlayerOptions.index(this) + 1;
            if (selectedPlayerNumber !== playerNumber) {
                selectedPlayerNumber = playerNumber;
                changeChartData(selectedPlayerNumber);

                $dropdownMenuSelectedAvatar.attr("src", getPlayerAvatarSrc(players[playerNumber - 1].avatar));
                $dropdownMenuSelectedName.text(getPlayerFirstName(players[playerNumber - 1].name));

                $sideBarPlayerButtons.attr('class', 'player-button');
                $sideBarPlayerButtons.eq(playerNumber - 1).attr('class', 'player-button player-button-selected');
            };
            $dropdownMenu.toggleClass("active");
        });
        return $playerDropdownOption;
    };

    const membershipInfo = await MemberStack.onReady;
    userInfo = {
        memberstackID: membershipInfo["id"]
    };

    const [players, insightData] = await Promise.all([
        $.ajax({
            type: "GET",
            // url: `http://127.0.0.1:3000/users/${userInfo.memberstackID}/added-profiles`,
            url: `https://kanjo-web-app.herokuapp.com/users/${userId}/added-profiles`,
            // add error handling here, not a popup
            statusCode: {
                500: function () {

                }
            },
            error: {

            }
        }),
        await $.ajax({
            type: "GET",
            // url: `http://127.0.0.1:3000/insights/${userInfo.memberstackID}`,
            url: `https://kanjo-web-app.herokuapp.com/users/${userId}/insights`,
            data: {
                userUTCOffset: new Date().getTimezoneOffset()
            }
        })
    ]);
    $("#insights-container").css("display", "");
    let maxHeight = 0;
    $insightParagraphs.each((index, element) => {
        if ($(element).height() > maxHeight) {
            maxHeight = $(element).height();
        };
    });
    $insightParagraphs.css("min-height", maxHeight);

    players.forEach((player) => {
        $sideBar.append(playerButtonGenerator(player.name, player.avatar));
        $dropdownMenuOptions.append(playerDropdownOptionGenerator(player.name, player.avatar))
    });
    $sideBarPlayerButtons = $(".player-button");
    $dropdownPlayerOptions = $(".dropdown-menu-option");


    setTimeout(()=>{
        for(let i=0;i<$('.player-button').length;i++) {
            lottie.loadAnimation({
                container: document.getElementsByClassName('player-button-avatar')[i],
                render: 'svg',
                loop: false,
                autoplay: true,
                path:  document.getElementsByClassName('player-button-avatar')[i]?.getAttribute('data-src'),
                name: i
            })
        }
    },500)

    let selectedPlayerNumber = 1;
    $sideBarPlayerButtons.eq(0).attr('class', 'player-button player-button-selected');
    $dropdownMenuSelectedAvatar.attr("src", getPlayerAvatarSrc(players[0].avatar));
    $dropdownMenuSelectedName.text(getPlayerFirstName(players[0].name));

    $sideBar.css("display", "");
    $dropdownMenu.css("display", "");

    const objectiveMetricBarColors = [
        {
            sufficientData: 'rgba(0, 82, 120, 1)',
            lackingData: 'rgba(0, 82, 120, 0.25)'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            sufficientData: 'rgba(16, 83, 62, 1)',
            lackingData: 'rgba(16, 83, 62, 0.25)'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            sufficientData: 'rgba(60, 40, 78, 1)',
            lackingData: 'rgba(60, 40, 78, 0.25)'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            sufficientData: 'rgba(116, 40, 44, 1)',
            lackingData: 'rgba(116, 40, 44, 0.25)'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            sufficientData: 'rgba(122, 79, 23, 1)',
            lackingData: 'rgba(122, 79, 23, 0.25)'
            // borderColor: 'rgba(255, 99, 132, 1)',
        }
    ];

    const kanjoInsightBarColors = [
        {
            // sufficientData: 'rgba(0, 174, 239, 1)',
            // lackingData: 'rgba(0, 174, 239, 0.25)'
            sufficientData: '#212F7C',
            lackingData: '#FED075'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            // sufficientData: 'rgba(32, 167, 124, 1)',
            // lackingData: 'rgba(32, 167, 124, 0.25)'
            sufficientData: '#212F7C',
            lackingData: '#FED075'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            // sufficientData: 'rgba(119, 80, 156, 1)',
            // lackingData: 'rgba(119, 80, 156, 0.25)'
            sufficientData: '#212F7C',
            lackingData: '#FED075'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            // sufficientData: 'rgba(233, 81, 89, 1)',
            // lackingData: 'rgba(233, 81, 89, 0.25)'
            sufficientData: '#212F7C',
            lackingData: '#FED075'
            // borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            // sufficientData: 'rgba(245, 159, 46, 1)',
            // lackingData: 'rgba(245, 159, 46, 0.25)'
            sufficientData: '#212F7C',
            lackingData: '#FED075'
            // borderColor: 'rgba(255, 99, 132, 1)',
        }
    ]

    const barColors = [
        {
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
        }
    ];

    // CHART 1
    const dataKeyValueArr_1 = Object.entries(insightData.drawingActivityThisMonth);
    const daysInMonth = dataKeyValueArr_1[0][1].length;

    const ctx_1 = $('#chart-daily-activity')[0].getContext('2d');

    const labels_1 = [];
    for (let i = 1; i <= daysInMonth; i++) {
        labels_1.push(i.toString());
    };

    const datasets_1 = [];
    for (let i = 0; i < dataKeyValueArr_1.length; i++) {
        const playerData = dataKeyValueArr_1[i];
        const dataset = {
            label: playerData[0],
            data: playerData[1],
            // backgroundColor: objectiveMetricBarColors[i].sufficientData,
            backgroundColor: '#FF6745',
            // borderColor: barColors[i].borderColor,
            // borderWidth: 0
            borderRadius: '15'
        };
        datasets_1.push(dataset);
    };

    const data_1 = {
        labels: labels_1,
        datasets: [datasets_1[selectedPlayerNumber - 1]]
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const userCurrentMonth = monthNames[d.getMonth()];

    const config_1 = {
        type: 'bar',
        data: data_1,
        options: {
            animation: {
                duration: 1000,
                onComplete: function () {
                    var chartInstance = this,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';
                    ctx.font = "normal 12px Castledown Trial";

                    // Loop through each data in the datasets

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.getDatasetMeta(i);

                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillStyle = bar.options.backgroundColor;
                            if(data != 0) {
                                ctx.fillText(data.toFixed(2), bar.x, bar.y - 5);
                            }
                        });
                    });
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${userCurrentMonth} - Daily Activity`,
                    color: '#000000',
                    align: 'start',
                    font: {
                        family: "Castledown Trial",
                        size: 32,
                        weight: 900,
                    },
                    padding: {
                        bottom: 20
                    }
                },
                legend: {
                    display: false,
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    // position: {
                    //   y: 0,
                    // },
                    title: {
                        display: false,
                        // text: "Date"
                    },
                    grid: {
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                },
                y: {
                    suggestedMin: 0,
                    suggestedMax: Math.max(...datasets_1[selectedPlayerNumber - 1].data) + 1,
                    ticks: {
                        display: false,
                        precision: 0
                    },
                    border: {
                        display: false,
                    },
                    title: {
                        display: false,
                        text: "Number of Drawings"
                    },
                    grid: {
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                }
            }
        }
    };

    const drawingActivityChart = new Chart(ctx_1, config_1);

    //___________________________________________

    // // CHART 2 ___ not in use

    // const dataKeyValueArr_2 = Object.entries(insightData.pointCountByTimeOfDay);

    // const labels_2 = [];
    // const datasets_2 = [];

    // for (let i = 0; i < dataKeyValueArr_2.length; i++) {
    //   const playerData = dataKeyValueArr_2[i];
    //   const playerName = playerData[0];
    //   const playerRawBinData = playerData[1];
    //   const playerAveragedBinData = [];
    //   const binColors = [];
    //   const binCount = playerRawBinData.length;
    //   const interval = 24 / binCount;
    //   const date = new Date(null, null, null, 0, 0, 0, 0);
    //   const playerLabels = [];

    //   for (let i = 0; i < binCount; i++) {
    //     let label;
    //     let hours = ("0" + date.getHours()).slice(-2);
    //     let minutes = ("0" + date.getMinutes()).slice(-2);
    //     label = `${hours}:${minutes}-`
    //     date.setHours(date.getHours() + interval);
    //     hours = ("0" + date.getHours()).slice(-2);
    //     minutes = ("0" + date.getMinutes()).slice(-2);
    //     label += `${hours}:${minutes}`;
    //     playerLabels.push(label);
    //   };
    //   labels_2.push(playerLabels);

    //   for (let i = 0; i < binCount; i++) {
    //     const dataPointsCount = playerRawBinData[i].length;
    //     let lackingData = false;
    //     if (dataPointsCount < 4) {
    //       lackingData = true;
    //     };
    //     playerAveragedBinData.push(playerRawBinData[i].length === 0 ? 0 : playerRawBinData[i].reduce((a, b) => a + b) / dataPointsCount);
    //     binColors.push(lackingData ? 'rgba(54, 162, 235, 0.2)' : 'rgba(54, 162, 235, 0.8)');
    //     // binColors.push(lackingData ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)');
    //     // binColors.push(lackingData ? 'rgba(54, 162, 235, 0.5)' : 'rgb(54, 162, 235)');
    //   }

    //   const dataset = {
    //     label: playerName,
    //     data: playerAveragedBinData,
    //     backgroundColor: binColors,
    //     // borderColor: barColors[i].borderColor,
    //     // borderWidth: 1
    //     borderColor: 'rgba(54, 162, 235, 1)',
    //     borderWidth: 1
    //   };
    //   datasets_2.push(dataset);
    // };

    // const data_2 = {
    //   labels: labels_2[selectedPlayerNumber - 1],
    //   datasets: [datasets_2[selectedPlayerNumber - 1]]
    // };

    // const ctx_2 = $('#chart2')[0].getContext('2d');

    // const config_2 = {
    //   type: 'bar',
    //   data: data_2,
    //   options: {
    //     plugins: {
    //         title: {
    //         display: true,
    //         text: `Average Point Count Per Drawing by Time of Day`,
    //         // text: `All Time - Average Point Count Per Drawing by Time of Day`,
    //         font: {
    //           size: 30
    //         }
    //       },
    //     },
    //     maintainAspectRatio: false,
    //     responsive: true,
    //     scales: {
    //       x: {
    //         title: {
    //           display: true,
    //           text: "Time"
    //         },
    //         grid: {
    //           display: false,
    //           // drawBorder: true,
    //           // drawOnChartArea: true,
    //           // drawTicks: true,
    //         }
    //       },
    //       y: {
    //       suggestedMin: Math.min(...datasets_1[selectedPlayerNumber - 1].data) - (Math.max(...datasets_1[selectedPlayerNumber - 1].data) * 0.1),
    //       suggestedMax: Math.max(...datasets_1[selectedPlayerNumber - 1].data) * 1.1,
    //         ticks: {
    //           precision: 0
    //         },
    //         title: {
    //           display: true,
    //           text: "Average points count per drawing"
    //         },
    //         grid: {
    //           display: false,
    //           // drawBorder: true,
    //           // drawOnChartArea: true,
    //           // drawTicks: true,
    //         }
    //       }
    //     }
    //   }
    // };

    // const pointCountByTimeOfDayChart = new Chart(ctx_2, config_2);

    // __________________________________________

    // CHART 3

    const dataKeyValueArr_3 = Object.entries(insightData.decisivenessByTimeOfDay);

    const labels_3 = [];
    const datasets_3 = [];
    const nonEmptyVals_3 = [];

    for (let i = 0; i < dataKeyValueArr_3.length; i++) {
        const playerNumber = i;
        const playerData = dataKeyValueArr_3[i];
        const playerName = playerData[0];
        const playerRawBinData = playerData[1];
        const playerAveragedBinData = [];
        const binColors = [];
        const binCount = playerRawBinData.length;
        const interval = 24 / binCount;
        const date = new Date(null, null, null, 0, 0, 0, 0);
        const playerLabels = [];
        const playerNonEmptyVals = [];

        if (binCount <= 6) {
            for (let i = 0; i < binCount; i++) {
                let label;
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                label = `${hours}:${minutes}-`
                date.setHours(date.getHours() + interval);
                hours = ("0" + date.getHours()).slice(-2);
                minutes = ("0" + date.getMinutes()).slice(-2);
                label += `${hours}:${minutes}`;
                playerLabels.push(label);
            };
        }
        else {
            for (let i = 0; i < binCount; i++) {
                let label;
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                label = `${hours}:${minutes}`
                date.setHours(date.getHours() + interval);
                playerLabels.push(label);
            };
        };

        labels_3.push(playerLabels);

        for (let i = 0; i < binCount; i++) {
            const dataPointsCount = playerRawBinData[i].length;
            let lackingData = false;
            if (dataPointsCount < 4) {
                lackingData = true;
            };
            let averageVal;
            playerAveragedBinData.push(playerRawBinData[i].length === 0 ? 0 : averageVal = playerRawBinData[i].reduce((a, b) => a + b) / dataPointsCount);
            if (averageVal !== undefined) playerNonEmptyVals.push(averageVal)
            binColors.push(lackingData ? kanjoInsightBarColors[playerNumber].lackingData : kanjoInsightBarColors[playerNumber].sufficientData);
            // binColors.push(lackingData ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)');
            // binColors.push(lackingData ? 'rgba(54, 162, 235, 0.5)' : 'rgb(54, 162, 235)');
        };

        nonEmptyVals_3.push(playerNonEmptyVals);

        const dataset = {
            label: playerName,
            data: playerAveragedBinData,
            backgroundColor: binColors,
            // backgroundColor: '#FED075',
            // borderColor: barColors[i].borderColor,
            // borderWidth: 1
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 0,
            borderRadius: 15
        };
        datasets_3.push(dataset);
    };

    const data_3 = {
        labels: labels_3[selectedPlayerNumber - 1],
        datasets: [datasets_3[selectedPlayerNumber - 1]],
    };

    // for(let i=0;i<data_3.datasets.length;i++) {
    //     if(i%2===1){
    //         data_3.datasets[i].backgroundColor = '#212F7C';
    //     } else {
    //         data_3.datasets[i].backgroundColor = '#FED075';
    //     }
    // }

    const ctx_3 = $('#chart-decisiveness')[0].getContext('2d');

    const config_3 = {
        type: 'bar',
        data: data_3,
        options: {
            animation: {
                duration: 1000,
                onComplete: function () {
                    var chartInstance = this,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';
                    ctx.font = "normal 12px Castledown Trial";

                    // Loop through each data in the datasets

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.getDatasetMeta(i);

                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillStyle = bar.options.backgroundColor;
                            if(data != 0) {
                                ctx.fillText(data.toFixed(2), bar.x, bar.y - 5);
                            }
                        });
                    });
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `k-Decisiveness`,
                    color: '#000000',
                    align: 'start',
                    font: {
                        family: "Castledown Trial",
                        size: 32,
                        weight: 900,
                    }
                },
                padding: {
                    bottom: 20
                },
                legend: {
                    display: false,
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    // position: {
                    //   y: 0,
                    // },
                    // title: {
                    //     display: true,
                    //     text: "Time"
                    // },
                    grid: {
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                },
                y: {
                    border: {
                        display: false,
                    },
                    // min: [0, Math.min(...nonEmptyVals_3[selectedPlayerNumber - 1]) - (Math.max(...nonEmptyVals_3[selectedPlayerNumber - 1]) * 0.1)].sort((a, b) => a - b)[1],
                    // max: Math.max(...nonEmptyVals_3[selectedPlayerNumber - 1]) * 1.1,
                    suggestedMin: 0,
                    suggestedMax: 0,//Math.max(...datasets_3[selectedPlayerNumber - 1].data) * 1.1 === 0 ? 1 : Math.max(...datasets_3[selectedPlayerNumber - 1].data),
                    ticks: {
                        display: false,
                        //     precision: 3
                    },
                    //   title: {
                    //     display: true,
                    //     text: "Average points count per drawing"
                    //   },
                    grid: {
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                }
            },
        }
    };

    const decisivenessByTimeOfDayChart = new Chart(ctx_3, config_3);

    // __________________________________________

    // CHART 4

    const dataKeyValueArr_4 = Object.entries(insightData.excitementByTimeOfDay);

    const labels_4 = [];
    const datasets_4 = [];
    const nonEmptyVals_4 = [];

    for (let i = 0; i < dataKeyValueArr_4.length; i++) {
        const playerNumber = i;
        const playerData = dataKeyValueArr_4[i];
        const playerName = playerData[0];
        const playerRawBinData = playerData[1];
        const playerAveragedBinData = [];
        const binColors = [];
        const binCount = playerRawBinData.length;
        const interval = 24 / binCount;
        const date = new Date(null, null, null, 0, 0, 0, 0);
        const playerLabels = [];
        const playerNonEmptyVals = [];

        if (binCount <= 6) {
            for (let i = 0; i < binCount; i++) {
                let label;
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                label = `${hours}:${minutes}-`
                date.setHours(date.getHours() + interval);
                hours = ("0" + date.getHours()).slice(-2);
                minutes = ("0" + date.getMinutes()).slice(-2);
                label += `${hours}:${minutes}`;
                playerLabels.push(label);
            };
        }
        else {
            for (let i = 0; i < binCount; i++) {
                let label;
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                label = `${hours}:${minutes}`
                date.setHours(date.getHours() + interval);
                playerLabels.push(label);
            };
        };

        labels_4.push(playerLabels);

        for (let i = 0; i < binCount; i++) {
            const dataPointsCount = playerRawBinData[i].length;
            let lackingData = false;
            if (dataPointsCount < 4) {
                lackingData = true;
            };
            let averageVal;
            playerAveragedBinData.push(playerRawBinData[i].length === 0 ? 0 : averageVal = playerRawBinData[i].reduce((a, b) => a + b) / dataPointsCount);
            if (averageVal !== undefined) playerNonEmptyVals.push(averageVal)
            binColors.push(lackingData ? kanjoInsightBarColors[playerNumber].lackingData :  kanjoInsightBarColors[playerNumber].sufficientData);
            // binColors.push(lackingData ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)');
            // binColors.push(lackingData ? 'rgba(54, 162, 235, 0.5)' : 'rgb(54, 162, 235)');
        };

        nonEmptyVals_4.push(playerNonEmptyVals);

        const dataset = {
            label: playerName,
            data: playerAveragedBinData,
            backgroundColor: binColors,
            // borderColor: barColors[i].borderColor,
            // borderWidth: 1
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 0,
            borderRadius: 15,
        };
        datasets_4.push(dataset);
    };


    const data_4 = {
        labels: labels_4[selectedPlayerNumber - 1],
        datasets: [datasets_4[selectedPlayerNumber - 1]]
    };

    const ctx_4 = $('#chart-excitement')[0].getContext('2d');

    const config_4 = {
        type: 'bar',
        data: data_4,
        options: {
            animation: {
                duration: 1000,
                onComplete: function () {
                    var chartInstance = this,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';
                    ctx.font = "normal 12px Castledown Trial";

                    // Loop through each data in the datasets

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillStyle = bar.options.backgroundColor;
                            if(data != 0) {
                                ctx.fillText(data.toFixed(2), bar.x, bar.y - 5);
                            }
                        });
                    });
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `k-Enthusiasm`,
                    color: '#000000',
                    align: 'start',
                    font: {
                        family: "Castledown Trial",
                        size: 32,
                        weight: 900,
                    }
                },
                padding: {
                    bottom: 20
                },
                legend: {
                    display: false,
                },
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        color: () => {
                            return 'red'
                        },
                        font: {
                            size: 40
                        }
                    },
                    border: {
                        display: false,
                    },
                    title: {
                        color: '#FFFFFF',
                    },
                    // position: {
                    //   y: 0,
                    // },
                    // title: {
                    //     display: true,
                    //     text: "Time"
                    // },
                    grid: {
                        drawBorder: false,
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                },
                y: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        color: () => {
                            return 'red'
                        },
                        font: {
                            size: 40
                        }
                    },
                    border: {
                        display: false,
                    },
                    // min: [0, Math.min(...nonEmptyVals_3[selectedPlayerNumber - 1]) - (Math.max(...nonEmptyVals_3[selectedPlayerNumber - 1]) * 0.1)].sort((a, b) => a - b)[1],
                    // max: Math.max(...nonEmptyVals_3[selectedPlayerNumber - 1]) * 1.1,
                    suggestedMin: 0,
                    suggestedMax: Math.max(...datasets_4[selectedPlayerNumber - 1].data) * 1.1 === 0 ? 1 : Math.max(...datasets_4[selectedPlayerNumber - 1].data),
                    ticks: {
                        display: false,
                        // precision: 3
                    },
                    // title: {
                    //   display: true,
                    //   text: "Average points count per drawing"
                    // },
                    grid: {
                        display: false,
                        drawBorder: false,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                }
            }
        }
    };

    const excitementByTimeOfDayChart = new Chart(ctx_4, config_4);

    // ____________________________________

    // CHART 5

    const dataKeyValueArr_5 = Object.entries(insightData.planningByTimeOfDay);

    const labels_5 = [];
    const datasets_5 = [];
    const nonEmptyVals_5 = [];

    for (let i = 0; i < dataKeyValueArr_5.length; i++) {
        const playerNumber = i;
        const playerData = dataKeyValueArr_5[i];
        const playerName = playerData[0];
        const playerRawBinData = playerData[1];
        const playerAveragedBinData = [];
        const binColors = [];
        const binCount = playerRawBinData.length;
        const interval = 24 / binCount;
        const date = new Date(null, null, null, 0, 0, 0, 0);
        const playerLabels = [];
        const playerNonEmptyVals = [];

        if (binCount <= 6) {
            for (let i = 0; i < binCount; i++) {
                let label;
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                label = `${hours}:${minutes}-`
                date.setHours(date.getHours() + interval);
                hours = ("0" + date.getHours()).slice(-2);
                minutes = ("0" + date.getMinutes()).slice(-2);
                label += `${hours}:${minutes}`;
                playerLabels.push(label);
            };
        }
        else {
            for (let i = 0; i < binCount; i++) {
                let label;
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                label = `${hours}:${minutes}`
                date.setHours(date.getHours() + interval);
                playerLabels.push(label);
            };
        };

        labels_5.push(playerLabels);

        for (let i = 0; i < binCount; i++) {
            const dataPointsCount = playerRawBinData[i].length;
            let lackingData = false;
            if (dataPointsCount < 4) {
                lackingData = true;
            };
            let averageVal;
            playerAveragedBinData.push(playerRawBinData[i].length === 0 ? 0 : averageVal = playerRawBinData[i].reduce((a, b) => a + b) / dataPointsCount);
            if (averageVal !== undefined) playerNonEmptyVals.push(averageVal)
            binColors.push(lackingData ? kanjoInsightBarColors[playerNumber].lackingData :  kanjoInsightBarColors[playerNumber].sufficientData);
            // binColors.push(lackingData ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)');
            // binColors.push(lackingData ? 'rgba(54, 162, 235, 0.5)' : 'rgb(54, 162, 235)');
        };

        nonEmptyVals_5.push(playerNonEmptyVals);

        const dataset = {
            label: playerName,
            data: playerAveragedBinData,
            backgroundColor: binColors,
            // borderColor: barColors[i].borderColor,
            // borderWidth: 1
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 0,
            borderRadius: 15,
        };
        datasets_5.push(dataset);
    };

    const data_5 = {
        labels: labels_5[selectedPlayerNumber - 1],
        datasets: [datasets_5[selectedPlayerNumber - 1]]
    };

    const ctx_5 = $('#chart-planning')[0].getContext('2d');

    const config_5 = {
        type: 'bar',
        data: data_5,
        options: {
            animation: {
                duration: 1000,
                onComplete: function () {
                    var chartInstance = this,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';
                    ctx.font = "normal 12px Castledown Trial";

                    // Loop through each data in the datasets

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillStyle = bar.options.backgroundColor;
                            if(data != 0) {
                                ctx.fillText(data.toFixed(2), bar.x, bar.y - 5);
                            }
                        });
                    });
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `k-Planning`,
                    color: '#000000',
                    align: 'start',
                    font: {
                        family: "Castledown Trial",
                        size: 32,
                        weight: 900,
                    }
                },
                padding: {
                    bottom: 20
                },
                legend: {
                    display: false,
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    // position: {
                    //   y: 0,
                    // },
                    // title: {
                    //     display: true,
                    //     text: "Time"
                    // },
                    tickColor: '#FFFFFF',
                    color: '#FFFFFF',
                    grid: {
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                },
                y: {
                    border: {
                        display: false,
                    },
                    // min: [0, Math.min(...nonEmptyVals_3[selectedPlayerNumber - 1]) - (Math.max(...nonEmptyVals_3[selectedPlayerNumber - 1]) * 0.1)].sort((a, b) => a - b)[1],
                    // max: Math.max(...nonEmptyVals_3[selectedPlayerNumber - 1]) * 1.1,
                    suggestedMin: 0,
                    suggestedMax: Math.max(...datasets_5[selectedPlayerNumber - 1].data) * 1.1 === 0 ? 1 : Math.max(...datasets_5[selectedPlayerNumber - 1].data),
                    ticks: {
                        display: false,
                        // precision: 3
                    },
                    // title: {
                    //   display: true,
                    //   text: "Average points count per drawing"
                    // },
                    grid: {
                        display: false,
                        // drawBorder: true,
                        // drawOnChartArea: true,
                        // drawTicks: true,
                    }
                }
            }
        }
    };

    const planningByTimeOfDayChart = new Chart(ctx_5, config_5);

    // _______________________________________________


    // CHART 5

    let sunburstChart;
    let sunburstDatasets;
    const sizeSunburstFont = function () {
        if (window.matchMedia("only screen and (min-width: 1150px)").matches) {
            sunburstChart.fontSize = $(window).width() / 75;
        }
        else if (window.matchMedia("only screen and (min-width: 970px)").matches) {
            sunburstChart.fontSize = $(window).width() / 80;
        }
        else if (window.matchMedia("only screen and (min-width: 860px)").matches) {
            sunburstChart.fontSize = $(window).width() / 90;
        }
        else if (window.matchMedia("only screen and (min-width: 820px)").matches) {
            sunburstChart.fontSize = $(window).width() / 100;
        }
        else if (window.matchMedia("only screen and (min-width: 570px)").matches) {
            sunburstChart.fontSize = $(window).width() / 65;
        }
        else {
            sunburstChart.fontSize = $(window).width() / 70;
        };
        // else if (window.matchMedia("only screen and (min-width: 0px)").matches) {
        //   sunburstChart.fontSize = $(window).width() / 70;
        // }
    };

    setTimeout(() => {

        am4core.useTheme(am4themes_animated);

        // Create the chart

        const getRGBAForSegment = function (emotion, count) {
            if (!count) {
                // light grey color
                return "rgba(190, 190, 190, 0.4)"
            };

            const opacity = count / 5 >= 1 ? 1 : count / 5;

            if (["Angry", "Hurt", "Jealous", "Hateful", "Furious", "Annoyed", "Critical", "Offended", "Selfish", "Spiteful", "Rageful", "Frustrated", "Skeptical"].includes(emotion)) {
                return `rgba(233, 81, 89, ${opacity})`
            }
            else if (["Scared", "Rejected", "Confused", "Helpless", "Weak", "Embarrassed", "Worried", "Discouraged", "Bewildered", "Insignificant", "Inadequate", "Awkward", "Anxious"].includes(emotion)){
                return `rgba(245, 159, 46, ${opacity})`
            }
            else if (["Happy", "Excited", "Attractive", "Energetic", "Amused", "Playful", "Interested", "Daring", "Charming", "Inspired", "Cheerful", "Creative", "Fascinated"].includes(emotion)) {
                return `rgba(224, 230, 60, ${opacity})`
            }
            else if (["Powerful", "Proud", "Respected", "Appreciated", "Hopeful", "Important", "Confident", "Successful", "Admired", "Valued", "Optimistic", "Intelligent", "Ambitious"].includes(emotion)) {
                return `rgba(32, 167, 124, ${opacity})`
            }
            else if (["Peaceful", "Thankful", "Trusting", "Content", "Loving", "Calm", "Thoughtful", "Nurtured", "Compassionate", "Serene", "Intimate", "Relaxed", "Pensive"].includes(emotion)) {
                return `rgba(0, 174, 239, ${opacity})`
            }
            else if (["Sad", "Bored", "Miserable", "Stupid", "Guilty", "Lonely", "Shy", "Fatigued", "Depressed", "Apathetic", "Ashamed", "Isolated", "Insecure"].includes(emotion)) {
                return `rgba(119, 80, 156, ${opacity})`
            };

        };

        const sunburstDataKeyValueArr = Object.entries(insightData.emotionalVocabularyCount);
        sunburstDatasets = [];

        for (let i = 0; i < players.length; i++) {

            const playerEmotionsCount = sunburstDataKeyValueArr[i][1];

            sunburstDatasets.push([
                {
                    name: "Angry",
                    value: 100,
                    color: am4core.color(getRGBAForSegment("Angry", playerEmotionsCount?.["Angry"])),
                    children: [
                        {
                            name: "Hurt",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Hurt", playerEmotionsCount?.["Hurt"])),
                            children: [
                                {
                                    name: "Offended",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Offended", playerEmotionsCount?.["Offended"])),
                                }
                            ]
                        },
                        {
                            name: "Jealous",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Jealous", playerEmotionsCount?.["Jealous"])),
                            children: [
                                {
                                    name: "Selfish",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Selfish", playerEmotionsCount?.["Selfish"]))
                                }
                            ]
                        },
                        {
                            name: "Hateful",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Hateful", playerEmotionsCount?.["Hateful"])),
                            children: [
                                {
                                    name: "Spiteful",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Spiteful", playerEmotionsCount?.["Spiteful"]))
                                }
                            ]
                        },
                        {
                            name: "Furious",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Furious", playerEmotionsCount?.["Furious"])),
                            children: [
                                {
                                    name: "Rageful",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Rageful", playerEmotionsCount?.["Rageful"]))
                                }
                            ]
                        },
                        {
                            name: "Annoyed",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Annoyed", playerEmotionsCount?.["Annoyed"])),
                            children: [
                                {
                                    name: "Frustrated",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Frustrated", playerEmotionsCount?.["Frustrated"]))
                                }
                            ]
                        },
                        {
                            name: "Critical",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Critical", playerEmotionsCount?.["Critical"])),
                            children: [
                                {
                                    name: "Skeptical",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Skeptical", playerEmotionsCount?.["Skeptical"]))
                                }
                            ]
                        },
                    ]
                },
                {
                    name: "Scared",
                    value: 100,
                    color: am4core.color(getRGBAForSegment("Scared", playerEmotionsCount?.["Scared"])),
                    children: [
                        {
                            name: "Rejected",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Rejected", playerEmotionsCount?.["Rejected"])),
                            children: [
                                {
                                    name: "Discouraged",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Discouraged", playerEmotionsCount?.["Discouraged"]))
                                }
                            ]
                        },
                        {
                            name: "Confused",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Confused", playerEmotionsCount?.["Confused"])),
                            children: [
                                {
                                    name: "Bewildered",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Bewildered", playerEmotionsCount?.["Bewildered"]))
                                }
                            ]
                        },
                        {
                            name: "Helpless",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Helpless", playerEmotionsCount?.["Helpless"])),
                            children: [
                                {
                                    name: "Insignificant",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Insignificant", playerEmotionsCount?.["Insignificant"]))
                                }
                            ]
                        },
                        {
                            name: "Weak",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Weak", playerEmotionsCount?.["Weak"])),
                            children: [
                                {
                                    name: "Inadequate",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Inadequate", playerEmotionsCount?.["Inadequate"]))
                                }
                            ]
                        },
                        {
                            name: "Embarrassed",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Embarrassed", playerEmotionsCount?.["Embarrassed"])),
                            children: [
                                {
                                    name: "Awkward",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Awkward", playerEmotionsCount?.["Awkward"]))
                                }
                            ]
                        },
                        {
                            name: "Worried",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Worried", playerEmotionsCount?.["Worried"])),
                            children: [
                                {
                                    name: "Anxious",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Anxious", playerEmotionsCount?.["Anxious"]))
                                }
                            ]
                        },
                    ]
                },
                {
                    name: "Happy",
                    value: 100,
                    color: am4core.color(getRGBAForSegment("Happy", playerEmotionsCount?.["Happy"])),
                    children: [
                        {
                            name: "Excited",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Excited", playerEmotionsCount?.["Excited"])),
                            children: [
                                {
                                    name: "Daring",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Daring", playerEmotionsCount?.["Daring"]))
                                }
                            ]
                        },
                        {
                            name: "Attractive",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Attractive", playerEmotionsCount?.["Attractive"])),
                            children: [
                                {
                                    name: "Charming",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Charming", playerEmotionsCount?.["Charming"]))
                                }
                            ]
                        },
                        {
                            name: "Energetic",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Energetic", playerEmotionsCount?.["Energetic"])),
                            children: [
                                {
                                    name: "Inspired",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Inspired", playerEmotionsCount?.["Inspired"]))
                                }
                            ]
                        },
                        {
                            name: "Amused",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Amused", playerEmotionsCount?.["Amused"])),
                            children: [
                                {
                                    name: "Cheerful",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Cheerful", playerEmotionsCount?.["Cheerful"]))
                                }
                            ]
                        },
                        {
                            name: "Playful",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Playful", playerEmotionsCount?.["Playful"])),
                            children: [
                                {
                                    name: "Creative",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Creative", playerEmotionsCount?.["Creative"]))
                                }
                            ]
                        },
                        {
                            name: "Interested",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Interested", playerEmotionsCount?.["Interested"])),
                            children: [
                                {
                                    name: "Fascinated",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Fascinated", playerEmotionsCount?.["Fascinated"]))
                                }
                            ]
                        },
                    ]
                },
                {
                    name: "Powerful",
                    value: 100,
                    color: am4core.color(getRGBAForSegment("Powerful", playerEmotionsCount?.["Powerful"])),
                    children: [
                        {
                            name: "Proud",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Proud", playerEmotionsCount?.["Proud"])),
                            children: [
                                {
                                    name: "Successful",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Successful", playerEmotionsCount?.["Successful"]))
                                }
                            ]
                        },
                        {
                            name: "Respected",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Respected", playerEmotionsCount?.["Respected"])),
                            children: [
                                {
                                    name: "Admired",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Admired", playerEmotionsCount?.["Admired"]))
                                }
                            ]
                        },
                        {
                            name: "Appreciated",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Appreciated", playerEmotionsCount?.["Appreciated"])),
                            children: [
                                {
                                    name: "Valued",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Valued", playerEmotionsCount?.["Valued"]))
                                }
                            ]
                        },
                        {
                            name: "Hopeful",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Hopeful", playerEmotionsCount?.["Hopeful"])),
                            children: [
                                {
                                    name: "Optimistic",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Optimistic", playerEmotionsCount?.["Optimistic"]))
                                }
                            ]
                        },
                        {
                            name: "Important",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Important", playerEmotionsCount?.["Important"])),
                            children: [
                                {
                                    name: "Intelligent",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Intelligent", playerEmotionsCount?.["Intelligent"]))
                                }
                            ]
                        },
                        {
                            name: "Confident",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Confident", playerEmotionsCount?.["Confident"])),
                            children: [
                                {
                                    name: "Ambitious",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Ambitious", playerEmotionsCount?.["Ambitious"]))
                                }
                            ]
                        },
                    ]
                },
                {
                    name: "Peaceful",
                    value: 100,
                    color: am4core.color(getRGBAForSegment("Peaceful", playerEmotionsCount?.["Peaceful"])),
                    children: [
                        {
                            name: "Thankful",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Thankful", playerEmotionsCount?.["Thankful"])),
                            children: [
                                {
                                    name: "Nurtured",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Nurtured", playerEmotionsCount?.["Nurtured"]))
                                }
                            ]
                        },
                        {
                            name: "Trusting",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Trusting", playerEmotionsCount?.["Trusting"])),
                            children: [
                                {
                                    name: "Compassionate",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Compassionate", playerEmotionsCount?.["Compassionate"]))
                                }
                            ]
                        },
                        {
                            name: "Content",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Content", playerEmotionsCount?.["Content"])),
                            children: [
                                {
                                    name: "Serene",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Serene", playerEmotionsCount?.["Serene"]))
                                }
                            ]
                        },
                        {
                            name: "Loving",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Loving", playerEmotionsCount?.["Loving"])),
                            children: [
                                {
                                    name: "Intimate",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Intimate", playerEmotionsCount?.["Intimate"]))
                                }
                            ]
                        },
                        {
                            name: "Calm",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Calm", playerEmotionsCount?.["Calm"])),
                            children: [
                                {
                                    name: "Relaxed",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Relaxed", playerEmotionsCount?.["Relaxed"]))
                                }
                            ]
                        },
                        {
                            name: "Thoughtful",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Thoughtful", playerEmotionsCount?.["Thoughtful"])),
                            children: [
                                {
                                    name: "Pensive",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Pensive", playerEmotionsCount?.["Pensive"]))
                                }
                            ]
                        },
                    ]
                },
                {
                    name: "Sad",
                    value: 100,
                    color: am4core.color(getRGBAForSegment("Sad", playerEmotionsCount?.["Sad"])),
                    children: [
                        {
                            name: "Bored",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Bored", playerEmotionsCount?.["Bored"])),
                            children: [
                                {
                                    name: "Fatigued",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Fatigued", playerEmotionsCount?.["Fatigued"]))
                                }
                            ]
                        },
                        {
                            name: "Miserable",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Miserable", playerEmotionsCount?.["Miserable"])),
                            children: [
                                {
                                    name: "Depressed",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Depressed", playerEmotionsCount?.["Depressed"]))
                                }
                            ]
                        },
                        {
                            name: "Stupid",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Stupid", playerEmotionsCount?.["Stupid"])),
                            children: [
                                {
                                    name: "Apathetic",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Apathetic", playerEmotionsCount?.["Apathetic"]))
                                }
                            ]
                        },
                        {
                            name: "Guilty",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Guilty", playerEmotionsCount?.["Guilty"])),
                            children: [
                                {
                                    name: "Ashamed",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Ashamed", playerEmotionsCount?.["Ashamed"]))
                                }
                            ]
                        },
                        {
                            name: "Lonely",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Lonely", playerEmotionsCount?.["Lonely"])),
                            children: [
                                {
                                    name: "Isolated",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Isolated", playerEmotionsCount?.["Isolated"]))
                                }
                            ]
                        },
                        {
                            name: "Shy",
                            value: 100,
                            color: am4core.color(getRGBAForSegment("Shy", playerEmotionsCount?.["Shy"])),
                            children: [
                                {
                                    name: "Insecure",
                                    value: 100,
                                    color: am4core.color(getRGBAForSegment("Insecure", playerEmotionsCount?.["Insecure"]))
                                }
                            ]
                        },
                    ]
                }
            ]);
        };

        sunburstChart = am4core.create("sunburst-chart-container", am4plugins_sunburst.Sunburst);

        // sunburstChart.radius = am4core.percent(95);
        sunburstChart.radius = am4core.percent(100);

        // Make colors more distinctive
        sunburstChart.colors.step = 2;

        // Add multi-level data
        sunburstChart.data = sunburstDatasets[0];

        // sunburstChart.responsive.enabled;

        // Define data fields
        sunburstChart.dataFields.value = "value";
        sunburstChart.dataFields.name = "name";
        sunburstChart.dataFields.children = "children";
        sunburstChart.dataFields.color = "color";

        sunburstChart.paddingLeft = sunburstChart.paddingRight = -30;
        sunburstChart.paddingTop = 30;
        sunburstChart.paddingBottom = 30;

        sizeSunburstFont();

        // Configure levels
        const level0 = sunburstChart.seriesTemplates.create("0");
        level0.slices.template.tooltipText = "";
        level0.labels.template.text = "{category}";


        const level1 = sunburstChart.seriesTemplates.create("1");
        level1.slices.template.tooltipText = "";
        level1.labels.template.text = "{category}";


        const level2 = sunburstChart.seriesTemplates.create("2");
        level2.slices.template.tooltipText = "";
        level2.labels.template.text = "{category}";

        // const title = sunburstChart.titles.create();
        // title.text = "Emotional Vocabulary";
        // title.fontSize = 30;
        // title.marginBottom = 30;

    }, 1000)

    // Math.min and Math.max will return Infinity and -Infinity respectively if provided the spread of an empty array
    // Additionally, the min and max y-axis values will both be set to 0 if the nonEmptyValues array for a given player only contains the value 0
    // The below loop addresses both of these issues by adding a 0 and 1/1.1 to such arrays, so that the y-axis min/max values will become 0 and 1, respectively
    const nonEmptyVals_all = [nonEmptyVals_3, nonEmptyVals_4, nonEmptyVals_5];
    for (let nonEmptyGraphVals of nonEmptyVals_all) {
        for (let nonEmptyPlayerVals of nonEmptyGraphVals) {
            if (nonEmptyPlayerVals.length === 0 || (nonEmptyPlayerVals.length === nonEmptyPlayerVals.filter((value) => value === 0)).length) {
                nonEmptyPlayerVals.push(0, 1/1.1);
            };
        };
    };

    // ____________________________________________

    let sunburstTimeout = null;
    function changeChartData(selectedPlayerNumber) {
        if (sunburstChart !== null) {
            clearTimeout(sunburstTimeout);
        }
        const graph1Dataset = datasets_1[selectedPlayerNumber - 1];
        drawingActivityChart.data.datasets = [graph1Dataset];
        drawingActivityChart.options.scales.y.suggestedMax = Math.max(...graph1Dataset.data) * 1.1;

        // const graph2Labels = labels_2[selectedPlayerNumber - 1];
        // const graph2Dataset = datasets_2[selectedPlayerNumber - 1]
        // pointCountByTimeOfDayChart.data.labels = graph2Labels;
        // pointCountByTimeOfDayChart.data.datasets = [graph2Dataset];
        // pointCountByTimeOfDayChart.options.scales.y.suggestedMax = Math.max(...graph2Dataset.data) * 1.1;

        const graph3Labels = labels_3[selectedPlayerNumber - 1];
        const graph3Dataset = datasets_3[selectedPlayerNumber - 1];
        // const graph3NonEmptyVals = nonEmptyVals_3[selectedPlayerNumber - 1];
        decisivenessByTimeOfDayChart.data.labels = graph3Labels;
        decisivenessByTimeOfDayChart.data.datasets = [graph3Dataset];
        decisivenessByTimeOfDayChart.options.scales.y.suggestedMax = Math.max(...graph3Dataset.data) * 1.1;
        // decisivenessByTimeOfDayChart.options.scales.y.min = [0, Math.min(...graph3NonEmptyVals) - (Math.max(...graph3NonEmptyVals) * 0.1)].sort((a, b) => a - b)[1];
        // decisivenessByTimeOfDayChart.options.scales.y.max = Math.max(...graph3NonEmptyVals) * 1.1;

        const graph4Labels = labels_4[selectedPlayerNumber - 1];
        const graph4Dataset = datasets_4[selectedPlayerNumber - 1]
        // const graph4NonEmptyVals = nonEmptyVals_4[selectedPlayerNumber - 1];
        excitementByTimeOfDayChart.data.labels = graph4Labels;
        excitementByTimeOfDayChart.data.datasets = [graph4Dataset];
        excitementByTimeOfDayChart.options.scales.y.suggestedMax = Math.max(...graph4Dataset.data) * 1.1;
        // excitementByTimeOfDayChart.options.scales.y.min = [0, Math.min(...graph4NonEmptyVals) - (Math.max(...graph4NonEmptyVals) * 0.1)].sort((a, b) => a - b)[1];
        // excitementByTimeOfDayChart.options.scales.y.max = Math.max(...graph4NonEmptyVals) * 1.1;

        const graph5Labels = labels_5[selectedPlayerNumber - 1];
        const graph5Dataset = datasets_5[selectedPlayerNumber - 1]
        // const graph5NonEmptyVals = nonEmptyVals_5[selectedPlayerNumber - 1];
        planningByTimeOfDayChart.data.labels = graph5Labels;
        planningByTimeOfDayChart.data.datasets = [graph5Dataset];
        planningByTimeOfDayChart.options.scales.y.suggestedMax = Math.max(...graph5Dataset.data) * 1.1;
        // planningByTimeOfDayChart.options.scales.y.min = [0, Math.min(...graph5NonEmptyVals) - (Math.max(...graph5NonEmptyVals) * 0.1)].sort((a, b) => a - b)[1];
        // planningByTimeOfDayChart.options.scales.y.max = Math.max(...graph5NonEmptyVals) * 1.1;

        drawingActivityChart.update();
        // pointCountByTimeOfDayChart.update();
        decisivenessByTimeOfDayChart.update();
        excitementByTimeOfDayChart.update();
        planningByTimeOfDayChart.update();

        sunburstTimeout = setTimeout(() => {
            sunburstChart.data = sunburstDatasets[selectedPlayerNumber - 1];
            sunburstTimeout = null;
        }, 1000);
    };

});
