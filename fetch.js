const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

function fetchArticle(itemId){
    console.log(`Fetching ${itemId}...`);
    fetch(`http://qiita.com/api/v2/items/${itemId}`).then(res => {
        res.json().then(json => {
            fs.writeFileSync(`raw/${json.id}.md`, `<!-- ${JSON.stringify({ 
                id: json.id, 
                created_at: json.created_at,
                tags: json.tags, 
                title: json.title
            }, null, 2)} -->\n${json.body}`);


            const imgPattern = /!\[.*?\]\((.*?)\)/g;
            var match;
            while(match = imgPattern.exec(json.body)){
                const imgPath = match[1];
                const dest = `img/${path.basename(imgPath)}`;
                if( ! fs.existsSync(dest)){
                    console.log(`Fetching ${imgPath}...`);
                    fetch(imgPath).then(res => {
                        res.buffer().then(buffer => {
                            fs.writeFileSync(`img/${path.basename(imgPath)}`, buffer);
                        });
                    });
                }
            }
        });
    });
}

function filterQiitaQrticle(xs){
    return xs.filter(arg => arg.match(/[a-z0-9]{20}/));
}

const subcommand = process.argv[2];
if(subcommand == "update"){
    filterQiitaQrticle(fs.readdirSync("raw").map(file => path.basename(file, ".md"))).forEach(fetchArticle);
}else{
    filterQiitaQrticle(process.argv).forEach(fetchArticle);
}