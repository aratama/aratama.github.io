
window.addEventListener("DOMContentLoaded", function(){
    const h = maquette.h;

    function gear(key, scale, x, y, opacity, r){
        const size = window.innerWidth * scale;
        const left = window.innerWidth * x;
        const top = window.innerWidth * y;
        return h("img.gear", { 
            key: key, 
            src: "/res/gear.png", 
            style: `width: ${size}px; opacity: ${opacity}; position:absolute; left: ${left}px; top: ${top}px; transform: rotate(${-r}deg);` 
        });
    }

    function render(){
        const r = window.scrollY / 30;
        return h("div.background", [
            gear(0, 0.15, 0.05, 0.35, 0.5, r),
            gear(0, 0.8, 0.4, 0.2, 0.3, -r),
            gear(0, 0.15, 0.7, 0.03, 0.5, -r),
            gear(0, 0.3, 0.15, 0.15, 0.7, -r),
            gear(0, 0.4, 0.70, 0.1, 1.0, r),
            gear(0, 0.4, -0.1, -0.1, 1.0, r)
        ]);      
    }

    const projector = maquette.createProjector();
    projector.merge(document.querySelector(".background"), render);

    window.addEventListener("scroll", function(e){
        projector.scheduleRender();
    });

    window.addEventListener("resize", function(e){
        projector.scheduleRender();
    });
});

