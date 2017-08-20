
window.addEventListener("DOMContentLoaded", function(){
    const h = maquette.h;

    function render(){
        const r = window.scrollY / 10;
        const s = 1 - (window.scrollY / 10000); 
        return h("div.background", [
            h("img.gear.gear0", { key: 0, src: "/res/gear.svg", style: `opacity: 0.1; position:absolute; top:100px; left: 100px; transform: rotate(${r}deg) scale(${s})` })           
        ]);      
    }

    const projector = maquette.createProjector();
    projector.merge(document.querySelector(".background"), render);

    window.addEventListener("scroll", function(e){
        projector.scheduleRender();
    });
});

