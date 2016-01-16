var splash = document.getElementById('splash');
splash.addEventListener("mousedown", function(e){
    e.preventDefault(); 
    e.stopPropagation(); 
    splash.style.display = 'none'; 
});
window.addEventListener("load", function(){
    splash.style.display = 'none';
});