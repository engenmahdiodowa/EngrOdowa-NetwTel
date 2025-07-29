document.addEventListener("DOMContentLoaded", () => {
    const groupsContainer = document.getElementById("groupsContainer");
    const totalGroupsSpan = document.getElementById("totalGroups");
    const totalMembersSpan = document.getElementById("totalMembers");
    const toggleThemeBtn = document.getElementById("toggleThemeBtn");
    const groupSearchInput = document.getElementById("groupSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const body = document.body;

    const groups = [{
            name: "Odowa Main Channel",
            description: "Official main broadcast channel for Odowa community news and updates.",
            members: 12500,
            link: "https://t.me/odowa_main",
            category: "General",
        },
        {
            name: "Odowa Tech Talk",
            description: "Group chat for tech enthusiasts in Odowa community to share ideas and projects.",
            members: 3200,
            link: "https://t.me/odowa_techtalk",
            category: "Tech",
        },
        {
            name: "Odowa Market",
            description: "Buy, sell and trade goods with fellow Odowa community members.",
            members: 4800,
            link: "https://t.me/odowa_market",
            category: "General",
        },
        {
            name: "Odowa Social",
            description: "Casual chatting and social networking group for Odowa members.",
            members: 2100,
            link: "https://t.me/odowa_social",
            category: "General",
        },
        {
            name: "Odowa Q&A Hub",
            description: "Ask questions and get answers on various topics from the Odowa community.",
            members: 2500,
            link: "https://t.me/odowa_qa",
            category: "General",
        },
        {
            name: "Crypto Signals Central",
            description: "Reliable cryptocurrency trading signals and market discussions.",
            members: 5200,
            link: "https://t.me/crypto_signals_central",
            category: "Crypto",
        },
        {
            name: "Engineering Insights",
            description: "Discussions on civil, structural, electrical, and software engineering topics.",
            members: 2800,
            link: "https://t.me/engineering_insights",
            category: "Engineering",
        },
        {
            name: "Finance & Investments",
            description: "Share tips and discuss stocks, forex, and personal finance strategies.",
            members: 3400,
            link: "https://t.me/finance_investments",
            category: "Finance",
        },
        {
            name: "Book Lovers Club",
            description: "Share and discuss your favorite books, recommendations, and reading tips.",
            members: 1800,
            link: "https://t.me/book_lovers_club",
            category: "Books",
        },
        {
            name: "Crypto Talk & News",
            description: "Latest news, trends, and discussions on blockchain and cryptocurrencies.",
            members: 4600,
            link: "https://t.me/crypto_talk_news",
            category: "Crypto",
        },
        {
            name: "Civil Engineering Projects",
            description: "A place for civil engineers to share project ideas, challenges, and solutions.",
            members: 2100,
            link: "https://t.me/civil_engineering_projects",
            category: "Engineering",
        },
        {
            name: "Financial Analysis Group",
            description: "Discuss financial reports, market analysis, and economic forecasts.",
            members: 1900,
            link: "https://t.me/financial_analysis_group",
            category: "Finance",
        },
        // Graphic Design groups added here:
        {
            name: "Creative Designers Hub",
            description: "A group for graphic designers to share tips, resources, and portfolio feedback.",
            members: 2100,
            link: "https://t.me/creative_designers_hub",
            category: "Graphic Design",
        },
        {
            name: "Photoshop & Illustrator Experts",
            description: "Discuss advanced Photoshop, Illustrator techniques, tutorials, and projects.",
            members: 1750,
            link: "https://t.me/photoshop_illustrator_experts",
            category: "Graphic Design",
        },
    ];

    let activeCategory = "All";

    // Format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Render groups filtered by category and search term
    function renderGroups(filter = "") {
        groupsContainer.innerHTML = "";

        // Filter groups by category
        let filteredGroups = groups.filter(group => {
            const categoryMatch = activeCategory === "All" || group.category === activeCategory;
            const searchMatch =
                group.name.toLowerCase().includes(filter.toLowerCase()) ||
                group.description.toLowerCase().includes(filter.toLowerCase());
            return categoryMatch && searchMatch;
        });

        if (filteredGroups.length === 0) {
            groupsContainer.innerHTML = `<p class="loading">No groups found matching "${filter}" in category "${activeCategory}".</p>`;
            totalGroupsSpan.textContent = 0;
            totalMembersSpan.textContent = 0;
            return;
        }

        filteredGroups.forEach(group => {
            const card = document.createElement("article");
            card.classList.add("group-card");
            card.tabIndex = 0;

            // Container HTML with QR code button and empty QR container
            card.innerHTML = `
        <h3>${group.name}</h3>
        <p>${group.description}</p>
        <p class="members">Members: ${formatNumber(group.members)}</p>
        <a href="${group.link}" target="_blank" rel="noopener noreferrer" aria-label="Join ${group.name} on Telegram">Join Group</a>
        <button class="qr-btn" aria-label="Show QR code for ${group.name}">📱 QR Code</button>
        <div class="qr-code" aria-hidden="true"></div>
      `;

            groupsContainer.appendChild(card);

            // QR code toggle logic
            const qrBtn = card.querySelector(".qr-btn");
            const qrCodeContainer = card.querySelector(".qr-code");
            let qrVisible = false;

            qrBtn.addEventListener("click", () => {
                if (!qrVisible) {
                    QRCode.toCanvas(group.link, { width: 128, margin: 1 }, (error, canvas) => {
                        if (error) {
                            console.error(error);
                            qrCodeContainer.textContent = "Error generating QR code.";
                        } else {
                            qrCodeContainer.innerHTML = "";
                            qrCodeContainer.appendChild(canvas);
                            qrCodeContainer.setAttribute("aria-hidden", "false");
                        }
                    });
                    qrBtn.textContent = "❌ Close QR";
                    qrVisible = true;
                } else {
                    qrCodeContainer.innerHTML = "";
                    qrCodeContainer.setAttribute("aria-hidden", "true");
                    qrBtn.textContent = "📱 QR Code";
                    qrVisible = false;
                }
            });
        });

        totalGroupsSpan.textContent = filteredGroups.length;
        const totalFilteredMembers = filteredGroups.reduce((acc, group) => acc + group.members, 0);
        totalMembersSpan.textContent = formatNumber(totalFilteredMembers);
        groupsContainer.setAttribute("aria-busy", "false");
    }

    // Initial render with no filter
    renderGroups();

    // Search input listener
    groupSearchInput.addEventListener("input", (e) => {
        groupsContainer.setAttribute("aria-busy", "true");
        renderGroups(e.target.value.trim());
    });

    // Category filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active from all buttons
            filterButtons.forEach(b => b.classList.remove("active"));
            // Set active to clicked button
            btn.classList.add("active");
            // Update active category and rerender with current search filter
            activeCategory = btn.dataset.category;
            groupsContainer.setAttribute("aria-busy", "true");
            renderGroups(groupSearchInput.value.trim());
        });
    });

    // Dark mode toggle
    function setTheme(theme) {
        if (theme === "dark") {
            body.setAttribute("data-theme", "dark");
            toggleThemeBtn.textContent = "☀️ Light Mode";
        } else {
            body.removeAttribute("data-theme");
            toggleThemeBtn.textContent = "🌙 Dark Mode";
        }
        localStorage.setItem("theme", theme);
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    toggleThemeBtn.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme") === "dark" ? "dark" : "light";
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });
});
