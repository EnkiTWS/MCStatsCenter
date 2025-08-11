fetch('cards.json')
    .then(response => response.json())
    .then(settings => {
        document.getElementById("logo").src = settings.logoUrl;
        document.getElementById("page-title").textContent = settings.siteTitle;

        document.getElementById("navbar").innerHTML = `
        <div class="bg-gray-900/50 backdrop-blur-sm border-b border-white/20">
            <div class="max-w-5xl mx-auto px-4">
                <div class="flex items-center space-x-6 h-12">
                    ${settings.navLinks.map(link => `
                        <a href="${link.url}" class="text-sm text-cyan-400 hover:text-cyan-300 transition underline">${link.text}</a>
                    `).join('')}
                </div>
            </div>
        </div>
        `;

        document.getElementById("cards").innerHTML = settings.cardsData.map(card => `
        <div class="link-card ${settings.cardStyles.cardBg} p-6 rounded-xl shadow-2xl">
            <h2 class="text-2xl font-bold ${settings.cardStyles.headerColor} mb-4 border-b-2 ${settings.cardStyles.headerBorder} pb-2">${card.title}</h2>
            <div class="space-y-3 text-left">
                ${card.links.map(link => `
                    <a href="${link.url}" target="_blank" 
                       class="${link.download ? settings.cardStyles.downloadLinkBg : settings.cardStyles.normalLinkBg} block p-3 rounded-lg transition-colors duration-200">
                        ${link.download ? settings.worldDownloadSVG : ''}${link.text}
                    </a>
                `).join('')}
            </div>
        </div>
        `).join('');
    });