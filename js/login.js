// +------------------------------------------+ //

// YOUTUBE DATA API v3 //

/**
 * Sample JavaScript code for youtube.activities.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({
            scope: 'https://www.googleapis.com/auth/youtube.readonly  https://www.googleapis.com/auth/youtube.force-ssl'
        })
        .then(function loadClient() {

                console.log('Sign-in successful');

                // If Log in successfull remove
                const sideLead = document.getElementById('side-lead')
                const rowContent1 = document.getElementById('rowContent1')
                sideLead.classList.add('d-none')
                rowContent1.classList.add('d-none')

                // then remove
                const sideNavs = document.getElementById('side-navs')
                const rowContent2 = document.getElementById('rowContent2')
                sideNavs.classList.remove('d-none')
                rowContent2.classList.remove('d-none')

                // Set API Key
                gapi.client.setApiKey('AIzaSyBqUkszUUVCfErWT3a071n24v9_rTscIN4');
                return gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
                    .then(function () {
                            console.log('GAPI client loaded for API');
                        },
                        function (err) {
                            console.error('Error loading GAPI client for API', err);
                        });

            },
            function (err) {
                console.error('Error signing in', err);
            });
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.youtube.activities.list({
            'part': 'snippet,contentDetails',
            'maxResults': 5,
            'channelId': 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
        })
        .then(function (response) {

                // Handle the results here (response.result has the parsed body).
                console.log('Response', response);

                const dataOutput = response.result.items  
                
                if (dataOutput) {
                    
                    let output = '<small class="text-muted"><i>Max Results Limit is 5 video</i></small>'
                    
                    dataOutput.forEach(video => {

                        const videoId = video.contentDetails.upload.videoId

                        output += `<div class="mb-1">
                                    <iframe width="270" height="auto"
                                        src="https://www.youtube.com/embed/${videoId}" frameborder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen></iframe>

                                    <button class="btn btn-outline-primary btn-sm" onclick="executeVideoDetail('${videoId}').then(executeCommentThreads('${videoId}'))">video detail</button>
                                    <hr style="background-color: #ff0000;">
                                </div>`;

                    })

                    document.getElementById('preview-video').innerHTML = output

                } else {
                    document.getElementById('preview-video').innerHTML = 'No Uploaded Video!'
                }

            },
            function (err) {
                console.error('Execute error', err);
            });
}

function executeVideoDetail(videoId) {
    return gapi.client.youtube.videos.list({
            "part": "snippet,statistics",
            "id": videoId
        })
        .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);

                const dataOutput = response.result.items[0]

                // SHOW VIDEO
                const showVideo = document.getElementById('show-video')
                showVideo.setAttribute('src', `https://www.youtube.com/embed/${dataOutput.id}`)

                // STATISTICS
                const videoStats = document.getElementById('video-stats')
                videoStats.innerHTML = `<p class="card-text">${dataOutput.statistics.viewCount} views</p>
                                        <p class="card-text">${dataOutput.statistics.likeCount} likes</p>
                                        <p class="card-text">${dataOutput.statistics.dislikeCount} dislikes</p>
                                        <p class="card-text">${dataOutput.statistics.commentCount} Comment</p>`;

                // DESCRIPTIONS
                const videoDescription = document.getElementById('video-description')
                videoDescription.innerHTML = dataOutput.snippet.description

            },
            function (err) {
                console.error("Execute error", err);
            });
}

function executeCommentThreads(videoId) {
    return gapi.client.youtube.commentThreads.list({
            "part": "snippet",
            "maxResults": 5,
            "order": "relevance",
            "videoId": videoId
        })
        .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);

                const dataOutput = response.result.items

                if (dataOutput) {

                    let output = '<small class="text-muted"><i>Max Results Limit is 5 comments</i></small>'

                    dataOutput.forEach(commentVideo => {

                        const authorName = commentVideo.snippet.topLevelComment.snippet.authorDisplayName
                        const authorProfile = commentVideo.snippet.topLevelComment.snippet.authorProfileImageUrl
                        const textComment = commentVideo.snippet.topLevelComment.snippet.textDisplay

                        output += `<div id="comment" class="row card-body mb-3">
                                        <div class="col-4 img-icon-comment">
                                            <img id="img-comment" src="${authorProfile}"
                                                class="rounded-circle">
                                        </div>
                                        <div class="col-8">
                                            <p id="acc-comment" class="card-text">
                                                ${authorName} <small class="text-muted">2 hours ago</small>
                                            </p>
                                            <p id="text-comment" class="text-comment card-text">
                                                ${textComment}
                                            </p>
                                        </div>
                                        <div class="container mt-3">
                                            <div class="border-top" style="background-color: #ff0000;"></div>
                                        </div>
                                    </div>`;

                    })
                    
                    document.getElementById('comment-body').innerHTML = output

                } else {
                    document.getElementById('comment-body').innerHTML = 'no comment in this video!'
                }

            },
            function (err) {
                console.error("Execute error", err);
            });
}

function executeChannelDetail() {
    return gapi.client.youtube.channels.list({
            "part": "snippet,contentDetails,statistics",
            "mine": true
        })
        .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);

                const dataOutput = response.result.items[0]

                const channelDetail = document.getElementById('channel-detail')

                channelDetail.innerHTML = `<img id="account-thumbnail" class="img-fluid img-thumbnail rounded-circle w-50 mb-4"
                                                src="${dataOutput.snippet.thumbnails.default.url}">

                                            <div class="card-text lead">
                                                <p>username :</p>
                                                <p id="account-username" class="mt-n3">${dataOutput.snippet.title}</p>
                                                <p>channel id :</p>
                                                <p id="account-channelId" class="mt-n3">${dataOutput.id}</p>
                                                <p>subscribers :</p>
                                                <p id="account-subscribers" class="mt-n3">${dataOutput.statistics.subscriberCount}</p>
                                                <p>views :</p>
                                                <p id="account-views" class="mt-n3">${dataOutput.statistics.viewCount}</p>
                                                <p>video uploaded :</p>
                                                <p id="account-videoUploaded" class="mt-n3">${dataOutput.statistics.videoCount}</p>
                                                <p>channel description :</p>
                                                <p id="account-channelDescription" class="mt-n3">${dataOutput.snippet.description}</p>
                                            </div>`;

                

                // Loged In as
                const logedInas = document.getElementById('logedInas')
                logedInas.innerHTML = `<div class="small">Logged in as:</div>${dataOutput.snippet.title}`;

            },
            function (err) {
                console.error("Execute error", err);
            });
}

// Load OAuth 2.0 Client
gapi.load('client:auth2', function () {
    gapi.auth2.init({
        // Set Client Id
        client_id: '375667189160-q5tlka8jh3a85m0q2tb9lrgilse9tgbm.apps.googleusercontent.com'
    });
});