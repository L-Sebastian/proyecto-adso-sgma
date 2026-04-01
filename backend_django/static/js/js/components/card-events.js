
fetch("/frontend/public/views/components/events.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("events-section").innerHTML = html;

    // Ahora sí, aplicar la lógica de los likes
    document.querySelectorAll(".event-card .like-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        let likesSpan = btn.querySelector(".likes-count");
        let likes = parseInt(likesSpan.textContent) || 0;
        likes++;
        likesSpan.textContent = likes;
      });
    });
  });
