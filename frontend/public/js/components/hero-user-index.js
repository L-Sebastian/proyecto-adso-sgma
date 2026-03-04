document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".hero__user__index");

    if(heroElement){
        fetch("/frontend/public/views/components/hero__user__index.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});


const input = document.getElementById("file-input");
const image = document.getElementById("img-preview");

input.addEventListener("change", (e)=>{
    if(e.target.files.length){
        const src = URL.createObjectURL(e.target.files[0]);
        image.src = src;
    }
});

// Toast
function showToast(){
    var toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(function(){toast.className = toast.className.replace("show", "");},3000);
}
