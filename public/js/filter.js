document.addEventListener('DOMContentLoaded', () => {
    const div = document.getElementById("myDiv");
    const close = document.getElementById("close");
    const fill=document.getElementsByClassName("fill")
    Array.from(fill).forEach(element => {
        element.addEventListener("click", function() {
            if (div.classList.contains('translate-x-full')) {
                div.classList.remove('translate-x-full');
            } else {
                div.classList.add('translate-x-full');
            }
        });
    });
    close.addEventListener("click",function(){
            div.classList.add('translate-x-full');
    })
   
})