$(document).ready(function () {
    const $content = $("#content");
    const githubUsername = 'nengayuwulandari64-prog'; 
  
    // ==========================================
    // --- 1. CORE SPA NAVIGATION ENGINE ---
    // ==========================================
    
    function loadPage(pageUrl) {
        // A. Animasi Fade Out (Mengecil dan Menghilang)
        $content.removeClass("fade-in");
        
        setTimeout(function() {
            // B. Muat konten
            $content.load(pageUrl, function (response, status, xhr) {
                if (status == "error") {
                    $content.html("<div class='text-center py-20 italic text-[#8b5e3c]/50 uppercase text-[10px] tracking-widest'>Halaman tidak ditemukan...</div>");
                }
                
                // C. Animasi Fade In
                $content.addClass("fade-in");
                
                // D. Scroll ke atas
                window.scrollTo({ top: 0, behavior: 'smooth' });
  
                // E. LOGIKA KHUSUS HALAMAN
                if (pageUrl.includes("github.html")) {
                    window.fetchGithub(githubUsername);
                }
                
                if (pageUrl.includes("contact.html")) {
                    checkContactLocalStorage();
                }
            });
        }, 400); 
    }
  
    // --- Inisialisasi Awal ---
    $(`.nav-item[data-page="home.html"]`).addClass("nav-active mobile-nav-active");
    loadPage("home.html");
  
  
    // --- Event Listener Klik Navigasi ---
    $(".nav-item").click(function () {
        const $this = $(this);
        const pageToLoad = $this.data("page");
  
        if ($this.hasClass("nav-active")) return;
  
        // Reset & Aktifkan status menu
        $(".nav-item").removeClass("nav-active mobile-nav-active");
        $(`.nav-item[data-page="${pageToLoad}"]`).addClass("nav-active mobile-nav-active");
        
        loadPage(pageToLoad);
    });
  
  
    // ==========================================
    // --- 2. GITHUB API (Disesuaikan Tema Earth Tone) ---
    // ==========================================
    
    window.fetchGithub = (username) => {
        const $projectContainer = $('#github-projects');
        if ($projectContainer.length === 0) return;
  
        $.ajax({
            url: `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
            method: "GET",
            success: function (repos) {
                let cardsHtml = "";
                $projectContainer.empty(); 
  
                if (repos.length === 0) {
                    $projectContainer.html('<p class="col-span-full text-center text-[#8b5e3c]/40 italic py-10 uppercase text-[10px] tracking-widest">No public projects found.</p>');
                    return;
                }
  
                repos.forEach(repo => {
                    const desc = repo.description || "Project kreatif yang dikembangkan dengan dedikasi.";
                    const lang = repo.language || "Web Project";
                    
                    // Card disesuaikan dengan warna #8b5e3c (Cokelat Kayu)
                    cardsHtml += `
                        <a href="${repo.html_url}" target="_blank" class="group bg-white/50 border border-[#8b5e3c]/5 p-7 rounded-[2.5rem] hover:shadow-2xl hover:bg-white transition-all duration-500 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-6">
                                    <div class="w-10 h-10 bg-[#f4f1ee] rounded-2xl flex items-center justify-center text-[#8b5e3c]/30 group-hover:text-[#8b5e3c] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                                    </div>
                                    <span class="text-[9px] font-black text-[#8b5e3c] uppercase tracking-widest bg-[#8b5e3c]/10 px-3 py-1 rounded-full">${lang}</span>
                                </div>
                                <h3 class="text-lg font-bold text-[#433422] mb-3 lowercase tracking-tight group-hover:text-[#8b5e3c] transition-colors">/${repo.name}</h3>
                                <p class="text-stone-500 text-xs leading-relaxed line-clamp-3 mb-8 italic">${desc}</p>
                            </div>
                            <div class="flex items-center gap-4 text-[10px] font-bold text-stone-300 uppercase tracking-widest border-t border-[#8b5e3c]/5 pt-4">
                                <span class="group-hover:text-[#8b5e3c]/60 transition-colors">⭐ ${repo.stargazers_count}</span>
                                <span class="group-hover:text-[#8b5e3c]/60 transition-colors">🍴 ${repo.forks_count}</span>
                            </div>
                        </a>`;
                });
                $projectContainer.html(cardsHtml);
            },
            error: function () {
                $projectContainer.html('<div class="col-span-full text-center py-10"><p class="text-[#8b5e3c] font-bold uppercase text-[10px] tracking-widest">Gagal mengambil data GitHub.</p></div>');
            }
        });
    };
  
  
    // ==========================================
    // --- 3. CONTACT FORM (Sync Tema) ---
    // ==========================================
  
    function checkContactLocalStorage() {
        if (localStorage.getItem("Ayu_cv_name")) $("#name").val(localStorage.getItem("Ayu_cv_name"));
        if (localStorage.getItem("Ayu_cv_email")) $("#email").val(localStorage.getItem("Ayu_cv_email"));
    }
  
    $(document).on("submit", "#contactForm", function (e) {
        e.preventDefault();
        
        const $form = $(this);
        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const message = $("#message").val().trim();
        let isValid = true;
  
        $form.find(".error-msg").addClass("hidden").text("");
        $form.find("input, textarea").removeClass("border-[#8b5e3c]/30 ring-[#8b5e3c]/20");
  
        if (name === "") {
            $("#name").addClass("border-[#8b5e3c]/50").next(".error-msg").removeClass("hidden").text("Nama jangan kosong ya! ✨");
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $("#email").addClass("border-[#8b5e3c]/50").next(".error-msg").removeClass("hidden").text("Format email kurang tepat..");
            isValid = false;
        }
  
        if (isValid) {
            localStorage.setItem("Ayu_cv_name", name);
            localStorage.setItem("Ayu_cv_email", email);
  
            const $btn = $("#btnKirim");
            const originalText = $btn.text();
            $btn.text("Mengirim... 🪵").prop("disabled", true).addClass("opacity-60");
  
            setTimeout(function () {
                $("#successMsg").fadeIn().removeClass("hidden");
                $form[0].reset();
                $btn.text(originalText).prop("disabled", false).removeClass("opacity-60");
                checkContactLocalStorage();
            }, 1500);
        }
    });
  
    $(document).on("click", "#btnKirimLagi", function() {
        $("#successMsg").fadeOut().addClass("hidden");
    });
  
  });