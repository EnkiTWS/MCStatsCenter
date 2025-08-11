// app.js

document.addEventListener('DOMContentLoaded', () => {

    // IMPORTANT: Replace with your YouTube Data API key
    // WARNING: Do not share your API key publicly.
    const API_KEY = "Add_API_KEY";

    // Replace with the Channel IDs of your creators
    const creatorChannelIds = [
        "UChy4O2b6PUIX4hq4qq1rTSQ", // Enki
        "UCEganPqP_1qHLk8feF7lGpw", // Obievil
        "UCx62HdBeB4AQFQP9AEtC4lA", // crink
        "UC2yJFwdgxnqLeBJxJZRX5fg", // Bear
        "UCFKjnsVTzNbqjLN9RnZNb8A", // Rusty
        "UCtWzH2ZMsaQIF7DnRDHEdNA", // Dune
        "UCZOqCx_X9yG2uB8JfBjt_Wg", // Firefly
        "UCux0sINLA3uOGf83SEoqJSw", // FXCDA
        "UCLVfx7uhPjn7oHU8VAosaJA", // not so friendly
        "UCHKh5YmmrYJubG6W2IU_T2A", // Geo
        "UC6GLJ3gILhigBheZBEiCLsw", // HeartGamer26
        "UC8JuGyYU9Jj83vddw1Br7MA", // Jushik
        "UCvYHkk9eOX924SEupBsQcqg", // JustRosie
        "UCjs1jdN8Ln3eA0nUeM_O--g", // KeaneMC
        "UC_Hp0EEwCftaJ22zHcr0GnA", // Kind o Candles
        "UCs-M14-MVIHAbX55fz4yf3A", // Klachin
        "UCp-cKQYrcQ5cQXYZoroCh5A", // MarshJewel
        "UCEILRiDxKxtNTiAX_2DOtrw", // ProKitman
        "UCxAgAyy2if3vkwZveADbG1A", // Twidie Gamers
    ];

    const videoListElement = document.getElementById('video-list');
    const channelLinksElement = document.getElementById('channel-links');
    const channelDetails = new Map(); // Store channel ID and details for easy access

    async function fetchVideos() {
        try {
            // First, fetch the details for all channels (including icons and titles)
            const channelsResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${creatorChannelIds.join(',')}&key=${API_KEY}`);
            const channelsData = await channelsResponse.json();
            
            if (channelsData.items && channelsData.items.length > 0) {
                channelsData.items.forEach(channel => {
                    channelDetails.set(channel.id, {
                        title: channel.snippet.title,
                        icon: channel.snippet.thumbnails.default.url
                    });
                });
                displayChannelLinks(); // Call the new function to display the links
            }

            // Now, fetch the upload playlist IDs for each channel
            const channelUploads = await Promise.all(
                creatorChannelIds.map(channelId =>
                    fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`)
                        .then(response => response.json())
                        .then(data => data.items[0]?.contentDetails.relatedPlaylists.uploads)
                )
            );

            // Fetch the videos from each upload playlist
            const allVideos = await Promise.all(
                channelUploads.filter(id => id).map(playlistId =>
                    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=5&key=${API_KEY}`)
                        .then(response => response.json())
                        .then(data => data.items)
                )
            );

            let combinedVideos = allVideos.flat().sort((a, b) => {
                const dateA = new Date(a.contentDetails.videoPublishedAt);
                const dateB = new Date(b.contentDetails.videoPublishedAt);
                return dateB - dateA;
            });

            combinedVideos = combinedVideos.filter(video => 
                video.snippet.title.toLowerCase().includes("autocraft")
            );

            displayVideos(combinedVideos);

        } catch (error) {
            console.error("Error fetching videos:", error);
            videoListElement.innerHTML = `<p>Failed to load videos. Please check your API key and channel IDs.</p>`;
        }
    }

    function displayVideos(videos) {
        if (videos.length === 0) {
            videoListElement.innerHTML = `<p>No videos found.</p>`;
            return;
        }

        videos.forEach(item => {
            const videoId = item.snippet.resourceId.videoId;
            const videoTitle = item.snippet.title;
            const videoThumbnail = item.snippet.thumbnails.high.url;
            const channelName = item.snippet.channelTitle;
            const channelId = item.snippet.channelId;
            const channelIconUrl = channelDetails.get(channelId)?.icon;
            const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString();

            const videoElement = document.createElement('div');
            videoElement.className = 'video';
            videoElement.innerHTML = `
                ${channelIconUrl ? `<img src="${channelIconUrl}" alt="${channelName} icon" class="channel-icon">` : ''}
                <div class="video-content">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                        <img src="${videoThumbnail}" alt="${videoTitle}" class="thumbnail">
                    </a>
                    <div class="video-details">
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${videoTitle}</a>
                        <p>By ${channelName}</p>
                        <p>Published: ${publishedAt}</p>
                    </div>
                </div>
            `;
            videoListElement.appendChild(videoElement);
        });
    }

    // New function to display channel links in the sidebar
    function displayChannelLinks() {
        channelDetails.forEach((details, channelId) => {
            const linkDiv = document.createElement('div');
            linkDiv.className = 'channel-link-item';
            linkDiv.innerHTML = `
                <img src="${details.icon}" alt="${details.title} icon" class="channel-icon-sidebar">
                <a href="https://www.youtube.com/channel/${channelId}" title="Visit ${details.title}'s channel" target="_blank">${details.title}</a>
            `;
            channelLinksElement.appendChild(linkDiv);
        });
    }

    // Call the main function to fetch and display everything
    fetchVideos();

});
